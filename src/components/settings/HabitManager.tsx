import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { GridRow, GridCell } from "@/components/layout/grid"
import { ScrambleText } from "@/components/ui/scramble-text"

export function HabitManager() {
    const pills = useQuery(api.pills.getPills.default)
    const archivePill = useMutation(api.pills.item.archivePill)

    const handleArchivePill = async (id: any) => {
        if (window.confirm("Archive this pill? It will stop appearing in your dashboard.")) {
            try {
                await archivePill({ id })
            } catch (e) {
                console.error(e)
                alert("Failed to archive pill")
            }
        }
    }

    return (
        <GridRow>
            <GridCell span={12} className="p-16 border-r-0 backdrop-blur-none bg-black/80">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-primary text-lg uppercase"><ScrambleText text="Active Pills" /></h3>
                </div>

                <div className="grid grid-cols-1 gap-0 border border-neutral-800">
                    {pills?.map((pill) => (
                        <div key={pill._id} className="flex justify-between items-center p-4 border-b border-neutral-800 last:border-b-0 hover:bg-neutral-900 transition-colors">
                            <div>
                                <span className="font-mono text-sm block">{pill.name}</span>
                                <span className="text-xs text-dark-theme-text uppercase">{pill.category} • Target: {pill.target_value} {pill.unit} • {pill.frequency_per_week}x/week</span>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleArchivePill(pill._id)}
                                    className="text-xs text-red hover:opacity-80 uppercase font-mono"
                                >
                                    [Archive]
                                </button>
                            </div>
                        </div>
                    ))}
                    {(!pills || pills.length === 0) && (
                        <div className="p-8 text-center text-dark-theme-text text-xs uppercase">
                            No active pills found.
                        </div>
                    )}
                </div>
            </GridCell>
        </GridRow>
    )
}
