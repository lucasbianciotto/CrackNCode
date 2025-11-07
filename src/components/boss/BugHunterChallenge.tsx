import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

interface BugHunterChallengeProps {
  challenge: {
    id: string;
    code: string;
    bugs: Array<{ line: number; description: string }>;
    correctBugs: number[];
  };
  onSuccess: () => void;
  onFailure: () => void;
  timeLimit?: number;
}

export function BugHunterChallenge({
  challenge,
  onSuccess,
  onFailure,
  timeLimit = 20,
}: BugHunterChallengeProps) {
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  useEffect(() => {
    if (hasSubmitted) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (!hasSubmitted) {
            onFailure();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [hasSubmitted, onFailure]);

  const toggleLine = (lineNumber: number) => {
    if (hasSubmitted) return;
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) {
        next.delete(lineNumber);
      } else {
        next.add(lineNumber);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;

    setHasSubmitted(true);
    const selectedArray = Array.from(selectedLines).sort((a, b) => a - b);
    const correctArray = [...challenge.correctBugs].sort((a, b) => a - b);

    const isCorrect =
      selectedArray.length === correctArray.length &&
      selectedArray.every((val, idx) => val === correctArray[idx]);

    if (isCorrect) {
      setTimeout(() => onSuccess(), 1500);
    } else {
      setTimeout(() => onFailure(), 1500);
    }
  };

  const codeLines = challenge.code.split("\n");
  const isLineBug = (lineNumber: number) => challenge.correctBugs.includes(lineNumber);
  const isLineSelected = (lineNumber: number) => selectedLines.has(lineNumber);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bug className="w-5 h-5 text-destructive" />
            Chasse aux Bugs
          </h3>
          <p className="text-sm text-muted-foreground">
            Clique sur les lignes contenant des bugs ({challenge.correctBugs.length} bug{challenge.correctBugs.length > 1 ? "s" : ""})
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
        <div className="mb-4">
          <pre className="p-4 rounded-lg bg-background/50 border border-primary/20 font-mono text-xs text-foreground overflow-x-auto max-h-[400px] overflow-y-auto">
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const isBug = isLineBug(lineNumber);
              const isSelected = isLineSelected(lineNumber);
              const showResult = hasSubmitted;

              return (
                <div
                  key={index}
                  onClick={() => toggleLine(lineNumber)}
                  className={cn(
                    "px-2 py-1 rounded cursor-pointer transition-all flex items-center gap-2",
                    isSelected && !showResult && "bg-primary/20 border border-primary/50",
                    showResult && isBug && isSelected && "bg-green-adaptive/20 border-2 border-green-adaptive",
                    showResult && !isBug && isSelected && "bg-destructive/20 border-2 border-destructive",
                    showResult && isBug && !isSelected && "bg-yellow-adaptive/20 border-2 border-yellow-adaptive",
                    !hasSubmitted && "hover:bg-primary/10"
                  )}
                >
                  <span className="text-muted-foreground w-8 text-right">{lineNumber}</span>
                  <code className="flex-1">{line || " "}</code>
                  {showResult && isBug && (
                    <CheckCircle2 className={cn(
                      "w-4 h-4",
                      isSelected ? "text-green-adaptive" : "text-yellow-adaptive"
                    )} />
                  )}
                  {showResult && !isBug && isSelected && (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
              );
            })}
          </pre>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            {selectedLines.size} ligne{selectedLines.size > 1 ? "s" : ""} sélectionnée{selectedLines.size > 1 ? "s" : ""}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={hasSubmitted || selectedLines.size === 0}
            className="gap-2"
          >
            <Bug className="w-4 h-4" />
            Valider
          </Button>
        </div>

        {hasSubmitted && (
          <Card className="mt-4 p-4 bg-muted/50 border-primary/20">
            <p className="text-sm text-foreground mb-2">
              <strong>Bugs trouvés :</strong>
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {challenge.bugs.map((bug, idx) => (
                <li key={idx}>
                  • Ligne {bug.line}: {bug.description}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Card>
    </div>
  );
}

