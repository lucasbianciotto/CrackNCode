import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodePatternChallengeProps {
  challenge: {
    id: string;
    pattern: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
  timeLimit?: number;
}

export function CodePatternChallenge({
  challenge,
  onSuccess,
  onFailure,
  timeLimit = 15,
}: CodePatternChallengeProps) {
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
          <h3 className="text-xl font-bold text-foreground">🔍 Reconnaissance de Pattern</h3>
          <p className="text-sm text-muted-foreground">
            Identifie le pattern qui complète la séquence
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
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Pattern à compléter :</h4>
          <pre className="p-4 rounded-lg bg-background/50 border border-primary/20 font-mono text-sm text-foreground overflow-x-auto">
            {challenge.pattern}
          </pre>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Choisis la suite logique :</h4>
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
                  "w-full justify-start text-left h-auto p-4 font-mono text-sm",
                  !hasAnswered && "hover:bg-primary/10 hover:border-primary/50",
                  isSelected && isCorrect && showResult && "bg-green-adaptive border-green-adaptive",
                  isSelected && !isCorrect && showResult && "bg-destructive/20 border-destructive"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <code className="text-xs">{option}</code>
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

