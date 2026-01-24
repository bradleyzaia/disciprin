
interface HistoryItem {
    label: string
    date: string
}

interface JournalSidebarProps {
    history: HistoryItem[]
    selectedDate: string
    onSelect: (date: string) => void
}

export function JournalSidebar({ history, selectedDate, onSelect }: JournalSidebarProps) {
    return (
        <div>
            <div>
                <h4 className="uppercase text-xs text-muted-foreground mb-4">History</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                    {history.map((item) => (
                        <li
                            key={item.date}
                            onClick={() => onSelect(item.date)}
                            className={`flex justify-between cursor-pointer hover:text-foreground ${item.date === selectedDate ? 'text-foreground font-medium' : ''}`}
                        >
                            <span>{item.label}</span>
                        </li>
                    ))}
                    {history.length === 0 && (
                        <li className="text-xs text-muted-foreground italic">No journal entries yet</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
