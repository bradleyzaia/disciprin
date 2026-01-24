import React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { motion, type HTMLMotionProps } from "framer-motion"
import { HelpCircle } from "lucide-react"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps extends HTMLMotionProps<"input"> {
    hideSteppers?: boolean
    onHelpClick?: () => void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, hideSteppers, onHelpClick, onFocus, ...props }, ref) => {
        const innerRef = React.useRef<HTMLInputElement | null>(null)

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select()
            onFocus?.(e)
        }

        const handleIncrement = () => {
            const input = innerRef.current
            if (input) {
                input.stepUp()
                input.dispatchEvent(new Event("input", { bubbles: true }))
                input.dispatchEvent(new Event("change", { bubbles: true }))
            }
        }

        const handleDecrement = () => {
            const input = innerRef.current
            if (input) {
                input.stepDown()
                input.dispatchEvent(new Event("input", { bubbles: true }))
                input.dispatchEvent(new Event("change", { bubbles: true }))
            }
        }

        if (type === "number" && !hideSteppers) {
            return (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={cn("relative flex h-12 w-full", className)}
                >
                    <button
                        type="button"
                        onClick={handleDecrement}
                        className="absolute left-0 top-0 h-full w-10 flex items-center justify-center border-r border-dark-theme-border text-dark-theme-text bg-grayscale0 transition-colors hover:bg-grayscale100 hover:text-grayscale0 hover:border-grayscale100 disabled:opacity-50 z-10"
                        tabIndex={-1}
                    >
                        -
                    </button>
                    <motion.input
                        type={type}
                        onFocus={handleFocus}
                        className={cn(
                            "flex h-full w-full rounded-none border border-dark-theme-border bg-transparent px-10 py-2 text-center text-xs text-dark-theme-text placeholder:text-neutral-500 hover:bg-grayscale100 hover:border-grayscale100 hover:text-grayscale0 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase appearance-none transition-colors",
                            // Remove spin buttons
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        )}
                        style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                        ref={(node) => {
                            innerRef.current = node
                            if (typeof ref === "function") {
                                ref(node)
                            } else if (ref) {
                                (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
                            }
                        }}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={handleIncrement}
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center border-l border-dark-theme-border text-dark-theme-text bg-grayscale0 transition-colors hover:bg-grayscale100 hover:text-grayscale0 hover:border-grayscale100 disabled:opacity-50 z-10"
                        tabIndex={-1}
                    >
                        +
                    </button>
                </motion.div>
            )
        }

        if (onHelpClick) {
            return (
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={cn("relative flex h-12 w-full", className)}
                >
                    <motion.input
                        type={type}
                        onFocus={handleFocus}
                        className={cn(
                            "flex h-full w-full rounded-none border border-dark-theme-border bg-transparent px-4 py-2 pr-12 text-xs text-dark-theme-text placeholder:text-neutral-500 hover:bg-grayscale100 hover:border-grayscale100 hover:text-grayscale0 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase transition-colors"
                        )}
                        ref={ref}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={onHelpClick}
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center border-l border-dark-theme-border text-dark-theme-text transition-colors hover:bg-grayscale100 hover:text-grayscale0 hover:border-grayscale100 disabled:opacity-50 z-10"
                        tabIndex={-1}
                    >
                        <HelpCircle className="h-4 w-4" />
                    </button>
                </motion.div>
            )
        }

        return (
            <motion.input
                type={type}
                onFocus={handleFocus}
                className={cn(
                    "flex h-12 w-full rounded-none border border-dark-theme-border bg-transparent px-4 py-2 text-xs text-dark-theme-text placeholder:text-neutral-500 hover:bg-grayscale100 hover:border-grayscale100 hover:text-grayscale0 focus:outline-none focus:ring-1 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase transition-colors",
                    className
                )}
                ref={ref}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"
