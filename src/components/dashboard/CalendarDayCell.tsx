import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { StaticAsciiPill } from "@/components/StaticAsciiPill"
import { motion } from "framer-motion"

export type DayCellState = 'completed' | 'partially-completed' | 'past-incomplete' | 'future'

interface CalendarDayCellProps {
    state: DayCellState
    value?: number
    target?: number
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
    className?: string
}

export function CalendarDayCell({ state, value, target, onClick, className }: CalendarDayCellProps) {
    let content = null

    switch (state) {
        case 'completed':
            content = (
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-none">
                    <Check className="w-4 h-4" />
                </div>
            )
            break
        case 'partially-completed':
            const percentage = (value && target) ? Math.round((value / target) * 100) : 0
            content = (
                <div className="w-6 h-6 border border-black flex items-center justify-center bg-transparent">
                    <span className="text-[9px] font-medium leading-none">{percentage}%</span>
                </div>
            )
            break
        case 'past-incomplete':
            content = (

                <div className="w-6 h-3 rounded-full border border-black/20 bg-transparent rotate-45 transform origin-center" />

            )
            break
        case 'future':
            content = (
                <div className="w-full h-full flex items-center justify-center bg-black/10">
                    <div className="w-6 h-3 rounded-full border border-black/10 rotate-45 transform origin-center" />
                </div>
            )
            break
    }

    return (
        <motion.div
            onClick={onClick}
            className={cn(
                "h-full w-full border-r border-black/50 last:border-r-0 flex items-center justify-center transition-all hover:bg-black/5 cursor-pointer relative",
                state === 'future' && "bg-white text-muted-foreground cursor-default hover:bg-white",
                className
            )}
        >
            {content}
        </motion.div>
    )
}
