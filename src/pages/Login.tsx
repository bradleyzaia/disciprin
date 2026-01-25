import { useState, useEffect } from "react"
import { useSignIn, useAuth } from "@clerk/clerk-react"
import { useNavigate, Link } from "react-router-dom"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { EffectScene } from "@/components/effect-scene"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"


export function Login() {
    const { isLoaded: signInLoaded, signIn, setActive } = useSignIn()
    const { isLoaded: authLoaded, isSignedIn } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && isSignedIn) {
            navigate("/dashboard")
        }
    }, [authLoaded, isSignedIn, navigate])

    if (!signInLoaded || !authLoaded) {
        return null
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn?.create({
                identifier: email,
                password,
            })

            if (result?.status === "complete") {
                await setActive?.({ session: result.createdSessionId })
                navigate("/dashboard")
            } else {
                console.error(JSON.stringify(result, null, 2))
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (strategy: "oauth_google" | "oauth_github") => {
        setError("")
        try {
            await signIn?.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            })
        } catch (err: any) {
            console.error("Social login error:", err)
            setError(err.errors?.[0]?.message || "Social login failed")
        }
    }

    return (
        <div className="relative min-h-screen bg-background">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>

            <MasterGrid className="relative z-10 bg-transparent pointer-events-none min-h-screen h-auto border-l border-r-0 border-dark-theme-border">
                <GridRow className="flex-1">
                    {/* Mobile Spacer for Top Half Scene */}
                    <GridCell className="col-span-12 h-[50vh] md:hidden border-b border-dark-theme-border p-0 backdrop-blur-none bg-transparent" />

                    <GridCell className="col-span-12 md:col-span-6 h-auto md:h-full flex flex-col justify-center items-start pointer-events-auto backdrop-blur-md bg-grayscale0/20 md:bg-transparent p-4 md:p-8">
                        <div className="w-full max-w-md space-y-8">
                            <div className="space-y-2">
                                <h1 className="font-display text-3xl text-dark-theme-text tracking-normal">
                                    Log in
                                </h1>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-10"
                                    onClick={() => handleSocialLogin("oauth_google")}
                                >
                                    CONTINUE WITH GOOGLE
                                </Button>
                                {/* 
                                <Button 
                                    variant="outline" 
                                    className="w-full h-10" 
                                    icon={Github}
                                    onClick={() => handleSocialLogin("oauth_github")}
                                >
                                    CONTINUE WITH GITHUB
                                </Button> 
                                */}
                            </div>

                            <div className="relative flex items-center gap-4">
                                <div className="h-[1px] flex-1 bg-white/20" />
                                <span className="font-mono text-[10px] text-zinc-500 uppercase">OR</span>
                                <div className="h-[1px] flex-1 bg-white/20" />
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="uppercase font-mono text-xs text-zinc-500">EMAIL ADDRESS</Label>
                                    <Input
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="uppercase font-mono text-xs text-zinc-500">PASSWORD</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-red font-mono text-[10px] uppercase">{error}</p>
                                )}

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full h-12"
                                    disabled={loading}
                                    showScramble={true}
                                >
                                    {loading ? "AUTHENTICATING..." : "CONTINUE"}
                                </Button>
                            </form>

                            <div className="pt-4 flex flex-col items-start gap-2">
                                <p className="text-zinc-500 font-mono text-xs uppercase">
                                    DON'T HAVE AN ACCOUNT?
                                </p>
                                <Link
                                    to="/signup"
                                    className="text-dark-theme-text hover:text-zinc-300 font-mono text-xs uppercase underline underline-offset-4 decoration-white/50"
                                >
                                    CREATE ACCOUNT
                                </Link>
                            </div>
                        </div>
                    </GridCell>
                    <GridCell className="hidden md:block md:col-span-6 h-full border-l border-dark-theme-border p-0 backdrop-blur-none" />
                </GridRow>
            </MasterGrid>
        </div>
    )
}
