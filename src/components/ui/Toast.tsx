import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/lib/toast-context";

export function Toast() {
    const { toast, hideToast } = useToast();

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    onClick={hideToast}
                    className="absolute top-0 left-0 w-full bg-grayscale100 text-light-theme-text border-b border-dark-theme-border p-8 z-50 origin-top flex flex-col justify-center min-h-[theme(spacing.24)] cursor-pointer" // Assuming row height matches Navbar padding/content layout roughly
                >
                    <div className="max-w-[1440px] mx-auto w-full">
                        <h2 className="font-mono text-lg mb-1">{toast.title}</h2>
                        <div className="font-mono text-xs">{toast.message}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
