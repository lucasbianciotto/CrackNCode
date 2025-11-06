import { createContext, useContext, useState, useCallback, ReactNode } from "react";
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

  const setCurrentBoss = useCallback((boss: Boss | null) => {
    setCurrentBossState(boss);
  }, []);

  const damageBoss = useCallback((damage: number) => {
    setCurrentBossState((prevBoss) => {
      if (!prevBoss) {
        console.warn("damageBoss called but currentBoss is null");
        return prevBoss;
      }
      const newHP = Math.max(0, prevBoss.currentHP - damage);
      console.log(`damageBoss: ${prevBoss.currentHP} - ${damage} = ${newHP}`);
      return {
        ...prevBoss,
        currentHP: newHP,
      };
    });
  }, []);

  const resetBoss = useCallback(() => {
    setCurrentBossState((prevBoss) => {
      if (!prevBoss) return prevBoss;
      return {
        ...prevBoss,
        currentHP: prevBoss.maxHP,
      };
    });
  }, []);

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

