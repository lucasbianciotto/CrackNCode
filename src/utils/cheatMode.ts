// Utilitaires pour le mode cheat (présentation/démonstration)

const CHEAT_MODE_KEY = "crackncode_cheat_mode";

export function isCheatModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CHEAT_MODE_KEY) === "true";
}

export function enableCheatMode(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHEAT_MODE_KEY, "true");
}

export function disableCheatMode(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHEAT_MODE_KEY);
}

export function toggleCheatMode(): boolean {
  if (isCheatModeEnabled()) {
    disableCheatMode();
    return false;
  } else {
    enableCheatMode();
    return true;
  }
}

