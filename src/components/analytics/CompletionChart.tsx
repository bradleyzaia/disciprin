import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
    date: string
    completionRate: number
}

interface CompletionChartProps {
    className?: string
    data: DataPoint[]
    timeRange?: 'W' | 'M' | 'Y'
}

export function CompletionChart({ className, data, timeRange = 'W' }: CompletionChartProps) {
    // Track mouse position for tooltip
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!data || data.length === 0) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percent = x / rect.width
        const index = Math.min(data.length - 1, Math.max(0, Math.round(percent * (data.length - 1))))
        setHoverIndex(index)
    }

    // Chart dimensions
    const width = 1000
    const height = 600
    const paddingY = 20 // Small vertical padding to prevent clipping

    // Calculate path
    const pathData = useMemo(() => {
        if (!data || data.length === 0) return ""

        return data.map((point, i) => {
            const x = (i / (data.length - 1 || 1)) * width
            const y = height - paddingY - (point.completionRate / 100) * (height - 2 * paddingY)
            // Use 3 decimal places for precision to avoid any potential gaps
            return `${i === 0 ? 'M' : 'L'} ${x.toFixed(3)},${y.toFixed(3)}`
        }).join(" ")
    }, [data, paddingY])

    // Format date for labels
    const formatDate = (dateStr: string) => {
        if (!dateStr) return ""
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    return (
        <div className={cn("w-full h-full flex flex-col user-select-none", className)}>
            {/* Chart Area: Y-Axis Labels + SVG share the same height container */}
            <div className="flex-1 w-full flex min-h-0">
                {/* Y-Axis Labels */}
                <div className="relative w-12 h-full text-[10px] text-stable-light/30 font-mono">
                    {[100, 75, 50, 25, 0].map((tick) => {
                        const yPercent = (height - paddingY - (tick / 100) * (height - 2 * paddingY)) / height * 100
                        return (
                            <span
                                key={tick}
                                className="absolute w-full text-right pr-4"
                                style={{
                                    top: `${yPercent}%`,
                                    transform: 'translateY(-50%)'
                                }}
                            >
                                {tick}%
                            </span>
                        )
                    })}
                </div>

                {/* SVG Container */}
                <div className="flex-1 relative min-h-0">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="w-full h-full overflow-visible cursor-crosshair"
                        preserveAspectRatio="none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <defs>
                            <mask id="lineMask">
                                <motion.rect
                                    x="0"
                                    y="0"
                                    height={height}
                                    fill="white"
                                    initial={{ width: 0 }}
                                    animate={{ width: width }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </mask>
                        </defs>

                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((tick) => {
                            const y = height - paddingY - (tick / 100) * (height - 2 * paddingY)
                            return (
                                <g key={tick}>
                                    <line
                                        x1={0}
                                        y1={y}
                                        x2={width}
                                        y2={y}
                                        stroke="var(--color-grayscale25)"
                                        strokeWidth={1}
                                        vectorEffect="non-scaling-stroke"
                                    />
                                </g>
                            )
                        })}

                        {/* Chart Line - Uses mask for reveal animation to ensure full connection */}
                        <motion.path
                            d={pathData}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            mask="url(#lineMask)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Hover Overlay */}
                        {hoverIndex !== null && data[hoverIndex] && (
                            <g>
                                <line
                                    x1={(hoverIndex / (data.length - 1 || 1)) * width}
                                    y1={0}
                                    x2={(hoverIndex / (data.length - 1 || 1)) * width}
                                    y2={height}
                                    stroke="#ffffff"
                                    strokeOpacity={0.2}
                                    strokeWidth={1}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </g>
                        )}
                    </svg>

                    {/* Bullet - Moved out of SVG to maintain 8x8 size regardless of scaling */}
                    {hoverIndex !== null && data[hoverIndex] && (
                        <div
                            className="absolute w-2 h-2 bg-white rounded-full pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)] border border-stable-dark"
                            style={{
                                left: `${(hoverIndex / (data.length - 1 || 1)) * 100}%`,
                                top: `${((height - paddingY - (data[hoverIndex].completionRate / 100) * (height - 2 * paddingY)) / height) * 100}%`
                            }}
                        />
                    )}

                    {/* Tooltip */}
                    {hoverIndex !== null && data[hoverIndex] && (
                        <div
                            className="absolute bg-stable-dark border border-stable-light/20 p-2 text-[10px] font-mono pointer-events-none z-10"
                            style={{
                                left: `${(hoverIndex / (data.length - 1 || 1)) * 100}%`,
                                top: '0',
                                transform: hoverIndex > data.length / 2 ? 'translateX(-100%)' : 'translateX(0)',
                                marginTop: '-40px'
                            }}
                        >
                            <div className="text-stable-light/50">
                                {timeRange === 'W' ? formatDate(data[hoverIndex].date) : `WEEK OF ${formatDate(data[hoverIndex].date)}`}
                            </div>
                            <div className="text-primary font-bold">{Math.round(data[hoverIndex].completionRate)}% COMPLETION</div>
                        </div>
                    )}
                </div>
            </div>

            {/* X-Axis Labels & Legend Row - Pushed below the chart area */}
            <div className="pl-12 w-full">
                {/* X-Axis Labels - Shows all dates in the range */}
                <div className="flex justify-between text-[10px] text-stable-light/30 font-mono mt-4">
                    {data.map((point, i) => (
                        <span key={i} className={cn(
                            "whitespace-nowrap",
                            i === 0 ? "text-left" : i === data.length - 1 ? "text-right" : "text-center"
                        )}>
                            {formatDate(point.date)}
                        </span>
                    ))}
                </div>

                <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-wider text-stable-light/20 font-mono">
                        {timeRange === 'W' ? '% of daily pills completed correctly' : '% of weekly goals met'}
                    </p>
                </div>
            </div>
        </div>
    )
}
