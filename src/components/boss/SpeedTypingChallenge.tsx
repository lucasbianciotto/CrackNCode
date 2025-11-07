import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Zap, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeedTypingChallengeProps {
  challenge: {
    id: string;
    targetCode: string;
    description: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
  timeLimit?: number;
}

export function SpeedTypingChallenge({
  challenge,
  onSuccess,
  onFailure,
  timeLimit = 30,
}: SpeedTypingChallengeProps) {
  const [userInput, setUserInput] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!started || hasCompleted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (!hasCompleted) {
            onFailure();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, hasCompleted, onFailure]);

  useEffect(() => {
    if (started && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [started]);

  useEffect(() => {
    if (userInput.trim() === challenge.targetCode.trim() && !hasCompleted) {
      setHasCompleted(true);
      setTimeout(() => onSuccess(), 500);
    }
  }, [userInput, challenge.targetCode, hasCompleted, onSuccess]);

  const handleStart = () => {
    setStarted(true);
    setUserInput("");
    setTimeRemaining(timeLimit);
  };

  const getAccuracy = () => {
    if (!userInput) return 100;
    const target = challenge.targetCode.trim();
    const input = userInput.trim();
    let correct = 0;
    const minLength = Math.min(target.length, input.length);
    for (let i = 0; i < minLength; i++) {
      if (target[i] === input[i]) correct++;
    }
    return Math.round((correct / target.length) * 100);
  };

  const getProgress = () => {
    const target = challenge.targetCode.trim();
    const input = userInput.trim();
    let progress = 0;
    const minLength = Math.min(target.length, input.length);
    for (let i = 0; i < minLength; i++) {
      if (target[i] === input[i]) {
        progress++;
      } else {
        break;
      }
    }
    return Math.round((progress / target.length) * 100);
  };

  const accuracy = getAccuracy();
  const progress = getProgress();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-adaptive" />
            Frappe Rapide
          </h3>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>
        {started && (
          <div className={cn(
            "text-2xl font-bold flex items-center gap-2",
            timeRemaining <= 10 ? "text-destructive animate-pulse" : "text-foreground"
          )}>
            <Clock className="w-5 h-5" />
            {timeRemaining}s
          </div>
        )}
      </div>

      <Card className="p-6 bg-card border-primary/30">
        {!started ? (
          <div className="text-center space-y-4">
            <p className="text-foreground">
              Tape le code suivant aussi rapidement que possible !
            </p>
            <pre className="p-4 rounded-lg bg-background/50 border border-primary/20 font-mono text-sm text-foreground overflow-x-auto">
              {challenge.targetCode}
            </pre>
            <Button onClick={handleStart} size="lg" className="gap-2">
              <Zap className="w-4 h-4" />
              Commencer
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Progression</span>
                <span className="text-sm font-bold text-primary">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground mb-2 block">
                Code à taper :
              </label>
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-32 p-4 font-mono text-sm bg-background/50 border border-primary/20 rounded-lg text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tape le code ici..."
                spellCheck={false}
                disabled={hasCompleted}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card className="p-3 bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Précision</div>
                <div className={cn(
                  "text-2xl font-bold",
                  accuracy >= 90 ? "text-green-adaptive" : accuracy >= 70 ? "text-yellow-adaptive" : "text-destructive"
                )}>
                  {accuracy}%
                </div>
              </Card>
              <Card className="p-3 bg-muted/50">
                <div className="text-xs text-muted-foreground mb-1">Caractères</div>
                <div className="text-2xl font-bold text-foreground">
                  {userInput.length} / {challenge.targetCode.length}
                </div>
              </Card>
            </div>

            {hasCompleted && (
              <Card className="p-4 bg-green-adaptive/20 border-green-adaptive">
                <div className="flex items-center gap-2 text-green-adaptive font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Code tapé avec succès !
                </div>
              </Card>
            )}
          </>
        )}
      </Card>
    </div>
  );
}

