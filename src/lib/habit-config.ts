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
    description: string
    citation_url?: string
    citation_text?: string
}> = {
    // PHYSICAL
    "ACCUMULATE STEPS": {
        category: "PHYSICAL", measurement_type: "quantity", target_value: 10000, unit: "STEPS", frequency_per_week: 7,
        description: "7,000 steps/day associated with 47% lower all-cause mortality vs. 2,000 steps/day.",
        citation_text: "Paluch AE, et al. (2022). The Lancet Public Health",
        citation_url: "https://doi.org/10.1016/S2468-2667(21)00302-9"
    },
    "GET SLEEP": {
        category: "PHYSICAL", measurement_type: "time", target_value: 480, unit: "MIN", frequency_per_week: 7,
        description: "7-8 hours is optimal across 4.4 million participants in 36 systematic reviews.",
        citation_text: "Chaput JP, et al. (2020). Applied Physiology, Nutrition, and Metabolism",
        citation_url: "https://doi.org/10.1139/apnm-2020-0034"
    },
    "MAINTAIN REGULARITY": {
        category: "PHYSICAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Stable sleep timing associated with better mental health, metabolic regulation, and cognitive resilience.",
        citation_text: "Phillips AJK, et al. (2017). Scientific Reports",
        citation_url: "https://doi.org/10.1038/s41598-017-03171-4"
    },
    "EAT BREAKFAST": {
        category: "PHYSICAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Skipping breakfast associated with 27% higher all-cause mortality.",
        citation_text: "Chen H, et al. (2020). Clinical Nutrition",
        citation_url: "https://doi.org/10.1016/j.clnu.2020.02.004"
    },
    "EAT PLANTS": {
        category: "PHYSICAL", measurement_type: "boolean", target_value: 1, unit: "MEAL", frequency_per_week: 7,
        description: "Replacing red meat with plant protein sources associated with lower frailty and mortality risk.",
        citation_text: "Hu FB. (2024). Journal of Internal Medicine",
        citation_url: "https://doi.org/10.1111/joim.13728"
    },
    "TRAIN RESISTANCE": {
        category: "PHYSICAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7,
        description: "Any resistance training reduces all-cause mortality by 15-21%.",
        citation_text: "Shailendra P, et al. (2022). American Journal of Preventive Medicine",
        citation_url: "https://doi.org/10.1016/j.amepre.2022.03.020"
    },
    "HYDRATE MORNING": {
        category: "PHYSICAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Dehydration impairs attention (ES = -0.52) and executive function (ES = -0.24).",
        citation_text: "Wittbrodt MT, Millard-Stafford M. (2018). Medicine & Science in Sports & Exercise",
        citation_url: "https://doi.org/10.1249/MSS.0000000000001682"
    },
    "TAKE BREAKS": {
        category: "PHYSICAL", measurement_type: "quantity", target_value: 5, unit: "BREAKS", frequency_per_week: 7,
        description: "Breaking up sitting improves metabolic markers; 60-75 min daily activity eliminates sitting-related mortality risk.",
        citation_text: "Ekelund U, et al. (2016). The Lancet",
        citation_url: "https://doi.org/10.1016/S0140-6736(16)30370-1"
    },
    "GET SUNLIGHT": {
        category: "PHYSICAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7,
        description: "Morning light advances circadian phase, improves sleep quality and mood.",
        citation_text: "Blume C, et al. (2019). Somnologie",
        citation_url: "https://doi.org/10.1007/s11818-019-00215-x"
    },
    "AVOID LATE-EATING": {
        category: "PHYSICAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Nighttime eating negatively impacts cardiometabolic health and sleep quality.",
        citation_text: "Kinsey AW, Ormsbee MJ. (2015). Nutrients",
        citation_url: "https://doi.org/10.3390/nu7042648"
    },

    // MENTAL
    "PRACTICE MINDFULNESS": {
        category: "MENTAL", measurement_type: "time", target_value: 20, unit: "MIN", frequency_per_week: 7,
        description: "Moderate evidence for improved anxiety (ES 0.38) and depression (ES 0.30).",
        citation_text: "Leung NT, et al. (2024). Psychological Bulletin",
        citation_url: "https://doi.org/10.1037/bul0000431"
    },
    "FOCUS ATTENTION": {
        category: "MENTAL", measurement_type: "time", target_value: 25, unit: "MIN", frequency_per_week: 7,
        description: "Interrupted work takes ~23 minutes to fully resume.",
        citation_text: "Mark G, et al. (2008). CHI Conference Proceedings",
        citation_url: "https://doi.org/10.1145/1357054.1357072"
    },
    "RESTRUCTURE THOUGHTS": {
        category: "MENTAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "CBT shows large effect sizes for depression treatment (g = 0.71).",
        citation_text: "Cuijpers P, et al. (2019). Canadian Journal of Psychiatry",
        citation_url: "https://doi.org/10.1177/0706743718805157"
    },
    "LEARN SKILL": {
        category: "MENTAL", measurement_type: "time", target_value: 30, unit: "MIN", frequency_per_week: 7,
        description: "Sustained learning engagement improves episodic memory and promotes neuroplasticity.",
        citation_text: "Park DC, et al. (2014). Psychological Science",
        citation_url: "https://doi.org/10.1177/0956797613499592"
    },
    "LIMIT MEDIA": {
        category: "MENTAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Most effect sizes between social media and wellbeing are negligible; problematic use is harmful.",
        citation_text: "Hancock JT, et al. (2024). Journal of Computer-Mediated Communication",
        citation_url: "https://doi.org/10.1093/jcmc/zmad055"
    },
    "SCHEDULE WORRY": {
        category: "MENTAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7,
        description: "Confining worry to designated time reduces overall worry and improves sleep.",
        citation_text: "Borkovec TD, et al. (1983). Behaviour Research and Therapy",
        citation_url: "https://doi.org/10.1016/0005-7967(83)90206-1"
    },
    "CREATE FLOW": {
        category: "MENTAL", measurement_type: "time", target_value: 30, unit: "MIN", frequency_per_week: 7,
        description: "Leisure activities independently associated with survival; flow contributes to life satisfaction.",
        citation_text: "Csikszentmihalyi M, LeFevre J. (1989). Journal of Personality and Social Psychology",
        citation_url: "https://doi.org/10.1037/0022-3514.56.5.815"
    },
    "AVOID SCREENS": {
        category: "MENTAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Evening screen use suppresses melatonin and delays circadian rhythm.",
        citation_text: "Chang AM, et al. (2015). PNAS",
        citation_url: "https://doi.org/10.1073/pnas.1418490112"
    },
    "COMPLETE TASKS": {
        category: "MENTAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Completing or planning tasks eliminates cognitive burden of incomplete goals (Zeigarnik effect).",
        citation_text: "Masicampo EJ, Baumeister RF. (2011). Journal of Personality and Social Psychology",
        citation_url: "https://doi.org/10.1037/a0024192"
    },
    "REVIEW DAY": {
        category: "MENTAL", measurement_type: "time", target_value: 5, unit: "MIN", frequency_per_week: 7,
        description: "Reflective practice ('What worked?') improves metacognition and self-awareness.",
        citation_text: "Di Stefano G, et al. (2016). Harvard Business School Working Paper",
        citation_url: "https://doi.org/10.2139/ssrn.2414478"
    },

    // FINANCIAL
    "TRACK EXPENSES": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Expense tracking increases financial control and goal progress.",
        citation_text: "Consumer Financial Protection Bureau. (2015). Research Report",
        citation_url: "https://www.consumerfinance.gov/data-research/research-reports/financial-well-being/"
    },
    "REVIEW ACCOUNTS": {
        category: "FINANCIAL", measurement_type: "time", target_value: 5, unit: "MIN", frequency_per_week: 7,
        description: "Regular financial engagement improves decision quality and reduces avoidance.",
        citation_text: "Hadar L, et al. (2013). Journal of Marketing Research",
        citation_url: "https://doi.org/10.1509/jmr.12.0096"
    },
    "AUTOMATE SAVINGS": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 1,
        description: "Automatic enrollment increased savings from 3.5% to 13.6% over 40 months.",
        citation_text: "Thaler RH, Benartzi S. (2004). Journal of Political Economy",
        citation_url: "https://doi.org/10.1086/380085"
    },
    "DELAY PURCHASE": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Cooling-off periods reduce impulse purchases as emotional arousal subsides.",
        citation_text: "Baumeister RF. (2002). Journal of Consumer Research",
        citation_url: "https://doi.org/10.1086/338209"
    },
    "IDENTIFY LEAK": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "LEAK", frequency_per_week: 1,
        description: "Regular spending review identifies unconscious financial drains.",
        citation_text: "Sussman AB, O'Brien RL. (2016). Journal of Marketing Research",
        citation_url: "https://doi.org/10.1509/jmr.14.0455"
    },
    "CALCULATE LABOR": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Reframing costs in labor hours improves spending-income alignment.",
        citation_text: "Prelec D, Loewenstein G. (1998). Marketing Science",
        citation_url: "https://doi.org/10.1287/mksc.17.1.4"
    },
    "CONTRIBUTE FUNDS": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 1,
        description: "Tax-advantaged contributions significantly increase retirement wealth.",
        citation_text: "Chetty R, et al. (2014). Quarterly Journal of Economics",
        citation_url: "https://doi.org/10.1093/qje/qju013"
    },
    "READ FINANCE": {
        category: "FINANCIAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7,
        description: "Higher financial literacy associated with better decisions and greater wealth.",
        citation_text: "Lusardi A, Mitchell OS. (2014). Journal of Economic Literature",
        citation_url: "https://doi.org/10.1257/jel.52.1.5"
    },
    "REVIEW GOALS": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Specific goals with regular feedback improve performance by 10-25%.",
        citation_text: "Locke EA, Latham GP. (2002). American Psychologist",
        citation_url: "https://doi.org/10.1037/0003-066X.57.9.705"
    },
    "APPRECIATE ASSETS": {
        category: "FINANCIAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Gratitude practice reduces materialistic strivings and increases satisfaction.",
        citation_text: "Emmons RA, McCullough ME. (2003). Journal of Personality and Social Psychology",
        citation_url: "https://doi.org/10.1037/0022-3514.84.2.377"
    },

    // EMOTIONAL
    "JOURNAL GRATITUDE": {
        category: "EMOTIONAL", measurement_type: "quantity", target_value: 3, unit: "ITEMS", frequency_per_week: 7,
        description: "5.8% higher mental health scores, 7.76% lower anxiety symptoms.",
        citation_text: "Cunha LF, et al. (2023). Einstein (São Paulo)",
        citation_url: "https://doi.org/10.31744/einstein_journal/2023RW0371"
    },
    "CONNECT DEEPLY": {
        category: "EMOTIONAL", measurement_type: "quantity", target_value: 1, unit: "PERSON", frequency_per_week: 7,
        description: "Adults without social support 2x more likely to report depression; strong relationships increase survival by 50%.",
        citation_text: "Holt-Lunstad J. (2024). World Psychiatry",
        citation_url: "https://doi.org/10.1002/wps.21224"
    },
    "EXPRESS THANKS": {
        category: "EMOTIONAL", measurement_type: "quantity", target_value: 1, unit: "PERSON", frequency_per_week: 7,
        description: "Gratitude expression strengthens relationships and increases satisfaction.",
        citation_text: "Komase Y, et al. (2021). Journal of Occupational Health",
        citation_url: "https://doi.org/10.1002/1348-9585.12290"
    },
    "WRITE FEELINGS": {
        category: "EMOTIONAL", measurement_type: "time", target_value: 20, unit: "MIN", frequency_per_week: 7,
        description: "68% of journaling interventions effective for mental illness; benefits from 15-20 min over 3-4 days.",
        citation_text: "Sohal M, et al. (2022). Family Medicine and Community Health",
        citation_url: "https://doi.org/10.1136/fmch-2021-001154"
    },
    "LABEL EMOTIONS": {
        category: "EMOTIONAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Precise emotion labeling activates prefrontal regulation of amygdala.",
        citation_text: "Lieberman MD, et al. (2007). Psychological Science",
        citation_url: "https://doi.org/10.1111/j.1467-9280.2007.01916.x"
    },
    "DO KINDNESS": {
        category: "EMOTIONAL", measurement_type: "quantity", target_value: 1, unit: "ACT", frequency_per_week: 7,
        description: "Acts of kindness have small-to-medium effect on actor well-being (d = 0.28).",
        citation_text: "Luberto CM, et al. (2018). Mindfulness",
        citation_url: "https://doi.org/10.1007/s12671-017-0841-8"
    },
    "SET BOUNDARY": {
        category: "EMOTIONAL", measurement_type: "quantity", target_value: 1, unit: "BOUNDARY", frequency_per_week: 7,
        description: "Boundary-setting prevents resentment accumulation and supports psychological health.",
        citation_text: "Tawwab NG. (2021). 'Set Boundaries, Find Peace'",
        citation_url: "https://www.penguinrandomhouse.com/books/647290/set-boundaries-find-peace-by-nedra-glover-tawwab/"
    },
    "ENGAGE TOUCH": {
        category: "EMOTIONAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Physical touch reduces cortisol, increases oxytocin, improves immune function.",
        citation_text: "Field T. (2010). Developmental Review",
        citation_url: "https://doi.org/10.1016/j.dr.2011.01.001"
    },
    "SHOW COMPASSION": {
        category: "EMOTIONAL", measurement_type: "boolean", target_value: 1, unit: "CHECK", frequency_per_week: 7,
        description: "Self-compassion is a stronger predictor of well-being than self-esteem (r = -0.54 with depression/anxiety).",
        citation_text: "Neff KD, Vonk R. (2009). Journal of Personality",
        citation_url: "https://doi.org/10.1111/j.1467-6494.2008.00537.x"
    },
    "SEEK SOLITUDE": {
        category: "EMOTIONAL", measurement_type: "time", target_value: 15, unit: "MIN", frequency_per_week: 7,
        description: "Deliberate solitude improves emotional regulation, creativity, and self-renewal.",
        citation_text: "Nguyen TT, et al. (2018). Journal of Research in Personality",
        citation_url: "https://doi.org/10.1016/j.jrp.2018.02.001"
    },
}

export const HABIT_OPTIONS = Object.entries(HABIT_CONFIG).map(([label, config]) => ({
    label,
    category: config.category
})).sort((a, b) => a.label.localeCompare(b.label))
