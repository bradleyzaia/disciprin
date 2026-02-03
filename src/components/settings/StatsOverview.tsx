import { useMemo } from "react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { GridRow, GridCell } from "@/components/layout/grid"

export function StatsOverview() {
    const user = useQuery(api.users.getUser)
    const pills = useQuery(api.pills.getPills.default)

    const today = new Date().toISOString().split('T')[0]
    const analytics = useQuery(api.analytics.getAnalyticsData, {
        startDate: today,
        endDate: today,
    })

    const daysActive = user ? Math.floor((Date.now() - (user.created_at || Date.now())) / (1000 * 60 * 60 * 24)) : 0
    const activeHabits = pills?.length || 0

    const complianceRate = useMemo(() => {
        if (!analytics?.habitPerformance) return 0

        const totalExpected = analytics.habitPerformance.reduce((acc, curr) => acc + (curr.lifetimeStats.expected || 0), 0)
        const totalActual = analytics.habitPerformance.reduce((acc, curr) => acc + (curr.lifetimeStats.actual || 0), 0)

        if (totalExpected === 0) return 0
        return (totalActual / totalExpected) * 100
    }, [analytics])

    const complianceText = useMemo(() => {
        if (complianceRate >= 100) return "Impossibiru"
        if (complianceRate >= 90) return "Rary"
        if (complianceRate >= 75) return "Rack"
        if (complianceRate >= 50) return "Dishonor"
        if (complianceRate >= 25) return "Shamefur Dispray"
        return "Disowned"
    }, [complianceRate])

    return (
        <GridRow>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center backdrop-blur-none bg-black/80">
                <h3 className="text-5xl font-mono m-0 tracking-normal">
                    {daysActive}
                </h3>
                <span className="text-xs text-dark-theme-text uppercase mt-2">Days Active</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center backdrop-blur-none bg-black/80">
                <h3 className="text-2xl font-mono text-primary m-0 tracking-normal uppercase px-2">
                    {complianceText}
                </h3>
                <span className="text-xs text-dark-theme-text uppercase mt-2">Discipline Level</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center border-r-0 backdrop-blur-none bg-black/80">
                <h3 className="text-5xl font-mono m-0 tracking-normal">{activeHabits}</h3>
                <span className="text-xs text-dark-theme-text uppercase mt-2">Active Pills</span>
            </GridCell>
        </GridRow>
    )
}
