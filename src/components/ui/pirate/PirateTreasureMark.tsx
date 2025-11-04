import * as React from "react";

export function PirateTreasureMark({ className = "", size = 28, color = "#d7263d" }: { className?: string; size?: number; color?: string }) {
  // Couleurs de la charte
  const rougeFonce = "#7d3437";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke={rougeFonce} strokeWidth="3" strokeLinecap="round">
        <path d="M4 4l20 20" />
        <path d="M24 4l-20 20" />
      </g>
    </svg>
  );
}
