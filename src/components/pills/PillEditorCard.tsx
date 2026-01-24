import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"
import { SelectionModal } from "@/components/ui/SelectionModal"
import { AsciiPillCanvas } from "@/components/ascii-pill-canvas"
import { HABIT_CONFIG, HABIT_OPTIONS, type PillDraft } from "@/lib/habit-config"

interface PillEditorCardProps {
    pill: PillDraft
    index: number
    onUpdate: (field: keyof PillDraft, value: any) => void
    className?: string
}

export function PillEditorCard({ pill, index, onUpdate, className }: PillEditorCardProps) {


    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)

    const handleNameChange = (value: string) => {
        const upperValue = value.toUpperCase()
        const config = HABIT_CONFIG[upperValue]

        if (config) {
            // Apply preset config, but keep the name as typed if it matches
            // We need to call onUpdate for each field or spread it.
            // Since onUpdate takes key/value, we might need a way to bulk update 
            // OR the parent handles single updates.
            // Let's assume onUpdate handles single field. 
            // BUT here we want to update multiple fields. 
            // To keep it simple, let's just update 'name' and let the parent handle the side-effect logic 
            // OR we change the interface to allow full object update?
            // The original code did:
            // if (field === "name") { apply config... }
            // So we should just pass the name update, and let the parent do the logic?
            // No, we want to encapsulate logic here? 
            // Actually, in re-reading the original code, the parent `updatePill` function had the logic.
            // "if (field === "name") { const config = ... }"

            // To make this component dumb, we should just fire onChange.
            // BUT if we want to reuse this logic, we should probably duplicate it here 
            // or bubble up a "replacePill" event.

            // Let's stick to the original pattern: The parent passes an `onUpdate` that takes (field, value).
            // But wait, if I select "RUN", I need to update type, target, unit etc.
            // If `onUpdate` only takes one field, I can't do that easily unless I call it multiple times.
            // Better: have `onPillChange(newPill: PillDraft)`
        }
        onUpdate("name", upperValue)
    }

    return (
        <div className={className}>
            <div className="hover:bg-black/5 transition-colors border-b lg:border-b-0 lg:border-r border-black/50 relative">

                <div className="w-full h-32 border-b border-black/10 bg-white overflow-hidden relative">
                    <AsciiPillCanvas className="w-full h-full" />
                    <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-white px-1">
                        PILL {String(index + 1).padStart(2, '0')}
                    </div>
                </div>

                <div className="space-y-4 p-6">

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <Label>Habit</Label>
                            <button
                                type="button"
                                onClick={() => setIsSuggestionsOpen(true)}
                                className="text-[10px] uppercase tracking-wider flex items-center gap-1 hover:text-neutral-500 transition-colors"
                            >
                                <Sparkles className="w-3 h-3" />
                                Suggestions
                            </button>
                        </div>
                        <Input
                            value={pill.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="NAME"
                            className="h-10 text-xs border-black/50 focus-visible:ring-black"
                        />
                    </div>

                    <div>
                        <Label>Type</Label>
                        <Select
                            value={pill.measurement_type}
                            onChange={(value) => onUpdate("measurement_type", value)}
                            className="h-10 text-xs border-black/50 focus-visible:ring-black"
                            options={[
                                { label: "PASS/FAIL", value: "boolean" },
                                { label: "QUANTITY", value: "quantity" },
                                { label: "TIME", value: "time" },
                            ]}
                        />
                    </div>

                    {pill.measurement_type !== 'boolean' && (
                        <div className="grid grid-cols-2 gap-0">
                            <div>
                                <Label>Target</Label>
                                <Input
                                    type="number"
                                    hideSteppers
                                    value={pill.target_value}
                                    onChange={(e) => onUpdate("target_value", parseInt(e.target.value) || 0)}
                                    className="h-10 text-xs border-black/50 focus-visible:ring-black border-r-0 focus-visible:ring-inset focus-visible:ring-offset-0 z-10 relative"
                                />
                            </div>
                            <div>
                                <Label>Unit</Label>
                                <Input
                                    value={pill.unit || ""}
                                    onChange={(e) => onUpdate("unit", e.target.value.toUpperCase())}
                                    placeholder={pill.measurement_type === 'time' ? 'MIN' : 'UNIT'}
                                    className="h-10 text-xs border-black/50 focus-visible:ring-black -ml-px focus-visible:ring-inset focus-visible:ring-offset-0 z-0 relative focus:z-20"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <Label>doses per week</Label>
                        <Input
                            type="number"
                            min={1}
                            max={7}
                            value={pill.frequency_per_week}
                            onChange={(e) => onUpdate("frequency_per_week", parseInt(e.target.value) || 1)}
                            className="h-10 text-xs border-black/50 focus-visible:ring-black"
                        />
                    </div>
                </div>
            </div>

            <SelectionModal
                isOpen={isSuggestionsOpen}
                onClose={() => setIsSuggestionsOpen(false)}
                onConfirm={(value) => {
                    handleNameChange(value)
                    setIsSuggestionsOpen(false)
                }}
                options={HABIT_OPTIONS}
                title="SELECT PRESET"
            />
        </div>
    )
}
