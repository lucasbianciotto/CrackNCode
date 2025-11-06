import { useQuery, useQueryClient } from "@tanstack/react-query";
import { languages as staticLanguages } from "@/data/languages";
import { levels as staticLevels } from "@/data/levels";
import type { Language, Level } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

interface LanguageProgressData {
  language: Language | undefined;
  levels: Level[];
  completedLevel: number;
}

// Hook pour récupérer la progression d'un langage
export const useLanguageProgress = (languageId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["language-progress", languageId],
    queryFn: async (): Promise<LanguageProgressData> => {
      if (!languageId) {
        return {
          language: undefined,
          levels: [],
          completedLevel: 0,
        };
      }

      const res = await fetch(`${API_BASE}/api/languages/${languageId}/levels`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Si pas connecté, retourne les données statiques
        const staticLang = staticLanguages.find((lang) => lang.id === languageId);
        const staticLevelsForLang = staticLevels[languageId] || [];
        return {
          language: staticLang,
          levels: staticLevelsForLang,
          completedLevel: 0,
        };
      }

      const data = await res.json();
      const completed = data.completedLevel || 0;

      // Met à jour le langage avec la progression
      const staticLang = staticLanguages.find((lang) => lang.id === languageId);
      
      // Calcule l'XP gagné depuis les niveaux complétés
      const XP_PER_LEVEL = [100, 150, 200, 200, 250];
      const earnedXP = completed > 0 
        ? XP_PER_LEVEL.slice(0, completed).reduce((sum, xp) => sum + xp, 0)
        : 0;
      const totalXP = 900; // 100 + 150 + 200 + 200 + 250
      
      const updatedLanguage = staticLang
        ? {
            ...staticLang,
            completedLevels: completed,
            currentLevel: data.currentLevel || completed + 1,
            earnedXP: data.earnedXP !== undefined ? data.earnedXP : earnedXP,
            totalXP: data.totalXP !== undefined ? data.totalXP : totalXP,
          }
        : undefined;

      // Met à jour les niveaux avec leur statut
      const staticLevelsForLang = staticLevels[languageId] || [];
      const updatedLevels = staticLevelsForLang.map((level) => ({
        ...level,
        isCompleted: level.levelNumber <= completed,
        isLocked: level.levelNumber > completed + 1,
      }));

      return {
        language: updatedLanguage,
        levels: updatedLevels,
        completedLevel: completed,
      };
    },
    enabled: enabled && !!languageId,
    refetchInterval: 5000, // Actualise toutes les 5 secondes
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 1,
  });
};

// Hook pour invalider et refetch la progression d'un langage
export const useInvalidateLanguageProgress = () => {
  const queryClient = useQueryClient();
  return (languageId?: string) => {
    if (languageId) {
      queryClient.invalidateQueries({ queryKey: ["language-progress", languageId] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["language-progress"] });
    }
  };
};

