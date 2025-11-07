import { Language } from "@/types";
import { Card } from "@/components/ui/card";
import { ChevronRight, Trophy, Zap, Target } from "lucide-react";
import {getLanguageLevelsCount} from "@/data/languages.ts";
import { PirateTreasureMark } from "@/components/ui/pirate/PirateTreasureMark";
import { useAuth } from "@/context/AuthContext";

interface LanguageCardProps {
  language: Language;
  onClick: () => void;
}

export const LanguageCard = ({ language, onClick }: LanguageCardProps) => {
  const { user } = useAuth();
  const total = getLanguageLevelsCount(language.id);
  const raw = total && user ? (language.completedLevels / total) * 100 : 0;
  const percent = Math.min(100, Math.max(0, Math.round(raw)));

  return (
    <Card
      className="cursor-pointer card-hover border-border bg-card overflow-hidden group"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Icon avec image */}
          <div
            className="w-16 h-16 flex items-center justify-center rounded-xl shrink-0 transition-all group-hover:scale-110 group-hover:rotate-3 overflow-hidden"
            style={{ backgroundColor: `${language.color}20` }}
          >
            <img 
              src={`/${language.id}.png`} 
              alt={language.name}
              className="w-full h-full object-contain p-2"
              onError={(e) => {
                // Fallback vers emoji si l'image n'existe pas
                const target = e.target as HTMLImageElement;
                if (target) {
                  target.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.className = "text-4xl";
                  fallback.textContent = language.icon;
                  target.parentNode?.appendChild(fallback);
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">{language.name}</h3>
                </div>
              <ChevronRight className="text-muted-foreground shrink-0 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {language.description}
            </p>
            {/* Stats avec design gamifié */}
            {user ? (
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30">
                  <Target className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-foreground">
                    Niveau {language.currentLevel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                  <Trophy className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {language.completedLevels}/{getLanguageLevelsCount(language.id)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30">
                  <Zap className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    {language.earnedXP} XP
                  </span>
                </div>
              </div>
            ) : (
              <div className="mb-3 p-2 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Connectez-vous pour voir votre progression
                </p>
              </div>
            )}
            {/* Progress Bar avec design gamifié */}
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Progression</span>
                  <span className="font-bold text-foreground">
                    {language.earnedXP} / {language.totalXP} XP
                  </span>
                </div>
                <div className="relative h-3 bg-background/50 rounded-full overflow-hidden border border-border/50">
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
                  <span className="text-muted-foreground">{Math.round(percent)}% complété</span>
                  <span className="text-muted-foreground">{language.totalXP - language.earnedXP} XP restants</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Progression</span>
                  <span className="font-bold text-foreground">
                    0 / {language.totalXP} XP
                  </span>
                </div>
                <div className="relative h-3 bg-background/50 rounded-full overflow-hidden border border-border/50">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: "0%" }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">0% complété</span>
                  <span className="text-muted-foreground">{language.totalXP} XP restants</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
