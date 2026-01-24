import { GridRow, GridCell } from "@/components/layout/grid"

interface JournalHeaderProps {
    dateRange: string
}

export function JournalHeader({ dateRange }: JournalHeaderProps) {
    return (
        <GridRow>
            <GridCell span={8} className="flex items-center">
                <h2 className="text-xl m-0 tracking-normal">Weekly Review</h2>
            </GridCell>
            <GridCell span={4} className="p-0 border-r-0 h-full flex">
                <div className="flex-1 flex items-center justify-center border-r border-black/50 text-sm">
                    {dateRange}
                </div>
            </GridCell>
        </GridRow>
    )
}
