import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"

export function GridTest() {
    return (
        <MasterGrid className="h-screen">
            <GridRow>
                <GridCell span={12} className="p-8">
                    <h1 className="text-xl mb-4 font-mono">Dynamic Text Sizing Test</h1>
                    <p className="mb-8 font-mono text-sm max-w-2xl">
                        The text below should scale to fit the cell width.
                        Resize the window to see it adjust.
                    </p>
                </GridCell>
            </GridRow>

            {/* Row 1: Short text - Should be maxFontSize (default 100px) */}
            <GridRow>
                <GridCell span={12} dynamicText className="h-32 flex items-center bg-gray-50/5">
                    JAMES
                </GridCell>
            </GridRow>

            {/* Row 2: Medium text - Should scale down */}
            <GridRow>
                <GridCell span={12} dynamicText className="h-32 flex items-center bg-gray-50/10">
                    JAMES BOND 007
                </GridCell>
            </GridRow>

            {/* Row 3: Long text - Should scale down significantly */}
            <GridRow>
                <GridCell span={12} dynamicText className="h-32 flex items-center bg-gray-50/5">
                    JAMES BOND 007 LICENSE TO KILL AND ALSO SOME OTHER STUFF
                </GridCell>
            </GridRow>

            {/* Row 4: Custom max size */}
            <GridRow>
                <GridCell span={12} dynamicText maxFontSize={50} className="h-32 flex items-center bg-gray-50/10">
                    LIMITED TO 50PX MAX
                </GridCell>
            </GridRow>
        </MasterGrid>
    )
}
