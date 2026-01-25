import { useState } from "react"
import { Link, type LinkProps } from "react-router-dom"
import { ScrambleText } from "./scramble-text"
import { cn } from "@/lib/utils"
import { SFX, playSFX } from "@/lib/sfx"

interface ScrambleLinkProps extends LinkProps {
    children: string
    duration?: number
    symbols?: string
}

export function ScrambleLink({ children, className, duration, symbols, ...props }: ScrambleLinkProps) {
    const [hoverCount, setHoverCount] = useState(0)

    return (
        <Link
            {...props}
            className={cn("transition-colors scramble-link", className)}
            onMouseEnter={(e) => {
                setHoverCount(prev => prev + 1)
                props.onMouseEnter?.(e)
            }}
            onMouseDown={(e) => {
                playSFX(SFX.ENTER)
                props.onMouseDown?.(e)
            }}
            onClick={(e) => {
                props.onClick?.(e)
            }}
        >
            <ScrambleText text={children} duration={duration} symbols={symbols} trigger={hoverCount} />
        </Link>
    )
}
