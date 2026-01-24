import { useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
    label: string
    value: number
}

// Mock data: Last 12 weeks of completion rates
const MOCK_DATA: DataPoint[] = [
    { label: "W1", value: 65 },
    { label: "W2", value: 72 },
    { label: "W3", value: 68 },
    { label: "W4", value: 75 },
    { label: "W5", value: 82 },
    { label: "W6", value: 78 },
    { label: "W7", value: 85 },
    { label: "W8", value: 80 },
    { label: "W9", value: 88 },
    { label: "W10", value: 92 },
    { label: "W11", value: 90 },
    { label: "W12", value: 94 },
]

export function CompletionChart({ className }: { className?: string }) {
    // Chart dimensions (internal SVG units)
    const width = 100
    const height = 60
    const padding = 5

    // Calculate path
    const pathData = useMemo(() => {
        const maxValue = 100 // Percentages go to 100
        const minValue = 0

        const points = MOCK_DATA.map((d, i) => {
            const x = padding + (i / (MOCK_DATA.length - 1)) * (width - 2 * padding)
            const y = height - padding - ((d.value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
            return `${x},${y}`
        })

        return `M ${points.join(" L ")}`
    }, [])

    return (
        <div className={cn("w-full h-full flex flex-col user-select-none", className)}>
            <div className="flex-1 w-full relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const y = height - padding - (tick / 100) * (height - 2 * padding)
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeOpacity={0.1}
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </g>
                        )
                    })}

                    {/* Chart Line */}
                    <motion.path
                        d={pathData}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-2 text-[10px] text-muted-foreground font-mono mt-2">
                <span>{MOCK_DATA[0].label}</span>
                <span>{MOCK_DATA[MOCK_DATA.length - 1].label}</span>
            </div>
        </div>
    )
}
