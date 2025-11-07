import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Zap, AlertTriangle, Trophy, Skull, Sparkles, XCircle } from "lucide-react";
import { useBoss } from "@/context/BossContext";
import { useLanguagesData } from "@/hooks/useLanguagesData";
import { useUserData } from "@/hooks/useUserData";
import { getMainBoss } from "@/data/bosses";
import { phase1Challenges, phase2Challenges } from "@/data/bossChallenges";
import { languages } from "@/data/languages";
import { getLanguageLevelsCount } from "@/data/languages";
import { QuizRunner } from "@/components/minigames/QuizRunner";
import { CodeFillRunner } from "@/components/minigames/CodeFillRunner";
import { HtmlBuilderRunner } from "@/components/minigames/HtmlBuilderRunner";
import { MultiLanguageChallenge } from "@/components/boss/MultiLanguageChallenge";
import { CodePatternChallenge } from "@/components/boss/CodePatternChallenge";
import { BugHunterChallenge } from "@/components/boss/BugHunterChallenge";
import { SpeedTypingChallenge } from "@/components/boss/SpeedTypingChallenge";
import { LogicPuzzleChallenge } from "@/components/boss/LogicPuzzleChallenge";
import { originalBossChallenges } from "@/data/bossChallenges";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CombatPhase = "idle" | "phase1" | "phase2" | "victory" | "defeat";

const TOTAL_TIME_SECONDS = 600; // 10 minutes
const PHASE1_DAMAGE = 100; // Dégâts par tentacule
const PHASE2_DAMAGE = 50; // Dégâts par défi multi-langage
const CHALLENGE_TIME_LIMIT = 20; // 20 secondes par défi phase 1
const MAX_FAILURES = 3; // Nombre d'échecs avant perte de temps

