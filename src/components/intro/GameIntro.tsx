import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SkipForward, Play, Code2, Ship, Zap, Trophy, AlertTriangle, ChevronRight } from "lucide-react";

interface GameIntroProps {
  onComplete: () => void;
}

interface StoryStep {
  id: number;
  title?: string;
  text: string;
  icon?: React.ReactNode;
  duration: number;
}

const storySteps: StoryStep[] = [
  {
    id: 1,
    title: "Chargement...",
    text: "Initialisation du système de combat...",
    icon: <Code2 className="w-16 h-16 animate-pulse" />,
    duration: 3000,
  },
  {
    id: 2,
    text: "Au cœur des mers du code, une menace terrifiante rôde...",
    icon: <AlertTriangle className="w-20 h-20 text-primary animate-pulse" />,
    duration: 6000,
  },
  {
    id: 3,
    text: "Le Kraken du Code a plongé le monde des développeurs dans les ténèbres.",
    icon: <AlertTriangle className="w-20 h-20 text-destructive rotate-12" />,
    duration: 6000,
  },
  {
    id: 4,
    text: "Ses tentacules d'erreurs et de bugs paralysent les projets les plus ambitieux.",
    icon: <Ship className="w-20 h-20 text-accent animate-float" />,
    duration: 6000,
  },
  {
    id: 5,
    text: "Mais il existe une légende... celle d'un développeur qui maîtriserait tous les langages.",
    icon: <Code2 className="w-20 h-20 text-primary" />,
    duration: 7000,
  },
  {
    id: 6,
    text: "En apprenant Python, JavaScript, HTML et CSS, tu forgeras les armes nécessaires.",
    icon: <Zap className="w-20 h-20 text-accent animate-pulse" />,
    duration: 7000,
  },
  {
    id: 7,
    text: "Chaque niveau complété te rapprochera de la victoire finale.",
    icon: <Trophy className="w-20 h-20 text-primary animate-bounce" />,
    duration: 6000,
  },
  {
    id: 8,
    text: "Es-tu prêt à relever le défi et à devenir le développeur légendaire qui vaincra le Kraken ?",
    icon: <Ship className="w-24 h-24 text-primary animate-float" />,
    duration: 8000,
  },
];

export function GameIntro({ onComplete }: GameIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showContinueHint, setShowContinueHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initial loading screen
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowSkip(true);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  const goToNextStep = () => {
    // Clear any pending timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    
    if (currentStep >= storySteps.length - 1) {
      setShowPlayButton(true);
      setShowContinueHint(false);
    } else {
      setCurrentStep((prev) => prev + 1);
      setShowContinueHint(false);
    }
  };

  useEffect(() => {
    if (isLoading || currentStep >= storySteps.length) return;

    // Clear previous timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

    const step = storySteps[currentStep];
    
    // Show continue hint after 2 seconds
    hintTimerRef.current = setTimeout(() => {
      setShowContinueHint(true);
    }, 2000);

    // Auto-advance after duration
    timerRef.current = setTimeout(() => {
      goToNextStep();
    }, step.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isLoading]);

  const handleClick = () => {
    if (showPlayButton) return;
    goToNextStep();
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePlay = () => {
    onComplete();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="mx-auto animate-spin-slow">
            <Code2 className="w-24 h-24 text-primary" />
          </div>
          <div className="space-y-2 animate-fade-in-delay">
            <h2 className="text-2xl font-bold gradient-text">Crack'n Code</h2>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto animate-fade-in-delay-2">
            <div className="h-full bg-gradient-primary rounded-full animate-progress-bar" />
          </div>
        </div>
      </div>
    );
  }

  const currentStoryStep = storySteps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Skip button */}
      {showSkip && !showPlayButton && (
        <div className="absolute top-6 right-6 z-50 animate-slide-down">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer l'intro
          </Button>
        </div>
      )}

      {/* Main content */}
      <div 
        className="relative z-10 h-full flex items-center justify-center p-8 cursor-pointer"
        onClick={handleClick}
      >
        <div key={currentStep} className="text-center space-y-8 max-w-3xl animate-story-slide">
          {/* Icon */}
          {currentStoryStep.icon && (
            <div className="flex justify-center animate-icon-pop">
              {currentStoryStep.icon}
            </div>
          )}

          {/* Title */}
          {currentStoryStep.title && (
            <h2 className="text-3xl font-bold gradient-text animate-fade-in-delay-title">
              {currentStoryStep.title}
            </h2>
          )}

          {/* Text */}
          <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed animate-text-fade">
            {currentStoryStep.text}
          </p>

          {/* Continue hint */}
          {showContinueHint && !showPlayButton && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground animate-fade-in-delay mt-4">
              <ChevronRight className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Cliquer pour continuer</span>
              <ChevronRight className="w-5 h-5 animate-pulse" />
            </div>
          )}

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 pt-4">
            {storySteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-primary w-8 animate-progress-dot"
                    : "bg-muted w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Play button */}
        {showPlayButton && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-play-button">
            <Button
              size="lg"
              onClick={handlePlay}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Play className="w-6 h-6 mr-2" />
              Embarquer pour l'aventure
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Appuyez sur Entrée pour commencer
            </p>
          </div>
        )}
      </div>

      {/* Keyboard handler */}
      <KeyboardHandler 
        onPlay={handlePlay} 
        onSkip={handleSkip} 
        onNext={goToNextStep}
        showPlay={showPlayButton} 
        showSkip={showSkip}
        canAdvance={!isLoading && !showPlayButton}
      />
    </div>
  );
}

function KeyboardHandler({
  onPlay,
  onSkip,
  onNext,
  showPlay,
  showSkip,
  canAdvance,
}: {
  onPlay: () => void;
  onSkip: () => void;
  onNext: () => void;
  showPlay: boolean;
  showSkip: boolean;
  canAdvance: boolean;
}) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && showPlay) {
        onPlay();
      } else if (e.key === "Escape" && showSkip) {
        onSkip();
      } else if ((e.key === "Enter" || e.key === " " || e.key === "ArrowRight") && canAdvance && !showPlay) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPlay, onSkip, onNext, showPlay, showSkip, canAdvance]);

  return null;
}

