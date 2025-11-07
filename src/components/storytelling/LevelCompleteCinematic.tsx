import { useState, useEffect } from "react";
import { Trophy, Zap, Sparkles, Waves, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCracknDialogue, STORY_EVENTS } from "@/data/storytelling";

interface LevelCompleteCinematicProps {
  levelTitle: string;
  languageName: string;
  xpEarned: number;
  isFirstLevel?: boolean;
  isLanguageComplete?: boolean;
  onContinue: () => void;
}

export function LevelCompleteCinematic({
  levelTitle,
  languageName,
  xpEarned,
  isFirstLevel = false,
  isLanguageComplete = false,
  onContinue,
}: LevelCompleteCinematicProps) {
  const [step, setStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Auto-advance après 3 secondes pour chaque étape
    const timer = setTimeout(() => {
      if (step < 2) {
        setStep((prev) => prev + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [step]);

  const handleContinue = () => {
    setShow(false);
    setTimeout(() => {
      onContinue();
    }, 500);
  };

  const event = isFirstLevel
    ? STORY_EVENTS.first_level_complete
    : isLanguageComplete
    ? STORY_EVENTS.language_complete
    : STORY_EVENTS.level_complete;

  const steps = [
    {
      icon: <Trophy className="w-20 h-20 text-yellow-adaptive" />,
      title: "Défi Complété !",
      message: `Tu as maîtrisé : ${levelTitle}`,
      xp: `+${xpEarned} XP`,
    },
    {
      icon: <span className="text-8xl animate-bounce">🐙</span>,
      title: "Crack'n te félicite !",
      message: (() => {
        const dialogue = getCracknDialogue(
          isFirstLevel ? "first_level" : isLanguageComplete ? "language_complete" : "level_complete",
          { languageName }
        );
        return typeof dialogue === 'string' ? dialogue : dialogue?.text || "Excellent travail !";
      })(),
      xp: null,
    },
    {
      icon: isLanguageComplete ? (
        <Sword className="w-20 h-20 text-destructive animate-pulse" />
      ) : (
        <Sparkles className="w-20 h-20 text-primary animate-pulse" />
      ),
      title: isLanguageComplete ? "Tentacule Coupé !" : "Prochaine Étape",
      message: isLanguageComplete
        ? `Le Kraken a perdu un tentacule ! ${languageName} est maintenant libre de son emprise.`
        : "Continue ton aventure et libère les mers du code !",
      xp: null,
    },
  ];

  const currentStep = steps[step];

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30" />
            
            {/* Vagues animées */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-cyan-500/20 to-transparent animate-float" />
            
            {/* Particules de célébration - réduites */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-adaptive rounded-full animate-pulse"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 100}%`,
                  top: `${50 + (Math.random() - 0.5) * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Main content - Compact */}
          <div
            key={step}
            className="relative z-10 max-w-md w-full animate-scale-in"
          >
            <Card className="p-4 bg-gradient-to-br from-card/95 via-card/95 to-card/95 border-2 border-primary/50 shadow-2xl text-center">
              {/* Icon - Réduit */}
              <div className="flex justify-center mb-3 animate-bounce">
                {typeof currentStep.icon === 'string' ? (
                  <span className="text-5xl">{currentStep.icon}</span>
                ) : (
                  <div className="scale-75">{currentStep.icon}</div>
                )}
              </div>

              {/* Title - Réduit */}
              <h2 className="text-xl font-bold gradient-text mb-2 animate-fade-in">
                {currentStep.title}
              </h2>

              {/* Message - Réduit */}
              <p className="text-sm text-foreground leading-relaxed mb-3 min-h-[40px] animate-fade-in">
                {currentStep.message}
              </p>

              {/* XP Display - Réduit */}
              {currentStep.xp && (
                <div className="flex items-center justify-center gap-2 mb-3 animate-scale-in">
                  <Zap className="w-4 h-4 text-yellow-adaptive" />
                  <span className="text-lg font-bold text-yellow-adaptive">{currentStep.xp}</span>
                </div>
              )}

              {/* Progress dots - Réduit */}
              <div className="flex justify-center gap-1.5 mb-3">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === step
                        ? "bg-primary w-6"
                        : index < step
                        ? "bg-primary/50 w-3"
                        : "bg-muted w-1.5"
                    }`}
                  />
                ))}
              </div>

              {/* Continue button - Réduit */}
              {step === steps.length - 1 && (
                <div className="animate-fade-in">
                  <Button
                    onClick={handleContinue}
                    size="sm"
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Continuer
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
  );
}

