import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlock {
  language: string;
  code: string;
  errorLine?: number;
}

interface MultiLanguageChallengeProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    codeBlocks: CodeBlock[];
    correctAnswer: { blockIndex: number; lineIndex: number };
    explanation: string;
  };
  onSuccess: () => void;
  onFailure: () => void;
  timeLimit?: number;
}

export function MultiLanguageChallenge({
  challenge,
  onSuccess,
  onFailure,
  timeLimit = 30,
}: MultiLanguageChallengeProps) {
  const [selectedLine, setSelectedLine] = useState<{ blockIndex: number; lineIndex: number } | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  // Timer
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

  const handleLineClick = (blockIndex: number, lineIndex: number) => {
    if (hasAnswered) return;

    setSelectedLine({ blockIndex, lineIndex });
    setHasAnswered(true);

    const isCorrect =
      blockIndex === challenge.correctAnswer.blockIndex &&
      lineIndex === challenge.correctAnswer.lineIndex;

    if (isCorrect) {
      setTimeout(() => onSuccess(), 1000);
    } else {
      setTimeout(() => onFailure(), 1000);
    }
  };

  const getLineStatus = (blockIndex: number, lineIndex: number) => {
    if (!hasAnswered) return null;
    if (selectedLine?.blockIndex === blockIndex && selectedLine?.lineIndex === lineIndex) {
      const isCorrect =
        blockIndex === challenge.correctAnswer.blockIndex &&
        lineIndex === challenge.correctAnswer.lineIndex;
      return isCorrect ? "correct" : "incorrect";
    }
    if (
      blockIndex === challenge.correctAnswer.blockIndex &&
      lineIndex === challenge.correctAnswer.lineIndex &&
      selectedLine
    ) {
      return "correct";
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">{challenge.title}</h3>
          <p className="text-sm text-muted-foreground">{challenge.description}</p>
        </div>
        <div className={cn(
          "text-2xl font-bold",
          timeRemaining <= 10 ? "text-destructive animate-pulse" : "text-foreground"
        )}>
          {timeRemaining}s
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenge.codeBlocks.map((block, blockIndex) => (
          <Card key={blockIndex} className="p-4 border-border bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono px-2 py-1 rounded bg-background text-foreground">
                {block.language.toUpperCase()}
              </span>
            </div>
            <pre className="text-xs font-mono text-foreground overflow-x-auto">
              {block.code.split("\n").map((line, lineIndex) => {
                const status = getLineStatus(blockIndex, lineIndex);
                return (
                  <div
                    key={lineIndex}
                    onClick={() => handleLineClick(blockIndex, lineIndex)}
                    className={cn(
                      "px-2 py-1 rounded cursor-pointer transition-all",
                      status === "correct" && "bg-success/20 border-2 border-success",
                      status === "incorrect" && "bg-destructive/20 border-2 border-destructive",
                      !status && !hasAnswered && "hover:bg-accent/20",
                      !status && hasAnswered && "opacity-50"
                    )}
                  >
                    <span className="text-muted-foreground mr-2">{lineIndex + 1}</span>
                    {line || " "}
                    {status === "correct" && (
                      <CheckCircle2 className="w-4 h-4 text-success inline-block ml-2" />
                    )}
                    {status === "incorrect" && (
                      <XCircle className="w-4 h-4 text-destructive inline-block ml-2" />
                    )}
                  </div>
                );
              })}
            </pre>
          </Card>
        ))}
      </div>

      {hasAnswered && (
        <Card className="p-4 border-border bg-muted">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Explication :</p>
              <p className="text-sm text-muted-foreground">{challenge.explanation}</p>
            </div>
          </div>
        </Card>
      )}

      {!hasAnswered && (
        <div className="text-center text-sm text-muted-foreground">
          Cliquez sur la ligne contenant l'erreur ou l'incohérence
        </div>
      )}
    </div>
  );
}

