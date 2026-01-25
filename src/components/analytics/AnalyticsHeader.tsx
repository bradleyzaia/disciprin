
import { GridRow, GridCell } from "@/components/layout/grid"

interface AnalyticsHeaderProps {
    timeRange?: 'W' | 'M' | 'Y'
    onTimeRangeChange?: (range: 'W' | 'M' | 'Y') => void
}

export function AnalyticsHeader({ timeRange = 'W', onTimeRangeChange }: AnalyticsHeaderProps) {
    return (
        <GridRow>
            <GridCell span={8} className="flex items-center backdrop-blur-none bg-black/80">
                <h2 className="text-xl m-0 tracking-normal">PERFORMANCE</h2>
            </GridCell>
            <GridCell span={4} className="p-0 border-r-0 h-full flex backdrop-blur-none bg-black/80">
                <button
                    onClick={() => onTimeRangeChange?.('W')}
                    className={`flex-1 border-r border-dark-theme-border h-full text-xs transition-colors uppercase ${timeRange === 'W' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    W
                </button>
                <button
                    onClick={() => onTimeRangeChange?.('M')}
                    className={`flex-1 border-r border-dark-theme-border h-full text-xs transition-colors uppercase ${timeRange === 'M' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    M
                </button>
                <button
                    onClick={() => onTimeRangeChange?.('Y')}
                    className={`flex-1 h-full text-xs transition-colors uppercase ${timeRange === 'Y' ? 'bg-foreground text-background' : 'hover:bg-muted/50'
                        }`}
                >
                    Y
                </button>
            </GridCell>
        </GridRow>
    )
}
