import { Boss } from "@/types";

// Boss principal unique pour toute l'application
export const mainBoss: Boss = {
  id: "main-boss",
  name: "Codex",
  title: "Le Gardien Ultime du Code",
  description: "Un être légendaire qui protège les secrets de la programmation",
  lore: "Codex est l'entité suprême qui règne sur tous les langages de programmation. Depuis des millénaires, il défie les développeurs qui osent s'aventurer dans son royaume. Chaque défi relevé l'affaiblit, mais sa puissance est immense. Vaincs-le en maîtrisant tous les langages et en complétant tous les défis !",
  maxHP: 1000,
  currentHP: 850, // Affaibli par les défis précédents
  avatar: "👹",
  color: "#ef4444",
};

export const getMainBoss = (): Boss => {
  return mainBoss;
};

