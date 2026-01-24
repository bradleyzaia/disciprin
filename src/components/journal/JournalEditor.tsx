

interface JournalEditorProps {
    value: string
    onChange: (value: string) => void
    onSave: () => void
    onDelete?: () => void
    isSaving?: boolean
    isDeleting?: boolean
}

export function JournalEditor({ value, onChange, onSave, onDelete, isSaving = false, isDeleting = false }: JournalEditorProps) {
    return (
        <>
            <textarea
                className="w-full h-full bg-transparent border-none p-8 resize-none focus:outline-none font-mono leading-relaxed pb-32" // Added pb-32 to avoid overlap with buttons
                placeholder="Start typing your reflection here..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="absolute bottom-0 right-0 p-8 flex gap-4">
                {onDelete && (
                    <button
                        onClick={onDelete}
                        disabled={isDeleting || isSaving}
                        className="px-8 py-3 border border-red-500 text-red-500 text-sm uppercase hover:bg-red-500 hover:text-white disabled:opacity-50 transition-colors"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                )}
                <button
                    onClick={onSave}
                    disabled={isSaving || isDeleting}
                    className="px-8 py-3 bg-foreground text-background text-sm uppercase hover:opacity-90 disabled:opacity-50"
                >
                    {isSaving ? "Saving..." : "Save Entry"}
                </button>
            </div>
        </>
    )
}
