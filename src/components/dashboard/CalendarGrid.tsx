import { cn } from "@/lib/utils"
import { startOfDay, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, getWeek, isWithinInterval, startOfYear, endOfYear, eachWeekOfInterval } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useMemo } from "react"
import { DayEntryModal } from "./DayEntryModal"
import { CalendarDayCell, type DayCellState } from "./CalendarDayCell"

// --- Types ---

// Data Model
export interface Pill {
    id: string
    name: string
    target_value: number
    unit?: string
    measurement_type: 'time' | 'quantity' | 'boolean'
    frequency_per_week: number
    current_streak: number
}

export interface PillEntry {
    pill_id: string
    date: string // YYYY-MM-DD
    value: number
    is_completed: boolean
}

export type CalendarView = 'week' | 'month' | 'quarter' | 'year'

// View Model
interface ColumnHeaderViewModel {
    id: string
    label: string
    subLabel: string
    dateObj?: Date
    interval?: { start: Date, end: Date }
    type: 'day' | 'week'
    isWeekend?: boolean
}

interface CellViewModel {
    id: string
    type: 'day' | 'week'
    isFuture: boolean

    // Day Specific
    dayState: DayCellState
    value?: number
    target?: number

    // Aggregated Specific
    aggregatedStats?: {
        completed: number
        total: number
        isMet: boolean
    }

    // Context for Actions
    context: {
        date: Date
        pillId: string
        pill: Pill
    }
}

interface RowViewModel {
    pill: Pill
    cells: CellViewModel[]
}


interface CalendarGridProps {
    pills: Pill[]
    entries?: PillEntry[]
    currentDate?: Date
    className?: string
    view?: CalendarView
    onViewChange?: (view: CalendarView) => void
    onDateChange?: (date: Date) => void
    onEntryUpdate?: (entry: PillEntry) => void
    weekStartsOn?: 0 | 1
}

// --- Helper Functions ---
const formatDateKey = (date: Date) => format(date, 'yyyy-MM-dd')

