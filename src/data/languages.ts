import { Language } from "@/types";
import {levels} from "@/data/levels.ts";

// Calcul de l'XP total par langage : 100 + 150 + 200 + 200 + 250 = 900 XP
const XP_PER_LANGUAGE = 900;

export const languages: Language[] = [
  // 1) HTML/CSS
  {
    id: "html",
    name: "HTML/CSS",
    icon: "🧱", // Garde l'emoji comme fallback, mais on utilisera l'image
    color: "hsl(14 85% 57%)",
    description: "Structure et styles: démarre avec un mini‑jeu interactif",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 2) JavaScript
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "hsl(45 93% 47%)",
    description: "Le langage du web interactif",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 3) PHP
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "hsl(258 90% 66%)",
    description: "Backend web pragmatique",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 4) SQL
  {
    id: "sql",
    name: "SQL",
    icon: "🧮",
    color: "hsl(199 89% 48%)",
    description: "Interroger et manipuler des données",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 5) Python
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "hsl(199 89% 48%)",
    description: "Polyvalent et accessible",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 6) Java
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "hsl(330 81% 60%)",
    description: "Robuste et orienté objet",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 7) C#
  {
    id: "csharp",
    name: "C#",
    icon: "🎮",
    color: "hsl(142 76% 36%)",
    description: "Développement moderne et gaming",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
  // 8) C++
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    color: "hsl(271 81% 56%)",
    description: "Puissance et performance",
    currentLevel: 1,
    completedLevels: 0,
    totalXP: XP_PER_LANGUAGE, // 900 XP
    earnedXP: 0,
  },
];

export function getLanguageLevelsCount(id: string): number {
  return (levels[id] ?? []).length;
}
