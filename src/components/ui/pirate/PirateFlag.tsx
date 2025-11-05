import * as React from "react";

export function PirateFlag({ className = "", size = 32, style }: { className?: string; size?: number; style?: React.CSSProperties }) {
  // Couleurs de la charte
  const noir = "#35302d";
  const violet = "#784c51";
  const grisbleu = "#3b4245";
  const rougeFonce = "#7d3437";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <rect x="2" y="6" width="4" height="20" rx="2" fill={grisbleu} />
      <path d="M6 8 Q14 4 26 10 Q18 14 30 18 Q18 22 6 18" fill={violet} stroke={rougeFonce} strokeWidth="2" />
      <circle cx="18" cy="13" r="2" fill={noir} />
      <circle cx="22" cy="15" r="2" fill={noir} />
      <rect x="17" y="12" width="2" height="2" fill={rougeFonce} />
      <rect x="21" y="14" width="2" height="2" fill={rougeFonce} />
      <rect x="19" y="16" width="2" height="2" fill={violet} />
    </svg>
  );
}