export default function BossBattle() {
  const navigate = useNavigate();
  const { currentBoss, setCurrentBoss, damageBoss } = useBoss();
  const { data: user } = useUserData();
  const { data: languagesData = [] } = useLanguagesData(!!user);

  const [phase, setPhase] = useState<CombatPhase>("idle");
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_SECONDS);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedTentacles, setCompletedTentacles] = useState<Set<string>>(new Set());
  const [failures, setFailures] = useState(0);
  const [isChallengeActive, setIsChallengeActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState<"classic" | "pattern" | "bug" | "typing" | "logic">("classic");

  // Vérifier le déblocage (100% des 8 langages)
  const isUnlocked = useCallback(() => {
    if (!user || languagesData.length === 0) return false;
    
    return languagesData.every((lang) => {
      const total = getLanguageLevelsCount(lang.id);
      return total > 0 && lang.completedLevels >= total;
    });
  }, [user, languagesData]);

  // Initialiser le boss
  useEffect(() => {
    if (!currentBoss) {
      const boss = getMainBoss();
      setCurrentBoss({ ...boss, currentHP: boss.maxHP });
      console.log("Boss initialized in useEffect:", boss.maxHP);
    }
  }, [setCurrentBoss, currentBoss]);

  // Timer global
  useEffect(() => {
    if (phase !== "phase1" && phase !== "phase2") return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setPhase("defeat");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Vérifier la victoire
  useEffect(() => {
    if (currentBoss && currentBoss.currentHP <= 0 && phase !== "victory") {
      setPhase("victory");
      setIsChallengeActive(false);
    }
  }, [currentBoss, phase]);

  // Debug: Log les changements de HP
  useEffect(() => {
    if (currentBoss) {
      console.log("Boss HP updated:", currentBoss.currentHP, "/", currentBoss.maxHP);
    }
  }, [currentBoss?.currentHP]);

  // Démarrer le combat
  const startBattle = () => {
    if (!isUnlocked()) {
      toast.error("Vous devez compléter 100% de tous les langages pour débloquer le combat !");
      return;
    }
    // S'assurer que le boss est initialisé
    if (!currentBoss) {
      const boss = getMainBoss();
      setCurrentBoss({ ...boss, currentHP: boss.maxHP });
      console.log("Boss initialized in startBattle:", boss.maxHP);
    }
    setPhase("phase1");
    setTimeRemaining(TOTAL_TIME_SECONDS);
    setCurrentChallengeIndex(0);
    setCompletedTentacles(new Set());
    setFailures(0);
    launchPhase1Challenge();
  };

  // Lancer un défi Phase 1 (tentacules) - avec variété de défis
  const launchPhase1Challenge = useCallback(() => {
    const remainingLanguages = languages.filter(
      (lang) => !completedTentacles.has(lang.id)
    );

    if (remainingLanguages.length === 0) {
      // Tous les tentacules coupés, passer à la phase 2
      setPhase("phase2");
      launchPhase2Challenge();
      return;
    }

    // 60% de chance d'utiliser un défi original, 40% pour les défis classiques
    const useOriginal = Math.random() < 0.6;
    
    if (useOriginal) {
      // Choisir un type de défi original aléatoire
      const challengeTypes = [
        { type: "pattern" as const, key: "codePattern" as const },
        { type: "bug" as const, key: "bugHunter" as const },
        { type: "typing" as const, key: "speedTyping" as const },
        { type: "logic" as const, key: "logicPuzzle" as const }
      ];
      const randomChallengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
      const challenges = originalBossChallenges[randomChallengeType.key];
      
      if (challenges && challenges.length > 0) {
        const challenge = challenges[Math.floor(Math.random() * challenges.length)];
        setChallengeType(randomChallengeType.type);
        setCurrentChallenge(challenge);
        setIsChallengeActive(true);
        setFailures(0);
        return;
      }
    }

    // Défi classique par langage
    const randomLang = remainingLanguages[Math.floor(Math.random() * remainingLanguages.length)];
    const challenges = phase1Challenges[randomLang.id];
    
    if (!challenges || challenges.length === 0) {
      // Pas de défi pour ce langage, le marquer comme complété
      setCompletedTentacles((prev) => new Set([...prev, randomLang.id]));
      damageBoss(PHASE1_DAMAGE);
      toast.success(`Tentacule ${randomLang.name} coupé ! -${PHASE1_DAMAGE} HP`);
      setTimeout(() => launchPhase1Challenge(), 1000);
      return;
    }

    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    setCurrentLanguageId(randomLang.id);
    setChallengeType("classic");
    setCurrentChallenge(challenge);
    setIsChallengeActive(true);
    setFailures(0);
  }, [completedTentacles, damageBoss]);

  // Lancer un défi Phase 2 (multi-langages)
  const launchPhase2Challenge = useCallback(() => {
    if (phase2Challenges.length === 0) {
      toast.error("Aucun défi Phase 2 disponible");
      return;
    }

    const randomChallenge = phase2Challenges[Math.floor(Math.random() * phase2Challenges.length)];
    setCurrentChallenge(randomChallenge);
    setIsChallengeActive(true);
    setFailures(0);
  }, []);

  // Gérer la réussite d'un défi
  const handleChallengeSuccess = useCallback(() => {
    console.log("handleChallengeSuccess called", { phase, currentLanguageId, currentBoss: currentBoss?.currentHP });
    setIsChallengeActive(false);

    if (phase === "phase1") {
      if (challengeType === "classic" && currentLanguageId) {
        // Défi classique : couper un tentacule spécifique
        setCompletedTentacles((prev) => new Set([...prev, currentLanguageId!]));
        damageBoss(PHASE1_DAMAGE);
        toast.success(`Tentacule ${languages.find(l => l.id === currentLanguageId)?.name} coupé ! -${PHASE1_DAMAGE} HP`);
      } else {
        // Défi original : dégâts généraux
        damageBoss(PHASE1_DAMAGE);
        const challengeNames = {
          pattern: "Pattern reconnu",
          bug: "Bugs éliminés",
          typing: "Code tapé",
          logic: "Puzzle résolu"
        };
        toast.success(`${challengeNames[challengeType]} ! -${PHASE1_DAMAGE} HP`);
      }
      setTimeout(() => launchPhase1Challenge(), 1500);
    } else if (phase === "phase2") {
      // Phase 2 : dégâts au cœur
      console.log("Calling damageBoss with", PHASE2_DAMAGE);
      damageBoss(PHASE2_DAMAGE);
      toast.success(`Cœur du Kraken touché ! -${PHASE2_DAMAGE} HP`);
      setTimeout(() => launchPhase2Challenge(), 1500);
    } else {
      console.warn("handleChallengeSuccess: phase or currentLanguageId not set", { phase, currentLanguageId });
    }
  }, [phase, currentLanguageId, challengeType, damageBoss, launchPhase1Challenge, launchPhase2Challenge, currentBoss]);

  // Gérer l'échec d'un défi
  const handleChallengeFailure = useCallback(() => {
    setFailures((prev) => {
      const newFailures = prev + 1;
      
      if (newFailures >= MAX_FAILURES) {
        // Perte de temps
        setTimeRemaining((prev) => Math.max(0, prev - 30));
        toast.error("Échec ! -30 secondes");
        setIsChallengeActive(false);
        
        // Relancer un défi après un court délai
        setTimeout(() => {
          if (phase === "phase1") {
            launchPhase1Challenge();
          } else if (phase === "phase2") {
            launchPhase2Challenge();
          }
        }, 2000);
        
        return 0;
      }
      
      return newFailures;
    });
  }, [phase, launchPhase1Challenge, launchPhase2Challenge]);

  // Vérifier si le temps est écoulé
  useEffect(() => {
    if (timeRemaining <= 0 && phase !== "victory") {
      setPhase("defeat");
      setIsChallengeActive(false);
    }
  }, [timeRemaining, phase]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const hpPercent = currentBoss ? (currentBoss.currentHP / currentBoss.maxHP) * 100 : 0;
  const isPhase2 = phase === "phase2";
  const isPhase1 = phase === "phase1";

  if (!isUnlocked() && phase === "idle") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>

          <Card className="p-8 text-center border-border bg-gradient-card">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Combat Verrouillé
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Pour débloquer le combat contre le Kraken, vous devez compléter <strong>100% de tous les langages</strong>.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {languagesData.map((lang) => {
                const total = getLanguageLevelsCount(lang.id);
                const percent = total > 0 ? (lang.completedLevels / total) * 100 : 0;
                return (
                  <div key={lang.id} className="p-4 rounded-lg bg-muted">
                    <div className="text-2xl mb-2">{lang.icon}</div>
                    <div className="text-sm font-medium">{lang.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {lang.completedLevels}/{total} ({Math.round(percent)}%)
                    </div>
                    <div className="w-full h-2 bg-background rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (phase === "victory") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Card className="p-8 text-center border-border bg-gradient-to-br from-success/20 to-success/10">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              VICTOIRE !
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Vous avez vaincu le Kraken du Code ! Les mers du code sont libres !
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} size="lg">
                Retour à l'accueil
              </Button>
              <Button onClick={startBattle} variant="outline" size="lg">
                Rejouer
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (phase === "defeat") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Card className="p-8 text-center border-border bg-gradient-to-br from-destructive/20 to-destructive/10">
            <div className="text-8xl mb-4">💀</div>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              DÉFAITE
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Le temps est écoulé ! Le Kraken a gagné cette fois...
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/")} size="lg">
                Retour à l'accueil
              </Button>
              <Button onClick={startBattle} variant="outline" size="lg">
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          {phase === "idle" && (
            <Button onClick={startBattle} size="lg" className="gap-2">
              <Zap className="w-5 h-5" />
              Commencer le Combat
            </Button>
          )}
        </div>

        {/* Boss HP Bar - Sticky en haut */}
        {currentBoss && (isPhase1 || isPhase2) && (
          <Card className="p-4 border-border bg-gradient-to-br from-destructive/10 to-card sticky top-0 z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src={currentBoss.avatar} 
                  alt={currentBoss.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{currentBoss.name}</h2>
                <p className="text-muted-foreground">{currentBoss.title}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  {currentBoss.currentHP} / {currentBoss.maxHP}
                </div>
                <div className="text-sm text-muted-foreground">HP</div>
              </div>
            </div>
            <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  hpPercent <= 25 ? "bg-destructive" : hpPercent <= 50 ? "bg-orange-500" : "bg-primary"
                )}
                style={{ width: `${hpPercent}%` }}
              />
            </div>
            {isPhase2 && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  Phase 2 : Le Kraken est enragé ! Défis Multi-Langages
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Timer - Compact */}
        {(isPhase1 || isPhase2) && (
          <Card className="p-3 border-border bg-gradient-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-bold text-foreground">Temps restant</span>
              </div>
              <div className={cn(
                "text-3xl font-bold",
                timeRemaining <= 60 ? "text-destructive animate-pulse" : "text-foreground"
              )}>
                {formatTime(timeRemaining)}
              </div>
            </div>
          </Card>
        )}

        {/* Phase 1 Progress - Compact */}
        {isPhase1 && (
          <Card className="p-3 border-border">
            <div className="flex items-center gap-2 mb-3">
              <Skull className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Phase 1 : Les Tentacules</span>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {languages.map((lang) => {
                const isCompleted = completedTentacles.has(lang.id);
                return (
                  <div
                    key={lang.id}
                    className={cn(
                      "p-3 rounded-lg text-center transition-all",
                      isCompleted
                        ? "bg-success/20 border-2 border-success"
                        : "bg-muted border-2 border-border"
                    )}
                  >
                    <div className="text-2xl mb-1">{lang.icon}</div>
                    <div className="text-xs font-medium">
                      {isCompleted ? "✓" : "?"}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Challenge Area - Scroll interne si nécessaire */}
        {isChallengeActive && currentChallenge && (
          <Card className="p-4 border-border max-h-[calc(100vh-32rem)] overflow-y-auto">
            {/* Boutons de cheat - À RETIRER EN PRODUCTION */}
            <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Mode Cheat (Test uniquement)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChallengeSuccess}
                    className="gap-2 bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/20"
                  >
                    <Sparkles className="w-4 h-4" />
                    Réussir
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChallengeFailure}
                    className="gap-2 bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20"
                  >
                    <XCircle className="w-4 h-4" />
                    Échouer
                  </Button>
                </div>
              </div>
            </div>

            {phase === "phase2" && currentChallenge.id ? (
              // Phase 2 : Défi multi-langages
              <MultiLanguageChallenge
                challenge={currentChallenge}
                onSuccess={handleChallengeSuccess}
                onFailure={handleChallengeFailure}
                timeLimit={30}
              />
            ) : (
              // Phase 1 : Défis variés (classiques + originaux)
              <>
                {challengeType === "pattern" && (
                  <CodePatternChallenge
                    challenge={currentChallenge}
                    onSuccess={handleChallengeSuccess}
                    onFailure={handleChallengeFailure}
                    timeLimit={15}
                  />
                )}
                {challengeType === "bug" && (
                  <BugHunterChallenge
                    challenge={currentChallenge}
                    onSuccess={handleChallengeSuccess}
                    onFailure={handleChallengeFailure}
                    timeLimit={20}
                  />
                )}
                {challengeType === "typing" && (
                  <SpeedTypingChallenge
                    challenge={currentChallenge}
                    onSuccess={handleChallengeSuccess}
                    onFailure={handleChallengeFailure}
                    timeLimit={30}
                  />
                )}
                {challengeType === "logic" && (
                  <LogicPuzzleChallenge
                    challenge={currentChallenge}
                    onSuccess={handleChallengeSuccess}
                    onFailure={handleChallengeFailure}
                    timeLimit={25}
                  />
                )}
                {challengeType === "classic" && (
                  <>
                    {currentChallenge.type === "quiz" && (
                      <QuizRunner
                        quiz={currentChallenge}
                        languageId={currentLanguageId || ""}
                        levelKey="boss-challenge"
                        onSuccess={handleChallengeSuccess}
                      />
                    )}
                    {currentChallenge.type === "code-fill" && (
                      <CodeFillRunner
                        game={currentChallenge}
                        languageId={currentLanguageId || ""}
                        levelKey="boss-challenge"
                        onSuccess={handleChallengeSuccess}
                      />
                    )}
                    {currentChallenge.type === "html-builder" && (
                      <HtmlBuilderRunner
                        game={currentChallenge}
                        languageId={currentLanguageId || ""}
                        levelKey="boss-challenge"
                        onSuccess={handleChallengeSuccess}
                      />
                    )}
                  </>
                )}
              </>
            )}
          </Card>
        )}

        {/* Idle State */}
        {phase === "idle" && currentBoss && (
          <Card className="p-8 border-border bg-gradient-card text-center">
            <div className="flex justify-center mb-4">
              <img 
                src={currentBoss.avatar} 
                alt={currentBoss.name}
                className="w-32 h-32 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{currentBoss.name}</h2>
            <p className="text-lg text-muted-foreground mb-6">{currentBoss.lore}</p>
            <Button onClick={startBattle} size="lg" className="gap-2">
              <Zap className="w-5 h-5" />
              Combattre le Kraken
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

