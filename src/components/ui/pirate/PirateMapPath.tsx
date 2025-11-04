import * as React from "react";

export function PirateMapPath({ className = "", color = "#d4af37" }: { className?: string; color?: string }) {
  // Couleurs de la charte
  const violet = "#784c51";
  const grisbleu = "#3b4245";
  return (
    <svg
      className={className}
      width="100%"
      height="24"
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ minWidth: 80 }}
    >
      <path
        d="M0 12 Q20 0 40 12 T80 12 T120 12 T160 12 T200 12"
        stroke={violet}
        strokeWidth="2"
        strokeDasharray="4 8"
        fill="none"
      />
      <circle cx="0" cy="12" r="2" fill={grisbleu} />
      <circle cx="200" cy="12" r="2" fill={grisbleu} />
    </svg>
  );
}
