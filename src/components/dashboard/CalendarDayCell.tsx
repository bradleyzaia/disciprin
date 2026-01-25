import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ScrambleText } from "@/components/ui/scramble-text"

export type DayCellState = 'completed' | 'partially-completed' | 'past-incomplete' | 'present-incomplete' | 'future'

interface CalendarDayCellProps {
    state: DayCellState
    value?: number
    target?: number
    unit?: string
    onUpdate?: (value: number) => void
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
    className?: string
}

export function CalendarDayCell({ state, value, target, unit, onUpdate, onClick, className }: CalendarDayCellProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [localValue, setLocalValue] = useState(value?.toString() || "")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    useEffect(() => {
        setLocalValue(value?.toString() || "")
    }, [value])

    const handleSubmit = () => {
        setIsEditing(false)
        const numValue = parseFloat(localValue)
        if (!isNaN(numValue)) {
            onUpdate?.(numValue)
        } else if (localValue === "") {
            onUpdate?.(0)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        } else if (e.key === 'Escape') {
            setLocalValue(value?.toString() || "")
            setIsEditing(false)
        }
    }

    const onCellClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (state === 'future') return
        e.stopPropagation()
        setIsEditing(true)
        onClick?.(e)
    }

    if (isEditing) {
        return (
            <div className={cn("h-full w-full relative flex items-center justify-center p-2 bg-white/5", className)}>
                <div className="flex items-baseline gap-1 font-mono">
                    <input
                        ref={inputRef}
                        type="text"
                        value={localValue}
                        onChange={(e) => setLocalValue(e.target.value)}
                        onBlur={handleSubmit}
                        onKeyDown={handleKeyDown}
                        className="w-12 bg-white/10 border-none text-center focus:outline-none p-0 m-0 text-green text-base"
                        placeholder="0"
                    />
                    <span className="text-xs text-dark-theme-text/30">/</span>
                    <span className="text-xs text-dark-theme-text/50">{target}</span>
                    {unit && (
                        <span className="text-xs text-dark-theme-text/40 uppercase ml-0.5">
                            <ScrambleText text={unit} />
                        </span>
                    )}
                </div>
            </div>
        )
    }

    let content = null
    const percentage = (value && target) ? Math.round((value / target) * 100) : (state === 'completed' ? 100 : 0)

    switch (state) {
        case 'completed':
            content = (
                <>
                    <ScrambleText
                        className="absolute top-4 right-4 text-xs leading-none text-green scale-75 origin-top-right"
                        text={`${percentage}%`}
                        scrambleOnMount={false}
                    />
                    <div className="w-8 h-4 rounded-full border border-dark-theme-border bg-green rotate-315 transform origin-center flex items-center justify-center">
                        <Check className="w-3 h-3 rotate-45 text-black" />
                    </div>
                </>
            )
            break
        case 'future':
            content = (
                <div className="w-6 h-3 rounded-full border border-dark-theme-border bg-white/10 rotate-315 transform origin-center" />
            )
            break
        default:
            let progressColor = "bg-white"
            if (percentage < 50) {
                progressColor = "bg-red"
            } else if (percentage < 100) {
                progressColor = "bg-yellow"
            }

            content = (
                <>
                    <ScrambleText
                        className="absolute top-4 right-4 text-xs leading-none text-dark-theme-text/50 scale-75 origin-top-right"
                        text={`${percentage}%`}
                        scrambleOnMount={false}
                    />
                    <div className="w-6 h-3 rounded-full border border-dark-theme-border bg-transparent rotate-315 transform origin-center overflow-hidden relative">
                        <div
                            className={cn("h-full transition-all duration-300 ease-out", progressColor)}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </>
            )
            break
    }

    return (
        <div
            onClick={onCellClick}
            className={cn(
                "h-full w-full relative flex items-center justify-center cursor-pointer group",
                state === 'future' && "cursor-default",
                className
            )}
        >
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:2px_2px] opacity-0 group-hover:opacity-25 transition-opacity duration-200 pointer-events-none z-0" />
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {content}
            </div>
        </div>
    )
}

