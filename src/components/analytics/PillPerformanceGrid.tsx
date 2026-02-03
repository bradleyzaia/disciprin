
import { GridRow, GridCell } from "@/components/layout/grid"
import { PillCircleChart } from "./PillCircleChart"

interface PillPerformanceData {
    id: string
    name: string
    completionRate: number
    currentStreak: number
    status: string
    lifetimeStats?: {
        totalCompleted: number
        completionRate: number
        expected: number
        actual: number
    }
}

interface PillPerformanceGridProps {
    data: PillPerformanceData[]
}

export function PillPerformanceGrid({ data }: PillPerformanceGridProps) {
    if (!data || data.length === 0) return null;

    return (
        <GridRow className="border-b-0">
            {data.map((pill) => (
                <GridCell key={pill.id} className="col-span-6 md:col-span-3 p-4 md:p-8 backdrop-blur-none bg-black/80 min-h-[300px] border-b border-dark-theme-border">
                    <PillCircleChart
                        name={pill.name}
                        completionRate={pill.completionRate}
                        lifetimeCompletionRate={pill.lifetimeStats?.completionRate || 0}
                        status={pill.status}
                    />
                </GridCell>
            ))}
        </GridRow>
    )
}
