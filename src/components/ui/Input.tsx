import React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { motion, type HTMLMotionProps } from "framer-motion"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps extends HTMLMotionProps<"input"> {
    hideSteppers?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, hideSteppers, ...props }, ref) => {
        const innerRef = React.useRef<HTMLInputElement | null>(null)

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
                        className="absolute left-0 top-0 h-full w-10 flex items-center justify-center border-r border-neutral-800 text-foreground transition-colors hover:bg-black hover:text-white disabled:opacity-50 z-10"
                        tabIndex={-1}
                    >
                        -
                    </button>
                    <motion.input
                        type={type}
                        className={cn(
                            "flex h-full w-full rounded-none border border-neutral-800 bg-transparent px-10 py-2 text-center text-xs text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase appearance-none",
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
                        className="absolute right-0 top-0 h-full w-10 flex items-center justify-center border-l border-neutral-800 text-foreground transition-colors hover:bg-black hover:text-white disabled:opacity-50 z-10"
                        tabIndex={-1}
                    >
                        +
                    </button>
                </motion.div>
            )
        }

        return (
            <motion.input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-none border border-neutral-800 bg-transparent px-4 py-2 text-xs text-foreground placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 font-mono uppercase",
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
