import { useQuery } from "@tanstack/react-query";
import type { AvatarOptions } from "@/components/profile/AvatarCustomizer";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// Hook pour récupérer la personnalisation de l'avatar
export const usePersonalisation = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["personalisation"],
    queryFn: async (): Promise<AvatarOptions | null> => {
      const res = await fetch(`${API_BASE}/api/personalisation`, {
        credentials: "include",
      });
      if (!res.ok) return null;
      const json = await res.json();
      const db = json.personalisation || {};
      
      const mapped: AvatarOptions = {
        // avatarStyle: "Circle",
        topType: db.hair ?? "ShortHairShortFlat",
        accessoriesType: db.accessories ?? "Blank",
        hatColor: db.hat_colors ?? "Black",
        hairColor: db.hair_colors ?? "Brown",
        facialHairType: db.facial_hair_types ?? "Blank",
        facialHairColor: db.facial_hair_colors ?? "Brown",
        clotheType: db.clothes ?? "Hoodie",
        clotheColor: db.clothes_colors ?? "Blue03",
        graphicType: db.graphics ?? "Bat",
        eyeType: db.eyes ?? "Default",
        eyebrowType: db.eyebrows ?? "Default",
        mouthType: db.mouth_types ?? "Smile",
        skinColor: db.skin_colors ?? "Light",
      };
      
      return mapped;
    },
    enabled,
    refetchInterval: 5000, // Actualise toutes les 5 secondes
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 1,
  });
};

