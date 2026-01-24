import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { X, Check } from "lucide-react"
import type { Pill } from "./CalendarGrid"
import { cn } from "@/lib/utils"

interface DayEntryModalProps {
    pill: Pill
    date: Date
    initialValue?: number
    isCompleted?: boolean
    onClose: () => void
    onSave: (value: number, isCompleted: boolean) => void
    originRect?: DOMRect | null
    layoutId?: string // Deprecated but kept for compat if needed, unused
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

export function DayEntryModal({
    pill,
    date,
    initialValue = 0,
    isCompleted = false,
    onClose,
    onSave,
    originRect
}: DayEntryModalProps) {
    const [value, setValue] = useState(initialValue)
    const [completed, setCompleted] = useState(isCompleted)
    const inputRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    // Measure the final modal size immediately?
    // We need to render it to measure it. 
    // Strategy: Render modal, measure it, then triggering the "Zoom" if we have valid dimensions.
    // However, for the "Classic" feel, the zoom happens *before* content appears.
    // Let's approximate the target. Center of screen, max-w-sm.
    useEffect(() => {
        if (contentRef.current) {
            const rect = contentRef.current.getBoundingClientRect()
            setTargetRect(rect)
        }
    }, [])


    // Handle submit
    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault()
        onSave(value, completed)
        onClose()
    }

    // Determine input type based on pill measurement
    const renderInput = () => {
        if (pill.measurement_type === 'boolean') {
            return (
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setCompleted(true)}
                        className={cn(
                            "px-4 py-2 border border-dark-theme-border font-mono text-xs uppercase hover:bg-white/10 transition-colors",
                            completed && "bg-black text-dark-theme-text hover:bg-black"
                        )}
                    >
                        Pass
                    </button>
                    <button
                        type="button"
                        onClick={() => setCompleted(false)}
                        className={cn(
                            "px-4 py-2 border border-dark-theme-border font-mono text-xs uppercase hover:bg-white/10 transition-colors",
                            !completed && "bg-white/10"
                        )}
                    >
                        Fail
                    </button>
                </div>
            )
        }

        return (
            <div className="flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="number"
                    value={value || ''}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-24 border-b border-l border-r border-t border-dark-theme-border bg-transparent p-2 font-mono text-2xl outline-none"
                    placeholder="0"
                />
                <span className="text-xs text-dark-theme-text">{pill.unit}</span>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-transparent"
            />

            {/* The Zoom Animation Layer */}
            {originRect && targetRect && (
                <>
                    <EntranceZoomRects origin={originRect} target={targetRect} />
                    <ExitZoomRects origin={originRect} target={targetRect} />
                </>
            )}

            {/* Modal Content */}
            {/* We delay showing the content slightly to let zoom happen? Or show concurrently? */}
            {/* Classic Mac OS: Zoom happens, then content fills. */}
            <motion.div
                ref={contentRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0, transition: { delay: 0.1, duration: 0.2, ease: "easeOut" } }}
                exit={{
                    opacity: 0,
                    transition: { duration: 0.05 } // Fast fade out to let rects take over
                }}
                className="relative z-10 w-full max-w-sm border border-dark-theme-border bg-black shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-dark-theme-border p-4 bg-black text-dark-theme-text">
                    <div className="flex flex-col">
                        <span className="font-mono text-[10px] opacity-70 uppercase tracking-widest">{format(date, 'EEEE, MMM d')}</span>
                        <span className="font-mono text-lg">{pill.name}</span>
                    </div>
                    <button onClick={onClose} className="hover:opacity-70">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 flex flex-col items-center gap-6">
                    {renderInput()}
                </form>

                {/* Footer */}
                <div className="grid grid-cols-2 border-t border-dark-theme-border">
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-4 border-r border-dark-theme-border hover:bg-white/10 font-mono text-xs uppercase"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        className="p-4 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
