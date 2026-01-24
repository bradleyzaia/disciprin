import { useState } from "react"
import { Link, type LinkProps } from "react-router-dom"
import { ScrambleText } from "./scramble-text"
import { cn } from "@/lib/utils"

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
        >
            <ScrambleText text={children} duration={duration} symbols={symbols} trigger={hoverCount} />
        </Link>
    )
}
