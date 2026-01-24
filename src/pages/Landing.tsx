import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Link } from "react-router-dom"
import { EffectScene } from "@/components/effect-scene"

export function Landing() {
    return (
        <div className="relative min-h-screen bg-background">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>
            <MasterGrid className="relative z-10 bg-transparent pointer-events-none h-screen">
                <GridRow className="h-full">
                    <GridCell span={6} className="h-full flex flex-col justify-between border-r-0 pointer-events-auto bg-background/80 backdrop-blur-sm p-0">
                        <div className="p-8">
                            <h1 className="font-display text-8xl uppercase leading-[0.8] tracking-normal">
                                Disciprin
                            </h1>
                            <p className="mt-8 text-muted-foreground max-w-md">
                                Daily habit tracking for the disciplined. Weekly accountability periods.
                                Zero excuses.
                            </p>
                        </div>
                        <div className="flex w-full border-t border-black/50">
                            <Link to="/signup" className="flex-1 py-6 text-center hover:bg-foreground hover:text-background transition-colors uppercase border-r border-black/50">
                                Register
                            </Link>
                            <Link to="/login" className="flex-1 py-6 text-center hover:bg-foreground hover:text-background transition-colors uppercase">
                                Login
                            </Link>
                        </div>
                    </GridCell>
                    <GridCell span={6} className="h-full border-l border-black/50 p-0">
                        {/* Empty cell to maintain grid structure over the background */}
                    </GridCell>
                </GridRow>
            </MasterGrid>
        </div>
    )
}
