import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Award, TrendingUp, Calendar, User, Trophy, Target, Pencil, Code2, Zap, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { AvatarCustomizer, AvatarOptions } from "@/components/profile/AvatarCustomizer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PirateAnchor } from "@/components/ui/pirate/PirateAnchor";
import { Avataaars } from "@/components/ui/Avataaars";
import { toast } from "sonner";

const Profile = () => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [open, setOpen] = useState(false);
  const [tempAvatarOptions, setTempAvatarOptions] = useState<AvatarOptions | null>(null);
  const [activities, setActivities] = useState<Array<{
    id: number;
    language_id: string;
    level_title: string;
    xp_earned: number;
    created_at: string;
  }>>([]);

  const { user } = useAuth();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // Fonction pour formater le temps écoulé
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "à l'instant";
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''}`;
    return `il y a ${Math.floor(diffInSeconds / 604800)} semaine${Math.floor(diffInSeconds / 604800) > 1 ? 's' : ''}`;
  };

  const handleOpenDialog = () => {
    setTempAvatarOptions(avatarOptions);
    setOpen(true);
  };

  // Charger la personnalisation au login
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/personalisation`, { credentials: "include" });
        if (!res.ok) return;
        const json = await res.json();
        const db = json.personalisation || {};
        const mapped: AvatarOptions = {
          avatarStyle: "Circle",
          topType: db.hair ?? "ShortHairShortFlat",
          accessoriesType: db.accessories ?? "Blank",
          hatColor: db.hat_colors ?? "Black",
          hairColor: db.hair_colors ?? "Brown",
          facialHairType: db.facial_hair_types ?? "Blank",
          facialHairColor: db.facial_hair_colors ?? "Brown",
          clotheType: db.clothes ?? "Hoodie",
          clotheColor: db.clothes_colors ?? "Blue03",
          graphicType: db.graphics ?? "Bat",
          eyeType: db.eyes ?? "Default",
          eyebrowType: db.eyebrows ?? "Default",
          mouthType: db.mouth_types ?? "Smile",
          skinColor: db.skin_colors ?? "Light",
        };
        setAvatarOptions(mapped);
      } catch (err) {
        // Ignorer silencieusement en mode dev
      }
    })();
  }, [user]);

  // Charger les activités récentes
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/activities`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des activités:", err);
      }
    })();
  }, [user]);

  const handleSaveAvatar = () => {
    if (tempAvatarOptions) {
      setAvatarOptions(tempAvatarOptions);
      // Sauvegarde en DB via API
      (async () => {
        try {
          await fetch(`${API_BASE}/api/personalisation`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(tempAvatarOptions),
          });
        } catch (_) {
          // Ignorer en mode dev
        }
      })();
    }
    setOpen(false);
  };

  const handleCancelAvatar = () => {
    setTempAvatarOptions(null);
    setOpen(false);
  };

  if (!user) {
  return (
    <AppLayout>
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Connectez-vous</h2>
                <p className="text-sm text-muted-foreground">Accédez à votre profil, niveau et XP.</p>
              </div>
              <Button onClick={() => (window.location.href = (import.meta.env.VITE_API_BASE_URL || "http://localhost:4000") + "/auth/google")}>Se connecter</Button>
            </div>
          </Card>
      </AppLayout>
    );
  }

  const xpPercentage = (user.currentXP / user.xpToNextLevel) * 100;
  const avatarProps = avatarOptions || user.avatarOptions || {
    avatarStyle: "Circle",
    topType: "ShortHairShortFlat",
    accessoriesType: "Blank",
    hairColor: "Brown",
    facialHairType: "Blank",
    clotheType: "Hoodie",
    clotheColor: "Blue03",
    eyeType: "Default",
    eyebrowType: "Default",
    mouthType: "Smile",
    skinColor: "Light",
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header de la page profil avec titre */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-primary">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Mon Profil</h1>
              <p className="text-muted-foreground">Gérez votre profil et suivez votre progression</p>
            </div>
          </div>
          <PirateAnchor size={40} />
        </div>

        {/* Section principale avec avatar et stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Avatar et infos principales */}
          <Card className="p-6 bg-gradient-card border-border md:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden shadow-lg">
                    <Avataaars
                      style={{ width: '100%', height: '100%' }}
                      {...avatarProps}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 level-badge">
                    Lvl {user.level}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenDialog}
                  className="mt-4 bg-background/80 backdrop-blur-sm"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </div>
              
              <div className="text-center space-y-2 w-full">
                <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
                <p className="text-muted-foreground">Développeur en formation</p>
              </div>

              {/* XP Bar */}
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Niveau {user.level + 1}</span>
                  <span className="font-bold text-foreground">
                    {user.currentXP} / {user.xpToNextLevel} XP
                  </span>
                </div>
                <div className="xp-bar">
                  <div
                    className="xp-bar-fill"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats détaillées */}
          <Card className="p-6 bg-card border-border md:col-span-2">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              Statistiques
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted">
                <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{user.completedChallenges}</p>
                <p className="text-sm text-muted-foreground">Défis complétés</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{user.totalXP}</p>
                <p className="text-sm text-muted-foreground">XP Total</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <Award className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{user.achievements.length}</p>
                <p className="text-sm text-muted-foreground">Succès</p>
              </div>
            </div>
          </Card>
        </div>
        {/* Achievements Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Succès débloqués</h2>
          </div>
          {user.achievements && user.achievements.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {user.achievements.map((achievement, index) => (
                <div key={index} className="p-5 rounded-lg bg-muted border border-border hover:border-primary transition-colors">
                  <div className="text-4xl mb-3">{achievement || "🏆"}</div>
                  <h3 className="font-bold text-foreground mb-2">Succès débloqué</h3>
                  <p className="text-sm text-muted-foreground">Félicitations pour cet accomplissement !</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun succès débloqué pour le moment. Complétez des défis pour débloquer des succès !</p>
            </div>
          )}
        </Card>

        {/* Activity Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Activité récente</h2>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => {
                const timeAgo = getTimeAgo(new Date(activity.created_at));
                return (
                  <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                    <div className="p-2 rounded-full bg-primary/20">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Code2 className="w-4 h-4 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">{activity.level_title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Complété {timeAgo}</p>
                    </div>
                    <span className="text-accent font-bold text-lg">+{activity.xp_earned} XP</span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune activité récente. Complétez des défis pour voir votre historique ici !</p>
              </div>
            )}
          </div>
        </Card>

        {/* Dialog pour personnaliser l'avatar */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Personnaliser mon avatar</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <AvatarCustomizer 
                onChange={setTempAvatarOptions}
                initialOptions={tempAvatarOptions || avatarOptions}
              />
            </div>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button variant="outline" onClick={handleCancelAvatar}>
                Annuler
              </Button>
              <Button onClick={handleSaveAvatar}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Profile;
