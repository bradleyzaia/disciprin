import { useState, useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { CompletionChart } from "@/components/analytics/CompletionChart"
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader"
import { KeyMetrics } from "@/components/analytics/KeyMetrics"
import { PillPerformanceTable } from "@/components/analytics/PillPerformanceTable"

export function Analytics() {
    const [timeRange, setTimeRange] = useState<'W' | 'M' | 'Y'>('M')

    // Calculate date range based on selection
    const { startDate, endDate } = useMemo(() => {
        const end = new Date();
        const start = new Date();

        switch (timeRange) {
            case 'W':
                // Start of current week (Sunday)
                start.setDate(start.getDate() - start.getDay());
                break;
            case 'M':
                // Start of current month
                start.setDate(1);
                break;
            case 'Y':
                // Start of current year
                start.setMonth(0, 1);
                break;
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    }, [timeRange]);

    const data = useQuery(api.analytics.getAnalyticsData, { startDate, endDate, timeRange });

    return (
        <MasterGrid>
            <Navbar />
            <AnalyticsHeader
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
            />

            <KeyMetrics
                overallCompletionRate={data?.overallCompletionRate ?? 0}
                totalHabitsCompleted={data?.totalHabitsCompleted ?? 0}
                currentStreak={data?.currentStreak ?? 0}
                bestStreak={data?.bestStreak ?? 0}
            />

            <GridRow>
                <GridCell span={12} className="h-[400px] flex flex-col">
                    <h3 className="mb-0 font-mono text-sm uppercase tracking-wider text-stable-light/50">Completion Rate</h3>
                    <div className="flex-1 min-h-0 pt-8">
                        <CompletionChart
                            data={data?.chartData ?? []}
                            timeRange={timeRange}
                            className="h-full"
                        />
                    </div>
                </GridCell>
            </GridRow>


        </MasterGrid>
    )
}
