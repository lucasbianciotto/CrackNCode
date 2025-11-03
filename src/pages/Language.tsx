import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LevelCard } from "@/components/language/LevelCard";
import { LevelModal } from "@/components/language/LevelModal";
import {getLanguageLevelsCount, languages} from "@/data/languages";
import { levels } from "@/data/levels";
import { Level } from "@/types";
import { ArrowLeft, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Language = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const language = languages.find((lang) => lang.id === id);
  const languageLevels = levels[id || ""] || [];

  const total = getLanguageLevelsCount(language.id);
  const raw = total ? (language.completedLevels / total) * 100 : 0;
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
    if (!level.isLocked) {
      navigate(`/language/${id}/level/${level.id}`)
    }
  };

  const handlePlay = () => {
    toast.info("Mini-jeu à implémenter", {
      description: `Le niveau "${selectedLevel?.title}" sera disponible prochainement !`,
    });
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
              <span className="font-bold text-foreground">{percent}%</span>
            </div>
            <div className="xp-bar h-4">
              <div
                className="xp-bar-fill"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{language.earnedXP} XP gagnés</span>
              <span>{language.totalXP} XP total</span>
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
    </AppLayout>
  );
};

export default Language;
