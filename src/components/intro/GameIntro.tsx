import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SkipForward, Play, Code2, Ship, Zap, Trophy, AlertTriangle, ChevronRight, ChevronLeft, Waves, Sword, Pause, PlayCircle } from "lucide-react";

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
    icon: <Code2 className="w-16 h-16 animate-pulse text-primary" />,
    duration: 3000,
  },
  {
    id: 2,
    text: "Dans les profondeurs abyssales des mers du code, une ombre gigantesque s'éveille...",
    icon: <Waves className="w-24 h-24 text-primary animate-pulse" />,
    duration: 7000,
  },
  {
    id: 3,
    text: "Le Kraken du Code, monstre légendaire aux huit tentacules, règne sur l'océan numérique.",
    icon: <img src="/kraken/boss.png" alt="Kraken du Code" className="w-32 h-32 object-contain animate-pulse" />,
    duration: 7000,
  },
  {
    id: 4,
    text: "Chaque tentacule représente un langage de programmation qu'il contrôle avec une poigne de fer.",
    icon: <Code2 className="w-20 h-20 text-destructive rotate-12 animate-pulse" />,
    duration: 7000,
  },
  {
    id: 5,
    text: "Ses erreurs et bugs paralysent les projets, plongeant les développeurs dans le désespoir.",
    icon: <AlertTriangle className="w-24 h-24 text-destructive animate-bounce" />,
    duration: 7000,
  },
  {
    id: 6,
    text: "Mais une prophétie ancienne parle d'un héros qui maîtriserait les huit langages...",
    icon: <Sword className="w-20 h-20 text-primary animate-pulse" />,
    duration: 7000,
  },
  {
    id: 6.5,
    text: "Dans les profondeurs, un petit poulpe bienveillant t'attend : Crack'n, dernier gardien du code. Il sera ton guide et ton compagnon dans cette quête.",
    icon: <img src="/kraken/happy.png" alt="Crack'n" className="w-32 h-32 object-contain animate-bounce" />,
    duration: 8000,
  },
  {
    id: 7,
    text: "HTML, JavaScript, PHP, SQL, Python, Java, C# et C++... Chaque langage maîtrisé affaiblit le Kraken. Avec Crack'n à tes côtés, tu n'es pas seul.",
    icon: <Zap className="w-20 h-20 text-accent animate-pulse" />,
    duration: 8000,
  },
  {
    id: 8,
    text: "En complétant tous les niveaux, tu couperas ses tentacules un par un, libérant les mers du code.",
    icon: <Trophy className="w-20 h-20 text-primary animate-bounce" />,
    duration: 8000,
  },
  {
    id: 9,
    text: "L'aventure finale t'attend : un combat épique contre le cœur du Kraken lui-même.",
    icon: <Ship className="w-24 h-24 text-primary animate-float" />,
    duration: 7000,
  },
  {
    id: 10,
    text: "Es-tu prêt à devenir le développeur légendaire qui libérera le monde du code ?",
    icon: <span className="text-9xl animate-pulse">⚔️</span>,
    duration: 8000,
  },
];

