import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { CalendarGrid, type CalendarView, type PillEntry } from "@/components/dashboard/CalendarGrid"
import { PillCreationModal } from "@/components/pills/PillCreationModal"
import { type PillDraft } from "@/lib/habit-config"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns"

export function Dashboard() {
    const [view, setView] = useState<CalendarView>('week')
    // We can track a "current focused date" if we want to navigate (previous/next week), 
    // but for now let's stick to "today" as the anchor or just use current date.
    const [currentDate, setCurrentDate] = useState(new Date())

    const createPill = useMutation(api.pills.createPill.default)
    const updateEntry = useMutation(api.pills.logPillEntry.default)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalOriginRect, setModalOriginRect] = useState<DOMRect | null>(null)

    const user = useQuery(api.users.getUser)
    const weekStartsOn = useMemo(() => {
        return user?.week_start_day === 'sunday' ? 0 : 1
    }, [user?.week_start_day])

    // Calculate Date Range for Query based on current view
    const { startDate, endDate, viewDate } = useMemo(() => {
        let start = new Date()
        let end = new Date()
        let gridStart = new Date(currentDate) // Default to current date for other views

        switch (view) {
            case 'week':
                // Align Grid and Query to User's Start Day
                start = startOfWeek(currentDate, { weekStartsOn: weekStartsOn as 0 | 1 })
                end = endOfWeek(currentDate, { weekStartsOn: weekStartsOn as 0 | 1 })
                gridStart = start
                break;
            case 'month':
                start = startOfMonth(currentDate)
                end = endOfMonth(currentDate)
                gridStart = currentDate // Month view handles its own startOfMonth logic internally
                break;
            case 'quarter':
                const currentMonth = currentDate.getMonth()
                const quarterStartMonth = Math.floor(currentMonth / 3) * 3
                start = new Date(currentDate.getFullYear(), quarterStartMonth, 1)
                end = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0)
                gridStart = currentDate
                break;
            case 'year':
                start = startOfYear(currentDate)
                end = endOfYear(currentDate)
                gridStart = currentDate
                break;
        }

        return {
            startDate: format(start, 'yyyy-MM-dd'),
            endDate: format(end, 'yyyy-MM-dd'),
            viewDate: gridStart
        }
    }, [view, currentDate, weekStartsOn])

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

    const handleAddPillClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setModalOriginRect(rect)
        setIsModalOpen(true)
    }

    const handleCreatePill = async (newPill: PillDraft) => {
        setIsModalOpen(false)
        try {
            await createPill(newPill)
        } catch (error) {
            console.error("Failed to create pill:", error)
        }
    }

    const pills = data?.pills || []
    const entries = data?.entries || []

    // Calculate generic stats based on loaded data
    const compliance = useMemo(() => {
        if (!data || pills.length === 0) return 0
        // Simple "completed" count for now
        // Ideally we compare against (frequency_per_week * num_weeks_in_range)
        // usage of mock data had 0%, let's return 0 if no entries logic is robust yet
        const completed = entries.filter(e => e.is_completed).length
        return completed > 0 ? "~" : 0;
    }, [pills, entries])

    return (
        <MasterGrid>
            <Navbar />
            <GridRow flex="pass">
                <GridCell className="h-40 w-[240px] flex-none flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground uppercase">User</p>
                    <p className="text-xl font-mono tracking-normal truncate" title={user?.name}>{user?.name || '...'}</p>
                </GridCell>
                <GridCell className="h-40 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground uppercase">Weekly Compliance</p>
                    <p className="text-5xl font-mono tracking-normal">{compliance}%</p>
                </GridCell>
                <GridCell className="h-40 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-muted-foreground uppercase">Active Streak</p>
                    <p className="text-5xl font-mono tracking-normal">
                        {pills.length > 0 ? Math.max(0, ...pills.map(p => p.current_streak)) : 0}
                    </p>
                </GridCell>
                <GridCell className="h-40 flex-1 flex flex-row justify-between p-0">
                    <div className="flex flex-col justify-between items-start p-8">
                        <p className="text-xs text-muted-foreground uppercase">Period</p>
                        <p className="text-5xl font-mono tracking-normal">
                            {view === 'week' ? `W${format(startDate, 'w')}-${format(startDate, 'RRRR')}` :
                                view === 'month' ? format(currentDate, 'MMM yyyy').toUpperCase() :
                                    view === 'quarter' ? `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${format(currentDate, 'yyyy')}` :
                                        format(currentDate, 'yyyy')}
                        </p>
                    </div>
                    <div className="flex flex-col h-full border-l border-black">
                        {(['week', 'month', 'quarter', 'year'] as CalendarView[]).map(v => (
                            <div key={v} className="flex-1 w-12 border-b border-black last:border-b-0">
                                <button
                                    onClick={() => setView(v)}
                                    className={cn(
                                        "w-full h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors uppercase text-[10px]",
                                        view === v ? "text-black font-bold" : "text-black/30"
                                    )}
                                >
                                    {v[0]}
                                </button>
                            </div>
                        ))}
                    </div>
                </GridCell>
                <GridCell className="h-40 w-40 flex-none p-0">
                    <button
                        onClick={handleAddPillClick}
                        className="w-full h-full flex items-center justify-center bg-black hover:bg-black/90 transition-colors group"
                    >
                        <Plus className="w-12 h-12 text-white" />
                    </button>
                </GridCell>
            </GridRow>

            <GridRow className="flex-1">
                <GridCell span={12} className="min-h-[600px] p-0 flex flex-col">
                    {data === undefined ? (
                        <div className="flex-1 flex items-center justify-center">
                            <span className="animate-pulse">Loading data...</span>
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
                            weekStartsOn={weekStartsOn as 0 | 1}
                        />
                    )}
                </GridCell>
            </GridRow>
            <PillCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCreatePill}
                title={`NEW PILL`}
                originRect={modalOriginRect}
            />
        </MasterGrid>
    )
}
