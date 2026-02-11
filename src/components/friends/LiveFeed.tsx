import { motion } from "framer-motion"
import { type LiveUpdate } from "@/lib/mock-friends"

const HL_COLORS = {
  green: 'text-green',
  yellow: 'text-yellow',
  pink: 'text-red',
} as const

interface LiveFeedProps {
  updates: LiveUpdate[]
}

export function LiveFeed({ updates }: LiveFeedProps) {
  // Duplicate for seamless vertical loop
  const doubled = [...updates, ...updates]

  return (
    <div className="border-t border-dark-theme-border p-6 overflow-hidden h-[200px] relative">
      <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-grayscale50 mb-4">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-green"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        Live Updates
      </div>
      <motion.div
        animate={{ y: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((u, i) => (
          <div key={`${u.id}-${i}`} className="py-2 text-[11px] text-grayscale75 border-b border-dark-theme-border">
            <span className="text-dark-theme-text font-semibold">{u.name}</span>{' '}
            {u.action}{' '}
            <span className={`font-bold ${HL_COLORS[u.highlightColor]}`}>{u.highlight}</span>{' '}
            <span className="text-grayscale50 text-[9px]">{u.timeAgo}</span>
          </div>
        ))}
      </motion.div>
      {/* Fade-out gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-grayscale0 to-transparent pointer-events-none" />
    </div>
  )
}
