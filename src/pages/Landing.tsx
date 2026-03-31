import { useAuth } from "@clerk/clerk-react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleLink } from "@/components/ui/scramble-link"
import { EffectScene } from "@/components/effect-scene"
import { Activity, Brain, Wallet, Heart, Pill } from "lucide-react"

export function Landing() {
    const { isLoaded, isSignedIn } = useAuth()

    return (
        <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>
            <MasterGrid className="relative border-l border-r-0 border-dark-theme-border z-10 bg-transparent pointer-events-none h-full">
                <GridRow className="flex-1 flex flex-col md:grid">
                    {/* Mobile Spacer for Top Half Scene */}
                    <GridCell className="col-span-12 flex-1 md:hidden p-0 backdrop-blur-none bg-transparent" />

                    <GridCell className="col-span-12 md:col-span-6 md:h-full flex flex-col justify-between pointer-events-auto backdrop-blur-md bg-grayscale0/20 md:bg-transparent p-0 border-t md:border-t-0 border-dark-theme-border">
                        <div className="p-4 md:p-8">
                            <h1 className="font-display text-5xl md:text-8xl uppercase leading-[0.9] md:leading-[0.8] tracking-normal text-dark-theme-text">
                                Disciprin
                            </h1>
                            <p className="mt-4 md:mt-8 text-dark-theme-text max-w-md text-sm">
                                time to do all the shit you said you would.
                            </p>

                            <div className="mt-8 flex gap-4 text-dark-theme-text">
                                <Activity className="size-6" strokeWidth={1} />
                                <Brain className="size-6" strokeWidth={1} />
                                <Wallet className="size-6" strokeWidth={1} />
                                <Heart className="size-6" strokeWidth={1} />
                                <Pill className="size-6" strokeWidth={1} />
                            </div>

                        </div>
                        <div className="flex w-full flex-col border-t border-dark-theme-border">
                            {isLoaded && isSignedIn ? (
                                <ScrambleLink to="/dashboard" className="flex-1 py-4 md:py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase">
                                    Continue to Dashboard
                                </ScrambleLink>
                            ) : (
                                <>
                                    <div className="flex w-full border-b border-dark-theme-border">
                                        <ScrambleLink to="/login" className="flex-1 py-4 md:py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase">
                                            Log in
                                        </ScrambleLink>
                                        {!("__TAURI__" in window) && (
                                            <a
                                                href="https://github.com/bradleyzaia/disciprin/releases/latest/download/Disciprin_aarch64.dmg"
                                                className="flex-1 py-4 md:py-6 text-center text-dark-theme-text hover:bg-white hover:text-grayscale0 transition-colors uppercase font-mono text-xs tracking-normal border-l border-dark-theme-border"
                                            >
                                                ↓ Download
                                            </a>
                                        )}
                                    </div>
                                    <ScrambleLink to="/signup" className="flex-1 py-4 md:py-6 text-center bg-white text-grayscale0 hover:bg-grayscale100 hover:text-dark-theme-text transition-colors uppercase">
                                        Lock In
                                    </ScrambleLink>
                                </>
                            )}
                        </div>
                    </GridCell>
                    <GridCell className="hidden md:block md:col-span-6 h-full border-l border-dark-theme-border p-0 backdrop-blur-none">
                        {/* Empty cell to maintain grid structure over the background */}
                    </GridCell>
                </GridRow>
            </MasterGrid>
        </div>
    )
}
