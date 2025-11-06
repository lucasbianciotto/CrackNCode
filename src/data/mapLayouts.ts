    // Custom per-language level node positions for the treasure-map UI
// Coordinates are percentages relative to the LevelMap container (0..100)
// You can key points by levelNumber or by id. If both are present, id takes precedence.

export type MapPoint = {
  id?: string;
  levelNumber?: number;
  x: number; // 0..100
  y: number; // 0..100
};

export const mapLayouts: Record<string, MapPoint[]> = {
  // Example layouts — adjust freely to match your overlay images.
  // HTML/CSS: 5 niveaux
  html: [
    { levelNumber: 1, x: 28, y: 34 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 72, y: 90 },
    { levelNumber: 4, x: 72, y: 33 },
    { levelNumber: 5, x: 49, y: 65 },
  ],
  // C++: 5 niveaux (exemple)
  cpp: [
    { levelNumber: 1, x: 28, y: 38 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 70, y: 90 },
    { levelNumber: 4, x: 72, y: 35 },
    { levelNumber: 5, x: 49, y: 65 },
  ],
  // SQL: 5 niveaux (exemple)
  sql: [
    { levelNumber: 1, x: 28, y: 38 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 70, y: 90 },
    { levelNumber: 4, x: 72, y: 35 },
    { levelNumber: 5, x: 51, y: 56 },
  ],
  // JavaScript: 5 niveaux (exemple)
  javascript: [
    { levelNumber: 1, x: 28, y: 38 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 70, y: 90 },
    { levelNumber: 4, x: 72, y: 35 },
    { levelNumber: 5, x: 51, y: 56 },
  ],
  // PHP: 5 niveaux (exemple)
  php: [
    { levelNumber: 1, x: 28, y: 34 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 73, y: 90 },
    { levelNumber: 4, x: 72, y: 33 },
    { levelNumber: 5, x: 51, y: 60 },
  ],
  // Python: 5 niveaux (exemple)
  python: [
    { levelNumber: 1, x: 28, y: 34 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 73, y: 90 },
    { levelNumber: 4, x: 72, y: 33 },
    { levelNumber: 5, x: 51, y: 65 },
  ],
  // JAVA: 5 niveaux (exemple)
  java: [
    { levelNumber: 1, x: 28, y: 34 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 72, y: 90 },
    { levelNumber: 4, x: 72, y: 33 },
    { levelNumber: 5, x: 50.5, y: 50 },
  ],
  // csharp: 5 niveaux (exemple)
  csharp: [
    { levelNumber: 1, x: 28, y: 34 },
    { levelNumber: 2, x: 28, y: 90 },
    { levelNumber: 3, x: 72, y: 90 },
    { levelNumber: 4, x: 72, y: 33 },
    { levelNumber: 5, x: 50, y: 60 },
  ],
};

// Helper to resolve a level position by id or levelNumber
export function findPoint(points: MapPoint[], opts: { id?: string; levelNumber?: number }) {
  if (!points || points.length === 0) return undefined;
  if (opts.id) {
    const byId = points.find((p) => p.id === opts.id);
    if (byId) return byId;
  }
  if (typeof opts.levelNumber === "number") {
    return points.find((p) => p.levelNumber === opts.levelNumber);
  }
  return undefined;
}
