import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogicPuzzleChallengeProps {
  challenge: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
  timeLimit?: number;
}

export function LogicPuzzleChallenge({
  challenge,
  onSuccess,
  onFailure,
  timeLimit = 25,
}: LogicPuzzleChallengeProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    if (hasAnswered) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (!hasAnswered) {
            onFailure();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasAnswered, onFailure]);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;

    setSelectedIndex(index);
    setHasAnswered(true);

    if (index === challenge.correctIndex) {
      setTimeout(() => onSuccess(), 1000);
    } else {
      setTimeout(() => onFailure(), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-adaptive" />
            Puzzle Logique
          </h3>
          <p className="text-sm text-muted-foreground">
            Résous ce puzzle de logique de programmation
          </p>
        </div>
        <div className={cn(
          "text-2xl font-bold flex items-center gap-2",
          timeRemaining <= 5 ? "text-destructive animate-pulse" : "text-foreground"
        )}>
          <Clock className="w-5 h-5" />
          {timeRemaining}s
        </div>
      </div>

      <Card className="p-6 bg-card border-primary/30">
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Question :</h4>
          <p className="text-base text-foreground leading-relaxed bg-background/50 p-4 rounded-lg border border-primary/20">
            {challenge.question}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Choisis la bonne réponse :</h4>
          {challenge.options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = index === challenge.correctIndex;
            const showResult = hasAnswered;

            return (
              <Button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={hasAnswered}
                variant={isSelected && showResult ? (isCorrect ? "default" : "destructive") : "outline"}
                className={cn(
                  "w-full justify-start text-left h-auto p-4",
                  !hasAnswered && "hover:bg-primary/10 hover:border-primary/50",
                  isSelected && isCorrect && showResult && "bg-green-adaptive border-green-adaptive",
                  isSelected && !isCorrect && showResult && "bg-destructive/20 border-destructive"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {showResult && isSelected && (
                    isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-adaptive" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )
                  )}
                  {showResult && !isSelected && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-adaptive" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {hasAnswered && (
          <Card className="mt-4 p-4 bg-muted/50 border-primary/20">
            <p className="text-sm text-foreground">
              <strong>Explication :</strong> {challenge.explanation}
            </p>
          </Card>
        )}
      </Card>
    </div>
  );
}

