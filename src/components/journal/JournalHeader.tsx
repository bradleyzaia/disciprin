import { GridRow, GridCell } from "@/components/layout/grid"
import { Plus } from "lucide-react"

interface JournalHeaderProps {
    dateRange: string
    onAddEntry?: () => void
}

export function JournalHeader({ dateRange, onAddEntry }: JournalHeaderProps) {
    return (
        <GridRow>
            <GridCell span={7} className="flex items-center backdrop-blur-none bg-black/80">
                <h2 className="text-xl m-0 tracking-normal">Weekly Review</h2>
            </GridCell>
            <GridCell span={4} className="p-0 h-full flex backdrop-blur-none bg-black/80">
                <div className="flex-1 flex items-center justify-center border-r border-dark-theme-border text-sm">
                    {dateRange}
                </div>
            </GridCell>
            <GridCell span={1} className="h-full p-0 backdrop-blur-none bg-black/80">
                <button
                    onClick={onAddEntry}
                    className="w-full h-full flex items-center justify-center bg-white hover:!bg-green transition-colors group"
                >
                    <Plus className="w-8 h-8 text-black" />
                </button>
            </GridCell>
        </GridRow>
    )
}
