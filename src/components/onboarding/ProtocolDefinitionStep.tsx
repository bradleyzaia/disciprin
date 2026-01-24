import { useState } from "react"
import { PillEditorCard } from "@/components/pills/PillEditorCard"
import { HABIT_CONFIG, type PillDraft } from "@/lib/habit-config"
import { ScrambleText } from "@/components/ui/ScrambleText"
import { Drawer } from "@/components/ui/Drawer"
import { Plus, X, Check } from "lucide-react"
import { Prescriptions } from "./Prescriptions"


interface ProtocolDefinitionStepProps {
    pills: PillDraft[]
    onUpdatePills: (pills: PillDraft[]) => void
}

export const ProtocolDefinitionStep = ({ pills, onUpdatePills }: ProtocolDefinitionStepProps) => {
    const [helpIndex, setHelpIndex] = useState<number | null>(null)
    const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
    const [newPillDraft, setNewPillDraft] = useState<PillDraft>({
        name: "",
        measurement_type: "boolean",
        target_value: 1,
        frequency_per_week: 3,
        unit: ""
    })
    const [isPrescriptionDrawerOpen, setIsPrescriptionDrawerOpen] = useState(false)

    const handleAddPillClick = () => {
        setNewPillDraft({
            name: "",
            measurement_type: "boolean",
            target_value: 1,
            frequency_per_week: 3,
            unit: ""
        })
        setIsAddDrawerOpen(true)
    }

    const handleSaveNewPill = () => {
        if (!newPillDraft.name) return
        onUpdatePills([...pills, newPillDraft])
        setIsAddDrawerOpen(false)
    }

    const updatePill = (index: number, fieldOrUpdates: keyof PillDraft | Partial<PillDraft>, value?: any) => {
        const updates = typeof fieldOrUpdates === 'string'
            ? { [fieldOrUpdates]: value }
            : fieldOrUpdates

        const newPills = [...pills]
        let updatedPill = { ...newPills[index], ...updates }

        if (updates.name) {
            const config = HABIT_CONFIG[updates.name]
            if (config) {
                updatedPill = { ...updatedPill, ...config }
            }
        }

        newPills[index] = updatedPill
        onUpdatePills(newPills)
    }

    return (
        <div className="max-w-5xl w-full mx-auto space-y-12 relative z-10">
            <div className="space-y-8">
                <div>
                    <div className="relative border-x border-t border-white/10 bg-white/5 text-xs text-dark-theme-text flex justify-between items-stretch">
                        <div className="p-8 pr-48">
                            <ScrambleText text="CHOOSE YOUR MEDICINE" />
                            <p className="mt-1 text-[10px] opacity-40 uppercase">One pill you know you should be taking every week.</p>
                        </div>
                        <div className="absolute top-0 bottom-0 right-0 h-full flex">
                            <button
                                onClick={() => setIsPrescriptionDrawerOpen(true)}
                                className="h-full aspect-square flex items-center justify-center bg-white border-r border-black/10 hover:!bg-green transition-colors group"
                            >
                                <span className="font-display font-bold text-lg text-black">Rx</span>
                            </button>
                            <button
                                onClick={handleAddPillClick}
                                className="h-full aspect-square flex items-center justify-center bg-white hover:!bg-green transition-colors group"
                            >
                                <Plus className="w-5 h-5 text-black" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 border-x border-b border-dark-theme-border divide-y divide-black/50">
                        {pills.map((pill, idx) => (
                            <PillEditorCard
                                key={idx}
                                pill={pill}
                                index={idx}
                                onUpdate={(fieldOrUpdates, value) => updatePill(idx, fieldOrUpdates, value)}
                                onHelpClick={() => setHelpIndex(idx)}
                            />
                        ))}

                    </div>
                </div>
            </div>

            <Drawer isOpen={helpIndex !== null} onClose={() => setHelpIndex(null)}>
                <Prescriptions
                    onClose={() => setHelpIndex(null)}
                    onSelect={(name) => {
                        if (helpIndex !== null) {
                            updatePill(helpIndex, "name", name)
                            setHelpIndex(null)
                        }
                    }}
                />
            </Drawer>

            <Drawer isOpen={isPrescriptionDrawerOpen} onClose={() => setIsPrescriptionDrawerOpen(false)}>
                <Prescriptions
                    onClose={() => setIsPrescriptionDrawerOpen(false)}
                    onSelect={(name) => {
                        const config = HABIT_CONFIG[name]
                        if (config) {
                            const defaults: Partial<PillDraft> = {
                                measurement_type: "boolean",
                                target_value: 1,
                                frequency_per_week: 3,
                                unit: ""
                            }
                            const newPill: PillDraft = {
                                name,
                                ...defaults,
                                ...config
                            } as PillDraft
                            onUpdatePills([...pills, newPill])
                        }
                        setIsPrescriptionDrawerOpen(false)
                    }}
                />
            </Drawer>

            <Drawer
                isOpen={isAddDrawerOpen}
                onClose={() => setIsAddDrawerOpen(false)}
                className="bg-black"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-dark-theme-border p-4 bg-black text-dark-theme-text shrink-0">
                        <span className="font-mono text-lg uppercase">
                            <ScrambleText text="ADD PILL" />
                        </span>
                        <button onClick={() => setIsAddDrawerOpen(false)} className="hover:opacity-70">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1">
                        <PillEditorCard
                            pill={newPillDraft}
                            index={pills.length}
                            onUpdate={(fieldOrUpdates, value) => {
                                const updates = typeof fieldOrUpdates === 'string'
                                    ? { [fieldOrUpdates]: value }
                                    : fieldOrUpdates

                                setNewPillDraft(prev => {
                                    let updated = { ...prev, ...updates }
                                    if (updates.name) {
                                        const config = HABIT_CONFIG[updates.name]
                                        if (config) {
                                            updated = { ...updated, ...config }
                                        }
                                    }
                                    return updated
                                })
                            }}
                            className="border-0"
                        />
                    </div>

                    {/* Footer */}
                    <div className="grid grid-cols-12 border-t border-dark-theme-border shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsAddDrawerOpen(false)}
                            className="p-4 col-span-6 border-r border-dark-theme-border hover:bg-grayscale100 hover:text-grayscale0 transition-colors font-mono text-xs uppercase"
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveNewPill}
                            className="p-4 col-span-6 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            CONFIRM
                        </button>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}
