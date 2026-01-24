import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type DayCellState = 'completed' | 'partially-completed' | 'past-incomplete' | 'future'

interface CalendarDayCellProps {
    state: DayCellState
    value?: number
    target?: number
    onChange?: (value: number) => void
    className?: string
}

export function CalendarDayCell({ state, value, target, onChange, className }: CalendarDayCellProps) {
    const isFuture = state === 'future'

    // Determine base styles based on state
    const getBaseStyles = () => {
        switch (state) {
            case 'completed':
                return "bg-black text-white"
            case 'partially-completed':
                return "bg-transparent text-black"
            case 'past-incomplete':
                // For past incomplete, we keep it subtle but allow input
                return "bg-red-50/50 text-red-500 font-medium"
            case 'future':
                return "bg-white text-muted-foreground cursor-default"
            default:
                return "bg-transparent text-black"
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value)
            if (!isNaN(newValue)) {
                onChange(newValue)
            }
        }
    }

    // For display, if value is 0 or undefined, showing empty string might be cleaner, 
    // but for '0' value pills it's important. 
    // Let's show the value if it exists, otherwise empty string for clean look?
    // Actually, usually inputs show '0'.
    const displayValue = value === undefined ? '' : value

    return (
        <motion.div
            title={target ? `Goal: ${target}` : undefined}
            className={cn(
                "h-full w-full border-r border-black/50 last:border-r-0 flex items-center justify-center relative",
                getBaseStyles(),
                className
            )}
        >
            <input
                type="number"
                disabled={isFuture}
                value={displayValue}
                onChange={handleChange}
                className={cn(
                    "w-full h-full bg-transparent text-center border-none p-0 focus:ring-0 focus:outline-none placeholder:text-black/20 text-xs font-mono appearance-none",
                    "[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none", // Hide spinner
                    state === 'completed' && "text-white placeholder:text-white/50 selection:bg-white/20",
                    isFuture && "cursor-default text-transparent placeholder:text-transparent" // Hide input in future
                )}
            />
        </motion.div>
    )
}
