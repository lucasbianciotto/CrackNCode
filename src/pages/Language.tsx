import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LevelCard } from "@/components/language/LevelCard";
import { LevelModal } from "@/components/language/LevelModal";
import { getLanguageLevelsCount } from "@/data/languages";
import { Level } from "@/types";
import { ArrowLeft, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { LoginPrompt } from "@/components/auth/LoginPrompt";
import { useLanguageProgress } from "@/hooks/useLanguageProgress";

const Language = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Utilise le hook React Query pour récupérer la progression avec actualisation automatique
  const { data: progressData } = useLanguageProgress(id, !!user);
  const language = progressData?.language;
  const languageLevels = progressData?.levels || [];
  const completedLevel = progressData?.completedLevel || 0;

  useEffect(() => {
    if (!user) setShowLoginPrompt(true);
  }, [user]);

  const total = language ? getLanguageLevelsCount(language.id) : 0;
  const raw = language && total ? (language.completedLevels / total) * 100 : 0;
  const percent = Math.min(100, Math.max(0, Math.round(raw)));

  if (!language) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Langage introuvable</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </div>
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
    // HTML/CSS niveau 1 => lancer le mini‑jeu
    if (id === "html" && selectedLevel.levelNumber === 1) {
      navigate(`/language/${id}/level/${selectedLevel.id}`);
      return;
    }
    // Autres niveaux => popup info (jeu à implémenter)
    toast.info("Jeu à implémenter prochainement ✨");
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
              className="text-6xl w-24 h-24 flex items-center justify-center rounded-2xl shrink-0"
              style={{ backgroundColor: `${language.color}20` }}
            >
              {language.icon}
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

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Progression globale</span>
              <span className="font-bold text-foreground">
                {language.earnedXP} / {language.totalXP} XP
              </span>
            </div>
            <div className="xp-bar h-4">
              <div
                className="xp-bar-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{Math.round(percent)}% complété</span>
              <span>{language.totalXP - language.earnedXP} XP restants</span>
            </div>
          </div>
        </div>

        {/* Levels List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Niveaux disponibles
          </h2>

          <div className="grid gap-3">
            {languageLevels.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                onClick={() => handleLevelClick(level)}
              />
            ))}
          </div>

          {languageLevels.length === 0 && (
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
    </AppLayout>
  );
};

export default Language;
