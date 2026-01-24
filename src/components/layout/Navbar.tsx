import { Link } from "react-router-dom"
import { GridRow, GridCell } from "@/components/layout/grid"
import { LayoutGrid, BarChart3, Book, Settings } from "lucide-react"

export function Navbar() {
    return (
        <GridRow flex="pass">
            <GridCell hug="pass" className="flex items-center">
                <Link to="/dashboard">
                    <span className="font-display font-black uppercase text-xl tracking-normal">Disciprin</span>
                </Link>
            </GridCell>
            <GridCell className="flex-1 flex items-center justify-center space-x-12 text-xs uppercase text-muted-foreground bg-transparent">
                <a href="/dashboard" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <LayoutGrid className="size-4" />
                    <span>Dashboard</span>
                </a>
                <a href="/analytics" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <BarChart3 className="size-4" />
                    <span>Analytics</span>
                </a>
                <a href="/journal" className="hover:text-foreground transition-colors flex items-center gap-2">
                    <Book className="size-4" />
                    <span>Journal</span>
                </a>
            </GridCell>
            <GridCell hug="pass" className="group flex items-center justify-end hover:bg-black transition-colors cursor-pointer">
                <a href="/settings" className="transition-colors group-hover:text-white">
                    <Settings className="size-5" />
                </a>
            </GridCell>
        </GridRow>
    )
}