export function CalendarGrid({
    pills,
    entries = [],
    currentDate = new Date(),
    className,
    view = 'week',
    onViewChange: _onViewChange,
    onDateChange,
    onEntryUpdate,
    weekStartsOn = 1
}: CalendarGridProps) {
    const onViewChange = _onViewChange || (() => { })

    // --- 1. Imperative Data Preparation ---

    // Generate Columns
    const columns: ColumnHeaderViewModel[] = useMemo(() => {
        switch (view) {
            case 'week': {
                return Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(currentDate)
                    date.setDate(currentDate.getDate() + i)
                    return {
                        id: format(date, 'yyyy-MM-dd'),
                        label: format(date, 'd'),
                        subLabel: format(date, 'EEE'),
                        dateObj: date,
                        type: 'day'
                    }
                })
            }
            case 'month': {
                const start = startOfMonth(currentDate)
                const end = endOfMonth(currentDate)
                return eachDayOfInterval({ start, end }).map(date => ({
                    id: format(date, 'yyyy-MM-dd'),
                    label: format(date, 'd'),
                    subLabel: format(date, 'EEE'),
                    dateObj: date,
                    type: 'day'
                }))
            }
            case 'quarter': {
                const currentMonth = currentDate.getMonth()
                const quarterStartMonth = Math.floor(currentMonth / 3) * 3
                const start = new Date(currentDate.getFullYear(), quarterStartMonth, 1)
                const end = new Date(currentDate.getFullYear(), quarterStartMonth + 3, 0)
                return eachWeekOfInterval({ start, end }, { weekStartsOn }).map(date => ({
                    id: `week-${getWeek(date, { weekStartsOn })}`,
                    label: `W${getWeek(date, { weekStartsOn })}`,
                    subLabel: format(date, 'MMM'),
                    interval: { start: date, end: endOfWeek(date, { weekStartsOn }) },
                    type: 'week'
                }))
            }
            case 'year': {
                const start = startOfYear(currentDate)
                const end = endOfYear(currentDate)
                return eachWeekOfInterval({ start, end }, { weekStartsOn }).map(date => ({
                    id: `year-week-${getWeek(date, { weekStartsOn })}`,
                    label: `W${getWeek(date, { weekStartsOn })}`,
                    subLabel: format(date, 'MMM'),
                    interval: { start: date, end: endOfWeek(date, { weekStartsOn }) },
                    type: 'week'
                }))
            }
        }
    }, [view, currentDate, weekStartsOn])

    // Generate Rows & Cells (The View Model)
    const rows: RowViewModel[] = useMemo(() => {
        return pills.map(pill => {
            const cells: CellViewModel[] = columns.map(col => {
                const today = startOfDay(new Date())
                const colDate = col.dateObj ? startOfDay(col.dateObj) : null

                const isFuture = col.type === 'day'
                    ? (colDate! > today)
                    : (col.interval!.end > new Date())

                // 1. Day Cell Logic
                if (col.type === 'day') {
                    const dateKey = formatDateKey(col.dateObj!)
                    const entry = entries.find(e => e.pill_id === pill.id && e.date === dateKey)

                    let dayState: DayCellState = 'future'
                    if (isFuture) {
                        dayState = 'future'
                    } else if (entry?.is_completed) {
                        dayState = 'completed'
                    } else if (entry && entry.value > 0) {
                        dayState = 'partially-completed'
                    } else {
                        dayState = 'past-incomplete'
                    }

                    return {
                        id: `${pill.id}-${col.id}`,
                        type: 'day',
                        isFuture,
                        dayState,
                        value: entry?.value,
                        target: pill.target_value,
                        context: { date: col.dateObj!, pillId: pill.id, pill }
                    }
                }
                // 2. Week/Aggregated Cell Logic
                else {
                    const interval = col.interval!
                    const relevantEntries = entries.filter(e => {
                        if (e.pill_id !== pill.id) return false
                        const entryDate = new Date(e.date)
                        return isWithinInterval(entryDate, interval)
                    })
                    const completedCount = relevantEntries.filter(e => e.is_completed).length
                    const isMet = completedCount >= pill.frequency_per_week

                    return {
                        id: `${pill.id}-${col.id}`,
                        type: 'week',
                        isFuture,
                        dayState: 'future', // Default/Unused
                        aggregatedStats: {
                            completed: completedCount,
                            total: relevantEntries.length,
                            isMet
                        },
                        context: { date: interval.start, pillId: pill.id, pill }
                    }
                }
            })

            return { pill, cells }
        })
    }, [pills, columns, entries])


    // Interaction State
    const [selectedCell, setSelectedCell] = useState<{
        pill: Pill,
        date: Date,
        entry?: PillEntry
        rect?: DOMRect
    } | null>(null)

    const handleCellClick = (cell: CellViewModel, e: React.MouseEvent) => {
        if (cell.type === 'day') {
            if (cell.isFuture) return // Or cell.dayState === 'future'

            const rect = e.currentTarget.getBoundingClientRect()
            // Re-fetch latest entry from props to ensure modal gets fresh data if used directly, 
            // but here we used pre-calculated vm. 
            // Actually, for the modal we might want the raw entry.
            // But we can find it again or pass it.
            // Let's find it again to be safe and consistent with previous logic
            const entry = entries.find(ent => ent.pill_id === cell.context.pillId && ent.date === formatDateKey(cell.context.date))

            setSelectedCell({
                pill: cell.context.pill,
                date: cell.context.date,
                entry,
                rect
            })
        } else {
            // Aggregated view click - navigate to week
            if (!cell.isFuture) {
                onViewChange('week')
                if (onDateChange) onDateChange(cell.context.date)
            }
        }
    }


    // --- 2. Declarative Rendering ---

    return (
        <div className={cn("w-full h-full flex flex-col font-mono text-xs overflow-hidden", className)}>
            <div className="flex-1 overflow-auto relative">
                {/* Header */}
                <div
                    className="grid h-16 sticky top-0 z-20 bg-background/95 backdrop-blur-sm"
                    style={{
                        gridTemplateColumns: `240px repeat(${columns.length}, minmax(40px, 1fr))`,
                        width: 'fit-content',
                        minWidth: '100%'
                    }}
                >
                    {/* Control Cell */}
                    <div className="p-4 border-r border-b border-black/50 flex items-center justify-between font-medium bg-black text-white h-full sticky left-0 z-30 w-[240px]">
                        <span>pill</span>
                    </div>

                    {/* Column Headers */}
                    {columns.map((col) => (
                        <div
                            key={col.id}
                            className={cn(
                                "p-2 border-r border-b border-black/50 last:border-r-0 flex flex-col items-center justify-center gap-1 min-w-[32px] bg-background",
                                view === 'week' && "p-4"
                            )}
                        >
                            <span className={cn("opacity-50 uppercase text-[10px]", view === 'week' && "text-xs")}>
                                {col.subLabel}
                            </span>
                            <span className="whitespace-nowrap">{col.label}</span>
                        </div>
                    ))}
                </div>

                {/* Body Rows */}
                <div className="w-fit min-w-full">
                    {rows.length === 0 ? (
                        <div className="w-full h-32 flex items-center justify-center text-muted-foreground border-b border-black/50 sticky left-0">
                            No pills configured.
                        </div>
                    ) : (
                        rows.map((row) => (
                            <div
                                key={row.pill.id}
                                className="grid border-b border-black/50 h-16 bg-background"
                                style={{
                                    gridTemplateColumns: `240px repeat(${columns.length}, minmax(40px, 1fr))`
                                }}
                            >
                                {/* Row Header (Pill Info) */}
                                <div className="p-4 border-r border-black/50 flex flex-col justify-center truncate group hover:bg-black/5 transition-colors h-full sticky left-0 z-10 w-[240px] bg-background">
                                    <div className="font-medium truncate">{row.pill.name}</div>
                                    <div className="text-[10px] text-muted-foreground flex gap-2">
                                        <span>{row.pill.measurement_type === 'boolean' ? 'PASS/FAIL' : `${row.pill.target_value} ${row.pill.unit || ''}`}</span>
                                        <span>•</span>
                                        <span>Goal: {row.pill.frequency_per_week}/wk</span>
                                    </div>
                                </div>

                                {/* Cells */}
                                {row.cells.map((cell) => (
                                    <motion.div
                                        key={cell.id}
                                        onClick={(e) => handleCellClick(cell, e)}
                                        className={cn(
                                            "border-r border-black/50 last:border-r-0 flex items-center justify-center transition-all hover:bg-black/5 cursor-pointer relative",
                                            cell.isFuture && "bg-white text-muted-foreground cursor-default hover:bg-white"
                                        )}
                                    >
                                        {cell.type === 'day' ? (
                                            <CalendarDayCell
                                                state={cell.dayState}
                                                value={cell.value}
                                                target={cell.target}
                                            />
                                        ) : (
                                            /* Aggregated Cell Rendering (Inline for now as it's specific) */
                                            cell.aggregatedStats && (cell.aggregatedStats.completed > 0 ? (
                                                <div className={cn(
                                                    "w-full h-full flex flex-col items-center justify-center text-[10px]",
                                                    cell.aggregatedStats.isMet && "font-bold"
                                                )}>
                                                    {view === 'week' ? (
                                                        <div className={cn(
                                                            "w-8 h-6 flex items-center justify-center border border-black",
                                                            cell.aggregatedStats.isMet ? "bg-black text-white" : "bg-transparent text-black"
                                                        )}>
                                                            {cell.aggregatedStats.completed}/{row.pill.frequency_per_week}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <span className="font-bold">{cell.aggregatedStats.completed}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                !cell.isFuture && <span className="text-black/20">-</span>
                                            ))
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedCell && (
                    <DayEntryModal
                        originRect={selectedCell.rect}
                        pill={selectedCell.pill}
                        date={selectedCell.date}
                        initialValue={selectedCell.entry?.value}
                        isCompleted={selectedCell.entry?.is_completed}
                        onClose={() => setSelectedCell(null)}
                        onSave={(value, isCompleted) => {
                            if (onEntryUpdate) {
                                onEntryUpdate({
                                    pill_id: selectedCell.pill.id,
                                    date: formatDateKey(selectedCell.date),
                                    value,
                                    is_completed: isCompleted
                                })
                            }
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
