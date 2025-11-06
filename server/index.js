import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080";
const prisma = new PrismaClient();

// In-memory user store (squelette). À remplacer par une vraie base plus tard
const usersByGoogleId = new Map();

// Valeurs par défaut de la personnalisation, alignées avec l'avatar initial du front
const DEFAULT_PERSONALISATION_DB = {
    accessories: "Blank",
    hat_colors: null,
    hair_colors: "Brown",
    facial_hair_types: "Blank",
    facial_hair_colors: null,
    clothes: "Hoodie",
    clothes_colors: "Blue03",
    graphics: null,
    eyes: "Default",
    eyebrows: "Default",
    mouth_types: "Smile",
    skin_colors: "Light",
    hair: null,
};

app.use(
	cors({
		origin: CLIENT_ORIGIN,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: process.env.SESSION_SECRET || "devlingo-secret",
		resave: false,
		saveUninitialized: false,
		cookie: { 
			secure: process.env.NODE_ENV === "production", // HTTPS en production
			httpOnly: true, // Empêche l'accès JavaScript au cookie
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours en millisecondes
			sameSite: "lax", // Protection CSRF
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
	done(null, user.googleId);
});

passport.deserializeUser((googleId, done) => {
	const user = usersByGoogleId.get(googleId) || null;
	done(null, user);
});

const hasGoogleCreds = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

if (!hasGoogleCreds) {
    console.error("[Auth] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET manquants. Ajoutez-les dans .env pour activer Google OAuth.");
}

if (hasGoogleCreds) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:
                    process.env.GOOGLE_CALLBACK_URL || `http://localhost:${DEFAULT_PORT}/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const googleId = profile.id;

                    // Assure la présence d'un utilisateur en base: crée à la première connexion
                    await prisma.user.upsert({
                        where: { id_google: googleId },
                        create: {
                            id_google: googleId,
                            nom: profile.name?.familyName || profile.displayName || "Inconnu",
                            prenom: profile.name?.givenName || profile.displayName || "Utilisateur",
                            xp_global: 0,
                        },
                        update: {},
                    });

                    // Crée la personnalisation par défaut si elle n'existe pas encore
                    await prisma.personalisation.upsert({
                        where: { id_user: googleId },
                        create: {
                            id_user: googleId,
                            ...DEFAULT_PERSONALISATION_DB,
                        },
                        update: {},
                    });

                    let user = usersByGoogleId.get(googleId);
                    if (!user) {
                        user = {
                            id: randomUUID(),
                            googleId,
                            email: profile.emails?.[0]?.value || "",
                            username: profile.displayName || profile.name?.givenName || "Utilisateur",
                            avatar:
                                (profile.photos && profile.photos[0] && profile.photos[0].value) || "",
                            level: 1,
                            currentXP: 0,
                            xpToNextLevel: 100,
                            totalXP: 0,
                            completedChallenges: 0,
                            achievements: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };
                        usersByGoogleId.set(googleId, user);
                    } else {
                        user.updatedAt = new Date().toISOString();
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );
}

// Routes OAuth Google
app.get("/auth/google", (req, res, next) => {
    if (!hasGoogleCreds) {
        return res.status(500).json({ error: "Google OAuth non configuré. Définissez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env" });
    }
    return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/auth/failure" }),
	(req, res) => {
		res.redirect(`${CLIENT_ORIGIN}/`);
	}
);

app.get("/auth/failure", (_req, res) => {
	res.status(401).json({ error: "Authentication failed" });
});

app.post("/api/logout", (req, res) => {
	req.logout(() => {
		res.clearCookie("connect.sid");
		res.status(204).end();
	});
});

// API utilisateur
app.get("/api/me", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ authenticated: false });
    }

    try {
        // Récupère xp_global depuis la base via Prisma en se basant sur l'id Google
        const dbUser = await prisma.user.findUnique({
            where: { id_google: req.user.googleId },
            select: { xp_global: true, nom: true, prenom: true },
        });

        // Récupère la personnalisation en base et la mappe vers les options d'avatar du front
        const pers = await prisma.personalisation.findUnique({
            where: { id_user: req.user.googleId },
        });
        let avatarOptions = toAvatarOptionsFromDb(pers);
        if (!avatarOptions) {
            avatarOptions = toAvatarOptionsFromDb(DEFAULT_PERSONALISATION_DB);
        }

        // Calcule le nombre de défis complétés depuis la table position
        const positions = await prisma.position.findMany({
            where: { id_user: req.user.googleId },
        });
        const completedChallenges = positions.reduce((sum, pos) => sum + pos.completed_level, 0);

        // Récupère les succès de l'utilisateur
        const achievements = await prisma.succes.findMany({
            where: { id_user: req.user.googleId },
            select: { image: true },
        });
        const achievementImages = achievements.map(a => a.image);

        const xpGlobal = dbUser?.xp_global ?? 0;
        const LEVEL_SIZE = 1000;
        const level = Math.floor(xpGlobal / LEVEL_SIZE) + 1;
        const currentXP = xpGlobal % LEVEL_SIZE;
        const xpToNextLevel = LEVEL_SIZE;

        const userWithXp = { 
            ...req.user, 
            username: dbUser ? `${dbUser.prenom} ${dbUser.nom}` : req.user.username,
            xp_global: xpGlobal,
            level,
            currentXP,
            xpToNextLevel,
            totalXP: xpGlobal,
            completedChallenges,
            achievements: achievementImages,
            avatarOptions 
        };
        return res.json({ authenticated: true, user: userWithXp });
    } catch (err) {
        console.error("/api/me prisma error:", err);
        // En cas d'erreur DB, renvoyer quand même l'utilisateur en mémoire, xp_global=0 par défaut
        return res.json({ authenticated: true, user: { ...req.user, xp_global: 0, completedChallenges: 0, achievements: [], avatarOptions: toAvatarOptionsFromDb(DEFAULT_PERSONALISATION_DB) } });
    }
});

app.put("/api/user", (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	const { username } = req.body || {};
	if (typeof username === "string" && username.trim().length >= 2) {
		const user = usersByGoogleId.get(req.user.googleId);
		user.username = username.trim();
		user.updatedAt = new Date().toISOString();
		return res.json({ user });
	}
	return res.status(400).json({ error: "Nom d'utilisateur invalide" });
});

// API pour récupérer les langages avec progression
app.get("/api/languages", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	try {
		const positions = await prisma.position.findMany({
			where: { id_user: req.user.googleId },
		});
		
		// Récupère toutes les activités pour calculer l'XP gagné par langage
		const activities = await prisma.activity.findMany({
			where: { id_user: req.user.googleId },
			select: { language_id: true, xp_earned: true },
		});
		
		// Calcule l'XP gagné par langage depuis les activités
		const xpByLanguage = new Map();
		activities.forEach(activity => {
			const current = xpByLanguage.get(activity.language_id) || 0;
			xpByLanguage.set(activity.language_id, current + (activity.xp_earned || 0));
		});
		
		// Configuration des XP par niveau (100 + 150 + 200 + 200 + 250 = 900)
		const XP_PER_LANGUAGE = 900;
		const XP_PER_LEVEL = [100, 150, 200, 200, 250];
		
		// Récupère tous les langages disponibles
		const languages = await prisma.language.findMany();
		
		// Crée un map pour accéder rapidement aux positions
		const positionMap = new Map();
		positions.forEach(pos => {
			positionMap.set(pos.id_level, pos);
		});
		
		// Construit la réponse avec les données de progression
		const languagesWithProgress = languages.map(lang => {
			const pos = positionMap.get(lang.id);
			const completedLevel = pos?.completed_level || 0;
			const currentLevel = completedLevel + 1;
			
			// Calcule l'XP gagné depuis les activités, ou depuis les niveaux complétés si pas d'activités
			let earnedXP = xpByLanguage.get(lang.id) || 0;
			
			// Si pas d'activités mais des niveaux complétés, calcule depuis les niveaux
			if (earnedXP === 0 && completedLevel > 0) {
				earnedXP = XP_PER_LEVEL.slice(0, completedLevel).reduce((sum, xp) => sum + xp, 0);
			}
			
			return {
				id: lang.id,
				currentLevel,
				completedLevels: completedLevel,
				totalXP: XP_PER_LANGUAGE, // 900 XP total par langage
				earnedXP: earnedXP,
			};
		});
		
		return res.json({ languages: languagesWithProgress });
	} catch (err) {
		console.error("GET /api/languages error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// API pour récupérer les niveaux d'un langage avec leur statut
app.get("/api/languages/:languageId/levels", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	try {
		const { languageId } = req.params;
		
		// Récupère la position de l'utilisateur pour ce langage
		const position = await prisma.position.findUnique({
			where: {
				id_user_id_level: {
					id_user: req.user.googleId,
					id_level: languageId,
				},
			},
		});
		
		const completedLevel = position?.completed_level || 0;
		
		// Récupère les activités pour ce langage pour calculer l'XP gagné
		const activities = await prisma.activity.findMany({
			where: { 
				id_user: req.user.googleId,
				language_id: languageId,
			},
			select: { xp_earned: true },
		});
		
		// Calcule l'XP gagné depuis les activités
		const earnedXP = activities.reduce((sum, activity) => sum + (activity.xp_earned || 0), 0);
		const totalXP = 900; // 100 + 150 + 200 + 200 + 250
		
		// Retourne le dernier niveau complété avec l'XP
		return res.json({
			completedLevel,
			currentLevel: completedLevel + 1,
			earnedXP,
			totalXP,
		});
	} catch (err) {
		console.error("GET /api/languages/:languageId/levels error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// API pour compléter un niveau et mettre à jour la progression
app.post("/api/languages/:languageId/complete", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	try {
		const { languageId } = req.params;
		const { levelNumber, xpReward } = req.body || {};
		
		if (typeof levelNumber !== "number" || levelNumber < 1) {
			return res.status(400).json({ error: "levelNumber invalide" });
		}
		
		// Récupère la position existante pour vérifier le niveau actuel
		const existingPosition = await prisma.position.findUnique({
			where: {
				id_user_id_level: {
					id_user: req.user.googleId,
					id_level: languageId,
				},
			},
		});
		
		const newCompletedLevel = existingPosition 
			? Math.max(levelNumber, existingPosition.completed_level)
			: levelNumber;
		
		// Utilise upsert pour créer ou mettre à jour la position
		const position = await prisma.position.upsert({
			where: {
				id_user_id_level: {
					id_user: req.user.googleId,
					id_level: languageId,
				},
			},
			create: {
				id_user: req.user.googleId,
				id_level: languageId,
				completed_level: levelNumber,
			},
			update: {
				completed_level: newCompletedLevel,
			},
		});
		
		// Met à jour l'XP global de l'utilisateur UNIQUEMENT si le niveau n'a pas déjà été complété
		// Vérifie si ce niveau a déjà été complété avant
		const wasAlreadyCompleted = existingPosition && existingPosition.completed_level >= levelNumber;
		
		if (typeof xpReward === "number" && xpReward > 0 && !wasAlreadyCompleted) {
			await prisma.user.update({
				where: { id_google: req.user.googleId },
				data: {
					xp_global: {
						increment: xpReward,
					},
				},
			});
		}
		
		// Récupère le titre du niveau pour l'activité
		const levelTitle = req.body.levelTitle || `${languageId.charAt(0).toUpperCase() + languageId.slice(1)} - Niveau ${levelNumber}`;
		
		// Enregistre l'activité
		try {
			await prisma.activity.create({
				data: {
					id_user: req.user.googleId,
					language_id: languageId,
					level_title: levelTitle,
					xp_earned: xpReward || 0,
				},
			});
		} catch (err) {
			console.error("Erreur lors de l'enregistrement de l'activité:", err);
		}
		
		// Vérifie et attribue les succès automatiquement
		const newAchievements = await checkAndAwardAchievements(req.user.googleId, {
			languageId,
			levelNumber,
		});
		
		return res.json({ 
			success: true,
			position: {
				completedLevel: position.completed_level,
				currentLevel: position.completed_level + 1,
			},
			wasAlreadyCompleted,
			newAchievements,
		});
	} catch (err) {
		console.error("POST /api/languages/:languageId/complete error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// API pour récupérer le leaderboard
app.get("/api/leaderboard", async (req, res) => {
	try {
		const topUsers = await prisma.user.findMany({
			orderBy: { xp_global: "desc" },
			take: 10,
			select: {
				id_google: true,
				nom: true,
				prenom: true,
				xp_global: true,
			},
		});
		
		// Récupère les personnalisations pour les avatars
		const userIds = topUsers.map(u => u.id_google);
		const personalisations = await prisma.personalisation.findMany({
			where: { id_user: { in: userIds } },
		});
		const persMap = new Map(personalisations.map(p => [p.id_user, p]));
		
		const LEVEL_SIZE = 1000;
		// Filtre les utilisateurs valides et construit le leaderboard
		const validUsers = topUsers.filter(user => user.nom && user.prenom);
		const leaderboard = validUsers.map((user, index) => {
			const level = Math.floor((user.xp_global || 0) / LEVEL_SIZE) + 1;
			const pers = persMap.get(user.id_google);
			return {
				rank: index + 1,
				id: user.id_google,
				username: `${user.prenom || ""} ${user.nom || ""}`.trim() || "Joueur anonyme",
				level,
				xp: user.xp_global || 0,
				avatarOptions: pers ? {
					avatarStyle: "Circle",
					topType: pers.hair || "ShortHairShortFlat",
					accessoriesType: pers.accessories || "Blank",
					hatColor: pers.hat_colors || "Black",
					hairColor: pers.hair_colors || "Brown",
					facialHairType: pers.facial_hair_types || "Blank",
					facialHairColor: pers.facial_hair_colors || "Brown",
					clotheType: pers.clothes || "Hoodie",
					clotheColor: pers.clothes_colors || "Blue03",
					graphicType: pers.graphics || "Bat",
					eyeType: pers.eyes || "Default",
					eyebrowType: pers.eyebrows || "Default",
					mouthType: pers.mouth_types || "Smile",
					skinColor: pers.skin_colors || "Light",
				} : null,
			};
		});
		
		return res.json({ leaderboard });
	} catch (err) {
		console.error("GET /api/leaderboard error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// API pour récupérer les succès d'un utilisateur
app.get("/api/achievements", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	try {
		const achievements = await prisma.succes.findMany({
			where: { id_user: req.user.googleId },
			select: {
				id: true,
				image: true,
			},
		});
		
		return res.json({ achievements });
	} catch (err) {
		console.error("GET /api/achievements error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// API pour récupérer les activités récentes d'un utilisateur
app.get("/api/activities", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	try {
		const activities = await prisma.activity.findMany({
			where: { id_user: req.user.googleId },
			orderBy: { created_at: "desc" },
			take: 10,
			select: {
				id: true,
				language_id: true,
				level_title: true,
				xp_earned: true,
				created_at: true,
			},
		});
		
		return res.json({ activities });
	} catch (err) {
		console.error("GET /api/activities error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// Fonction pour vérifier et attribuer automatiquement des succès
async function checkAndAwardAchievements(userId, context) {
	const achievements = [];
	
	try {
		// Récupère les statistiques de l'utilisateur
		const positions = await prisma.position.findMany({
			where: { id_user: userId },
		});
		const totalCompleted = positions.reduce((sum, pos) => sum + pos.completed_level, 0);
		
		const user = await prisma.user.findUnique({
			where: { id_google: userId },
			select: { xp_global: true },
		});
		
		const existingAchievements = await prisma.succes.findMany({
			where: { id_user: userId },
			select: { image: true },
		});
		const existingImages = new Set(existingAchievements.map(a => a.image));
		
		// Succès 1: Premier défi complété
		if (totalCompleted >= 1 && !existingImages.has("🏆")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "🏆",
				},
			});
			achievements.push("🏆");
		}
		
		// Succès 2: 10 défis complétés
		if (totalCompleted >= 10 && !existingImages.has("⭐")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "⭐",
				},
			});
			achievements.push("⭐");
		}
		
		// Succès 3: 25 défis complétés
		if (totalCompleted >= 25 && !existingImages.has("💎")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "💎",
				},
			});
			achievements.push("💎");
		}
		
		// Succès 4: 1000 XP atteints
		if (user?.xp_global >= 1000 && !existingImages.has("⚡")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "⚡",
				},
			});
			achievements.push("⚡");
		}
		
		// Succès 5: 5000 XP atteints
		if (user?.xp_global >= 5000 && !existingImages.has("🔥")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "🔥",
				},
			});
			achievements.push("🔥");
		}
		
		// Succès 6: Premier niveau HTML complété
		if (context?.languageId === "html" && context?.levelNumber === 1 && !existingImages.has("🧱")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "🧱",
				},
			});
			achievements.push("🧱");
		}
		
		// Succès 7: Tous les langages démarrés (au moins 1 niveau dans chaque langage)
		const languages = await prisma.language.findMany();
		const startedLanguages = positions.filter(p => p.completed_level > 0).length;
		if (startedLanguages >= languages.length && !existingImages.has("🌍")) {
			await prisma.succes.create({
				data: {
					id_user: userId,
					image: "🌍",
				},
			});
			achievements.push("🌍");
		}
		
	} catch (err) {
		console.error("Erreur lors de la vérification des succès:", err);
	}
	
	return achievements;
}

// Utilitaires de mapping entre DB et options d'avatar (front)
function toAvatarOptionsFromDb(db) {
    if (!db) return null;
    return {
        avatarStyle: "Circle",
        topType: db.hair || "ShortHairShortFlat", // hair stocke le topType en DB
        accessoriesType: db.accessories || "Blank",
        hatColor: db.hat_colors || "Black",
        hairColor: db.hair_colors || "Brown",
        facialHairType: db.facial_hair_types || "Blank",
        facialHairColor: db.facial_hair_colors || "Brown",
        clotheType: db.clothes || "Hoodie",
        clotheColor: db.clothes_colors || "Blue03",
        graphicType: db.graphics || "Bat",
        eyeType: db.eyes || "Default",
        eyebrowType: db.eyebrows || "Default",
        mouthType: db.mouth_types || "Smile",
        skinColor: db.skin_colors || "Light",
    };
}

function toDbFromAvatarOptions(opts) {
    if (!opts) return {};
    return {
        accessories: opts.accessoriesType ?? null,
        hat_colors: opts.hatColor ?? null,
        hair_colors: opts.hairColor ?? null,
        facial_hair_types: opts.facialHairType ?? null,
        facial_hair_colors: opts.facialHairColor ?? null,
        clothes: opts.clotheType ?? null,
        clothes_colors: opts.clotheColor ?? null,
        graphics: opts.graphicType ?? null,
        eyes: opts.eyeType ?? null,
        eyebrows: opts.eyebrowType ?? null,
        mouth_types: opts.mouthType ?? null,
        skin_colors: opts.skinColor ?? null,
        hair: opts.topType ?? null,
    };
}

// Routes de personnalisation
app.get("/api/personalisation", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const db = await prisma.personalisation.findUnique({
            where: { id_user: req.user.googleId },
        });
        if (!db) {
            // Retourne des valeurs par défaut si aucune personnalisation en DB
            return res.json({ personalisation: DEFAULT_PERSONALISATION_DB });
        }
        return res.json({ personalisation: db });
    } catch (err) {
        console.error("GET /api/personalisation error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/personalisation", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const data = toDbFromAvatarOptions(req.body || {});
        const saved = await prisma.personalisation.upsert({
            where: { id_user: req.user.googleId },
            create: { id_user: req.user.googleId, ...data },
            update: data,
        });
        return res.json({ personalisation: saved });
    } catch (err) {
        console.error("POST /api/personalisation error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.put("/api/personalisation", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
        const data = toDbFromAvatarOptions(req.body || {});
        const saved = await prisma.personalisation.upsert({
            where: { id_user: req.user.googleId },
            create: { id_user: req.user.googleId, ...data },
            update: data,
        });
        return res.json({ personalisation: saved });
    } catch (err) {
        console.error("PUT /api/personalisation error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

app.get("/health", (_req, res) => {
	res.json({ ok: true });
});

// ============================================
// ADMIN ENDPOINTS - À RETIRER EN PRODUCTION
// ============================================
// Ces endpoints permettent de reset un utilisateur ou de débloquer tout pour les tests.
// Pour les retirer : supprimez cette section complète (lignes suivantes jusqu'à "// FIN ADMIN")

// Reset complet d'un utilisateur (wipe toutes ses données)
app.post("/api/admin/reset-user", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	
	try {
		const userId = req.user.googleId;
		
		// Supprime toutes les données de l'utilisateur
		await prisma.activity.deleteMany({ where: { id_user: userId } });
		await prisma.succes.deleteMany({ where: { id_user: userId } });
		await prisma.position.deleteMany({ where: { id_user: userId } });
		
		// Remet l'XP à 0
		await prisma.user.update({
			where: { id_google: userId },
			data: { xp_global: 0 },
		});
		
		// Reset la personnalisation aux valeurs par défaut
		await prisma.personalisation.upsert({
			where: { id_user: userId },
			create: {
				id_user: userId,
				...DEFAULT_PERSONALISATION_DB,
			},
			update: {
				...DEFAULT_PERSONALISATION_DB,
			},
		});
		
		return res.json({ success: true, message: "Utilisateur reset avec succès" });
	} catch (err) {
		console.error("POST /api/admin/reset-user error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// Débloquer tous les langages à 100% (pour tester le combat Kraken)
app.post("/api/admin/unlock-all", async (req, res) => {
	if (!req.user) return res.status(401).json({ error: "Unauthorized" });
	
	try {
		const userId = req.user.googleId;
		
		// Liste des langages avec leur nombre de niveaux et XP par niveau
		// À synchroniser avec src/data/levels.ts - MAINTENANT 5 NIVEAUX PAR LANGAGE
		const languagesConfig = {
			html: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			javascript: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			php: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			sql: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			python: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			java: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			csharp: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
			cpp: { maxLevel: 5, xpPerLevel: [100, 150, 200, 200, 250] },
		};
		
		// Calcule le total d'XP pour tous les niveaux
		let totalXP = 0;
		for (const [languageId, config] of Object.entries(languagesConfig)) {
			// S'assure que le langage existe en base
			await prisma.language.upsert({
				where: { id: languageId },
				create: { id: languageId },
				update: {},
			});
			
			await prisma.position.upsert({
				where: {
					id_user_id_level: {
						id_user: userId,
						id_level: languageId,
					},
				},
				create: {
					id_user: userId,
					id_level: languageId,
					completed_level: config.maxLevel,
				},
				update: {
					completed_level: config.maxLevel,
				},
			});
			
			// Calcule l'XP total pour ce langage
			const xpForLang = config.xpPerLevel.reduce((sum, xp) => sum + xp, 0);
			totalXP += xpForLang;
		}
		
		
		// Met à jour l'XP global
		await prisma.user.update({
			where: { id_google: userId },
			data: { xp_global: totalXP },
		});
		
		return res.json({ 
			success: true, 
			message: "Tous les langages débloqués à 100%",
			totalXP,
		});
	} catch (err) {
		console.error("POST /api/admin/unlock-all error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

// FIN ADMIN
// ============================================

// Dev-friendly startup: if port is busy and no explicit PORT is set, try the next port.
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Auth server running on http://localhost:${port}`);
        if (hasGoogleCreds && !process.env.GOOGLE_CALLBACK_URL && port !== DEFAULT_PORT) {
            console.warn(
                `[Auth] Attention: port modifié (${port}) mais GOOGLE_CALLBACK_URL n'est pas défini. Le callback Google par défaut vise le port ${DEFAULT_PORT}. Définissez GOOGLE_CALLBACK_URL pour OAuth.`,
            );
        }
    });

    server.on("error", (err) => {
        if (err && err.code === "EADDRINUSE") {
            // Si l'utilisateur a explicitement défini PORT, ne pas auto-shifter: demander de libérer le port.
            const explicitPort = Boolean(process.env.PORT);
            if (!explicitPort && !hasGoogleCreds) {
                const next = port + 1;
                console.warn(`[Server] Le port ${port} est occupé. Tentative sur le port ${next}...`);
                // Petite attente pour laisser le port se libérer si le process concurrent se termine.
                setTimeout(() => startServer(next), 300);
            } else {
                console.error(
                    `[Server] Le port ${port} est déjà utilisé. Libérez-le ou définissez une variable d'environnement PORT différente.`,
                );
                process.exit(1);
            }
        } else {
            console.error(`[Server] Erreur au démarrage:`, err);
            process.exit(1);
        }
    });
}

startServer(DEFAULT_PORT);


