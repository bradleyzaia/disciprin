import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { IdentityStep } from "@/components/onboarding/IdentityStep"
import { SynchronizationStep } from "@/components/onboarding/SynchronizationStep"
import { ProtocolDefinitionStep } from "@/components/onboarding/ProtocolDefinitionStep"
import { HABIT_CONFIG, type PillDraft } from "@/lib/habit-config"
import { InitializationStep } from "@/components/onboarding/InitializationStep"
import { OnboardingAsciiBackground } from "@/components/onboarding/OnboardingAsciiBackground"


type OnboardingData = {
    name: string
    timezone: string
    pills: PillDraft[]
}

export const Onboarding = () => {
    const navigate = useNavigate()
    const completeOnboarding = useMutation(api.completeOnboarding.default)
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [data, setData] = useState<OnboardingData>({
        name: "",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        pills: [
            { ...HABIT_CONFIG["GYM"], name: "GYM" },
        ],
    })

    const handleNext = async () => {
        if (step < 4) {
            setStep(step + 1)
        } else {
            // Final submit
            setIsSubmitting(true)
            try {
                // Save to local storage as backup/reference
                localStorage.setItem("disciprin_user", JSON.stringify(data))

                // Submit to Convex
                await completeOnboarding({
                    name: data.name,
                    timezone: data.timezone,
                    pills: data.pills.map(p => ({
                        name: p.name,
                        measurement_type: p.measurement_type,
                        target_value: p.target_value,
                        unit: p.unit,
                        frequency_per_week: p.frequency_per_week,
                        category: p.category
                    }))
                })

                console.log("Onboarding completed & persisted to Convex:", data)
                navigate("/dashboard")
            } catch (error) {
                console.error("Failed to complete onboarding:", error)
                setIsSubmitting(false)
                // Optionally handle error UI here
            }
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    return (
        <MasterGrid className="min-h-[100dvh] bg-background text-dark-theme-text selection:bg-primary selection:text-primary-foreground">
            {/* Header Row */}
            <GridRow cols={12} className="border-b border-dark-theme-border">
                <GridCell span={8} className="border-r border-dark-theme-border py-8 px-8">
                    <h1 className="text-4xl font-display uppercase tracking-normal">patient intake</h1>
                </GridCell>
                <GridCell span={4} className="py-8 px-8 flex items-center justify-end text-right">
                    <div className="text-xs text-dark-theme-text">
                        STEP {step.toString().padStart(2, '0')} / 04
                    </div>
                </GridCell>
            </GridRow>

            {/* Progress Bar */}
            <GridRow cols={4} className="h-1 border-b border-dark-theme-border">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`h-full border-r border-dark-theme-border ${s <= step ? 'bg-foreground' : 'bg-transparent'}`} />
                ))}
            </GridRow>

            {/* Content Area */}
            <GridRow cols={12} className="flex-1 min-h-[500px] border-b-0">
                <GridCell span={12} className={`border-r-0 flex flex-col justify-center relative overflow-hidden ${step === 4 ? "p-0" : "p-12 md:p-20"}`}>
                    <OnboardingAsciiBackground />

                    {step === 1 && (
                        <IdentityStep
                            name={data.name}
                            onChange={(name) => setData({ ...data, name })}
                        />
                    )}

                    {step === 2 && (
                        <SynchronizationStep
                            timezone={data.timezone}
                            onChange={(timezone) => setData({ ...data, timezone })}
                        />
                    )}


                    {step === 3 && (
                        <ProtocolDefinitionStep
                            pills={data.pills}
                            onUpdatePills={(pills) => setData(prev => ({ ...prev, pills }))}
                        />
                    )}

                    {step === 4 && (
                        <InitializationStep
                            data={data}
                            onNext={handleNext}
                            isSubmitting={isSubmitting}
                        />
                    )}

                </GridCell>
            </GridRow>

            {/* Footer Navigation */}
            {step < 4 && (
                <GridRow cols={12} className="border-t border-dark-theme-border border-b-0 sticky bottom-0 bg-background z-10 transition-colors">
                    <GridCell span={6} className="border-r border-dark-theme-border p-0">
                        <Button
                            onClick={handleBack}
                            disabled={step === 1}
                            variant="ghost"
                            className="w-full h-20 text-sm"
                        >
                            Back
                        </Button>
                    </GridCell>
                    <GridCell span={6} className="p-0">
                        <Button
                            onClick={handleNext}
                            disabled={(step === 1 && !data.name) || (step === 3 && data.pills.some(p => !p.name || p.frequency_per_week < 1 || p.frequency_per_week > 7 || (p.measurement_type !== 'boolean' && p.target_value < 1)))}
                            variant="primary"
                            icon={ArrowRight}
                            className="w-full h-20 text-sm"
                        >
                            {step === 3 ? "Complete Intake" : "Next Step"}
                        </Button>
                    </GridCell>
                </GridRow>
            )}
        </MasterGrid>
    )
}
