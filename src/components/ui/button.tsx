import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-accent/20 bg-card/80 text-base font-medium tracking-wide ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-card/80 text-accent border-accent/20 hover:bg-accent/10 hover:text-accent",
        destructive: "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 hover:text-destructive",
        outline: "bg-transparent text-accent border-accent/30 hover:bg-accent/5",
        secondary: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
        ghost: "bg-transparent text-accent border-none hover:bg-accent/10",
        link: "text-accent underline underline-offset-4 hover:text-accent/80",
        pirate: "bg-accent/10 text-accent border-accent/40 hover:bg-accent/20 hover:text-accent/80 font-semibold tracking-wider",
      },
      size: {
        default: "h-10 px-4 py-2 text-base",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
