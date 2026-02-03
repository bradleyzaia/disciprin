import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { colors } from "@/styles/tokens"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Returns the appropriate color hex based on completion percentage.
 * Uses design tokens for consistent visual feedback across pills, charts, and progress indicators.
 * 
 * @param percentage - Completion percentage (0-100+)
 * @returns Hex color string from design tokens
 */
export function getCompletionColor(percentage: number): string {
    if (percentage >= 100) return colors.green    // Success
    if (percentage >= 50) return colors.yellow    // In progress
    return colors.magenta                          // Needs attention
}
