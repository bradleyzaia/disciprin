import { useState } from "react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Drawer } from "@/components/ui/Drawer"
import { Button } from "@/components/ui/Button"

export function GridTest() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    return (
        <MasterGrid className="h-[100dvh]">
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

            {/* Test Drawer Interaction */}
            <GridRow>
                <GridCell span={12} className="p-8 flex items-center justify-center border-t border-dark-theme-border">
                    <Button onClick={() => setIsDrawerOpen(true)}>
                        LAUNCH BOTTOM DRAWER
                    </Button>
                </GridCell>
            </GridRow>

            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black">
                    <h2 className="text-4xl font-display mb-4">DRAWER ACTIVE</h2>
                    <p className="font-mono text-sm opacity-50 mb-8">
                        BOTTOM 25% VIEWPORT FILL | 1PX TOP BORDER | SWISS GRID STANDARD
                    </p>
                    <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                        CLOSE DRAWER
                    </Button>
                </div>
            </Drawer>
        </MasterGrid>
    )
}
