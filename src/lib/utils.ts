import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Returns the appropriate color hex based on completion percentage.
 * Used for consistent visual feedback across pills, charts, and progress indicators.
 * 
 * @param percentage - Completion percentage (0-100+)
 * @returns Hex color string
 */
export function getCompletionColor(percentage: number): string {
    if (percentage >= 100) return '#00FF8C' // green
    if (percentage >= 50) return '#FBFF00'  // yellow
    return '#FF00B2'                         // red
}
