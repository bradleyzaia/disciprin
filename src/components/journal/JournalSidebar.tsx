
interface HistoryItem {
    label: string
    date: string
    time?: string
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
                <h4 className="uppercase text-sm font-mono text-dark-theme-text mb-4">History</h4>
                <ul className="space-y-4 text-sm text-dark-theme-text">
                    {history.map((item) => (
                        <li
                            key={item.date}
                            onClick={() => onSelect(item.date)}
                            className={`flex justify-between cursor-pointer hover:text-dark-theme-text ${item.date === selectedDate ? 'text-dark-theme-text font-medium' : ''}`}
                        >
                            <span>{item.label}</span>
                            {item.time && <span className="text-grayscale50">{item.time}</span>}
                        </li>
                    ))}
                    {history.length === 0 && (
                        <li className="text-xs text-grayscale50">NO JOURNAL ENTRIES YET</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
