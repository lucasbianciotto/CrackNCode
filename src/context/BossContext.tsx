import { createContext, useContext, useState, ReactNode } from "react";
import { Boss } from "@/types";

interface BossContextType {
  currentBoss: Boss | null;
  setCurrentBoss: (boss: Boss | null) => void;
  damageBoss: (damage: number) => void;
  resetBoss: () => void;
}

const BossContext = createContext<BossContextType | undefined>(undefined);

export const useBoss = () => {
  const context = useContext(BossContext);
  if (!context) {
    throw new Error("useBoss must be used within a BossProvider");
  }
  return context;
};

interface BossProviderProps {
  children: ReactNode;
}

export const BossProvider = ({ children }: BossProviderProps) => {
  const [currentBoss, setCurrentBossState] = useState<Boss | null>(null);

  const setCurrentBoss = (boss: Boss | null) => {
    setCurrentBossState(boss);
  };

  const damageBoss = (damage: number) => {
    if (currentBoss) {
      setCurrentBossState({
        ...currentBoss,
        currentHP: Math.max(0, currentBoss.currentHP - damage),
      });
    }
  };

  const resetBoss = () => {
    if (currentBoss) {
      setCurrentBossState({
        ...currentBoss,
        currentHP: currentBoss.maxHP,
      });
    }
  };

  return (
    <BossContext.Provider
      value={{
        currentBoss,
        setCurrentBoss,
        damageBoss,
        resetBoss,
      }}
    >
      {children}
    </BossContext.Provider>
  );
};

