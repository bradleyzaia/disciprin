import { cn } from "@/lib/utils"
import { grid } from "@/styles/tokens"

interface StaticAsciiPillProps {
    className?: string
}

export function StaticAsciiPill({ className }: StaticAsciiPillProps) {
    return (
        <div className={cn("relative flex items-center justify-center overflow-hidden bg-black", className)}>
            {/* Base "ASCII" Texture Pattern - Matches Modal Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: grid.pattern,
                    backgroundSize: grid.patternSize,
                    opacity: grid.patternOpacity
                }}
            />
        </div>
    )
}
