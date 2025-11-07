import { Boss } from "@/types";

// Boss principal unique pour toute l'application
export const mainBoss: Boss = {
  id: "main-boss",
  name: "Kraken",
  title: "Le Kraken du Code",
  description: "Une menace terrifiante qui a plongé le monde des développeurs dans les ténèbres",
  lore: "Le Kraken du Code est l'entité suprême qui règne sur tous les langages de programmation. Ses tentacules d'erreurs et de bugs paralysent les projets les plus ambitieux. Depuis des millénaires, il défie les développeurs qui osent s'aventurer dans son royaume. Chaque défi relevé l'affaiblit, mais sa puissance est immense. Vaincs-le en maîtrisant tous les langages et en complétant tous les défis !",
  maxHP: 1000,
  currentHP: 1000, // Commence à 100% pour le combat
  avatar: "/kraken/boss.png",
  color: "#ef4444",
};

export const getMainBoss = (): Boss => {
  return mainBoss;
};

