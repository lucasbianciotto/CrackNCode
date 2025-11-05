import { useBoss } from "@/context/BossContext";
import { Card } from "@/components/ui/card";
import { Skull, Zap, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const BossBanner = () => {
  const { currentBoss } = useBoss();

  if (!currentBoss) {
    return null;
  }

  const hpPercent = (currentBoss.currentHP / currentBoss.maxHP) * 100;
  const isDefeated = currentBoss.currentHP === 0;
  const isLowHP = hpPercent <= 25;
  const isMidHP = hpPercent > 25 && hpPercent <= 50;

  return (
    <Card className="relative overflow-hidden border-2 border-destructive/50 bg-gradient-to-br from-destructive/10 via-card/90 to-card/80 backdrop-blur-xl shadow-2xl">
      {/* Effet de particules en arrière-plan */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-4 w-40 h-40 bg-destructive/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-4 left-4 w-32 h-32 bg-destructive/20 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        {isLowHP && (
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* En-tête du boss */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
          {/* Avatar du boss - Grand et imposant */}
          <div className="relative">
            <div
              className={cn(
                "text-8xl md:text-9xl w-32 h-32 md:w-40 md:h-40 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300 shadow-2xl",
                isDefeated ? "grayscale opacity-50" : "animate-pulse",
                isLowHP && !isDefeated && "animate-bounce scale-110",
                isMidHP && !isDefeated && "scale-105"
              )}
              style={{ 
                backgroundColor: `${currentBoss.color}30`,
                boxShadow: `0 0 40px ${currentBoss.color}50`
              }}
            >
              {currentBoss.avatar}
            </div>
            {/* Aura autour du boss */}
            {!isDefeated && (
              <div className={cn(
                "absolute inset-0 rounded-2xl animate-pulse",
                isLowHP ? "bg-red-500/20" : isMidHP ? "bg-orange-500/20" : "bg-destructive/20"
              )} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Skull className="w-6 h-6 text-destructive animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{currentBoss.name}</h2>
              {isLowHP && !isDefeated && (
                <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
              )}
            </div>
            <p className="text-lg font-semibold text-muted-foreground mb-3">{currentBoss.title}</p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">{currentBoss.lore}</p>
          </div>
        </div>

        {/* Barre de PV - Design épique */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className={cn(
                "w-6 h-6 transition-all",
                isDefeated ? "text-muted-foreground" : isLowHP ? "text-destructive animate-pulse" : isMidHP ? "text-orange-500" : "text-primary"
              )} />
              <span className="text-lg font-bold text-foreground">Points de Vie</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "font-bold text-2xl md:text-3xl transition-all",
                isDefeated ? "text-muted-foreground" : isLowHP ? "text-destructive animate-pulse" : isMidHP ? "text-orange-500" : "text-primary"
              )}>
                {currentBoss.currentHP}
              </span>
              <span className="text-muted-foreground text-xl">/</span>
              <span className="text-muted-foreground text-xl">{currentBoss.maxHP}</span>
              {isLowHP && !isDefeated && (
                <Zap className="w-6 h-6 text-destructive animate-pulse" />
              )}
            </div>
          </div>

          {/* Barre de progression épique */}
          <div className="relative h-8 md:h-10 w-full overflow-hidden rounded-full bg-muted/50 border-2 border-border shadow-inner">
            {/* Barre de PV avec gradient selon l'état */}
            <div
              className={cn(
                "h-full transition-all duration-700 ease-out relative",
                isDefeated ? "bg-muted-foreground" : 
                isLowHP ? "bg-gradient-to-r from-destructive via-red-600 to-red-500" :
                isMidHP ? "bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500" :
                "bg-gradient-to-r from-primary via-blue-500 to-cyan-500"
              )}
              style={{ width: `${hpPercent}%` }}
            >
              {/* Effet de brillance animé */}
              {!isDefeated && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  {isLowHP && (
                    <div className="absolute inset-0 bg-red-500/50 animate-pulse" />
                  )}
                </>
              )}
            </div>

            {/* Indicateur de pourcentage */}
            {hpPercent > 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn(
                  "text-sm md:text-base font-bold drop-shadow-lg",
                  isLowHP ? "text-white" : "text-white/90"
                )}>
                  {Math.round(hpPercent)}%
                </span>
              </div>
            )}
            
            {/* Effet de brillance sur la bordure */}
            {!isDefeated && (
              <div className={cn(
                "absolute inset-0 rounded-full border-2 pointer-events-none",
                isLowHP ? "border-red-500/50 animate-pulse" : isMidHP ? "border-orange-500/50" : "border-primary/30"
              )} />
            )}
          </div>

          {/* Message de statut */}
          {isDefeated && (
            <div className="mt-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-success font-medium text-center">
                🎉 Boss vaincu ! Tu as réussi tous les défis !
              </p>
            </div>
          )}
          {isLowHP && !isDefeated && (
            <div className="mt-2 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-xs text-destructive font-medium text-center">
                ⚠️ Le boss est affaibli ! Continue tes efforts !
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

