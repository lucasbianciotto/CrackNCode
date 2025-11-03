import { Language } from "@/types";
import {levels} from "@/data/levels.ts";

export const languages: Language[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "hsl(199 89% 48%)",
    description: "Langage polyvalent et accessible",
    currentLevel: 4,
    completedLevels: 3,
    totalXP: 6000,
    earnedXP: 3900,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "hsl(45 93% 47%)",
    description: "Le langage du web interactif",
    currentLevel: 5,
    completedLevels: 6,
    totalXP: 7500,
    earnedXP: 3375,
  },
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    color: "hsl(271 81% 56%)",
    description: "Puissance et performance",
    currentLevel: 3,
    completedLevels: 2,
    totalXP: 5000,
    earnedXP: 1250,
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "hsl(330 81% 60%)",
    description: "Robuste et orienté objet",
    currentLevel: 1,
    completedLevels: 1,
    totalXP: 6000,
    earnedXP: 600,
  },
  {
    id: "csharp",
    name: "C#",
    icon: "🎮",
    color: "hsl(142 76% 36%)",
    description: "Développement moderne et gaming",
    currentLevel: 0,
    completedLevels: 0,
    totalXP: 5500,
    earnedXP: 0,
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: "💎",
    color: "hsl(0 71% 48%)",
    description: "Élégant et expressif",
    currentLevel: 0,
    completedLevels: 0,
    totalXP: 4500,
    earnedXP: 0,
  },
];

export function getLanguageLevelsCount(id: string): number {
  return (levels[id] ?? []).length;
}
