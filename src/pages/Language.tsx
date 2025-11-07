import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
// import { LevelCard } from "@/components/language/LevelCard";
import LevelMap from "@/components/language/LevelMap";
import { LevelModal } from "@/components/language/LevelModal";
import { getLanguageLevelsCount } from "@/data/languages";
import { Level } from "@/types";
import { ArrowLeft, Trophy, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useLanguageProgress } from "@/hooks/useLanguageProgress";
import { CracknChat, addMessageToHistory } from "@/components/storytelling/CracknChat";
import { getCracknDialogue, CRACKN_DIALOGUES } from "@/data/storytelling";
import { CracknMessage } from "@/components/storytelling/CracknCompanion";

const Language = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [cracknMessages, setCracknMessages] = useState<CracknMessage[]>([]);

  // Utilise le hook React Query pour récupérer la progression avec actualisation automatique
  // Toujours activé pour afficher les langages même si pas connecté
  const { data: progressData, isLoading, error } = useLanguageProgress(id, true);
  const language = progressData?.language;
  const languageLevels = progressData?.levels || [];
  const completedLevel = progressData?.completedLevel || 0;

  // Debug: log pour identifier les problèmes
  useEffect(() => {
    if (id) {
      console.log("[Language] ID:", id);
      console.log("[Language] Loading:", isLoading);
      console.log("[Language] Error:", error);
      console.log("[Language] Language:", language);
      console.log("[Language] Levels:", languageLevels.length);
    }
  }, [id, isLoading, error, language, languageLevels.length]);

  useEffect(() => {
    if (!user) setShowLoginPrompt(true);
  }, [user]);

  // Message de Crack'n selon la progression
  useEffect(() => {
    if (language && user) {
      const total = getLanguageLevelsCount(language.id);
      const percent = total > 0 ? (language.completedLevels / total) * 100 : 0;
      
      let newMsg: CracknMessage | null = null;
      
      if (percent === 100) {
        const dialogue = getCracknDialogue("language_complete");
        newMsg = {
          id: `language-complete-${language.id}-${Date.now()}`,
          text: dialogue?.text || `Incroyable ! Tu as maîtrisé ${language.name} ! Un tentacule du Kraken s'est rétracté ! 🎉`,
          emotion: dialogue?.emotion || "cheering",
          duration: 6000,
        };
      } else if (percent > 0 && percent < 100) {
        newMsg = {
          id: `language-progress-${language.id}-${Date.now()}`,
          text: `Continue sur ${language.name} ! Tu es à ${Math.round(percent)}% de la maîtrise. Chaque niveau te rapproche de la victoire ! 💪`,
          emotion: "determined",
          duration: 5000,
        };
      } else {
        newMsg = {
          id: `language-start-${language.id}-${Date.now()}`,
          text: `Bienvenue dans ${language.name} ! Prêt à commencer l'aventure ? Crack'n est là pour t'aider ! 🐙`,
          emotion: "excited",
          duration: 5000,
        };
      }
      
      if (newMsg) {
        addMessageToHistory(newMsg);
        setCracknMessages(prev => [...prev, newMsg!]);
      }
    }
  }, [language, user]);

  const total = language ? getLanguageLevelsCount(language.id) : 0;
  const raw = language && total && user ? (language.completedLevels / total) * 100 : 0;
  const percent = Math.min(100, Math.max(0, Math.round(raw)));

  // État de chargement
  if (isLoading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du langage...</p>
        </div>
      </AppLayout>
    );
  }

  // Erreur ou langage introuvable
  if (error || !language) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">
            {error ? "Erreur lors du chargement du langage" : "Langage introuvable"}
          </p>
          {id && (
            <p className="text-sm text-muted-foreground mb-4">
              ID du langage : {id}
            </p>
          )}
          <Button onClick={() => navigate("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
      </AppLayout>
    );
  }

  // Si pas connecté, afficher un message pour se connecter
  if (!user) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <Card className="p-8 text-center border-primary/50 bg-primary/5">
            <div className="max-w-md mx-auto space-y-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-6">
                {language.description}
              </p>
              <div className="p-6 bg-card rounded-lg border border-border mb-6">
                <p className="text-foreground font-medium mb-2">
                  🔒 Connectez-vous pour accéder à ce langage
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Vous devez être connecté pour voir votre progression et accéder aux niveaux.
                </p>
                <Button onClick={() => setShowLoginPrompt(true)} size="lg" className="w-full">
                  Se connecter
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
      </AppLayout>
    );
  }

  const handleLevelClick = (level: Level) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedLevel(level);
  };

  const handlePlay = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!selectedLevel) return;
    navigate(`/language/${id}/level/${selectedLevel.id}`);
    setSelectedLevel(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        {/* Language Header */}
        <div
          className="rounded-2xl p-8 border border-border"
          style={{ backgroundColor: `${language.color}10` }}
        >
          <div className="flex items-start gap-6 mb-6">
            <div
              className="w-24 h-24 flex items-center justify-center rounded-2xl shrink-0 overflow-hidden transition-transform hover:scale-105"
              style={{ backgroundColor: `${language.color}20` }}
            >
              <img 
                src={`/${language.id}.png`} 
                alt={language.name}
                className="w-full h-full object-contain p-3"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target) {
                    target.style.display = "none";
                    const fallback = document.createElement("span");
                    fallback.className = "text-6xl";
                    fallback.textContent = language.icon;
                    target.parentNode?.appendChild(fallback);
                  }
                }}
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language.name}
              </h1>
              <p className="text-muted-foreground text-lg mb-4">
                {language.description}
              </p>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  <span className="text-foreground font-medium">
                    Niveau {language.currentLevel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-medium">
                    {language.completedLevels}/{getLanguageLevelsCount(language.id)} niveaux
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar avec design gamifié */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-foreground">Progression globale</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {language.earnedXP} / {language.totalXP} XP
                </span>
              </div>
            </div>
            <div className="relative h-4 bg-background/50 rounded-full overflow-hidden border border-border/50">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${percent}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shimmer" />
              </div>
              {percent > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-foreground drop-shadow-sm">
                    {Math.round(percent)}%
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">{Math.round(percent)}% complété</span>
              </div>
              <span className="text-muted-foreground">{language.totalXP - language.earnedXP} XP restants</span>
            </div>
          </div>
        </div>

        {/* Levels Map with background images */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Parcours des niveaux</h2>
          {languageLevels.length > 0 ? (
            (() => {
              const overlayMap: Record<string, string> = {
                html: "htmlcss",
                cpp: "cpp",
                sql: "sql",
                python: "python",
                java: "java",
                javascript: "javascript",
                php: "php",
                csharp: "csharp",
              };
              const overlayKey = overlayMap[language.id];
              return (
                <div className="relative rounded-2xl border border-border overflow-hidden">
                  {/* Background full-width map image */}
                  <img
                    src="/maps/fond.png"
                    alt="Fond de la carte"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Language overlay image (optional, only on xl+) */}
                  <div className="hidden xl:block">
                    {overlayKey && (
                      <img
                        src={`/maps/${overlayKey}.png`}
                        alt={`Carte ${language.name}`}
                        className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[min(900px,92%)] opacity-90 pointer-events-none select-none"
                      />
                    )}
                  </div>
                  {/* Map content above images */}
                  <div className="relative z-10 px-2 sm:px-4 py-6 min-h-[38rem]">
                    <LevelMap
                      languageId={language.id}
                      levels={languageLevels}
                      onSelect={handleLevelClick}
                      forceVertical={typeof window !== 'undefined' ? window.innerWidth < 1440 : false}
                    />
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Aucun niveau disponible pour le moment.
            </p>
          )}
        </div>
      </div>

      {/* Level Modal */}
      <LevelModal
        level={selectedLevel}
        isOpen={!!selectedLevel}
        onClose={() => setSelectedLevel(null)}
        onPlay={handlePlay}
      />
      <LoginPrompt open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
      {/* Crack'n Chat */}
      {user && (
        <CracknChat 
          messages={cracknMessages}
          position="bottom-right"
        />
      )}
    </AppLayout>
  );
};

export default Language;
