
import { GridCell } from "@/components/layout/grid"

export function StreakDistribution() {
    return (
        <GridCell span={6} className="h-[400px] border-r-0">
            <h3 className="mb-8">Streak Distribution</h3>
            <div className="border border-dashed border-black/50 h-[240px] flex items-center justify-center text-muted-foreground text-sm">
                [Placeholder for Bar Graph]
            </div>
        </GridCell>
    )
}
