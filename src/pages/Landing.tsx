import { useAuth } from "@clerk/clerk-react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleLink } from "@/components/ui/scramble-link"
import { EffectScene } from "@/components/effect-scene"

export function Landing() {
    const { isLoaded, isSignedIn } = useAuth()

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>
            <MasterGrid className="relative border-l border-r-0 border-dark-theme-border z-10 bg-transparent pointer-events-none h-screen">
                <GridRow className="h-full">
                    <GridCell span={6} className="h-full flex flex-col justify-between pointer-events-auto backdrop-blur-md p-0">
                        <div className="p-8">
                            <h1 className="font-display text-8xl uppercase leading-[0.8] tracking-normal text-dark-theme-text">
                                Disciprin
                            </h1>
                            <p className="mt-8 text-dark-theme-text max-w-md">
                                time to do all the shit you said you would.
                            </p>

                        </div>
                        <div className="flex w-full border-t border-dark-theme-border">
                            {isLoaded && isSignedIn ? (
                                <ScrambleLink to="/dashboard" className="flex-1 py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase">
                                    Continue to Dashboard
                                </ScrambleLink>
                            ) : (
                                <>
                                    <ScrambleLink to="/signup" className="flex-1 py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase border-r border-dark-theme-border">
                                        Lock In
                                    </ScrambleLink>
                                    <ScrambleLink to="/login" className="flex-1 py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase">
                                        Log in
                                    </ScrambleLink>
                                </>
                            )}
                        </div>
                    </GridCell>
                    <GridCell span={6} className="h-full border-l border-dark-theme-border p-0 backdrop-blur-none">
                        {/* Empty cell to maintain grid structure over the background */}
                    </GridCell>
                </GridRow>
            </MasterGrid>
        </div>
    )
}
