export type PillDraft = {
    name: string
    measurement_type: "boolean" | "quantity" | "time" | string
    target_value: number
    frequency_per_week: number
    unit?: string
    category?: string
}

export const HABIT_CONFIG: Record<string, {
    category: string
    measurement_type: "boolean" | "quantity" | "time" | string
    target_value: number
    unit: string
    frequency_per_week: number
}> = {
    // PHYSICAL
    "GYM": { category: "PHYSICAL", measurement_type: "time", target_value: 60, unit: "MIN", frequency_per_week: 3 },
    "RUN": { category: "PHYSICAL", measurement_type: "time", target_value: 30, unit: "MIN", frequency_per_week: 3 },
    "WALK": { category: "PHYSICAL", measurement_type: "quantity", target_value: 10000, unit: "STEPS", frequency_per_week: 7 },
    "EXERCISE": { category: "PHYSICAL", measurement_type: "time", target_value: 45, unit: "MIN", frequency_per_week: 4 },
    "STRETCH": { category: "PHYSICAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7 },
    "CLEAN": { category: "PHYSICAL", measurement_type: "time", target_value: 20, unit: "MIN", frequency_per_week: 3 },

    // MENTAL
    "READ": { category: "MENTAL", measurement_type: "time", target_value: 30, unit: "MIN", frequency_per_week: 5 },
    "STUDY": { category: "MENTAL", measurement_type: "time", target_value: 60, unit: "MIN", frequency_per_week: 5 },
    "WRITE": { category: "MENTAL", measurement_type: "quantity", target_value: 500, unit: "WORDS", frequency_per_week: 3 },
    "CODING": { category: "MENTAL", measurement_type: "time", target_value: 60, unit: "MIN", frequency_per_week: 5 },

    // WELLNESS
    "MEDITATE": { category: "WELLNESS", measurement_type: "time", target_value: 20, unit: "MIN", frequency_per_week: 7 },
    "JOURNAL": { category: "WELLNESS", measurement_type: "boolean", target_value: 1, unit: "", frequency_per_week: 7 },
    "SLEEP 8H": { category: "WELLNESS", measurement_type: "time", target_value: 480, unit: "MIN", frequency_per_week: 7 },
    "DRINK WATER": { category: "WELLNESS", measurement_type: "quantity", target_value: 1, unit: "CUPS", frequency_per_week: 7 },
    "NO SUGAR": { category: "WELLNESS", measurement_type: "boolean", target_value: 1, unit: "", frequency_per_week: 7 },
    "COOK": { category: "WELLNESS", measurement_type: "boolean", target_value: 1, unit: "", frequency_per_week: 4 },
}

export const HABIT_OPTIONS = Object.entries(HABIT_CONFIG).map(([label, config]) => ({
    label,
    category: config.category
})).sort((a, b) => a.label.localeCompare(b.label))
