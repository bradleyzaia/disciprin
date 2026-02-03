import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { UserProfileEditor } from "@/components/settings/UserProfileEditor"
import { HabitManager } from "@/components/settings/HabitManager"
import { DangerZone } from "@/components/settings/DangerZone"
import { ScrambleText } from "@/components/ui/scramble-text"

export function Settings() {
    return (
        <MasterGrid>
            <Navbar />
            <GridRow>
                <GridCell span={12} className="flex items-center backdrop-blur-none bg-black/80">
                    <h2 className="text-xl m-0 tracking-normal uppercase"><ScrambleText text="ACCOUNT" /></h2>
                </GridCell>
            </GridRow>

            <UserProfileEditor />
            <HabitManager />
            <DangerZone />
        </MasterGrid>
    )
}
