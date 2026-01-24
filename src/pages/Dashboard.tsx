import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, differenceInDays } from "date-fns"
import { ScrambleText } from "@/components/ui/scramble-text"
import { CalendarGrid, type CalendarView, type PillEntry } from "@/components/dashboard/CalendarGrid"
import { type PillDraft } from "@/lib/habit-config"
import { Drawer } from "@/components/ui/Drawer"
import { PillEditorCard } from "@/components/pills/PillEditorCard"
import { X, Check, Trash2, Plus } from "lucide-react"
import { type Pill } from "@/components/dashboard/CalendarGrid"
import { cn } from "@/lib/utils"

export function Dashboard() {
    const [view, setView] = useState<CalendarView>('week')
    // We can track a "current focused date" if we want to navigate (previous/next week), 
    // but for now let's stick to "today" as the anchor or just use current date.
    const [currentDate, setCurrentDate] = useState(new Date())

    const createPill = useMutation(api.pills.createPill.default)
    const updateEntry = useMutation(api.pills.logPillEntry.default)
    const updatePillMutation = useMutation(api.pills.item.updatePill)
    const archivePillMutation = useMutation(api.pills.item.archivePill)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [editingPill, setEditingPill] = useState<Pill | null>(null)
    const [pillDraft, setPillDraft] = useState<PillDraft>({
        name: "",
        measurement_type: "boolean",
        target_value: 1,
        frequency_per_week: 3,
        unit: ""
    })

    const user = useQuery(api.users.getUser)
    // Calculate Date Range for Query based on current view
    const { startDate, endDate, viewDate } = useMemo(() => {
        let start = new Date()
        let end = new Date()
        let gridStart = new Date(currentDate) // Default to current date for other views

        switch (view) {
            case 'week':
                // Align Grid and Query to User's Start Day
                start = startOfWeek(currentDate, { weekStartsOn: 0 })
                end = endOfWeek(currentDate, { weekStartsOn: 0 })
                gridStart = start
                break;
            case 'month':
                start = startOfMonth(currentDate)
                end = endOfMonth(currentDate)
                gridStart = currentDate // Month view handles its own startOfMonth logic internally
                break;
        }

        return {
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd'),
            viewDate: gridStart
        }
    }, [view, currentDate])


    const data = useQuery(api.getDashboardData.default, { startDate, endDate })

    const handleEntryUpdate = async (entry: PillEntry) => {
        try {
            await updateEntry({
                pill_id: entry.pill_id as any, // Convex ID casting
                date: entry.date,
                value: entry.value,
                is_completed: entry.is_completed
            })
        } catch (error) {
            console.error("Failed to update entry:", error)
        }
    }

    const handleAddPillClick = () => {
        setEditingPill(null)
        setPillDraft({
            name: "",
            measurement_type: "boolean",
            target_value: 1,
            frequency_per_week: 3,
            unit: ""
        })
        setIsDrawerOpen(true)
    }

    const handlePillClick = (pill: Pill) => {
        setEditingPill(pill)
        setPillDraft({
            name: pill.name,
            measurement_type: pill.measurement_type,
            target_value: pill.target_value,
            frequency_per_week: pill.frequency_per_week,
            unit: pill.unit || ""
        })
        setIsDrawerOpen(true)
    }

    const handleSavePill = async () => {
        if (!pillDraft.name) return
        setIsDrawerOpen(false)

        try {
            if (editingPill) {
                await updatePillMutation({
                    id: editingPill.id as any,
                    name: pillDraft.name,
                    target_value: pillDraft.target_value,
                    frequency_per_week: pillDraft.frequency_per_week,
                    category: pillDraft.category
                })
            } else {
                await createPill(pillDraft)
            }
        } catch (error) {
            console.error("Failed to save pill:", error)
        }
    }

    const handleArchivePill = async () => {
        if (!editingPill) return
        if (window.confirm("Archive this pill? It will stop appearing in your dashboard.")) {
            setIsDrawerOpen(false)
            try {
                await archivePillMutation({ id: editingPill.id as any })
            } catch (error) {
                console.error("Failed to archive pill:", error)
            }
        }
    }

    const pills = data?.pills || []
    const entries = data?.entries || []

    // Calculate generic stats based on loaded data
    const compliance = useMemo(() => {
        if (!data || pills.length === 0) return 0

        const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date()

        // Calculate days to count for expectation (up to today if in current period)
        let effectiveEnd = end
        if (now < end) {
            effectiveEnd = now
        }

        const daysInView = Math.max(0, differenceInDays(effectiveEnd, start) + 1)

        if (daysInView === 0) return 0

        // Calculate total expected completions based on frequency
        // frequency_per_week is 1-7. 
        // Expected per day = frequency / 7
        const totalExpected = pills.reduce((acc, pill) => {
            return acc + (pill.frequency_per_week / 7) * daysInView
        }, 0)

        const completed = entries.reduce((acc, entry) => {
            const pill = pills.find(p => p.id === entry.pill_id)
            if (!pill) return acc

            if (pill.measurement_type === 'boolean') {
                return acc + (entry.is_completed ? 1 : 0)
            } else {
                // For numeric types, use the ratio but cap at 1.0 per day to prevent 
                // over-completing in a single day from distorting the weekly compliance average
                return acc + Math.min(1, entry.value / pill.target_value)
            }
        }, 0)

        if (totalExpected === 0) return 0

        return Math.round((completed / totalExpected) * 100)
    }, [pills, entries, startDate, endDate])

    return (
        <MasterGrid>
            <Navbar />
            <GridRow>
                <GridCell rows={2} span={2}>
                    <p className="text-xs text-dark-theme-text uppercase"><ScrambleText text="User" /></p>
                    <p className="text-xl font-mono tracking-normal truncate" title={user?.name}>
                        <ScrambleText text={user?.name || '...'} />
                    </p>
                </GridCell>
                <GridCell rows={2} span={3}>
                    <p className="text-xs text-dark-theme-text uppercase"><ScrambleText text=" this week " /></p>
                    <p className="text-5xl font-mono tracking-normal">
                        <ScrambleText text={`${compliance}%`} />
                    </p>
                </GridCell>
                <GridCell rows={2} span={3}>
                    <p className="text-xs text-dark-theme-text uppercase"><ScrambleText text="current streak" /></p>
                    <p className="text-5xl font-mono tracking-normal flex items-baseline">
                        <ScrambleText text={(data?.globalStreak ?? 0).toString()} />
                        <span className="ml-4 uppercase">Wk</span>
                    </p>
                </GridCell>
                <GridCell rows={2} span={3}>
                    <p className="text-xs text-dark-theme-text uppercase"><ScrambleText text="Period" /></p>
                    <p className="text-5xl font-mono tracking-normal">
                        <ScrambleText text={view === 'week' ? `W${format(startDate, 'w')}-${format(startDate, 'RRRR')}` :
                            format(currentDate, 'MMM yyyy').toUpperCase()} />
                    </p>
                </GridCell>
                <GridCell span={1} className="p-0">
                    <button
                        onClick={handleAddPillClick}
                        className="w-full h-full flex items-center justify-center bg-white hover:!bg-green transition-colors group"
                    >
                        <Plus className="w-12 h-12 text-black" />
                    </button>
                </GridCell>
            </GridRow>

            <GridRow className="flex-1">
                <GridCell span={12} className="min-h-[600px] p-0 flex flex-col">
                    {data === undefined ? (
                        <div className="flex-1 flex items-center justify-center">
                            <span className="animate-pulse"><ScrambleText text="Loading data..." /></span>
                        </div>
                    ) : (
                        <CalendarGrid
                            pills={pills}
                            entries={entries}
                            currentDate={viewDate}
                            view={view}
                            onViewChange={setView}
                            onDateChange={setCurrentDate}
                            onEntryUpdate={handleEntryUpdate}
                            onPillClick={handlePillClick}
                        />
                    )}
                </GridCell>
            </GridRow>
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                className="bg-black"
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-dark-theme-border p-4 bg-black text-dark-theme-text shrink-0">
                        <span className="font-mono text-lg uppercase">
                            <ScrambleText text={editingPill ? `EDIT PILL: ${editingPill.name}` : "NEW PILL"} />
                        </span>
                        <button onClick={() => setIsDrawerOpen(false)} className="hover:opacity-70">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1">
                        <PillEditorCard
                            pill={pillDraft}
                            index={0}
                            onUpdate={(fieldOrUpdates, value) => {
                                const updates = typeof fieldOrUpdates === 'string'
                                    ? { [fieldOrUpdates]: value }
                                    : fieldOrUpdates
                                setPillDraft(prev => ({ ...prev, ...updates }))
                            }}
                            className="border-0"
                        />
                    </div>

                    {/* Footer */}
                    <div className="grid grid-cols-12 border-t border-dark-theme-border shrink-0">
                        {editingPill && (
                            <button
                                type="button"
                                onClick={handleArchivePill}
                                className="col-span-2 p-4 border-r border-dark-theme-border hover:bg-red/10 text-red font-mono text-xs uppercase flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Archive
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className={cn(
                                "p-4 border-r border-dark-theme-border hover:bg-grayscale100 hover:text-grayscale0 transition-colors font-mono text-xs uppercase",
                                editingPill ? "col-span-4" : "col-span-6"
                            )}
                        >
                            CANCEL
                        </button>
                        <button
                            type="button"
                            onClick={handleSavePill}
                            className={cn(
                                "p-4 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase flex items-center justify-center gap-2",
                                editingPill ? "col-span-6" : "col-span-6"
                            )}
                        >
                            <Check className="w-4 h-4" />
                            {editingPill ? "Save Changes" : "Create Pill"}
                        </button>
                    </div>
                </div>
            </Drawer>
        </MasterGrid>
    )
}
