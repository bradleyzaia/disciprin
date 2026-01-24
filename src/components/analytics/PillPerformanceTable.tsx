
import { GridRow, GridCell } from "@/components/layout/grid"

export interface PillPerformanceData {
    id: string
    name: string
    completionRate: number
    currentStreak: number
    status: string
}

interface PillPerformanceTableProps {
    data: PillPerformanceData[]
}

export function PillPerformanceTable({ data }: PillPerformanceTableProps) {
    return (
        <>
            <GridRow className="border-b-0 flex-grow">
                <GridCell span={12} className="p-0 border-r-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-dark-theme-border">
                                <th className="p-6 text-xs text-dark-theme-text uppercase font-normal border-r border-dark-theme-border w-1/4">Pill</th>
                                <th className="p-6 text-xs text-dark-theme-text uppercase font-normal border-r border-dark-theme-border w-1/4">Current Streak</th>
                                <th className="p-6 text-xs text-dark-theme-text uppercase font-normal border-r border-dark-theme-border w-1/4">Status</th>
                                <th className="p-6 text-xs text-dark-theme-text uppercase font-normal w-1/4">Completion %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-6 text-center text-dark-theme-text">No pills found</td>
                                </tr>
                            ) : (
                                data.map((pill) => {
                                    const rateColor = pill.completionRate >= 90
                                        ? 'text-green'
                                        : pill.completionRate >= 70
                                            ? 'text-yellow'
                                            : 'text-red';

                                    return (
                                        <tr key={pill.id}>
                                            <td className={`p-6 border-b border-dark-theme-border border-r border-dark-theme-border ${rateColor}`}>
                                                {pill.name}
                                            </td>
                                            <td className="p-6 border-b border-dark-theme-border border-r border-dark-theme-border">
                                                {pill.currentStreak} WEEKS
                                            </td>
                                            <td className="p-6 border-b border-dark-theme-border border-r border-dark-theme-border">
                                                {pill.status}
                                            </td>
                                            <td className={`p-6 border-b border-dark-theme-border ${rateColor}`}>
                                                {Math.round(pill.completionRate)}%
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </GridCell>
            </GridRow>
        </>
    )
}
