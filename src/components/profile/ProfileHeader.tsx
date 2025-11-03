import { UserProfile } from "@/types";
import { Trophy, Target, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avataaars } from "@/components/ui/Avataaars";

interface ProfileHeaderProps {
  user: UserProfile & { avatarOptions?: any };
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const xpPercentage = (user.currentXP / user.xpToNextLevel) * 100;
  const avatarProps = user.avatarOptions || {
    avatarStyle: "Circle",
    topType: "ShortHairShortFlat",
    accessoriesType: "Blank",
    hairColor: "Brown",
    facialHairType: "Blank",
    clotheType: "Hoodie",
    clotheColor: "Blue03",
    eyeType: "Default",
    eyebrowType: "Default",
    mouthType: "Smile",
    skinColor: "Light",
  };
  
  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-bold glow-primary overflow-hidden">
            <Avataaars
              style={{ width: '100%', height: '100%' }}
              {...avatarProps}
            />
          </div>
          <div className="absolute -bottom-2 -right-2 level-badge">
            Lvl {user.level}
          </div>
        </div>
        
        {/* User Info */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.username}</h1>
            <p className="text-muted-foreground">Développeur en formation</p>
          </div>
          
          {/* XP Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progression vers le niveau {user.level + 1}</span>
              <span className="font-bold text-foreground">
                {user.currentXP} / {user.xpToNextLevel} XP
              </span>
            </div>
            <div className="xp-bar">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Défis</p>
                <p className="text-lg font-bold text-foreground">{user.completedChallenges}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-lg font-bold text-foreground">{user.totalXP}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Succès</p>
                <p className="text-lg font-bold text-foreground">{user.achievements.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
