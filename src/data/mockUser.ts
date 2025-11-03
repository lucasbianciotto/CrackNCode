import { UserProfile } from "@/types";

export const mockUser: UserProfile & { avatarOptions?: any } = {
  id: "user-1",
  username: "DevMaster",
  level: 12,
  currentXP: 3450,
  xpToNextLevel: 5000,
  totalXP: 24750,
  completedChallenges: 47,
  achievements: ["first-blood", "speed-demon", "perfectionist"],
};
