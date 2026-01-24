

import { Button } from "../ui/Button"

interface JournalEditorProps {
    value: string
    title?: string
    onChange: (value: string) => void
    onTitleChange?: (title: string) => void
    onSave: () => void
    onDelete?: () => void
    isSaving?: boolean
    isDeleting?: boolean
}

export function JournalEditor({ value, title, onChange, onTitleChange, onSave, onDelete, isSaving = false, isDeleting = false }: JournalEditorProps) {
    return (
        <div className="relative h-full flex flex-col">
            <input
                type="text"
                className="w-full bg-transparent border-none p-8 pb-0 text-xl font-display font-medium focus:outline-none placeholder:text-grayscale50"
                placeholder="Title"
                value={title || ''}
                onChange={(e) => onTitleChange?.(e.target.value)}
            />
            <textarea
                className="w-full flex-1 bg-transparent border-none p-8 resize-none focus:outline-none font-display font-normal normal-case leading-relaxed tracking-wider pb-32"
                placeholder="What did you learn this week?"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="absolute bottom-0 left-0 w-full p-0 flex justify-between">
                <div>
                    {/* Spacer or Left content if needed, but user just said buttons */}
                </div>
                <div className="flex w-full">
                    {/* Re-reading request: 'make this full width 0 padding' for the button container. 
                       If I want to match the previous separate buttons logic, I'll adapt.
                       The previous code had them in one container. 
                       I will put them in a flex container that spans the bottom.
                   */}
                    {onDelete && (
                        <Button
                            variant="ghost"
                            size="lg" // Adjusting to match full width aesthetic if needed, or keep standard
                            onClick={onDelete}
                            disabled={isDeleting || isSaving}
                            className="flex-1 border-t border-r border-grayscale-200 rounded-none h-14 hover:bg-red hover:text-white transition-colors"
                        >
                            {isDeleting ? "DELETING..." : "DELETE"}
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onSave}
                        disabled={isSaving || isDeleting}
                        className={`flex-1 border-t border-grayscale-200 rounded-none h-14 ${!onDelete ? 'w-full' : ''}`}
                    >
                        {isSaving ? "SAVING..." : "SAVE ENTRY"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
