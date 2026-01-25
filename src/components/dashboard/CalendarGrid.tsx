import { cn } from "@/lib/utils"
import { startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, format, isWithinInterval, isSameDay } from "date-fns"
import { Reorder } from "framer-motion"
import { useMemo, useEffect, useState } from "react"
import { CalendarDayCell, type DayCellState } from "./CalendarDayCell"
import { ScrambleText } from "@/components/ui/scramble-text"

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

export type CalendarView = 'week' | 'month'

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
    onPillClick?: (pill: Pill) => void
    onOrderChange?: (pills: Pill[]) => void
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
    onPillClick,
    onOrderChange
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
        }
    }, [view, currentDate])

    // Local state for drag-and-drop
    const [orderedPills, setOrderedPills] = useState(pills)

    useEffect(() => {
        setOrderedPills(pills)
    }, [pills])

    const handleReorder = (newOrder: Pill[]) => {
        setOrderedPills(newOrder)
    }

    // Generate Rows & Cells (The View Model)
    const rows: RowViewModel[] = useMemo(() => {
        return orderedPills.map(pill => {
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
                        const isToday = colDate!.getTime() === today.getTime()
                        dayState = isToday ? 'present-incomplete' : 'past-incomplete'
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
                    const completedCount = relevantEntries.reduce((acc, e) => {
                        if (pill.measurement_type === 'boolean') {
                            return acc + (e.is_completed ? 1 : 0)
                        } else {
                            return acc + Math.min(1, e.value / pill.target_value)
                        }
                    }, 0)
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
    }, [orderedPills, columns, entries])


    const handleCellClick = (cell: CellViewModel) => {
        if (cell.type === 'day') {
            // No-op for day cells
        } else {
            // Aggregated view click - navigate to week
            if (!cell.isFuture) {
                onViewChange('week')
                if (onDateChange) onDateChange(cell.context.date)
            }
        }
    }


    // --- 2. Declarative Rendering ---

    useEffect(() => {
        // Center the current day or focused date
        const todayKey = format(new Date(), 'yyyy-MM-dd')
        // First try to find Today's column
        let targetEl = document.getElementById(`calendar-col-${todayKey}`)

        // If Today isn't in view (e.g. browsing a different month), try the currently selected date
        if (!targetEl) {
            const selectedKey = format(currentDate, 'yyyy-MM-dd')
            targetEl = document.getElementById(`calendar-col-${selectedKey}`)
        }

        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }
    }, [columns, currentDate])

    return (
        <div className={cn("w-full h-full flex flex-col font-mono text-xs overflow-hidden", className)}>
            <div className="flex-1 overflow-x-auto overflow-y-auto relative">
                {/* Header */}
                <div
                    className="grid h-24 sticky top-0 z-20 bg-transparent backdrop-blur-sm"
                    style={{
                        gridTemplateColumns: `240px repeat(${columns.length}, minmax(${view === 'month' ? '120px' : '40px'}, 1fr))`,
                        width: 'fit-content',
                        minWidth: '100%'
                    }}
                >
                    {/* Control Cell */}
                    <div className="border-r border-b border-dark-theme-border flex sticky left-0 z-30 w-[240px] bg-black h-full">
                        {(['week', 'month'] as CalendarView[]).map(v => (
                            <button
                                key={v}
                                onClick={() => onViewChange(v)}
                                className={cn(
                                    "flex-1 h-full flex items-center justify-center hover:bg-white hover:text-black transition-colors uppercase text-[10px] border-r border-dark-theme-border last:border-r-0",
                                    view === v ? "text-dark-theme-text font-bold bg-white/10" : "text-dark-theme-text/30"
                                )}
                            >
                                <ScrambleText text={v[0]} />
                            </button>
                        ))}
                    </div>

                    {/* Column Headers */}
                    {columns.map((col) => (
                        <div
                            key={col.id}
                            id={`calendar-col-${col.id}`}
                            className={cn(
                                "p-2 border-r border-b border-dark-theme-border last:border-r-0 flex flex-col items-center justify-center gap-1 min-w-[32px]",
                                view === 'week' && "p-4"
                            )}
                        >
                            <span className={cn("opacity-50 uppercase text-[10px]", view === 'week' && "text-xs")}>
                                <ScrambleText text={col.subLabel} />
                            </span>
                            <span className="whitespace-nowrap"><ScrambleText text={col.label} /></span>
                        </div>
                    ))}
                </div>

                {/* Body Rows */}
                <div className="w-fit min-w-full">
                    {rows.length === 0 ? (
                        <div className="w-full h-32 flex items-center justify-center text-dark-theme-text border-b border-dark-theme-border sticky left-0">
                            <ScrambleText text="No pills configured." />
                        </div>
                    ) : (
                        <Reorder.Group as="div" axis="y" values={orderedPills} onReorder={handleReorder} className="w-fit min-w-full">
                            {rows.map((row) => (
                                <Reorder.Item
                                    as="div"
                                    key={row.pill.id}
                                    value={row.pill}
                                    onDragEnd={() => onOrderChange?.(orderedPills)}
                                    className="grid border-b border-dark-theme-border h-16 bg-black/50 backdrop-blur-md relative"
                                    style={{
                                        gridTemplateColumns: `240px repeat(${columns.length}, minmax(${view === 'month' ? '120px' : '40px'}, 1fr))`
                                    }}
                                >
                                    {/* Row Header (Pill Info) */}
                                    <div
                                        onClick={() => onPillClick?.(row.pill)}
                                        className="px-4 border-r border-dark-theme-border flex flex-col justify-center truncate group h-full sticky left-0 z-10 w-[240px] backdrop-blur-sm cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors"
                                    >
                                        <div className="font-medium truncate"><ScrambleText text={row.pill.name} /></div>
                                        <div className="text-[10px] text-dark-theme-text flex flex-col leading-relaxed">
                                            <div>
                                                <ScrambleText text={row.pill.measurement_type === 'boolean' ? 'PASS/FAIL' : `${row.pill.target_value}${row.pill.unit ? ` ${row.pill.unit}` : ''}`} />
                                                {row.pill.measurement_type !== 'boolean' && <ScrambleText text=" / DAY" className="text-grayscale75" />}
                                            </div>
                                            <div>
                                                <ScrambleText text={`${row.pill.frequency_per_week}X`} />
                                                <ScrambleText text=" / WEEK" className="text-grayscale75" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cells */}
                                    {row.cells.map((cell) => (
                                        <div
                                            key={cell.id}
                                            onClick={() => handleCellClick(cell)}
                                            className={cn(
                                                "border-r border-dark-theme-border last:border-r-0 flex items-center justify-center transition-all cursor-pointer relative",
                                                cell.isFuture && "bg-white/4 text-dark-theme-text cursor-default",
                                                (cell.type === 'day' && isSameDay(cell.context.date, new Date())) && "bg-white/2"
                                            )}
                                        >
                                            {cell.type === 'day' ? (
                                                <CalendarDayCell
                                                    state={cell.dayState}
                                                    value={cell.value}
                                                    target={cell.target}
                                                    unit={cell.context.pill.unit}
                                                    onUpdate={(newValue) => {
                                                        if (onEntryUpdate) {
                                                            onEntryUpdate({
                                                                pill_id: cell.context.pillId,
                                                                date: formatDateKey(cell.context.date),
                                                                value: newValue,
                                                                is_completed: newValue >= (cell.target || 0)
                                                            })
                                                        }
                                                    }}
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
                                                                "w-8 h-6 flex items-center justify-center border border-dark-theme-border",
                                                                cell.aggregatedStats.isMet ? "bg-green text-black" : "bg-transparent text-dark-theme-text/50"
                                                            )}>
                                                                <ScrambleText text={`${Number.isInteger(cell.aggregatedStats.completed) ? cell.aggregatedStats.completed : cell.aggregatedStats.completed.toFixed(1)}/${row.pill.frequency_per_week}`} scrambleOnMount={false} />
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="font-bold"><ScrambleText text={Number.isInteger(cell.aggregatedStats.completed) ? cell.aggregatedStats.completed.toString() : cell.aggregatedStats.completed.toFixed(1)} /></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    !cell.isFuture && <span className="text-dark-theme-text/20"><ScrambleText text="-" /></span>
                                                ))
                                            )}
                                        </div>
                                    ))}
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </div>
            </div>
        </div>
    )
}
