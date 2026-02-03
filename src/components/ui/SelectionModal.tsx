import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectionModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (value: string) => void
    options: string[] | { label: string, category: string }[]
    initialValue?: string
    title?: string
    originRect?: DOMRect | null
}

// Helper for "Classic Zoom" Rects (Entrance)
function EntranceZoomRects({ origin, target }: { origin: DOMRect, target: DOMRect }) {
    return (
        <>
            {[0, 1, 2, 3].map(i => {
                return (
                    <motion.div
                        key={`entrance-${i}`}
                        initial={{
                            top: origin.top,
                            left: origin.left,
                            width: origin.width,
                            height: origin.height,
                            opacity: 0.5,
                            borderWidth: "1px"
                        }}
                        animate={{
                            top: target.top,
                            left: target.left,
                            width: target.width,
                            height: target.height,
                            opacity: 0,
                            borderWidth: "1px"
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "linear",
                            delay: i * 0.03
                        }}
                        className="fixed z-50 border border-dark-theme-border pointer-events-none"
                    />
                )
            })}
        </>
    )
}

// Helper for "Classic Zoom" Rects (Exit)
function ExitZoomRects({ origin, target }: { origin: DOMRect, target: DOMRect }) {
    return (
        <>
            {[0, 1, 2, 3].map(i => {
                return (
                    <motion.div
                        key={`exit-${i}`}
                        initial={{
                            top: target.top,
                            left: target.left,
                            width: target.width,
                            height: target.height,
                            opacity: 0,
                            borderWidth: "1px"
                        }}
                        animate={{
                            opacity: 0
                        }}
                        exit={{
                            top: origin.top,
                            left: origin.left,
                            width: origin.width,
                            height: origin.height,
                            opacity: [0.5, 0], // Flash visible then fade
                            borderWidth: "1px"
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "linear",
                            delay: i * 0.03
                        }}
                        className="fixed z-50 border border-dark-theme-border pointer-events-none"
                    />
                )
            })}
        </>
    )
}

export function SelectionModal({
    isOpen,
    onClose,
    onConfirm,
    options,
    initialValue = "",
    title = "SELECT OPTION",
    originRect
}: SelectionModalProps) {
    const [selectedValue, setSelectedValue] = useState(initialValue)
    const contentRef = useRef<HTMLDivElement>(null)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [customValue, setCustomValue] = useState("")

    // Normalize options to categorized format
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { label: opt, category: 'GENERAL' } : opt
    )

    const categories = Array.from(new Set(normalizedOptions.map(o => o.category))).sort()
    if (!categories.includes("CUSTOM")) {
        categories.push("CUSTOM")
    }

    // Set initial active category based on selected value or first category
    useEffect(() => {
        if (isOpen) {
            setSelectedValue(initialValue)
            if (initialValue) {
                const found = normalizedOptions.find(o => o.label === initialValue)
                if (found) {
                    setActiveCategory(found.category)
                    return
                }
            }
            if (categories.length > 0 && !activeCategory) {
                setActiveCategory(categories[0])
            }
        }
    }, [isOpen, initialValue])

    // Measure the final modal size
    useEffect(() => {
        if (contentRef.current && isOpen) {
            const rect = contentRef.current.getBoundingClientRect()
            setTargetRect(rect)
        }
    }, [isOpen])

    const handleConfirm = () => {
        if (activeCategory === "CUSTOM") {
            if (customValue.trim()) {
                onConfirm(customValue.trim().toUpperCase())
            }
        } else {
            onConfirm(selectedValue)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:2px_2px] opacity-25 cursor-pointer"
                    />

                    {/* The Zoom Animation Layer */}
                    {originRect && targetRect && (
                        <>
                            <EntranceZoomRects origin={originRect} target={targetRect} />
                            <ExitZoomRects origin={originRect} target={targetRect} />
                        </>
                    )}

                    {/* Modal Content */}
                    <motion.div
                        ref={contentRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0, transition: { delay: 0.1, duration: 0.2, ease: "easeOut" } }}
                        exit={{
                            opacity: 0,
                            transition: { duration: 0.05 }
                        }}
                        className="relative z-10 w-full max-w-2xl border border-dark-theme-border bg-black shadow-xl max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-dark-theme-border p-4 bg-black text-dark-theme-text shrink-0">
                            <span className="font-mono text-lg uppercase">{title}</span>
                            <button onClick={onClose} className="hover:opacity-70">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Categories Row */}
                        <div className="flex border-b border-dark-theme-border bg-white/5 overflow-x-auto scrollbar-hide shrink-0">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "px-4 py-3 border text-xs font-mono uppercase transition-colors whitespace-nowrap rounded-none -ml-px first:ml-0 relative",
                                        activeCategory === category
                                            ? "z-10 bg-white text-black border-white"
                                            : "bg-black text-dark-theme-text border-dark-theme-border hover:border-white hover:text-dark-theme-text hover:z-10"
                                    )}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Options Vertical Grid - Filtering based on category */}
                        <div className="flex-1 overflow-y-auto bg-black min-h-[160px]">
                            {activeCategory === "CUSTOM" ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
                                    <div className="w-full max-w-xs space-y-2">
                                        <label className="text-xs font-mono uppercase text-dark-theme-text">Custom Pill Name</label>
                                        <input
                                            type="text"
                                            value={customValue}
                                            onChange={(e) => setCustomValue(e.target.value)}
                                            placeholder="ENTER NAME..."
                                            className="w-full p-3 border border-dark-theme-border font-mono text-base md:text-sm uppercase placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white bg-transparent text-dark-theme-text"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleConfirm()
                                            }}
                                        />
                                        <p className="text-[10px] text-dark-theme-text font-mono">
                                            New pills will track DAILY BOOLEAN (Pass/Fail) by default.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3">
                                        {normalizedOptions
                                            .filter(opt => opt.category === activeCategory)
                                            .map((option) => (
                                                <button
                                                    key={option.label}
                                                    onClick={() => setSelectedValue(option.label)}
                                                    className={cn(
                                                        "w-full aspect-square flex flex-col items-center justify-center p-4 border transition-all text-center gap-2 -ml-px -mt-px hover:z-10 relative",
                                                        selectedValue === option.label
                                                            ? "bg-white text-black border-white shadow-lg z-10"
                                                            : "bg-black text-dark-theme-text border-dark-theme-border hover:border-white"
                                                    )}
                                                >
                                                    {selectedValue === option.label && <Check className="w-4 h-4 mb-1" />}
                                                    <span className="font-mono text-xs uppercase leading-tight">{option.label}</span>
                                                </button>
                                            ))}
                                    </div>
                                    {normalizedOptions.filter(opt => opt.category === activeCategory).length === 0 && (
                                        <div className="w-full text-center text-dark-theme-text font-mono text-xs mt-8">NO OPTIONS AVAILABLE</div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="grid grid-cols-2 border-t border-dark-theme-border shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-4 border-r border-dark-theme-border hover:bg-white/10 font-mono text-xs uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="p-4 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
