import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { IdentityStep } from "@/components/onboarding/IdentityStep"
import { SynchronizationStep } from "@/components/onboarding/SynchronizationStep"
import { CalibrationStep } from "@/components/onboarding/CalibrationStep"
import { ProtocolDefinitionStep } from "@/components/onboarding/ProtocolDefinitionStep"
import { HABIT_CONFIG, type PillDraft } from "@/lib/habit-config"
import { InitializationStep } from "@/components/onboarding/InitializationStep"


type OnboardingData = {
    name: string
    timezone: string
    week_start_day: "sunday" | "monday" | string
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
        week_start_day: "sunday",
        pills: [
            { ...HABIT_CONFIG["DRINK WATER"], name: "DRINK WATER" },
            { ...HABIT_CONFIG["READ"], name: "READ" },
            { ...HABIT_CONFIG["EXERCISE"], name: "EXERCISE" },
        ],
    })

    const handleNext = async () => {
        if (step < 5) {
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
                    week_start_day: data.week_start_day,
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
        <MasterGrid className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Header Row */}
            <GridRow cols={12} className="border-b border-black/50">
                <GridCell span={8} className="border-r border-black/50 py-8 px-8">
                    <h1 className="text-4xl font-display uppercase tracking-normal">Onboarding</h1>
                </GridCell>
                <GridCell span={4} className="py-8 px-8 flex items-center justify-end text-right">
                    <div className="text-xs text-muted-foreground">
                        STEP {step.toString().padStart(2, '0')} / 05
                    </div>
                </GridCell>
            </GridRow>

            {/* Progress Bar */}
            <GridRow cols={5} className="h-1 border-b border-black/50">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`h-full border-r border-black/50 ${s <= step ? 'bg-foreground' : 'bg-transparent'}`} />
                ))}
            </GridRow>

            {/* Content Area */}
            <GridRow cols={12} className="flex-1 min-h-[500px] border-b-0">
                <GridCell span={12} className={`border-r-0 flex flex-col justify-center relative overflow-hidden ${step === 5 ? "p-0" : "p-12 md:p-20"}`}>

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
                        <CalibrationStep
                            weekStartDay={data.week_start_day}
                            onChange={(day) => setData({ ...data, week_start_day: day })}
                        />
                    )}

                    {step === 4 && (
                        <ProtocolDefinitionStep
                            pills={data.pills}
                            onUpdatePills={(pills) => setData({ ...data, pills })}
                        />
                    )}

                    {step === 5 && (
                        <InitializationStep
                            data={data}
                            onNext={handleNext}
                            isSubmitting={isSubmitting}
                        />
                    )}

                </GridCell>
            </GridRow>

            {/* Footer Navigation */}
            {step < 5 && (
                <GridRow cols={12} className="border-t border-black/50 border-b-0 sticky bottom-0 bg-background z-10 transition-colors">
                    <GridCell span={6} className="border-r border-black/50 p-0">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className="w-full h-20 flex items-center justify-center uppercase hover:bg-black/5 disabled:opacity-20 disabled:hover:bg-transparent transition-colors font-mono text-sm cursor-pointer"
                        >
                            Back
                        </button>
                    </GridCell>
                    <GridCell span={6} className="p-0">
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !data.name}
                            className="w-full h-20 flex items-center justify-center uppercase bg-black/5 hover:bg-foreground text-foreground hover:text-background transition-all disabled:opacity-50 disabled:hover:bg-black/5 disabled:hover:text-foreground font-mono text-sm tracking-widest cursor-pointer"
                        >
                            <span>{step === 4 ? "begin treatment" : "Next Step"}</span>
                        </button>
                    </GridCell>
                </GridRow>
            )}
        </MasterGrid>
    )
}
