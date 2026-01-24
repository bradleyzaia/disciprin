
import { GridRow, GridCell } from "@/components/layout/grid"

export function HabitPerformanceTable() {
    return (
        <>
            <GridRow>
                <GridCell span={12} className="py-8 border-b-0">
                    <h3 className="">Habit Performance (Total)</h3>
                </GridCell>
            </GridRow>

            <GridRow className="border-b-0 flex-grow">
                <GridCell span={12} className="p-0 border-r-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/50">
                                <th className="p-6 text-xs text-muted-foreground uppercase font-normal border-r border-black/50 w-1/4">Habit</th>
                                <th className="p-6 text-xs text-muted-foreground uppercase font-normal border-r border-black/50 w-1/4">Current Streak</th>
                                <th className="p-6 text-xs text-muted-foreground uppercase font-normal border-r border-black/50 w-1/4">Longest Streak</th>
                                <th className="p-6 text-xs text-muted-foreground uppercase font-normal w-1/4">Completion %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">Meditation</td>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">4 wks</td>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">12 wks</td>
                                <td className="p-6 border-b border-black/50 text-primary">94%</td>
                            </tr>
                            <tr>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">Reading</td>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">1 wk</td>
                                <td className="p-6 border-b border-black/50 border-r border-black/50">5 wks</td>
                                <td className="p-6 border-b border-black/50 text-muted-foreground">62%</td>
                            </tr>
                        </tbody>
                    </table>
                </GridCell>
            </GridRow>
        </>
    )
}
