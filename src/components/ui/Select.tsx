import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SelectOption {
    label: string
    value: string
}

export interface SelectProps {
    value: string
    onChange: (value: string) => void
    size?: "sm" | "default" | "lg"
    options: SelectOption[] | string[]
    className?: string
    placeholder?: string
    id?: string
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    ({ className, value, onChange, options, size = "default", placeholder, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState(false)
        const containerRef = useRef<HTMLDivElement>(null)

        const normalizedOptions: SelectOption[] = options.map(opt =>
            typeof opt === 'string' ? { label: opt, value: opt } : opt
        )

        const selectedOption = normalizedOptions.find(opt => opt.value === value)

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen(false)
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        const handleSelect = (optionValue: string) => {
            onChange(optionValue)
            setIsOpen(false)
        }

        const textSizeClass = {
            sm: "text-[10px]",
            default: "text-xs",
            lg: "text-lg"
        }[size]

        return (
            <div
                className={cn("relative w-full h-12", className)}
                ref={containerRef}
            >
                <div
                    ref={ref}
                    className={cn(
                        "flex h-full w-full items-center justify-between border border-dark-theme-border bg-transparent px-4 py-2 text-dark-theme-text cursor-pointer font-mono uppercase focus:outline-none transition-colors hover:bg-white hover:text-light-theme-text",
                        textSizeClass,
                        isOpen && "border-white bg-white/5 text-white",
                    )}
                    onClick={() => setIsOpen(!isOpen)}
                    {...props}
                >
                    <span className={cn(!selectedOption && "text-dark-theme-text/50")}>
                        {selectedOption ? selectedOption.label : (placeholder || "Select...")}
                    </span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className={cn(
                                "absolute top-full left-0 z-50 mt-1 w-full border border-white bg-grayscale100 text-grayscale0 max-h-60 overflow-y-auto font-mono uppercase shadow-xl",
                                textSizeClass
                            )}
                        >
                            {normalizedOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-grayscale0 hover:text-grayscale100 transition-colors border-b border-grayscale25 last:border-0",
                                        option.value === value && "bg-grayscale100 text-grayscale0"
                                    )}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <span>{option.label}</span>
                                    {option.value === value && <Check className="h-3 w-3" />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }
)
Select.displayName = "Select"
