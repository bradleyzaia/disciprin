
import { PillEditorCard } from "@/components/pills/PillEditorCard"
import { HABIT_CONFIG, type PillDraft } from "@/lib/habit-config"


interface ProtocolDefinitionStepProps {
    pills: PillDraft[]
    onUpdatePills: (pills: PillDraft[]) => void
}

export const ProtocolDefinitionStep = ({ pills, onUpdatePills }: ProtocolDefinitionStepProps) => {

    const updatePill = (index: number, field: keyof PillDraft, value: any) => {
        const newPills = [...pills]

        if (field === "name") {
            const config = HABIT_CONFIG[value]
            if (config) {
                newPills[index] = {
                    name: value,
                    ...config
                }
            } else {
                newPills[index] = { ...newPills[index], name: value }
            }
        } else {
            newPills[index] = { ...newPills[index], [field]: value }
        }
        onUpdatePills(newPills)
    }



    return (
        <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10">
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 border border-black/50">
                    {pills.map((pill, idx) => (
                        <PillEditorCard
                            key={idx}
                            pill={pill}
                            index={idx}
                            onUpdate={(field, value) => updatePill(idx, field, value)}
                        />
                    ))}

                </div>
            </div>
        </div>
    )
}
