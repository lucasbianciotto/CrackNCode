import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { randomUUID } from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:8080";

// In-memory user store (squelette). À remplacer par une vraie base plus tard
const usersByGoogleId = new Map();

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
		cookie: { secure: false },
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
                    process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const googleId = profile.id;
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
app.get("/api/me", (req, res) => {
	if (!req.user) {
		return res.status(401).json({ authenticated: false });
	}
	return res.json({ authenticated: true, user: req.user });
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

app.get("/health", (_req, res) => {
	res.json({ ok: true });
});

app.listen(PORT, () => {
	console.log(`Auth server running on http://localhost:${PORT}`);
});


