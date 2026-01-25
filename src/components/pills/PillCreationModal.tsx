import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { PillEditorCard } from "@/components/pills/PillEditorCard"
import { type PillDraft } from "@/lib/habit-config"

interface PillCreationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (pill: PillDraft) => void
    originRect?: DOMRect | null
    title?: string
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


export function PillCreationModal({
    isOpen,
    onClose,
    onConfirm,
    originRect,
    title = "NEW PILL"
}: PillCreationModalProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    // Initial State for a new pill
    const [pill, setPill] = useState<PillDraft>({
        name: "",
        measurement_type: "boolean",
        target_value: 1,
        frequency_per_week: 3,
        unit: ""
    })

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setPill({
                name: "",
                measurement_type: "boolean",
                target_value: 1,
                frequency_per_week: 3,
                unit: ""
            })
        }
    }, [isOpen])

    // Measure the final modal size
    useEffect(() => {
        if (contentRef.current && isOpen) {
            const rect = contentRef.current.getBoundingClientRect()
            setTargetRect(rect)
        }
    }, [isOpen])

    const handleUpdatePill = (fieldOrUpdates: keyof PillDraft | Partial<PillDraft>, value?: any) => {
        const updates = typeof fieldOrUpdates === 'string'
            ? { [fieldOrUpdates]: value }
            : fieldOrUpdates

        setPill(prev => ({
            ...prev,
            ...updates
        }))
    }

    const handleConfirm = () => {
        if (!pill.name) return // Basic validation
        onConfirm(pill)
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
                        className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:2px_2px] opacity-25"
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
                        className="relative z-10 w-full max-w-[1024px] border border-dark-theme-border bg-black shadow-xl flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-dark-theme-border p-4 bg-black text-dark-theme-text shrink-0">
                            <span className="font-mono text-lg uppercase">{title}</span>
                            <button onClick={onClose} className="hover:opacity-70">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body - using simplified PillEditorCard without borders since it's inside modal */}
                        <div>
                            <PillEditorCard
                                pill={pill}
                                index={0} // We can assume index 0 for creating single
                                onUpdate={handleUpdatePill}
                                className="border-0 min-w-0 md:min-w-[50rem]" // 800px to accommodate the grid on desktop
                            />
                        </div>

                        {/* Footer */}
                        <div className="grid grid-cols-2 border-t border-dark-theme-border shrink-0">
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-4 border-r border-dark-theme-border hover:bg-grayscale100 hover:text-grayscale0 transition-colors font-mono text-xs uppercase"
                            >
                                CANCEL
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="p-4 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Create Pill
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
