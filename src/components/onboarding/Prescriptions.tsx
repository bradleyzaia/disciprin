import { useMemo } from "react"
import { HABIT_CONFIG } from "@/lib/habit-config"
import { Button } from "@/components/ui/Button"
import { ScrambleText } from "@/components/ui/ScrambleText"
import { cn } from "@/lib/utils"

interface PrescriptionsProps {
    onSelect?: (name: string) => void
    onClose: () => void
    className?: string
}

export function Prescriptions({ onSelect, onClose, className }: PrescriptionsProps) {
    const categories = useMemo(() => {
        const grouped: Record<string, Array<{ name: string; config: typeof HABIT_CONFIG[string] }>> = {}

        Object.entries(HABIT_CONFIG).forEach(([name, config]) => {
            if (!grouped[config.category]) {
                grouped[config.category] = []
            }
            grouped[config.category].push({ name, config })
        })

        return grouped
    }, [])

    return (
        <div className={cn("flex-1 flex flex-col p-8 bg-black h-full overflow-hidden", className)}>
            <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-4xl font-display uppercase">
                    <ScrambleText text="Prescriptions" />
                </h2>
                <Button variant="outline" size="sm" onClick={onClose}>
                    X
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                        <h3 className="text-green text-xs font-mono uppercase sticky top-0 bg-black py-2 border-b border-dark-theme-border z-10">
                            {category}
                        </h3>
                        <div className="space-y-2">
                            {items.map(({ name, config }) => (
                                <button
                                    key={name}
                                    onClick={() => onSelect?.(name)}
                                    className="w-full text-left group hover:bg-white/5 p-2 transition-colors border border-transparent hover:border-dark-theme-border flex flex-col gap-1"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-sm font-mono text-dark-theme-text group-hover:text-white transition-colors">
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-dark-theme-text/40 group-hover:text-dark-theme-text/80 transition-colors uppercase">
                                            {config.frequency_per_week}x/WK
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-dark-theme-text/40 group-hover:text-dark-theme-text/60 truncate w-full uppercase">
                                        {config.target_value} {config.unit} • {config.measurement_type}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
