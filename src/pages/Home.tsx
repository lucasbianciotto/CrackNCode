import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { LanguageCard } from "@/components/language/LanguageCard";
import { languages as staticLanguages } from "@/data/languages";
import { Code2, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import type { Language } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Home = () => {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [languages, setLanguages] = useState<Language[]>(staticLanguages);

  // Charge les langages avec progression depuis l'API si l'utilisateur est connecté
  useEffect(() => {
    if (!user) {
      // Si pas connecté, utilise les données statiques
      setLanguages(staticLanguages);
      return;
    }

    const fetchLanguages = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/languages`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const apiLanguages = data.languages || [];
          
          // Fusionne les données de l'API avec les données statiques (nom, description, icon, color)
          const mergedLanguages = staticLanguages.map(staticLang => {
            const apiLang = apiLanguages.find((l: any) => l.id === staticLang.id);
            if (apiLang) {
              return {
                ...staticLang,
                currentLevel: apiLang.currentLevel || staticLang.currentLevel,
                completedLevels: apiLang.completedLevels || staticLang.completedLevels,
                earnedXP: apiLang.earnedXP || staticLang.earnedXP,
              };
            }
            return staticLang;
          });
          
          setLanguages(mergedLanguages);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des langages:", err);
        // En cas d'erreur, utilise les données statiques
        setLanguages(staticLanguages);
      }
    };

    fetchLanguages();
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
            <img src="/logo.png" alt="Logo Crack'n Code" className="w-48 h-48 object-contain drop-shadow-xl" />
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

          <div className="grid gap-4 md:grid-cols-2">
            {languages.map((language) => (
              <LanguageCard
                key={language.id}
                language={language}
                onClick={() => {
                  if (!user) {
                    setShowLoginPrompt(true);
                    return;
                  }
                  navigate(`/language/${language.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
    </AppLayout>
  );
};

export default Home;

