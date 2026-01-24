import { useState } from "react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { CompletionChart } from "@/components/analytics/CompletionChart"
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader"
import { KeyMetrics } from "@/components/analytics/KeyMetrics"
import { StreakDistribution } from "@/components/analytics/StreakDistribution"
import { HabitPerformanceTable } from "@/components/analytics/HabitPerformanceTable"

export function Analytics() {
    const [timeRange, setTimeRange] = useState<'W' | 'M' | 'Y'>('M')

    return (
        <MasterGrid>
            <Navbar />
            <AnalyticsHeader
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
            />

            <KeyMetrics />

            <GridRow>
                <GridCell span={6} className="h-[400px]">
                    <h3 className="mb-8">Completion Rate</h3>
                    <CompletionChart className="h-[240px]" />
                </GridCell>
                <StreakDistribution />
            </GridRow>

            <HabitPerformanceTable />
        </MasterGrid>
    )
}
