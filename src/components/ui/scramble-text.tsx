import { useScrambleText } from "@/hooks/use-scramble-text"
import { cn } from "@/lib/utils"


interface ScrambleTextProps {
    text: string
    duration?: number
    symbols?: string
    delay?: number
    className?: string
    trigger?: any
    scrambleOnMount?: boolean
}

export function ScrambleText({ text, duration, symbols, delay, className, trigger, scrambleOnMount }: ScrambleTextProps) {
    const scrambled = useScrambleText(text, duration, symbols, delay, trigger, scrambleOnMount)
    return <span className={cn("scramble-text", className)}>{scrambled}</span>
}
