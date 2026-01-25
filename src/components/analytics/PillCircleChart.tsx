
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PillCircleChartProps {
    name: string
    completionRate: number // 0-100
    lifetimeCompletionRate: number // 0-100
    status: string // 'Good' | 'Rack Disciprin' | 'Dishonor'
    className?: string
}

export function PillCircleChart({
    name,
    completionRate,
    lifetimeCompletionRate,
    // status,
    className
}: PillCircleChartProps) {
    const size = 160
    const strokeWidth = 1
    const center = size / 2

    // Outer Ring (Period Stats)
    const activeRadius = (size - strokeWidth) / 2
    const activeCircumference = 2 * Math.PI * activeRadius
    const activeDashArray = activeCircumference
    const activeDashOffset = activeCircumference - (completionRate / 100) * activeCircumference

    const color = '#00FF8C'

    return (
        <div className={cn("flex flex-col items-center justify-center h-full w-full py-4 space-y-4", className)}>
            <div className="text-center space-y-1">
                <h4 className="text-sm font-normal">{name}</h4>
                <div className="text-[10px] text-stable-light/50 uppercase tracking-widest">Performance</div>
            </div>

            <div className="relative flex items-center justify-center">
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="transform -rotate-90"
                >
                    {/* Track */}
                    <circle
                        cx={center}
                        cy={center}
                        r={activeRadius}
                        fill="none"
                        stroke="var(--color-grayscale25)"
                        strokeWidth={strokeWidth}
                    />

                    {/* Completion Ring */}
                    <motion.circle
                        cx={center}
                        cy={center}
                        r={activeRadius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={activeDashArray}
                        initial={{ strokeDashoffset: activeCircumference }}
                        animate={{ strokeDashoffset: activeDashOffset }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="butt"
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-normal" style={{ color }}>{Math.round(completionRate)}%</span>
                    <span className="text-[10px] text-stable-light/50 mt-1 uppercase">Goal</span>
                </div>
            </div>

            {/* Legend / Stats */}
            <div className="w-full flex justify-between px-4 text-[10px] uppercase font-mono tracking-wider">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-stable-light/70">Current</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-stable-light/70">{Math.round(lifetimeCompletionRate)}% Lifetime</span>
                </div>
            </div>
        </div>
    )
}
