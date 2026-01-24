import React from "react"
import { useScrambleText } from "@/hooks/use-scramble-text"
import { cn } from "@/lib/utils"
import { useStagger } from "@/components/ui/stagger-context"

interface ScrambleTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    text: string
    duration?: number
    symbols?: string
    as?: React.ElementType
    trigger?: any
}

export function ScrambleText({
    text,
    duration = 0.2,
    symbols,
    className,
    as: Component = "span",
    trigger,
    ...props
}: ScrambleTextProps) {
    const { delay } = useStagger()
    const scrambled = useScrambleText(text, duration, symbols, delay, trigger)

    const Comp = Component as any
    return (
        <Comp className={cn(className)} {...props}>
            {scrambled}
        </Comp>
    )
}
