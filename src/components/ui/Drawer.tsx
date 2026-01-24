import { motion, AnimatePresence } from "framer-motion"
import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    className?: string
}

export function Drawer({ isOpen, onClose, children, className }: DrawerProps) {
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:2px_2px] opacity-25 cursor-pointer backdrop-blur-[2px]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8
                        }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 h-auto min-h-[25vh] max-h-[90vh] bg-black border-t border-dark-theme-border z-50 flex flex-col shadow-2xl",
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