export function GameIntro({ onComplete }: GameIntroProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [showContinueHint, setShowContinueHint] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
      setShowPlayButton(false);
    }
  };

  const goToPreviousStep = () => {
    // Clear any pending timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowContinueHint(false);
      setShowPlayButton(false);
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (!isPaused) {
      // Pause: clear timers
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    }
  };

  useEffect(() => {
    if (isLoading || currentStep >= storySteps.length || isPaused) return;

    // Clear previous timers
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

    const step = storySteps[currentStep];
    
    // Show continue hint after 2 seconds
    hintTimerRef.current = setTimeout(() => {
      setShowContinueHint(true);
    }, 2000);

    // Auto-advance after duration (seulement si pas en pause)
    timerRef.current = setTimeout(() => {
      if (!isPaused) {
        goToNextStep();
      }
    }, step.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isLoading, isPaused]);

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
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Effet d'eau animé en arrière-plan */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent animate-float" />
        </div>
        
        <div className="text-center space-y-6 animate-fade-in relative z-10">
          <div className="mx-auto flex items-center justify-center">
            <img src="/logo.png" alt="Crack'n Code" className="w-32 h-32 object-contain animate-pulse" />
          </div>
          <div className="space-y-2 animate-fade-in-delay">
            <h2 className="text-4xl font-bold gradient-text drop-shadow-lg">Crack'n Code</h2>
            <p className="text-blue-200 font-medium">Navigation vers les mers du code...</p>
          </div>
          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mx-auto animate-fade-in-delay-2">
            <div className="h-full bg-gradient-hero rounded-full animate-progress-bar" />
          </div>
        </div>
      </div>
    );
  }

  const currentStoryStep = storySteps[currentStep];

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated background - Effet océan */}
      <div className="absolute inset-0">
        {/* Vagues animées */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-600/40 via-blue-500/30 to-transparent animate-float" />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-cyan-500/30 via-blue-400/20 to-transparent animate-float" style={{ animationDelay: "1s" }} />
        
        {/* Particules lumineuses (bulles) */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-cyan-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2.5s" }} />
        </div>
        
        {/* Lueur du Kraken */}
        {currentStep >= 2 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        )}
      </div>

      {/* Controls buttons */}
      {showSkip && !showPlayButton && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-2 animate-slide-down">
          {/* Previous button */}
          {currentStep > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousStep}
              className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90"
              title="Étape précédente (Flèche gauche)"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
          
          {/* Pause/Play button */}
          <Button
            variant="outline"
            size="sm"
            onClick={togglePause}
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90"
            title={isPaused ? "Reprendre (Espace)" : "Pause (Espace)"}
          >
            {isPaused ? <PlayCircle className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          
          {/* Skip button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkip}
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-background/90"
            title="Passer l'intro (Échap)"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Passer
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
          <p className="text-xl md:text-2xl font-medium text-white drop-shadow-lg leading-relaxed animate-text-fade px-4">
            {currentStoryStep.text}
          </p>

          {/* Continue hint */}
          {showContinueHint && !showPlayButton && (
            <div className="flex flex-col items-center justify-center gap-2 text-blue-200 animate-fade-in-delay mt-4">
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs">← Précédent</span>
                  </>
                )}
                <ChevronRight className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">Cliquer ou → pour continuer</span>
                <ChevronRight className="w-5 h-5 animate-pulse" />
              </div>
              {isPaused && (
                <div className="flex items-center gap-2 text-yellow-300 mt-2">
                  <Pause className="w-4 h-4" />
                  <span className="text-xs">En pause - Appuyez sur Espace pour reprendre</span>
                </div>
              )}
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
              className="bg-gradient-hero text-primary-foreground hover:opacity-90 px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Sword className="w-6 h-6 mr-2" />
              Embarquer pour l'aventure
            </Button>
            <p className="text-center text-sm text-blue-200 font-medium mt-4 drop-shadow-lg">
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
        onPrevious={goToPreviousStep}
        onTogglePause={togglePause}
        showPlay={showPlayButton} 
        showSkip={showSkip}
        canAdvance={!isLoading && !showPlayButton}
        isPaused={isPaused}
        canGoBack={currentStep > 0}
      />
    </div>
  );
}

function KeyboardHandler({
  onPlay,
  onSkip,
  onNext,
  onPrevious,
  onTogglePause,
  showPlay,
  showSkip,
  canAdvance,
  isPaused,
  canGoBack,
}: {
  onPlay: () => void;
  onSkip: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onTogglePause: () => void;
  showPlay: boolean;
  showSkip: boolean;
  canAdvance: boolean;
  isPaused: boolean;
  canGoBack: boolean;
}) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Empêche le comportement par défaut pour les touches de navigation
      if (["ArrowLeft", "ArrowRight", " ", "Enter", "Escape"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "Enter" && showPlay) {
        onPlay();
      } else if (e.key === "Escape" && showSkip) {
        onSkip();
      } else if (e.key === " " && canAdvance && !showPlay) {
        // Espace pour pause/play ou avancer
        onTogglePause();
      } else if ((e.key === "Enter" || e.key === "ArrowRight") && canAdvance && !showPlay) {
        onNext();
      } else if (e.key === "ArrowLeft" && canGoBack && !showPlay) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onPlay, onSkip, onNext, onPrevious, onTogglePause, showPlay, showSkip, canAdvance, isPaused, canGoBack]);

  return null;
}

