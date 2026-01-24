import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { EffectScene } from "@/components/effect-scene"
import { SignUp } from "@clerk/clerk-react"

export function Signup() {
    return (
        <div className="relative min-h-screen bg-background">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>
            <MasterGrid className="relative z-10 bg-transparent pointer-events-none h-screen">
                <GridRow className="h-full">
                    <GridCell span={12} className="social-only-signup h-full flex flex-col justify-center items-center pointer-events-auto bg-background/80 backdrop-blur-sm p-8">
                        <SignUp
                            path="/signup"
                            routing="path"
                            signInUrl="/login"
                            forceRedirectUrl="/onboarding"
                            appearance={{
                                elements: {
                                    rootBox: "w-full max-w-md",
                                    card: "rounded-none shadow-none border border-black/20 bg-white/50 backdrop-blur-md",
                                    headerTitle: "uppercase font-display",
                                    headerSubtitle: "text-muted-foreground font-mono text-xs",
                                    formButtonPrimary: "bg-black text-white hover:bg-gray-800 uppercase rounded-none font-mono text-xs h-10",
                                    footerActionLink: "text-black hover:text-gray-600 font-mono text-xs uppercase underline-offset-4",
                                    formFieldInput: "rounded-none border-black/20 focus:ring-black focus:border-black bg-transparent font-mono text-sm",
                                    formFieldLabel: "uppercase font-mono text-xs text-muted-foreground",
                                    socialButtonsBlockButton: "rounded-none border-black/20 uppercase font-mono text-xs hover:bg-black/5",
                                    dividerLine: "bg-black/10",
                                    dividerText: "uppercase font-mono text-[10px] text-muted-foreground"
                                }
                            }}
                        />
                    </GridCell>
                </GridRow>
            </MasterGrid>
        </div>
    )
}
