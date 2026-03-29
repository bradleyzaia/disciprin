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
    <div className="border-t border-dark-theme-border flex flex-col bg-black/80" style={{ maxHeight: '360px', height: '360px' }}>
      {/* Header — fixed outside scroll */}
      <div className="flex items-center gap-2 text-[9px] tracking-[0.3em] text-grayscale50 px-6 py-3 border-b border-dark-theme-border shrink-0">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-green"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        Live Updates
      </div>
      {/* Scrolling feed */}
      <div className="flex-1 overflow-hidden relative px-6 py-2">
        <motion.div
          animate={{ y: ['0%', '-50%'] }}
          transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        >
          {doubled.map((u, i) => (
            <div key={`${u.id}-${i}`} className="py-2 text-[11px] text-grayscale75 border-b border-dark-theme-border">
              <span className="text-dark-theme-text font-normal">{u.name}</span>{' '}
              {u.action}{' '}
              <span className={`font-normal ${HL_COLORS[u.highlightColor]}`}>{u.highlight}</span>{' '}
              <span className="text-grayscale50 text-[9px]">{u.timeAgo}</span>
            </div>
          ))}
        </motion.div>
        {/* Fade-out gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  )
}
