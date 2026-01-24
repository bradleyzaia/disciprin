import { ArrowRight } from "lucide-react"

interface InitializationStepProps {
    data: {
        name: string
        timezone: string
        pills: any[]
    }
    onNext: () => void
    isSubmitting?: boolean
}

export const InitializationStep = ({ data, onNext, isSubmitting = false }: InitializationStepProps) => {
    return (
        <div className="w-full h-full flex flex-col">
            {/* Header Section */}
            <div className="flex-1 flex items-center justify-center border-b border-black/50">
                <h3 className="text-4xl md:text-6xl font-display uppercase tracking-normal">patient intake complete</h3>
            </div>

            {/* Details Section */}
            <div className="flex-[2] w-full grid grid-cols-3">
                <div className="h-full border-r border-black/50 flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">USER</p>
                    <p className="text-2xl font-display uppercase">{data.name}</p>
                </div>
                <div className="h-full border-r border-black/50 flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">TIMEZONE</p>
                    <p className="text-2xl font-display uppercase">{data.timezone}</p>
                </div>
                <div className="h-full flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">PILLS CONFIGURED</p>
                    <p className="text-2xl font-display uppercase">{data.pills.length}</p>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onNext}
                disabled={isSubmitting}
                className="h-24 w-full flex items-center justify-center uppercase bg-foreground text-background hover:bg-foreground/90 transition-colors font-mono text-sm tracking-widest group border-t border-black/50 cursor-pointer disabled:opacity-50"
            >
                {isSubmitting ? "INITIALIZING PROTOCOL..." : "BEGIN TREATMENT"}
                {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
        </div>
    )
}
