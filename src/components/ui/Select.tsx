import React, { useState, useEffect, useRef } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Check, ChevronDown } from "lucide-react"
import { ScrambleText } from "@/components/ui/ScrambleText"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface SelectOption {
    label: string
    value: string
}

export interface SelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[] | string[]
    className?: string
    placeholder?: string
    id?: string
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
    ({ className, value, onChange, options, placeholder, ...props }, ref) => {
        const [isOpen, setIsOpen] = useState<'pass' | 'fail'>('fail')
        const containerRef = useRef<HTMLDivElement>(null)

        const normalizedOptions: SelectOption[] = options.map(opt =>
            typeof opt === 'string' ? { label: opt, value: opt } : opt
        )

        const selectedOption = normalizedOptions.find(opt => opt.value === value)

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                    setIsOpen('fail')
                }
            }

            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [])

        const handleSelect = (optionValue: string) => {
            onChange(optionValue)
            setIsOpen('fail')
        }

        return (
            <div className="relative" ref={containerRef}>
                <div
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full items-center justify-between border border-neutral-800 bg-transparent px-4 py-2 text-xs text-foreground cursor-pointer font-mono uppercase focus:outline-none focus:ring-1 focus:ring-neutral-500",
                        isOpen === 'pass' && "bg-black text-white border-black",
                        className
                    )}
                    onClick={() => setIsOpen(isOpen === 'pass' ? 'fail' : 'pass')}
                    {...props}
                >
                    <span className={cn(!selectedOption && "text-muted-foreground", "inline-flex")}>
                        <ScrambleText
                            key={selectedOption ? selectedOption.value : "placeholder"}
                            text={selectedOption ? selectedOption.label : (value || placeholder || "Select...")}
                        />
                    </span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen === 'pass' && "rotate-180")} />
                </div>

                {isOpen === 'pass' && (
                    <div className="absolute top-full left-0 w-full z-50 border border-t-0 border-black bg-black text-white max-h-60 overflow-y-auto font-mono uppercase text-xs [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-white">
                        {normalizedOptions.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-800 transition-colors",
                                    option.value === value && "bg-neutral-900"
                                )}
                                onClick={() => handleSelect(option.value)}
                            >
                                <span>{option.label}</span>
                                {option.value === value && <Check className="h-3 w-3" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)
Select.displayName = "Select"
