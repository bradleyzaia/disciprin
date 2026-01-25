import { GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleText } from "@/components/ui/scramble-text"
import { Plus } from "lucide-react"

interface JournalHeaderProps {
    dateRange: string
    onAddEntry?: () => void
}

export function JournalHeader({ dateRange, onAddEntry }: JournalHeaderProps) {
    return (
        <GridRow>
            <GridCell span={7} className="flex items-center backdrop-blur-none bg-black/80">
                <h2 className="text-xl m-0 tracking-normal"><ScrambleText text="Weekly Review" /></h2>
            </GridCell>
            <GridCell span={4} className="col-span-10 p-0 h-full flex backdrop-blur-none bg-black/80">
                <div className="flex-1 flex items-center justify-center text-sm">
                    <ScrambleText text={dateRange} />
                </div>
            </GridCell>
            <GridCell span={1} className="col-span-2 h-full p-0 backdrop-blur-none bg-black/80">
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
