import { cn } from "@/lib/utils"
import { useFitText } from "@/hooks/use-fit-text"
import { Toast } from "@/components/ui/Toast"

interface BaseProps {
    children?: React.ReactNode
    className?: string
}

export function MasterGrid({ children, className }: BaseProps) {
    return (
        <div className={cn(
            "max-w-[1440px] mx-auto border-l border-r border-black min-h-screen flex flex-col bg-transparent text-foreground font-mono text-xs [&>*]:border-r-0 [&>*:last-child]:border-b-0 relative",
            className
        )}>
            <Toast />
            {children}
        </div>
    )
}


interface GridRowProps extends BaseProps {
    cols?: number
    flex?: 'pass' | 'fail'
}

export function GridRow({ children, className, cols = 12, flex }: GridRowProps) {
    if (flex === 'pass') {
        return (
            <div
                className={cn(
                    "flex w-full border-b border-black text-xs [&>*:last-child]:border-r-0",
                    className
                )}
            >
                {children}
            </div>
        )
    }

    return (
        <div
            className={cn(
                "grid w-full border-b border-black text-xs [&>*:last-child]:border-r-0",
                className
            )}
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
            {children}
        </div>
    )
}

interface GridCellProps extends BaseProps {
    span?: number
    hug?: 'pass' | 'fail'
    dynamicText?: boolean
    minFontSize?: number
    maxFontSize?: number
}

export function GridCell({ children, className, span, hug, dynamicText, minFontSize = 12, maxFontSize = 100 }: GridCellProps) {
    // If span is undefined, it defaults to auto/1
    const style = span ? { gridColumn: `span ${span} / span ${span}` } : undefined

    const { fontSize, textRef, containerRef } = useFitText({
        maxFontSize,
        minFontSize
    })

    if (dynamicText) {
        return (
            <div
                ref={containerRef}
                className={cn(
                    "border-r border-black p-8 last:border-r-0 text-xs",
                    hug === 'pass' && "w-fit flex-none",
                    className
                )}
                style={style}
            >
                <span ref={textRef} style={{ fontSize }} className="whitespace-nowrap">
                    {children}
                </span>
            </div>
        )
    }

    return (
        <div
            className={cn(
                "border-r border-black p-8 last:border-r-0 text-xs",
                hug === 'pass' && "w-fit flex-none",
                className
            )}
            style={style}
        >
            {children}
        </div>
    )
}
