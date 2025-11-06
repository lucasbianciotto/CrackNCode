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
        // Si pas connecté, retourne les données statiques
        return staticLanguages;
      }
      const data = await res.json();
      const apiLanguages = data.languages || [];

      // Fusionne les données de l'API avec les données statiques
      const mergedLanguages = staticLanguages.map((staticLang) => {
        const apiLang = apiLanguages.find((l: any) => l.id === staticLang.id);
        if (apiLang) {
          return {
            ...staticLang,
            currentLevel: apiLang.currentLevel || staticLang.currentLevel,
            completedLevels: apiLang.completedLevels || staticLang.completedLevels,
            earnedXP: apiLang.earnedXP || staticLang.earnedXP,
            totalXP: apiLang.totalXP || staticLang.totalXP,
          };
        }
        return staticLang;
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

