import { motion } from "framer-motion"
import { type FriendData, getCompletionTier } from "@/lib/mock-friends"
import { WeekDots } from "./WeekDots"

const PCT_COLORS = {
  green: 'text-green',
  yellow: 'text-yellow',
  pink: 'text-red',
} as const

const BORDER_HOVER = {
  green: 'after:bg-green',
  yellow: 'after:bg-yellow',
  pink: 'after:bg-red',
} as const

interface FriendCardProps {
  friend: FriendData
  index: number
}

export function FriendCard({ friend, index }: FriendCardProps) {
  const tier = getCompletionTier(friend.completionPct)

  return (
    <motion.div
      className={`
        shrink-0 w-[240px] md:w-[280px] scroll-snap-align-start border border-dark-theme-border p-5 md:p-6
        relative overflow-hidden group
        after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5
        ${BORDER_HOVER[tier]}
        after:scale-x-0 after:origin-left after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.23,1,0.32,1)]
        hover:after:scale-x-100 hover:border-grayscale50
        transition-[border-color] duration-300
      `}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-sm font-bold tracking-widest">{friend.name}</div>
          <div className="text-[9px] text-grayscale50 mt-0.5">{friend.handle}</div>
        </div>
        <div className={`text-[28px] font-bold ${PCT_COLORS[tier]}`}>
          {friend.completionPct}%
        </div>
      </div>
      <div className="text-[11px] text-grayscale75 mb-3">
        <strong className="text-dark-theme-text">{friend.streakWeeks}W</strong> streak · {friend.primaryHabit}
      </div>
      <WeekDots dots={friend.weekDots} color={tier} />
    </motion.div>
  )
}
