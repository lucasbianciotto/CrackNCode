import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[1.25rem_0.75rem_1.5rem_0.75rem] border-2 border-accent/60 border-dashed bg-gradient-to-br from-card/80 to-accent/5 px-4 py-2 text-base font-bold tracking-wide shadow-inner ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-accent/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pirate-font",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
