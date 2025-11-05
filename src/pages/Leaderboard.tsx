import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { PirateDivider } from "@/components/ui/pirate/PirateDivider";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Leaderboard = () => {
  const [topPlayers, setTopPlayers] = useState<Array<{
    rank: number;
    username: string;
    level: number;
    xp: number;
    avatar?: string;
  }>>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/leaderboard`);
        if (res.ok) {
          const data = await res.json();
          // Ajoute des avatars par défaut basés sur le rang
          const players = data.leaderboard.map((player: any, index: number) => ({
            ...player,
            avatar: index === 0 ? "🔥" : index === 1 ? "⚡" : index === 2 ? "🥷" : "💻",
          }));
          setTopPlayers(players);
        }
      } catch (err) {
        console.error("Erreur lors du chargement du leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);
  
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-8 h-8 text-primary animate-pulse-glow" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Classement</h1>
          <p className="text-muted-foreground">Les meilleurs développeurs du Game of Code</p>
        </div>
        {/* PirateDivider sous le header */}
        <div className="px-8 pb-2">
          <PirateDivider />
        </div>
        {/* Leaderboard */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-3">
            {topPlayers.map((player) => (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                  player.rank <= 3
                    ? "bg-gradient-card border border-border"
                    : "bg-muted"
                }`}
              >
                {/* Rank */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  {player.rank === 1 && (
                    <Medal className="w-8 h-8 text-primary" />
                  )}
                  {player.rank === 2 && (
                    <Medal className="w-8 h-8 text-muted-foreground" />
                  )}
                  {player.rank === 3 && (
                    <Medal className="w-7 h-7 text-secondary" />
                  )}
                  {player.rank > 3 && (
                    <span className="text-xl font-bold text-muted-foreground">
                      #{player.rank}
                    </span>
                  )}
                </div>
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-2xl shrink-0">
                  {player.avatar}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground truncate">
                    {player.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Niveau {player.level}
                  </p>
                </div>
                {/* XP */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground">
                    {player.xp.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;
