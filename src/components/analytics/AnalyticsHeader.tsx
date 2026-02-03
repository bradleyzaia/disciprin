import { useMemo } from "react"
import { GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleText } from "@/components/ui/scramble-text"

interface AnalyticsHeaderProps {
    timeRange?: 'W' | 'M' | 'Y'
    onTimeRangeChange?: (range: 'W' | 'M' | 'Y') => void
    analyticsData?: any
    user?: any
}

export function AnalyticsHeader({ timeRange = 'W', onTimeRangeChange, analyticsData, user }: AnalyticsHeaderProps) {
    const daysActive = user ? Math.floor((Date.now() - (user.created_at || Date.now())) / (1000 * 60 * 60 * 24)) : 0
    const activeHabits = analyticsData?.activeHabitsCount || 0

    const complianceRate = useMemo(() => {
        if (!analyticsData?.habitPerformance) return 0

        const totalExpected = analyticsData.habitPerformance.reduce((acc: any, curr: any) => acc + (curr.lifetimeStats?.expected || 0), 0)
        const totalActual = analyticsData.habitPerformance.reduce((acc: any, curr: any) => acc + (curr.lifetimeStats?.actual || 0), 0)

        if (totalExpected === 0) return 0
        return (totalActual / totalExpected) * 100
    }, [analyticsData])

    const complianceText = useMemo(() => {
        if (complianceRate >= 100) return "Impossibiru"
        if (complianceRate >= 90) return "Rary"
        if (complianceRate >= 75) return "Rack"
        if (complianceRate >= 50) return "Dishonor"
        if (complianceRate >= 25) return "Shamefur"
        return "Disowned"
    }, [complianceRate])

    return (
        <GridRow>
            <GridCell span={5} className="h-full flex flex-col justify-center items-center text-center backdrop-blur-none bg-black/80 py-4 border-b md:border-b-0">
                <h3 className="text-xl font-mono text-primary m-0 tracking-normal uppercase px-2 truncate w-full">
                    <ScrambleText text={complianceText} />
                </h3>
                <span className="text-[10px] text-dark-theme-text uppercase mt-1">
                    <ScrambleText text="Discipline Level" />
                    <span
                        className="ml-1"
                        style={{
                            color: complianceRate >= 90 ? 'var(--color-green)' :
                                complianceRate >= 50 ? 'var(--color-yellow)' :
                                    'var(--color-red)'
                        }}
                    >
                        {Math.round(complianceRate)}%
                    </span>
                </span>
            </GridCell>

            <GridCell span={2} className="h-full flex flex-col justify-center items-center text-center backdrop-blur-none bg-black/80 py-4 border-b md:border-b-0 col-span-6">
                <h3 className="text-3xl font-mono m-0 tracking-normal">
                    <ScrambleText text={daysActive.toString()} />
                </h3>
                <span className="text-[10px] text-dark-theme-text uppercase mt-1"><ScrambleText text="Days Active" /></span>
            </GridCell>

            <GridCell span={2} className="h-full flex flex-col justify-center items-center text-center backdrop-blur-none bg-black/80 py-4 border-b md:border-b-0 col-span-6 border-r-0 md:border-r">
                <h3 className="text-3xl font-mono m-0 tracking-normal">
                    <ScrambleText text={activeHabits.toString()} />
                </h3>
                <span className="text-[10px] text-dark-theme-text uppercase mt-1"><ScrambleText text="Active Pills" /></span>
            </GridCell>

            <GridCell span={3} className="p-0 border-r-0 h-full flex backdrop-blur-none bg-black/80 min-h-[80px]">
                <button
                    onClick={() => onTimeRangeChange?.('W')}
                    className={`flex-1 border-r border-dark-theme-border h-full text-xs transition-colors uppercase ${timeRange === 'W' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    W
                </button>
                <button
                    onClick={() => onTimeRangeChange?.('M')}
                    className={`flex-1 border-r border-dark-theme-border h-full text-xs transition-colors uppercase ${timeRange === 'M' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    M
                </button>
                <button
                    onClick={() => onTimeRangeChange?.('Y')}
                    className={`flex-1 h-full text-xs transition-colors uppercase ${timeRange === 'Y' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    Y
                </button>
            </GridCell>
        </GridRow>
    )
}
