import { motion } from "framer-motion"
import { type FriendData, getCompletionTier } from "@/lib/mock-friends"

const COLOR_MAP = {
  green: 'text-green',
  yellow: 'text-yellow',
  pink: 'text-red',
} as const

interface TickerProps {
  friends: FriendData[]
  reverse?: boolean
  /** Extra stat items for bottom ticker */
  stats?: { label: string; value: string; color?: 'green' | 'yellow' | 'pink' }[]
}

export function Ticker({ friends, reverse = false, stats }: TickerProps) {
  const items = stats
    ? stats
    : friends.map(f => ({ label: f.name, value: `${f.completionPct}%`, color: getCompletionTier(f.completionPct) }))

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="border-b border-dark-theme-border py-2.5 overflow-hidden sticky top-0 z-30 bg-grayscale0">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: reverse ? 25 : 30, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="px-8 text-[10px] tracking-[0.15em] text-grayscale50">
              {item.label}{' '}
              <span className={`font-normal ${item.color ? COLOR_MAP[item.color] : 'text-dark-theme-text'}`}>
                {item.value}
              </span>
            </span>
            <span className="text-grayscale25 px-2">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
