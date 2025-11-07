import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Fonction pour mapper les données utilisateur
const mapUserData = (data: any): UserProfile | null => {
  if (!data?.authenticated || !data?.user) return null;

  const baseUser = data.user;
  const xpGlobal = typeof baseUser.xp_global === "number" ? baseUser.xp_global : 0;
  
  // Progression exponentielle : niveau 1 à 28 au combat Kraken, puis jusqu'à 30 (niveau rond)
  // Formule : level = 1 + floor(sqrt(xp / 10))
  // - Niveau 1 : 0 XP
  // - Niveau 2 : ~30 XP (après premier niveau de 100 XP, on a 100 XP donc niveau 4, mais on veut niveau 2)
  // - Niveau 28 : ~7200 XP (tous les langages complétés : 8 * 900 = 7200 XP)
  // - Niveau 30 : ~9000 XP (niveau rond final)
  
  // Calcul du niveau avec progression exponentielle
  const calculateLevel = (xp: number): number => {
    if (xp <= 0) return 1;
    // Formule exponentielle : level = 1 + floor(sqrt(xp / 10))
    // Avec k=10 : 7200 XP → 1 + sqrt(720) ≈ 1 + 26.8 ≈ 28 ✓
    //             9000 XP → 1 + sqrt(900) = 1 + 30 = 31, limité à 30 ✓
    const level = Math.floor(1 + Math.sqrt(xp / 10));
    // Limite à 30 (niveau rond final)
    return Math.min(level, 30);
  };
  
  const level = calculateLevel(xpGlobal);
  
  // Calcul de l'XP nécessaire pour le niveau suivant
  // Pour niveau n, il faut (n-1)² * 10 XP
  const xpForNextLevel = (level + 1 <= 30) ? Math.pow(level, 2) * 10 : Infinity;
  const xpForCurrentLevel = level > 1 ? Math.pow(level - 1, 2) * 10 : 0;
  const currentXP = xpGlobal - xpForCurrentLevel;
  const xpToNextLevel = xpForNextLevel - xpForCurrentLevel;
  const totalXP = xpGlobal;

  const mapped: UserProfile = {
    id: baseUser.id,
    username: baseUser.username,
    level,
    currentXP,
    xpToNextLevel,
    totalXP,
    completedChallenges: baseUser.completedChallenges ?? 0,
    achievements: baseUser.achievements ?? [],
  };

  const withAvatar = { ...(mapped as any), avatarOptions: baseUser.avatarOptions };
  return withAvatar as UserProfile;
};

// Hook pour récupérer les données utilisateur avec polling
export const useUserData = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/me`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const data = await res.json();
      return mapUserData(data);
    },
    refetchInterval: 5000, // Actualise toutes les 5 secondes
    refetchIntervalInBackground: true, // Continue même si l'onglet n'est pas actif
    refetchOnWindowFocus: true, // Actualise quand on revient sur l'onglet
    staleTime: 0, // Les données sont toujours considérées comme périmées
    retry: 1,
  });
};

// Hook pour invalider et refetch les données utilisateur
export const useInvalidateUser = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
};

