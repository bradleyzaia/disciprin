import { ScrambleLink } from "@/components/ui/scramble-link"
import { GridRow, GridCell } from "@/components/layout/grid"
import { LayoutGrid, BarChart3, Book, Settings, LogOut } from "lucide-react"
import { useClerk } from "@clerk/clerk-react"

export function Navbar() {
    const { signOut } = useClerk()

    return (
        <GridRow flex="pass">
            <GridCell hug="pass" className="flex items-center" to="/dashboard">
                <span className="font-display font-black uppercase text-xl tracking-normal">Disciprin</span>
            </GridCell>
            <GridCell className="flex-1 flex items-center justify-center space-x-12 text-xs uppercase text-dark-theme-text bg-transparent">
                <div className="flex items-center gap-2">
                    <LayoutGrid className="size-4" />
                    <ScrambleLink to="/dashboard" className="px-2 py-1 transition-colors hover:bg-white hover:text-grayscale0">Dashboard</ScrambleLink>
                </div>
                <div className="flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    <ScrambleLink to="/analytics" className="px-2 py-1 transition-colors hover:bg-white hover:text-grayscale0">Analytics</ScrambleLink>
                </div>
                <div className="flex items-center gap-2">
                    <Book className="size-4" />
                    <ScrambleLink to="/journal" className="px-2 py-1 transition-colors hover:bg-white hover:text-grayscale0">Journal</ScrambleLink>
                </div>
            </GridCell>
            <GridCell hug="pass" className="group flex items-center justify-end" to="/settings">
                <Settings className="size-5" />
            </GridCell>
            <GridCell hug="pass" className="group flex items-center justify-end" onClick={() => signOut()}>
                <LogOut className="size-5" />
            </GridCell>
        </GridRow>
    )
}

