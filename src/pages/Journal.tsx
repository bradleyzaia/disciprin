import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { MasterGrid, GridRow, GridCell } from "@/components/layout/grid"
import { Navbar } from "@/components/layout/Navbar"
import { useToast } from "@/lib/toast-context"
import { JournalHeader } from "@/components/journal/JournalHeader"
import { JournalSidebar } from "@/components/journal/JournalSidebar"
import { JournalEditor } from "@/components/journal/JournalEditor"
import { startOfWeek, format } from "date-fns"

export function Journal() {
    const { showToast } = useToast()

    const user = useQuery(api.users.getUser)

    // Default to Monday (1) if not specified or loading
    const weekStartsOn = (user as any)?.week_start_day === 'sunday' ? 0 : 1

    // Default to current week based on preference
    // We use a small effect to update the selected date if it was initialized with a default
    // or we just rely on the user changing it. 
    // Actually simpler: Initialize with Monday default, but recalculate if user loads differently?
    // The useState initializer only runs once.
    // Let's rely on standardizing the selectedDate to be the "start of the week" date.

    const [selectedDate, setSelectedDate] = useState(() => format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'))

    // When user preference loads, we might want to adjust the view BUT
    // selectedDate is already a specific date string (e.g. "2024-01-20").
    // If we view it with a different week start, the range calculation below handles it.

    // Display range for the *selected* date
    const selectedDateObj = new Date(selectedDate)

    // Ensure we find the start of the week for the selected date based on preference
    const rangesStart = startOfWeek(selectedDateObj, { weekStartsOn: weekStartsOn as 0 | 1 })
    const rangesEnd = new Date(rangesStart.getTime() + 6 * 24 * 60 * 60 * 1000)

    const displayDateRange = `${format(rangesStart, 'MMM dd')} - ${format(rangesEnd, 'MMM dd, yyyy')}`

    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")

    const entryData = useQuery(api.journal.getEntry, {
        period_type: "weekly",
        date: selectedDate
    })

    const allEntries = useQuery(api.journal.listEntries, {
        period_type: "weekly"
    })

    const saveEntry = useMutation(api.journal.saveEntry)
    const deleteEntry = useMutation(api.journal.deleteEntry)

    // Sync remote data to local state when loaded or date changes
    useEffect(() => {
        if (entryData) {
            setContent(entryData.content)
            setTitle(entryData.title || "")
        } else {
            setContent("") // Clear content if no entry exists for this date
            setTitle("")
        }
    }, [entryData, selectedDate])

    const handleSave = async () => {
        try {
            await saveEntry({
                period_type: "weekly",
                date: selectedDate,
                content: content,
                title: title
            })
            showToast("Entry Saved", "Your weekly review has been recorded.")
        } catch (error) {
            console.error("Failed to save entry:", error)
            showToast("Error", "Failed to save entry.")
        }
    }

    const handleDelete = async () => {
        if (!entryData) return

        if (!confirm("Are you sure you want to delete this journal entry?")) return

        try {
            await deleteEntry({ id: entryData._id })
            showToast("Entry Deleted", "The journal entry has been removed.")
            setContent("") // Clear editor
            setTitle("")
            // No need to change date, just stay on current date which is now empty
        } catch (error) {
            console.error("Failed to delete entry:", error)
            showToast("Error", "Failed to delete entry.")
        }
    }

    // Generate history list (Only existing entries)
    const history = useMemo(() => {
        if (!allEntries) return []

        return allEntries.map(entry => {
            const date = new Date(entry.date)
            // Use updated_at or created_at for time
            const timeVal = entry.updated_at || entry.created_at
            return {
                label: `Week ${format(date, 'w')}`,
                date: entry.date,
                time: timeVal ? format(new Date(timeVal), 'h:mm a') : undefined
            }
        })
    }, [allEntries])

    return (
        <MasterGrid>
            <Navbar />
            <JournalHeader
                dateRange={displayDateRange}
                onAddEntry={() => setSelectedDate(format(new Date(), 'yyyy-MM-dd'))}
            />

            <GridRow className="flex-grow min-h-[600px] border-b-0">
                <GridCell span={4} className="bg-muted/10">
                    <JournalSidebar
                        history={history}
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                    />
                </GridCell>
                <GridCell span={8} className="border-r-0 p-0 relative">
                    <JournalEditor
                        value={content}
                        title={title}
                        onChange={setContent}
                        onTitleChange={setTitle}
                        onSave={handleSave}
                        onDelete={entryData ? handleDelete : undefined}
                        isSaving={false}
                    />
                </GridCell>
            </GridRow>
        </MasterGrid>
    )
}
