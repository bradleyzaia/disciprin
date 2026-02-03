
import { GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleText } from "@/components/ui/scramble-text"

interface KeyMetricsProps {
    overallCompletionRate: number;
    totalHabitsCompleted: number;
    currentStreak: number;
    bestStreak: number;
}

export function KeyMetrics({ overallCompletionRate, totalHabitsCompleted, currentStreak, bestStreak }: KeyMetricsProps) {
    return (
        <GridRow>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-left md:text-center backdrop-blur-none bg-black/80 p-4 md:p-8 border-b md:border-b-0 col-span-6">
                <h3 className="text-2xl md:text-5xl font-mono text-primary m-0 tracking-normal"><ScrambleText text={`${Math.round(overallCompletionRate)}%`} /></h3>
                <span className="text-xs text-grayscale75 uppercase"><ScrambleText text="Period Completion Rate" /></span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-left md:text-center backdrop-blur-none bg-black/80 p-4 md:p-8 border-b md:border-b-0 border-r-0 md:border-r col-span-6">
                <h3 className="text-2xl md:text-5xl font-mono m-0 tracking-normal flex items-baseline justify-start md:justify-center">
                    <ScrambleText text={currentStreak.toString()} />
                    <span className="ml-4 uppercase">Wks</span>
                </h3>
                <span className="text-xs text-grayscale75 uppercase"><ScrambleText text="Current Streak" /></span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-left md:text-center backdrop-blur-none bg-black/80 p-4 md:p-8 col-span-6">
                <h3 className="text-2xl md:text-5xl font-mono m-0 tracking-normal flex items-baseline justify-start md:justify-center">
                    <ScrambleText text={bestStreak.toString()} />
                    <span className="ml-4 uppercase">Wks</span>
                </h3>
                <span className="text-xs text-grayscale75 uppercase"><ScrambleText text="Best Streak" /></span>
            </GridCell>
            <GridCell span={3} className="h-40 flex flex-col justify-between text-left md:text-center border-r-0 backdrop-blur-none bg-black/80 p-4 md:p-8 col-span-6">
                <h3 className="text-2xl md:text-5xl font-mono m-0 tracking-normal"><ScrambleText text={totalHabitsCompleted.toFixed(2)} /></h3>
                <span className="text-xs text-grayscale75 uppercase"><ScrambleText text="Total Pills Taken" /></span>
            </GridCell>
        </GridRow>
    )
}
