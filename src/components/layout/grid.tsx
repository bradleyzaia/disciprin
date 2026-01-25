import * as React from "react"
import { cn } from "@/lib/utils"
import { useFitText } from "@/hooks/use-fit-text"
import { Toast } from "@/components/ui/Toast"

import { Link } from "react-router-dom"
import { SFX, playSFX } from "@/lib/sfx"

interface BaseProps {
    children?: React.ReactNode
    className?: string
}

export function MasterGrid({ children, className }: BaseProps) {
    return (
        <div className={cn(
            "MasterGrid max-w-[1440px] mx-auto border-l border-r border-solid border-dark-theme-border min-h-[100dvh] flex flex-col bg-transparent text-dark-theme-text font-mono text-xs [&>*]:border-r-0 [&>*:last-child]:border-b-0 relative",
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
    style?: React.CSSProperties
}

export function GridRow({ children, className, cols = 12, flex, style }: GridRowProps) {
    if (flex === 'pass') {
        return (
            <div
                className={cn(
                    "GridRow flex w-full border-b border-solid border-dark-theme-border text-xs [&>*:last-child]:border-r-0",
                    className
                )}
                style={style}
            >
                {children}
            </div>
        )
    }

    return (
        <div
            className={cn(
                "GridRow grid w-full border-b border-solid border-dark-theme-border text-xs [&>*:last-child]:border-r-0",
                className
            )}
            style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                ...style
            }}
        >
            {children}
        </div>
    )
}

interface GridCellProps extends BaseProps {
    span?: number
    rowSpan?: number
    rows?: number
    hug?: 'pass' | 'fail'
    dynamicText?: boolean
    minFontSize?: number
    maxFontSize?: number
    to?: string
    href?: string
    onClick?: () => void
    title?: string
}

export function GridCell({ children, className, span, rowSpan, rows, hug, dynamicText, minFontSize = 12, maxFontSize = 100, to, href, onClick, title }: GridCellProps) {
    // If span is undefined, it defaults to auto/1
    const style: React.CSSProperties = {
        gridColumn: span ? `span ${span} / span ${span}` : undefined,
        gridRow: rowSpan ? `span ${rowSpan} / span ${rowSpan}` : undefined,
    }

    const { fontSize, textRef, containerRef } = useFitText({
        maxFontSize,
        minFontSize
    })

    const commonClasses = cn(
        "GridCell border-r border-solid border-dark-theme-border last:border-r-0 text-xs block relative",
        !rows && "p-8",
        hug === 'pass' && "w-fit flex-none",
        (to || href || onClick) && "cursor-pointer interactive",
        className
    )

    const content = (rows && rows > 1) ? (
        <div className="flex flex-col h-full w-full">
            {React.Children.toArray(children).map((child, i) => (
                <div
                    key={i}
                    className="flex-1 flex flex-col justify-center px-8 py-4"
                >
                    {child}
                </div>
            ))}
        </div>
    ) : dynamicText ? (
        <span ref={textRef} style={{ fontSize }} className="whitespace-nowrap">
            {children}
        </span>
    ) : children

    if (to) {
        return (
            <Link
                to={to}
                onMouseDown={() => playSFX(SFX.ENTER)}
                className={commonClasses}
                style={style}
                title={title}
            >
                <div ref={containerRef} className="w-full h-full flex items-center">
                    {content}
                </div>
            </Link>
        )
    }

    if (href) {
        return (
            <a
                href={href}
                onMouseDown={() => playSFX(SFX.ENTER)}
                className={commonClasses}
                style={style}
                title={title}
            >
                <div ref={containerRef} className="w-full h-full flex items-center">
                    {content}
                </div>
            </a>
        )
    }

    if (onClick) {
        return (
            <button
                type="button"
                onMouseDown={() => playSFX(SFX.ENTER)}
                onClick={onClick}
                className={cn(commonClasses, "text-left")}
                style={style}
                title={title}
            >
                <div ref={containerRef} className="w-full h-full flex items-center">
                    {content}
                </div>
            </button>
        )
    }

    return (
        <div
            ref={containerRef}
            className={commonClasses}
            style={style}
        >
            {content}
        </div>
    )
}
