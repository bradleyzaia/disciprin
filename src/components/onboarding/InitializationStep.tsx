import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

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
            <div className="flex-1 flex items-center justify-center border-b border-dark-theme-border">
                <h3 className="text-4xl md:text-6xl font-display uppercase tracking-normal">patient intake complete</h3>
            </div>

            {/* Details Section */}

            <div className="flex-[2] w-full grid grid-cols-1 grid-rows-3 md:grid-cols-3 md:grid-rows-1">
                <div className="h-full border-b md:border-b-0 md:border-r border-dark-theme-border flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-dark-theme-text tracking-widest uppercase mb-1">USER</p>
                    <p className="text-2xl font-display uppercase">{data.name}</p>
                </div>
                <div className="h-full border-b md:border-b-0 md:border-r border-dark-theme-border flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-dark-theme-text tracking-widest uppercase mb-1">TIMEZONE</p>
                    <p className="text-2xl font-display uppercase">{data.timezone}</p>
                </div>
                <div className="h-full flex flex-col items-center justify-center space-y-2">
                    <p className="font-mono text-xs text-dark-theme-text tracking-widest uppercase mb-1">PILLS CONFIGURED</p>
                    <p className="text-2xl font-display uppercase">{data.pills.length}</p>
                </div>
            </div>

            {/* Action Button */}
            <Button
                onClick={onNext}
                disabled={isSubmitting}
                variant="primary"
                icon={!isSubmitting ? ArrowRight : undefined}
                className="h-24 w-full text-sm border-t border-dark-theme-border"
            >
                {isSubmitting ? "INITIALIZING PROTOCOL..." : "BEGIN TREATMENT"}
            </Button>

        </div>
    )
}
