import { cn } from "@/lib/utils"

interface StaticAsciiPillProps {
    className?: string
}

export function StaticAsciiPill({ className }: StaticAsciiPillProps) {
    return (
        <div className={cn("relative flex items-center justify-center overflow-hidden bg-white", className)}>
            {/* Base "ASCII" Texture Pattern - Matches Modal Overlay */}
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage: `radial-gradient(circle, #000000 1px, transparent 1px)`,
                    backgroundSize: '2px 2px'
                }}
            />
        </div>
    )
}
