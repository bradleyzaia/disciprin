import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { grid } from "@/styles/tokens"

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    className?: string
    side?: "bottom" | "right"
}

export function Drawer({ isOpen, onClose, children, className, side = "bottom" }: DrawerProps) {
    const isRight = side === "right"

    const motionProps = isRight
        ? {
            initial: { x: "100%" },
            animate: { x: 0 },
            exit: { x: "100%" },
        }
        : {
            initial: { y: "100%" },
            animate: { y: 0 },
            exit: { y: "100%" },
        }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: grid.patternOpacity }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 cursor-pointer backdrop-blur-[2px]"
                        style={{
                            backgroundImage: grid.pattern,
                            backgroundSize: grid.patternSize
                        }}
                    />

                    {/* Drawer Content */}
                    <motion.div
                        {...motionProps}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        className={cn(
                            "fixed z-50 flex flex-col shadow-2xl bg-black",
                            isRight
                                ? "top-0 right-0 h-full w-[420px] max-w-[90vw] border-l border-dark-theme-border"
                                : "bottom-0 left-0 right-0 h-auto min-h-[25vh] max-h-[90vh] border-t border-dark-theme-border",
                            className
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
