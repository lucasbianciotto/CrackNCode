import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Award, TrendingUp, Calendar, User, Trophy, Target, Pencil, Code2, Zap, BookOpen } from "lucide-react";
import { useState } from "react";
import { AvatarCustomizer, AvatarOptions } from "@/components/profile/AvatarCustomizer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PirateAnchor } from "@/components/ui/pirate/PirateAnchor";
import { Avataaars } from "@/components/ui/Avataaars";

const Profile = () => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [open, setOpen] = useState(false);
  const [tempAvatarOptions, setTempAvatarOptions] = useState<AvatarOptions | null>(null);

  const { user } = useAuth();

  const handleOpenDialog = () => {
    setTempAvatarOptions(avatarOptions);
    setOpen(true);
  };

  const handleSaveAvatar = () => {
    if (tempAvatarOptions) {
      setAvatarOptions(tempAvatarOptions);
      // Ici vous pouvez ajouter un appel API pour sauvegarder l'avatar
      // await saveAvatarToServer(tempAvatarOptions);
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-5 rounded-lg bg-muted border border-border hover:border-primary transition-colors">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="font-bold text-foreground mb-2">First Blood</h3>
              <p className="text-sm text-muted-foreground">Premier défi complété</p>
            </div>
            <div className="p-5 rounded-lg bg-muted border border-border hover:border-primary transition-colors">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-foreground mb-2">Speed Demon</h3>
              <p className="text-sm text-muted-foreground">Défi complété en moins de 5 min</p>
            </div>
            <div className="p-5 rounded-lg bg-muted border border-border hover:border-primary transition-colors">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-foreground mb-2">Perfectionist</h3>
              <p className="text-sm text-muted-foreground">Score parfait sur un défi</p>
            </div>
          </div>
        </Card>

        {/* Activity Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Activité récente</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <div className="p-2 rounded-full bg-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Python - Dictionnaires</p>
                </div>
                <p className="text-xs text-muted-foreground">Complété il y a 2 heures</p>
              </div>
              <span className="text-accent font-bold text-lg">+300 XP</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
              <div className="p-2 rounded-full bg-primary/20">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">JavaScript - DOM Manipulation</p>
                </div>
                <p className="text-xs text-muted-foreground">Complété il y a 1 jour</p>
              </div>
              <span className="text-accent font-bold text-lg">+200 XP</span>
            </div>
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
