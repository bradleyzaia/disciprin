import { useMemo } from "react"
import { HABIT_CONFIG } from "@/lib/habit-config"
import { Button } from "@/components/ui/Button"
import { ScrambleText } from "@/components/ui/ScrambleText"
import { cn } from "@/lib/utils"
import {
    Activity, Brain, Heart, Wallet,
    Footprints, Moon, Clock, Coffee, Leaf, Dumbbell, Droplet, Armchair, Sun, UtensilsCrossed,
    Target, RefreshCw, BookOpen, PhoneOff, CalendarClock, Zap, MonitorOff, SquareCheck, ClipboardList,
    Receipt, CreditCard, PiggyBank, Hourglass, Search, Calculator, TrendingUp, Newspaper, Goal, Gem,
    BookHeart, Users, HeartHandshake, Pencil, Tag, Shield, Hand, Sparkles, User
} from "lucide-react"

const CATEGORY_ICONS: Record<string, typeof Activity> = {
    PHYSICAL: Activity,
    MENTAL: Brain,
    FINANCIAL: Wallet,
    EMOTIONAL: Heart,
}

const HABIT_ICONS: Record<string, typeof Activity> = {
    // PHYSICAL
    "ACCUMULATE STEPS": Footprints,
    "GET SLEEP": Moon,
    "MAINTAIN REGULARITY": Clock,
    "EAT BREAKFAST": Coffee,
    "EAT PLANTS": Leaf,
    "TRAIN RESISTANCE": Dumbbell,
    "HYDRATE MORNING": Droplet,
    "TAKE BREAKS": Armchair,
    "GET SUNLIGHT": Sun,
    "AVOID LATE-EATING": UtensilsCrossed,

    // MENTAL
    "PRACTICE MINDFULNESS": Brain,
    "FOCUS ATTENTION": Target,
    "RESTRUCTURE THOUGHTS": RefreshCw,
    "LEARN SKILL": BookOpen,
    "LIMIT MEDIA": PhoneOff,
    "SCHEDULE WORRY": CalendarClock,
    "CREATE FLOW": Zap,
    "AVOID SCREENS": MonitorOff,
    "COMPLETE TASKS": SquareCheck,
    "REVIEW DAY": ClipboardList,

    // FINANCIAL
    "TRACK EXPENSES": Receipt,
    "REVIEW ACCOUNTS": CreditCard,
    "AUTOMATE SAVINGS": PiggyBank,
    "DELAY PURCHASE": Hourglass,
    "IDENTIFY LEAK": Search,
    "CALCULATE LABOR": Calculator,
    "CONTRIBUTE FUNDS": TrendingUp,
    "READ FINANCE": Newspaper,
    "REVIEW GOALS": Goal,
    "APPRECIATE ASSETS": Gem,

    // EMOTIONAL
    "JOURNAL GRATITUDE": BookHeart,
    "CONNECT DEEPLY": Users,
    "EXPRESS THANKS": HeartHandshake,
    "WRITE FEELINGS": Pencil,
    "LABEL EMOTIONS": Tag,
    "DO KINDNESS": Heart,
    "SET BOUNDARY": Shield,
    "ENGAGE TOUCH": Hand,
    "SHOW COMPASSION": Sparkles,
    "SEEK SOLITUDE": User,
}

interface PrescriptionsProps {
    onSelect?: (name: string) => void
    onClose: () => void
    className?: string
}

export function Prescriptions({ onSelect, onClose, className }: PrescriptionsProps) {
    const categories = useMemo(() => {
        const grouped: Record<string, Array<{ name: string; config: typeof HABIT_CONFIG[string] }>> = {}

        Object.entries(HABIT_CONFIG).forEach(([name, config]) => {
            if (!grouped[config.category]) {
                grouped[config.category] = []
            }
            grouped[config.category].push({ name, config })
        })

        return grouped
    }, [])

    return (
        <div className={cn("flex-1 flex flex-col p-8 bg-black h-full overflow-hidden", className)}>
            <div className="flex items-center justify-between mb-8 shrink-0">
                <h2 className="text-4xl font-display uppercase">
                    <ScrambleText text="Prescriptions" />
                </h2>
                <Button variant="outline" size="sm" onClick={onClose}>
                    X
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-4 gap-4 pb-8">
                {Object.entries(categories).map(([category, items]) => {
                    const Icon = CATEGORY_ICONS[category]
                    return (
                        <div key={category} className="space-y-4">
                            <h3 className="text-green text-xs font-mono uppercase sticky top-0 bg-black py-2 z-10 flex items-center gap-2">
                                {Icon && <Icon className="size-4" />}
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {items.map(({ name, config }) => {
                                    const HabitIcon = HABIT_ICONS[name]
                                    return (
                                        <button
                                            key={name}
                                            onClick={() => onSelect?.(name)}
                                            className="w-full text-left group hover:bg-white/5 p-3 transition-colors border border-grayscale25 hover:border-dark-theme-border flex flex-col gap-1"
                                        >
                                            <div className="flex items-center justify-between w-full mb-1">
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {HabitIcon && <HabitIcon className="size-4 shrink-0 text-dark-theme-text/60 group-hover:text-white transition-colors" />}
                                                    <span className="text-sm font-mono text-dark-theme-text group-hover:text-white transition-colors truncate">
                                                        {name}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-dark-theme-text/40 group-hover:text-dark-theme-text/80 transition-colors uppercase shrink-0 ml-2">
                                                    {config.frequency_per_week}x/WK
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-dark-theme-text/40 group-hover:text-dark-theme-text/60 truncate w-full uppercase font-mono mb-1">
                                                {config.target_value} {config.unit} • {config.measurement_type}
                                            </div>
                                            {config.description && (
                                                <div className="text-[10px] text-grayscale75 transition-colors leading-relaxed uppercase">
                                                    {config.description}
                                                </div>
                                            )}
                                            {config.citation_url && (
                                                <a
                                                    href={config.citation_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-[8px] text-grayscale50 hover:text-green mt-1 block truncate uppercase"
                                                >
                                                    {config.citation_text || "Source Link"}
                                                </a>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
