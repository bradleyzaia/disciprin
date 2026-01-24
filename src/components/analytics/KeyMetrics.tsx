
import { GridRow, GridCell } from "@/components/layout/grid"

export function KeyMetrics() {
    return (
        <GridRow>
            <GridCell span={4} className="h-40 flex flex-col justify-between text-center">
                <h3 className="text-5xl font-mono text-primary m-0 tracking-normal">92%</h3>
                <span className="text-xs text-muted-foreground uppercase">Avg Weekly Completion</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-between text-center bg-muted/20">
                <h3 className="text-5xl font-mono m-0 tracking-normal">12</h3>
                <span className="text-xs text-muted-foreground uppercase">Best Streak (Days)</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-between text-center border-r-0">
                <h3 className="text-5xl font-mono m-0 tracking-normal">42</h3>
                <span className="text-xs text-muted-foreground uppercase">Total Perfect Days</span>
            </GridCell>
        </GridRow>
    )
}
