import * as React from "react";

export function PirateAnchor({ className = "", size = 32, color = "#d4af37" }: { className?: string; size?: number; color?: string }) {
  // Couleurs de la charte
  const violet = "#784c51";
  const grisbleu = "#3b4245";
  const noir = "#35302d";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="8" r="3" stroke={violet} strokeWidth="2" fill="none" />
      <path d="M16 11v10m0 0c-3 0-5-2-5-5m5 5c3 0 5-2 5-5" stroke={grisbleu} strokeWidth="2" strokeLinecap="round" />
      <path d="M11 26c2-2 8-2 10 0" stroke={noir} strokeWidth="2" strokeLinecap="round" />
      <path d="M8 21c2 2 4 5 8 5s6-3 8-5" stroke={violet} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="21" r="1.2" fill={grisbleu} />
    </svg>
  );
}
