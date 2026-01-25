import { useState, useEffect } from "react"
import { useSignUp, useAuth } from "@clerk/clerk-react"
import { useNavigate, Link } from "react-router-dom"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { EffectScene } from "@/components/effect-scene"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

export function Signup() {
    const { isLoaded: signUpLoaded, signUp, setActive } = useSignUp()
    const { isLoaded: authLoaded, isSignedIn } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState("")
    const [verifying, setVerifying] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (authLoaded && isSignedIn) {
            navigate("/dashboard")
        }
    }, [authLoaded, isSignedIn, navigate])

    if (!signUpLoaded || !authLoaded) {
        return null
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await signUp?.create({
                emailAddress: email,
                password,
            })

            await signUp?.prepareEmailAddressVerification({ strategy: "email_code" })
            setVerifying(true)
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    async function handleVerification(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const completeSignUp = await signUp?.attemptEmailAddressVerification({
                code,
            })

            if (completeSignUp?.status === "complete") {
                await setActive?.({ session: completeSignUp.createdSessionId })
                navigate("/onboarding")
            } else {
                console.error(JSON.stringify(completeSignUp, null, 2))
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Invalid code")
        } finally {
            setLoading(false)
        }
    }

    const handleSocialLogin = async (strategy: "oauth_google" | "oauth_github") => {
        setError("")
        try {
            await signUp?.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/onboarding",
            })
        } catch (err: any) {
            console.error("Social signup error:", err)
            setError(err.errors?.[0]?.message || "Social signup failed")
        }
    }

    return (
        <div className="relative h-[100dvh] w-full flex flex-col overflow-hidden bg-background">
            <div className="fixed inset-0 z-0">
                <EffectScene />
            </div>
            <MasterGrid className="relative z-10 w-full bg-transparent pointer-events-none h-full border-l-0 md:border-l border-r-0 border-dark-theme-border">
                <GridRow className="flex-1 flex flex-col md:grid">
                    {/* Mobile Spacer for Top Half Scene */}
                    <GridCell className="col-span-12 flex-1 md:hidden border-b border-dark-theme-border p-0 backdrop-blur-none bg-transparent" />

                    <GridCell className="col-span-12 md:col-span-6 h-auto md:h-full flex flex-col justify-end md:justify-center items-start pointer-events-auto backdrop-blur-md bg-grayscale0/20 md:bg-transparent p-4 md:p-8">
                        <div className="w-full max-w-md space-y-8">
                            {!verifying ? (
                                <>
                                    <div className="space-y-2">
                                        <h1 className="font-display text-3xl uppercase text-dark-theme-text tracking-normal">
                                            PATIENT INTAKE
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
                                            {loading ? "INITIALIZING..." : "LOCK IN"}
                                        </Button>
                                    </form>

                                    <div className="pt-4 flex flex-col items-start gap-2">
                                        <p className="text-zinc-500 font-mono text-xs uppercase">
                                            ALREADY HAVE AN ACCOUNT?
                                        </p>
                                        <Link
                                            to="/login"
                                            className="text-dark-theme-text hover:text-zinc-300 font-mono text-xs uppercase underline underline-offset-4 decoration-white/50"
                                        >
                                            LOG IN
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleVerification} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <h1 className="font-display text-3xl uppercase text-dark-theme-text tracking-normal">
                                            VERIFY EMAIL
                                        </h1>
                                        <p className="font-mono text-xs uppercase text-zinc-500">
                                            WE SENT A CODE TO {email}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="uppercase font-mono text-xs text-zinc-500">VERIFICATION CODE</Label>
                                        <Input
                                            type="text"
                                            placeholder="123456"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            required
                                            maxLength={6}
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red font-mono text-[10px] uppercase">{error}</p>
                                    )}

                                    <div className="space-y-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="w-full h-12"
                                            disabled={loading}
                                            showScramble={true}
                                        >
                                            {loading ? "VERIFYING..." : "CONFIRM VERIFICATION"}
                                        </Button>
                                        <button
                                            type="button"
                                            onClick={() => setVerifying(false)}
                                            className="w-full text-zinc-500 hover:text-white font-mono text-[10px] uppercase transition-colors"
                                        >
                                            BACK TO SIGNUP
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </GridCell>
                    <GridCell className="hidden md:block md:col-span-6 h-full border-l border-dark-theme-border p-0 backdrop-blur-none" />
                </GridRow>
            </MasterGrid>
        </div>
    )
}
