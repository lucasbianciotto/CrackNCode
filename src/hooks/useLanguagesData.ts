import { useQuery, useQueryClient } from "@tanstack/react-query";
import { languages as staticLanguages } from "@/data/languages";
import type { Language } from "@/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Hook pour récupérer les langages avec progression
export const useLanguagesData = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["languages"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/languages`, {
        credentials: "include",
      });
      if (!res.ok) {
        // Si pas connecté, retourne les données statiques avec progression à 0
        return staticLanguages.map(lang => ({
          ...lang,
          currentLevel: 1,
          completedLevels: 0,
          earnedXP: 0,
          totalXP: lang.totalXP,
        }));
      }
      const data = await res.json();
      const apiLanguages = data.languages || [];

      // Fusionne les données de l'API avec les données statiques
      const mergedLanguages = staticLanguages.map((staticLang) => {
        const apiLang = apiLanguages.find((l: any) => l.id === staticLang.id);
        if (apiLang) {
          return {
            ...staticLang,
            currentLevel: apiLang.currentLevel || 1,
            completedLevels: apiLang.completedLevels || 0,
            earnedXP: apiLang.earnedXP || 0,
            totalXP: apiLang.totalXP || staticLang.totalXP,
          };
        }
        // Si pas de données API pour ce langage, retourne avec progression à 0
        return {
          ...staticLang,
          currentLevel: 1,
          completedLevels: 0,
          earnedXP: 0,
          totalXP: staticLang.totalXP,
        };
      });

      return mergedLanguages;
    },
    enabled: true, // Toujours activé pour afficher les langages même si pas connecté
    refetchInterval: enabled ? 5000 : false, // Actualise seulement si connecté
    refetchIntervalInBackground: enabled,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 1,
  });
};

// Hook pour invalider et refetch les langages
export const useInvalidateLanguages = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["languages"] });
  };
};

