
import { GridRow, GridCell } from "@/components/layout/grid"

interface KeyMetricsProps {
    overallCompletionRate: number;
    totalHabitsCompleted: number;
    currentStreak: number;
    bestStreak: number;
}

export function KeyMetrics({ overallCompletionRate, totalHabitsCompleted, currentStreak, bestStreak }: KeyMetricsProps) {
    return (
        <GridRow>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-center">
                <h3 className="text-5xl font-mono text-primary m-0 tracking-normal">{Math.round(overallCompletionRate)}%</h3>
                <span className="text-xs text-grayscale75 uppercase">Period Completion Rate</span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-center">
                <h3 className="text-5xl font-mono m-0 tracking-normal flex items-baseline justify-center">
                    {currentStreak}
                    <span className="ml-4 uppercase">Wks</span>
                </h3>
                <span className="text-xs text-grayscale75 uppercase">Current Streak</span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-center">
                <h3 className="text-5xl font-mono m-0 tracking-normal flex items-baseline justify-center">
                    {bestStreak}
                    <span className="ml-4 uppercase">Wks</span>
                </h3>
                <span className="text-xs text-grayscale75 uppercase">Best Streak</span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-center border-r-0">
                <h3 className="text-5xl font-mono m-0 tracking-normal">{totalHabitsCompleted.toFixed(2)}</h3>
                <span className="text-xs text-grayscale75 uppercase">Total Pills Taken</span>
            </GridCell>
        </GridRow>
    )
}
