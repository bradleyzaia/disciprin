import React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {
        const variants = {
            primary: "bg-foreground text-background hover:bg-neutral-800 border border-transparent",
            secondary: "bg-neutral-200 text-black hover:bg-neutral-300 border border-transparent",
            outline: "bg-transparent text-foreground border border-neutral-800 hover:bg-neutral-900",
            ghost: "bg-transparent text-foreground hover:bg-neutral-900 border border-transparent",
        }

        const sizes = {
            sm: "px-4 py-2 text-xs",
            md: "px-6 py-3 text-xs",
            lg: "px-8 py-4 text-xs",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center font-mono uppercase tracking-wide transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-none cursor-pointer",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
