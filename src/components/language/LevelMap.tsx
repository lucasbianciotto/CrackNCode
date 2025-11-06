import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { Level } from "@/types";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { mapLayouts, findPoint, MapPoint } from "@/data/mapLayouts";
import { CheckCircle2, Lock as LockIcon, Circle as CircleIcon } from "lucide-react";

type LevelMapProps = {
  levels: Level[];
  onSelect: (level: Level) => void;
  languageId?: string; // to pick a predefined layout
  positions?: MapPoint[]; // explicit override positions per page
  forceVertical?: boolean; // for mobile/small screens
};

// A candy-crush-like vertical map with a central path and alternating left/right nodes
// Seeded RNG helpers for deterministic "treasure map" placement
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type PositionedLevel = Level & { xPercent: number; yPercent: number };

export const LevelMap: React.FC<LevelMapProps> = ({ levels, onSelect, languageId, positions, forceVertical }) => {
  if (!levels || levels.length === 0) return null;

  // Responsive: if forceVertical, render a simple vertical column
  if (forceVertical) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        {levels
          .slice()
          .sort((a, b) => a.levelNumber - b.levelNumber)
          .map((level, idx) => {
            const isLocked = !!level.isLocked;
            const isCompleted = !!level.isCompleted;
            const isActive = !isLocked && !isCompleted;
            return (
              <div key={level.id} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => (isLocked ? undefined : onSelect(level))}
                  aria-label={`Niveau ${level.levelNumber}${isLocked ? " verrouillé" : ""}`}
                  className={cn(
                    "relative rounded-full border shadow-card transition-transform focus:outline-none focus:ring-2 focus:ring-ring",
                    "flex items-center justify-center font-bold",
                    "w-16 h-16 md:w-20 md:h-20",
                    isCompleted && "bg-success text-success-foreground border-success/40",
                    isActive && "bg-gradient-accent text-foreground border-accent/40",
                    isLocked && "bg-muted text-muted-foreground border-muted-foreground/20 opacity-80 cursor-not-allowed",
                    !isLocked && "cursor-pointer hover:scale-105",
                  )}
                >
                  <span className="text-lg md:text-xl drop-shadow-sm">{level.levelNumber}</span>
                  {isCompleted && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-5 w-5 text-success bg-background rounded-full" />
                  )}
                  {isLocked && (
                    <LockIcon className="absolute -top-1 -right-1 h-5 w-5 text-muted-foreground bg-background rounded-full" />
                  )}
                  {!isCompleted && !isLocked && (
                    <CircleIcon className="absolute -top-1 -right-1 h-5 w-5 text-accent bg-background rounded-full" />
                  )}
                </button>
                {/* Info below */}
                <div className="mt-2 text-center">
                  <div className="font-semibold text-foreground">{level.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">{level.difficulty}</div>
                  <div className="text-xs text-muted-foreground">+{level.xpReward} XP</div>
                </div>
                {/* Arrow to next (except last) */}
                {idx < levels.length - 1 && (
                  <svg width="4" height="48" viewBox="0 0 4 48" className="my-2">
                    <line x1="2" y1="0" x2="2" y2="44" stroke="white" strokeWidth="2" strokeDasharray="2 8" strokeOpacity={levels[idx + 1].isLocked ? 0.25 : 1.0} />
                    <polygon points="0,44 4,44 2,48" fill="white" opacity={levels[idx + 1].isLocked ? 0.25 : 1.0} />
                  </svg>
                )}
              </div>
            );
          })}
      </div>
    );
  }

  const positioned = useMemo<PositionedLevel[]>(() => {
    const sorted = levels.slice().sort((a, b) => a.levelNumber - b.levelNumber);
    // 1) Try explicit positions prop first
    const points = positions && positions.length ? positions : (languageId ? mapLayouts[languageId] : undefined);

    if (points && points.length) {
      // Use provided layout; fallback individually if a level has no configured point
      return sorted.map((lvl, i) => {
        const p = findPoint(points, { id: lvl.id, levelNumber: lvl.levelNumber });
        if (p) {
          const xPercent = Math.max(0, Math.min(100, p.x));
          const yPercent = Math.max(0, Math.min(100, p.y));
          return Object.assign({}, lvl, { xPercent, yPercent });
        }
        // Fallback for missing: place roughly on a small inner ellipse
        const innerRx = 26; const innerRy = 18;
        const cx = 50; const cy = 50;
        const angle = (-Math.PI / 2) + (i * ((2 * Math.PI) / Math.max(1, sorted.length)));
        const xPercent = cx + innerRx * Math.cos(angle);
        const yPercent = cy + innerRy * Math.sin(angle);
        console.warn(`[LevelMap] Missing position for level ${lvl.id || lvl.levelNumber} in layout ${languageId ?? "custom"}. Using fallback.`);
        return Object.assign({}, lvl, { xPercent, yPercent });
      });
    }

    // 2) No layout configured: use procedural ellipse with jitter
    const seedGen = xmur3(sorted.map((l) => l.id).join("|"));
    const rand = mulberry32(seedGen());
    const cx = 50; const cy = 50; const rx = 36; const ry = 26;
    const N = Math.max(1, sorted.length);
    const angleStart = -Math.PI / 2;
    const angleStep = (2 * Math.PI) / N;
    return sorted.map((level, i) => {
      const angle = angleStart + i * angleStep;
      const baseX = cx + rx * Math.cos(angle);
      const baseY = cy + ry * Math.sin(angle);
      const jx = (rand() - 0.5) * 6;
      const jy = (rand() - 0.5) * 6;
      const xPercent = Math.max(8, Math.min(92, baseX + jx));
      const yPercent = Math.max(8, Math.min(92, baseY + jy));
      return Object.assign({}, level, { xPercent, yPercent });
    });
  }, [levels, languageId, positions]);

  // Height of the container in px (responsive-ish)
  const n = positioned.length;
  const totalHeightPx = Math.max(480, Math.min(880, 480 + (n - 5) * 60));

  return (
    <div className="relative" style={{ height: totalHeightPx }}>
      {/* SVG connectors between successive nodes for a treasure-map vibe */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width="100%"
        height={totalHeightPx}
        viewBox={`0 0 100 100`}
        preserveAspectRatio="none"
      >
        <defs>
          <marker id="arrow-white" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill="white" />
          </marker>
          <marker id="arrow-white-faded" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill="white" opacity="0.4" />
          </marker>
        </defs>
        {/* subtle background connectors along the loop */}
        {positioned.map((curr, i) => {
          if (i === 0) return null;
          const prev = positioned[i - 1];
          const x1 = prev.xPercent;
          const y1 = prev.yPercent;
          const x2 = curr.xPercent;
          const y2 = curr.yPercent;
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          // push control point outward from center to create a gentle curve
          const vx = midX - 50;
          const vy = midY - 50;
          const len = Math.max(1, Math.hypot(vx, vy));
          const nx = (vx / len) * 10; // outward normal of magnitude ~10
          const ny = (vy / len) * 10;
          const cx1 = midX + nx;
          const cy1 = midY + ny;
          const d = `M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`;
          const nextLocked = curr.isLocked === true;
          const strokeOpacity = nextLocked ? 0.25 : 1.0;
          const marker = nextLocked ? "url(#arrow-white-faded)" : "url(#arrow-white)";
          return (
            <path
              key={`seg-${curr.id}`}
              d={d}
              fill="none"
              stroke="white"
              strokeOpacity={strokeOpacity}
              strokeWidth={3}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="1 7"
              strokeLinecap="round"
              markerEnd={marker}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {positioned.map((level) => {
        const isLocked = !!level.isLocked;
        const isCompleted = !!level.isCompleted;
        const isActive = !isLocked && !isCompleted;

        return (
          <div
            key={level.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${level.xPercent}%`, top: `${(level.yPercent / 100) * totalHeightPx}px` }}
          >
            <HoverCard openDelay={60} closeDelay={60}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  onClick={() => (isLocked ? undefined : onSelect(level))}
                  aria-label={`Niveau ${level.levelNumber}${isLocked ? " verrouillé" : ""}`}
                  className={cn(
                    "relative rounded-full border shadow-card transition-transform focus:outline-none focus:ring-2 focus:ring-ring",
                    "flex items-center justify-center font-bold",
                    "w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20",
                    isCompleted && "bg-success text-success-foreground border-success/40",
                    isActive && "bg-gradient-accent text-foreground border-accent/40",
                    isLocked && "bg-muted text-muted-foreground border-muted-foreground/20 opacity-80 cursor-not-allowed",
                    !isLocked && "cursor-pointer hover:scale-105",
                  )}
                >
                  <span className="text-lg md:text-xl drop-shadow-sm">{level.levelNumber}</span>
                  {isCompleted && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-5 w-5 text-success bg-background rounded-full" />
                  )}
                  {isLocked && (
                    <LockIcon className="absolute -top-1 -right-1 h-5 w-5 text-muted-foreground bg-background rounded-full" />
                  )}
                  {!isCompleted && !isLocked && (
                    <CircleIcon className="absolute -top-1 -right-1 h-5 w-5 text-accent bg-background rounded-full" />
                  )}
                </button>
              </HoverCardTrigger>
              <HoverCardContent align={level.xPercent < 50 ? "start" : "end"} className="max-w-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">Niveau {level.levelNumber}</p>
                    <span
                      className={cn(
                        "text-xs rounded-full px-2 py-0.5 border",
                        level.difficulty === "beginner" && "text-accent border-accent/40",
                        level.difficulty === "intermediate" && "text-primary border-primary/40",
                        level.difficulty === "advanced" && "text-secondary border-secondary/40",
                        level.difficulty === "expert" && "text-destructive border-destructive/40",
                      )}
                    >
                      {level.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">{level.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>+{level.xpReward} XP</span>
                    {isCompleted && <span className="text-success font-medium">Complété</span>}
                    {isLocked && <span>Verrouillé</span>}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        );
      })}
    </div>
  );
};

export default LevelMap;
