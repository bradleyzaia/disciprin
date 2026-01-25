import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Label } from "@/components/ui/Label"
import { AsciiPillCanvas } from "@/components/ascii-pill-canvas"
import type { PillDraft } from "@/lib/habit-config"

interface PillEditorCardProps {
    pill: PillDraft
    index: number
    onUpdate: (fieldOrUpdates: keyof PillDraft | Partial<PillDraft>, value?: any) => void
    onHelpClick?: () => void
    className?: string
}

export function PillEditorCard({ pill, index, onUpdate, onHelpClick, className }: PillEditorCardProps) {
    const handleNameChange = (value: string) => {
        const upperValue = value.toUpperCase()
        onUpdate("name", upperValue)
    }

    const handleTypeChange = (value: string) => {
        if (value === 'time') {
            onUpdate({
                measurement_type: 'time',
                target_value: 60,
                unit: 'MIN'
            })
        } else if (value === 'boolean') {
            onUpdate({
                measurement_type: 'boolean',
                target_value: 1,
                unit: ''
            })
        } else if (value === 'quantity') {
            onUpdate({
                measurement_type: 'quantity',
                unit: ''
            })
        } else {
            onUpdate("measurement_type", value)
        }
    }

    return (
        <div className={cn(className)}>
            <div className="relative flex flex-col md:flex-row min-h-[11rem] h-auto md:h-44">

                <div className="w-full md:w-48 h-32 md:h-full border-b md:border-b-0 md:border-r border-dark-theme-border bg-black overflow-hidden relative shrink-0">
                    <AsciiPillCanvas className="w-full h-full" />
                    <div className="absolute top-2 left-2 text-[10px] uppercase tracking-widest text-dark-theme-text px-1">
                        PILL {String(index + 1).padStart(2, '0')}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-start mb-6 md:mb-0 border-b border-dark-theme-border">

                    <div className="col-span-1 md:col-span-4 relative">
                        <Label className="mb-2 block">Pill</Label>
                        <Input
                            value={pill.name ?? ""}
                            onChange={(e) => handleNameChange(e.target.value)}
                            onHelpClick={onHelpClick}
                            placeholder="NAME"
                            className={cn(
                                "h-10 text-xs border-dark-theme-border focus-visible:ring-white/50"
                            )}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        <Label className="mb-2 block">Type</Label>
                        <Select
                            value={pill.measurement_type ?? ""}
                            onChange={handleTypeChange}
                            className="h-10 text-xs border-dark-theme-border focus-visible:ring-white/50"
                            options={[
                                { label: "TIME", value: "time" },
                                { label: "QUANTITY", value: "quantity" },
                                { label: "PASS/FAIL", value: "boolean" },
                            ]}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-3">
                        {pill.measurement_type !== 'boolean' && (
                            <>
                                <Label className="mb-2 block">Target</Label>
                                <div className="flex gap-0">
                                    <Input
                                        type="number"
                                        hideSteppers
                                        min={1}
                                        value={pill.target_value ?? ""}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1
                                            onUpdate("target_value", Math.max(1, val))
                                        }}
                                        className="h-10 text-xs border-dark-theme-border focus-visible:ring-white/50 border-r-0 focus-visible:ring-inset focus-visible:ring-offset-0 z-10 relative"
                                    />
                                    <Input
                                        value={pill.unit || ""}
                                        onChange={(e) => onUpdate("unit", e.target.value.toUpperCase())}
                                        placeholder={pill.measurement_type === 'time' ? 'MIN' : 'UNIT'}
                                        className="h-10 text-xs border-dark-theme-border focus-visible:ring-white/50 -ml-px focus-visible:ring-inset focus-visible:ring-offset-0 z-0 relative focus:z-20"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <Label className="mb-2 block">Doses/Wk</Label>
                        <Input
                            type="number"
                            min={1}
                            max={7}
                            value={pill.frequency_per_week ?? ""}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 3
                                onUpdate("frequency_per_week", Math.min(Math.max(1, val), 7))
                            }}
                            className="h-10 text-xs border-dark-theme-border focus-visible:ring-white/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
