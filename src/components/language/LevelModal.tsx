import { Level } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Play, Lock } from "lucide-react";

interface LevelModalProps {
  level: Level | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
}

const difficultyColors = {
  beginner: "bg-accent/20 text-accent border-accent/50",
  intermediate: "bg-primary/20 text-primary border-primary/50",
  advanced: "bg-secondary/20 text-secondary border-secondary/50",
  expert: "bg-destructive/20 text-destructive border-destructive/50",
};

export const LevelModal = ({ level, isOpen, onClose, onPlay }: LevelModalProps) => {
  if (!level) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-xl">
              {level.levelNumber}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{level.title}</DialogTitle>
              <Badge className={difficultyColors[level.difficulty]}>
                {level.difficulty}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Image placeholder */}
          {level.imageUrl ? (
            <img
              src={level.imageUrl}
              alt={level.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
              <Trophy className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
          
          <DialogDescription className="text-base text-foreground">
            {level.description}
          </DialogDescription>
          
          {/* Stats */}
          <div className="flex items-center gap-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground">Récompense</p>
                <p className="font-bold text-foreground">+{level.xpReward} XP</p>
              </div>
            </div>
            
            {level.isCompleted && (
              <div className="flex items-center gap-2 text-accent">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-xs text-muted-foreground">Statut</p>
                  <p className="font-bold">Complété</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          <div className="flex gap-3 pt-4">
            {level.isLocked ? (
              <Button disabled className="flex-1 gap-2" size="lg">
                <Lock className="w-5 h-5" />
                Niveau verrouillé
              </Button>
            ) : (
              <Button
                onClick={onPlay}
                className="flex-1 gap-2 bg-gradient-hero text-primary-foreground hover:opacity-90 dark:text-primary-foreground"
                size="lg"
              >
                <Play className="w-5 h-5" />
                {level.isCompleted ? "Rejouer" : "Commencer"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
