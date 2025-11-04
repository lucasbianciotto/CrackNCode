import * as React from "react";

export function PirateDivider({ className = "", color = "#d4af37" }: { className?: string; color?: string }) {
  // Couleurs de la charte
  const violet = "#784c51";
  const grisbleu = "#3b4245";
  return (
    <svg
      className={className}
      width="100%"
      height="16"
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ minWidth: 80 }}
    >
      <path
        d="M0 8 Q20 0 40 8 T80 8 T120 8 T160 8 T200 8"
        stroke={violet}
        strokeWidth="3"
        strokeDasharray="6 6"
        fill="none"
      />
      <circle cx="0" cy="8" r="3" fill={grisbleu} />
      <circle cx="200" cy="8" r="3" fill={grisbleu} />
    </svg>
  );
}
