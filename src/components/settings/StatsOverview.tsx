import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { GridRow, GridCell } from "@/components/layout/grid"

export function StatsOverview() {
    const user = useQuery(api.users.getUser)
    const pills = useQuery(api.pills.getPills.default)

    const daysActive = user ? Math.floor((Date.now() - (user.created_at || Date.now())) / (1000 * 60 * 60 * 24)) : 0
    const activeHabits = pills?.length || 0

    return (
        <GridRow>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center">
                <h3 className="text-5xl font-mono m-0 tracking-normal">
                    {daysActive}
                </h3>
                <span className="text-xs text-muted-foreground uppercase mt-2">Days Active</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center bg-muted/20">
                <h3 className="text-5xl font-mono text-primary m-0 tracking-normal">HIGH</h3>
                <span className="text-xs text-muted-foreground uppercase mt-2">Discipline Compliance</span>
            </GridCell>
            <GridCell span={4} className="h-40 flex flex-col justify-center items-center text-center border-r-0">
                <h3 className="text-5xl font-mono m-0 tracking-normal">{activeHabits}</h3>
                <span className="text-xs text-muted-foreground uppercase mt-2">Active Habits</span>
            </GridCell>
        </GridRow>
    )
}
