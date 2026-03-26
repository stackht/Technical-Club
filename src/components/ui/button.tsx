"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-sm border bg-black/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] shadow-[inset_0_0_0_1px_rgba(0,255,0,0.2)] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neonGreen/70",
          variant === "default" &&
            "border-neonGreen/80 text-neonGreen shadow-[0_0_18px_rgba(0,255,0,0.35)] hover:bg-black/90 hover:shadow-[0_0_35px_rgba(0,255,0,0.55)]",
          variant === "ghost" &&
            "border-neonBlue/60 text-neonBlue/80 hover:border-neonGreen/80 hover:text-neonGreen",
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = "Button"

export { Button }
