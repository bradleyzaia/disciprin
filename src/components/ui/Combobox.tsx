import React, { useState, useRef } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import { SelectionModal } from "@/components/ui/SelectionModal"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ComboboxProps {
    value: string
    onChange: (value: string) => void
    options: string[] | { label: string, category: string }[]
    className?: string
    placeholder?: string
    id?: string
    modalTitle?: string
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
    ({ className, value, onChange, options, placeholder, id, modalTitle, ...props }, ref) => {
        const [isModalOpen, setIsModalOpen] = useState(false)
        const [originRect, setOriginRect] = useState<DOMRect | null>(null)
        const triggerRef = useRef<HTMLButtonElement>(null)

        const handleOpen = () => {
            if (triggerRef.current) {
                setOriginRect(triggerRef.current.getBoundingClientRect())
            }
            setIsModalOpen(true)
        }

        const handleConfirm = (selectedValue: string) => {
            onChange(selectedValue)
            setIsModalOpen(false)
        }

        return (
            <>
                {/* Hidden input to maintain form compatibility/refs if needed, though we primarily use the button for interaction */}
                <input
                    type="hidden"
                    value={value}
                    name={id}
                    id={id}
                    ref={ref}
                    readOnly
                />

                <motion.button
                    ref={triggerRef}
                    type="button"
                    onClick={handleOpen}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={cn(
                        "flex h-12 w-full items-center justify-between rounded-none border border-dark-theme-border bg-transparent px-4 py-2 text-xs text-dark-theme-text font-mono uppercase focus:outline-none focus:ring-1 focus:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white/5 transition-colors",
                        !value && "text-neutral-500",
                        className
                    )}
                    {...props as any}
                >
                    <span className={cn("truncate", !value && "text-neutral-500")}>
                        {value || placeholder || "SELECT..."}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50 ml-2" />
                </motion.button>

                <SelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirm}
                    options={options}
                    initialValue={value}
                    title={modalTitle || placeholder || "SELECT OPTION"}
                    originRect={originRect}
                />
            </>
        )
    }
)
Combobox.displayName = "Combobox"

