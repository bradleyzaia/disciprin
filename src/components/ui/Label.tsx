import React from "react"
import { useScrambleText } from "@/hooks/use-scramble-text"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useStagger } from "@/components/ui/stagger-context"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, children, ...props }, ref) => {
        const textContent = typeof children === "string" ? children : ""
        const { delay } = useStagger()
        const scrambledText = useScrambleText(textContent, 0.2, "!@#$%^&*-+", delay)

        return (
            <label
                ref={ref}
                className={cn(
                    "text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-mono uppercase mb-3 block text-neutral-500",
                    className
                )}
                {...props}
            >
                {typeof children === "string" ? scrambledText : children}
            </label>
        )
    }
)
Label.displayName = "Label"
