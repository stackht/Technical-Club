"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-12 w-full rounded-sm border border-neonGreen/50 bg-black/80 px-4 text-sm text-neonGreen placeholder:text-neonGreen/40 shadow-[inset_0_0_0_1px_rgba(0,255,0,0.15)] focus:border-neonBlue/80 focus:outline-none focus:ring-2 focus:ring-neonGreen/40",
        className,
      )}
      {...props}
    />
  ),
)

Input.displayName = "Input"

export { Input }
