import React, { useState } from "react"
import { motion } from "framer-motion"
import { ScrambleText } from "./ScrambleText"
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
    icon?: LucideIcon
    alwaysShowIcon?: boolean
    showScramble?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, className, variant = "primary", size = "md", icon: Icon, alwaysShowIcon = false, showScramble = true, ...props }, ref) => {
        const [isHovered, setIsHovered] = useState(false)

        const variants = {
            primary: "bg-transparent text-dark-theme-text border-dark-theme-border hover:border-grayscale100 overflow-hidden",
            secondary: "bg-grayscale25 text-dark-theme-text border-transparent hover:border-grayscale100 overflow-hidden",
            outline: "bg-transparent text-dark-theme-text border-dark-theme-border hover:border-grayscale100 overflow-hidden",
            ghost: "bg-transparent text-dark-theme-text border-transparent hover:bg-white/5 overflow-hidden",
        }

        const sizes = {
            sm: "px-4 py-2 text-xs",
            md: "px-6 py-3 text-xs",
            lg: "px-8 py-4 text-sm",
        }

        // Apply swipe-fill and inverted text to primary, secondary, and outline
        const hasSwipeFill = variant === "primary" || variant === "secondary" || variant === "outline"

        return (
            <button
                ref={ref}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "group relative inline-flex items-center justify-center font-mono uppercase transition-all duration-300 focus:outline-none disabled:opacity-20 disabled:pointer-events-none rounded-none cursor-pointer border",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {/* Swipe Fill Layer */}
                {hasSwipeFill && (
                    <motion.div
                        className="absolute inset-0 bg-grayscale100"
                        initial={{ x: "-100%" }}
                        animate={isHovered ? { x: 0 } : { x: "-100%" }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        style={{ zIndex: 0 }}
                    />
                )}

                {/* Content */}
                <div className={cn(
                    "relative z-10 flex items-center justify-center gap-2 transition-colors duration-300",
                    isHovered && hasSwipeFill ? "text-grayscale0" : "text-current"
                )}>
                    <span className="flex items-center gap-2">
                        {showScramble && typeof children === "string" ? (
                            <ScrambleText text={children} duration={0.4} trigger={isHovered} />
                        ) : (
                            children
                        )}
                    </span>

                    {Icon && (
                        <motion.span
                            initial={alwaysShowIcon ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0, x: -10 }}
                            animate={isHovered || alwaysShowIcon ? { opacity: 1, width: "auto", x: 0 } : { opacity: 0, width: 0, x: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex items-center overflow-hidden"
                        >
                            <Icon className="size-4 shrink-0" />
                        </motion.span>
                    )}
                </div>
            </button>
        )
    }
)
Button.displayName = "Button"

