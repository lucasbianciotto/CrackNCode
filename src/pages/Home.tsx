import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LanguageCarousel } from "@/components/language/LanguageCarousel";
import { Code2, Sparkles, Skull } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useLanguagesData } from "@/hooks/useLanguagesData";
import { getLanguageLevelsCount } from "@/data/languages";
import { CracknChat, addMessageToHistory } from "@/components/storytelling/CracknChat";
import { CRACKN_DIALOGUES } from "@/data/storytelling";
import { CracknMessage } from "@/components/storytelling/CracknCompanion";

const Home = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [cracknMessages, setCracknMessages] = useState<CracknMessage[]>([]);
  
  // Utilise le hook React Query pour récupérer les langages avec actualisation automatique
  // Toujours activé pour afficher les langages même si pas connecté
  const { data: languages = [], isLoading } = useLanguagesData(true);

  // Affiche Crack'n au chargement de la page
  useEffect(() => {
    if (user) {
      // Message de bienvenue pour les utilisateurs connectés
      const welcomeMsg: CracknMessage = {
        id: "welcome-back",
        text: CRACKN_DIALOGUES.welcome?.text || "Bienvenue à bord, jeune codeur ! Prêt pour de nouvelles aventures ?",
        emotion: CRACKN_DIALOGUES.welcome?.emotion || "happy",
        duration: 5000,
      };
      addMessageToHistory(welcomeMsg);
      setCracknMessages(prev => [...prev, welcomeMsg]);
    } else {
      // Message pour les visiteurs
      const visitorMsg: CracknMessage = {
        id: "welcome-visitor",
        text: "Salut ! Je suis Crack'n ! 🐙 Connecte-toi pour commencer l'aventure et libérer les mers du code du Kraken !",
        emotion: "excited",
        duration: 6000,
      };
      addMessageToHistory(visitorMsg);
      setCracknMessages(prev => [...prev, visitorMsg]);
    }
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 border border-border flex flex-col md:flex-row items-center justify-between">
          {/* Left: Text */}
          <div className="relative z-10 max-w-2xl flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">À l'abordage du code</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              À l'abordage du {" "}
              <span className="gradient-text">code</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Embarque pour des défis interactifs et des mini-jeux captivants. Progresse à ton rythme à travers différents langages, sans te prendre la tête.
            </p>
          </div>
          {/* Right: Logo */}
          <div className="flex-1 flex justify-end items-center">
            <img 
              src="/logo.png" 
              alt="Logo Crack'n Code" 
              className="w-48 h-48 object-contain drop-shadow-xl"
              style={{
                filter: 'hue-rotate(-20deg) saturate(1.2) brightness(1.1)',
              }}
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* User Profile */}
        {user ? (
          <ProfileHeader user={user} />
        ) : (
          <Card className="p-6 bg-card border-border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Bienvenue sur Crack'n Code</h2>
                <p className="text-sm text-muted-foreground">Connectez-vous pour suivre votre progression et débloquer les niveaux.</p>
              </div>
              <Button onClick={loginWithGoogle}>Se connecter</Button>
            </div>
          </Card>
        )}

        {/* Languages Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Code2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Choisis ton langage
            </h2>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Chargement des langages...</div>
          ) : languages.length > 0 ? (
            <LanguageCarousel
              languages={languages}
              onLanguageSelect={(language) => {
                if (!user) {
                  setShowLoginPrompt(true);
                  return;
                }
                navigate(`/language/${language.id}`);
              }}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun langage disponible</div>
          )}
        </div>

        {/* Boss Battle Section */}
        {user && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Skull className="w-6 h-6 text-destructive" />
              <h2 className="text-2xl font-bold text-foreground">
                Combat Final
              </h2>
            </div>
            <Card className="p-6 bg-gradient-to-br from-destructive/10 to-card border-border">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="mb-4">
                    <img 
                      src="/kraken/boss.png" 
                      alt="Le Kraken du Code" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Le Kraken du Code</h3>
                  <p className="text-muted-foreground mb-4">
                    Affrontez le boss final ! Complétez 100% de tous les langages pour débloquer le combat épique.
                  </p>
                  {languages.every((lang) => {
                    const total = getLanguageLevelsCount(lang.id);
                    return total > 0 && lang.completedLevels >= total;
                  }) ? (
                    <div className="flex items-center gap-2 text-success font-medium">
                      <span>✓</span>
                      <span>Combat débloqué !</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Progression : {languages.filter((lang) => {
                        const total = getLanguageLevelsCount(lang.id);
                        return total > 0 && lang.completedLevels >= total;
                      }).length} / {languages.length} langages complétés
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => navigate("/boss")}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-destructive to-red-600 hover:opacity-90"
                  disabled={!languages.every((lang) => {
                    const total = getLanguageLevelsCount(lang.id);
                    return total > 0 && lang.completedLevels >= total;
                  })}
                >
                  <Skull className="w-5 h-5" />
                  Combattre le Kraken
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
      <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
      {/* Crack'n Chat */}
      <CracknChat 
        messages={cracknMessages}
        position="bottom-right"
      />
    </AppLayout>
  );
};

export default Home;

