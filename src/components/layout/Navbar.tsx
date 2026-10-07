import { ScrambleLink } from "@/components/ui/scramble-link"
import { GridRow, GridCell } from "@/components/layout/grid"
import { LayoutGrid, BarChart3, Book, Users, User, LogOut, Pill } from "lucide-react"
import { useClerk } from "@clerk/clerk-react"

import { Link } from "react-router-dom"
import { playSFX, SFX } from "@/lib/sfx"

export function Navbar() {
    const { signOut } = useClerk()

    return (
        <GridRow flex="pass">
            <GridCell hug="pass" className="flex items-center justify-center w-12 md:w-16 !p-0 !backdrop-blur-none bg-black/80" to="/dashboard">
                <div className="w-full flex items-center justify-center">
                    <Pill className="size-8" strokeWidth={1} />
                </div>
            </GridCell>
            <GridCell className="flex-1 flex items-center !px-0 md:!px-8 text-xs uppercase text-dark-theme-text !backdrop-blur-none bg-black/80">
                <div className="flex-1 flex items-center justify-center gap-2" title="Dashboard">
                    <Link to="/dashboard" onMouseDown={() => playSFX(SFX.ENTER)} className="flex items-center justify-center text-current transition-colors hover:text-green">
                        <LayoutGrid className="size-4" strokeWidth={1} />
                    </Link>
                    <ScrambleLink to="/dashboard" className="px-2 py-1 transition-colors hover:text-green hidden md:inline-block">Dashboard</ScrambleLink>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2" title="Friends">
                    <Link to="/friends" onMouseDown={() => playSFX(SFX.ENTER)} className="flex items-center justify-center text-current transition-colors hover:text-green">
                        <Users className="size-4" strokeWidth={1} />
                    </Link>
                    <ScrambleLink to="/friends" className="px-2 py-1 transition-colors hover:text-green hidden md:inline-block">Friends</ScrambleLink>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2" title="Analytics">
                    <Link to="/analytics" onMouseDown={() => playSFX(SFX.ENTER)} className="flex items-center justify-center text-current transition-colors hover:text-green">
                        <BarChart3 className="size-4" strokeWidth={1} />
                    </Link>
                    <ScrambleLink to="/analytics" className="px-2 py-1 transition-colors hover:text-green hidden md:inline-block">Analytics</ScrambleLink>
                </div>
                <div className="flex-1 flex items-center justify-center gap-2" title="Journal">
                    <Link to="/journal" onMouseDown={() => playSFX(SFX.ENTER)} className="flex items-center justify-center text-current transition-colors hover:text-green">
                        <Book className="size-4" strokeWidth={1} />
                    </Link>
                    <ScrambleLink to="/journal" className="px-2 py-1 transition-colors hover:text-green hidden md:inline-block">Journal</ScrambleLink>
                </div>
            </GridCell>
            <GridCell hug="pass" className="group flex items-center justify-center w-12 md:w-16 !p-0 !backdrop-blur-none bg-black/80" to="/settings">
                <div className="w-full flex items-center justify-center">
                    <User className="size-5" strokeWidth={1} />
                </div>
            </GridCell>
            <GridCell hug="pass" className="group flex items-center justify-center w-12 md:w-16 !p-0 !backdrop-blur-none bg-black/80" onClick={() => signOut()}>
                <div className="w-full flex items-center justify-center">
                    <LogOut className="size-5" strokeWidth={1} />
                </div>
            </GridCell>
        </GridRow>
    )
}

