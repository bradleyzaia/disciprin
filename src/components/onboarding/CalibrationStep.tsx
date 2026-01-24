import { Label } from "@/components/ui/Label"

interface CalibrationStepProps {
    weekStartDay: "sunday" | "monday" | string
    onChange: (day: "sunday" | "monday") => void
}

export const CalibrationStep = ({ weekStartDay, onChange }: CalibrationStepProps) => {
    return (
        <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10">
            <div className="space-y-8">
                <div className="space-y-4">
                    <Label htmlFor="week-start">Week Start Day</Label>
                    <div className="grid grid-cols-2 gap-0 border border-black/50">
                        <button
                            onClick={() => onChange("sunday")}
                            className={`h-16 border-r border-black/50 font-mono text-sm uppercase transition-colors cursor-pointer ${weekStartDay === "sunday"
                                    ? "bg-foreground text-background"
                                    : "bg-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Sunday
                        </button>
                        <button
                            onClick={() => onChange("monday")}
                            className={`h-16 font-mono text-sm uppercase transition-colors cursor-pointer ${weekStartDay === "monday"
                                    ? "bg-foreground text-background"
                                    : "bg-transparent text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Monday
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
