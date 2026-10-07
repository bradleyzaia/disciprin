import { motion } from "framer-motion"

interface WeekDotsProps {
  dots: ('done' | 'miss' | 'pending')[]
  color: 'green' | 'yellow' | 'pink'
}

const DOT_COLORS = {
  done: { green: 'bg-green', yellow: 'bg-green', pink: 'bg-green' },
  miss: { green: 'bg-red/50', yellow: 'bg-red/50', pink: 'bg-red/50' },
  pending: { green: 'bg-grayscale25', yellow: 'bg-grayscale25', pink: 'bg-grayscale25' },
} as const

export function WeekDots({ dots, color }: WeekDotsProps) {
  return (
    <div className="flex gap-1">
      {dots.map((status, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 ${DOT_COLORS[status][color]}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.1 + i * 0.05,
            duration: 0.3,
            ease: [0.23, 1, 0.32, 1],
          }}
        />
      ))}
    </div>
  )
}
