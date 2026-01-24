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

    // Default to current week
    // We use standard logic to determine start of week

    const [selectedDate, setSelectedDate] = useState(() => format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'))

    // Display range for the *selected* date
    const selectedDateObj = new Date(selectedDate)
    const displayDateRange = `${format(selectedDateObj, 'MMM dd')} - ${format(new Date(selectedDateObj.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy')}`

    const [content, setContent] = useState("")

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
        } else {
            setContent("") // Clear content if no entry exists for this date
        }
    }, [entryData, selectedDate])

    const handleSave = async () => {
        try {
            await saveEntry({
                period_type: "weekly",
                date: selectedDate,
                content: content
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
            return {
                label: `Week ${format(date, 'w')}`,
                date: entry.date,
            }
        })
    }, [allEntries])

    return (
        <MasterGrid>
            <Navbar />
            <JournalHeader dateRange={displayDateRange} />

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
                        onChange={setContent}
                        onSave={handleSave}
                        onDelete={entryData ? handleDelete : undefined}
                        isSaving={false}
                    />
                </GridCell>
            </GridRow>
        </MasterGrid>
    )
}
