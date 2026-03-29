import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface HeroCounterProps {
  value: number
  label: string
  sublabel: string
}

export function HeroCounter({ value, label, sublabel }: HeroCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
    })
    return controls.stop
  }, [value, count])

  return (
    <div className="py-16 md:py-20 text-center relative overflow-hidden bg-black/80">
      <p className="text-[9px] tracking-[0.4em] text-grayscale50 mb-4 font-display">{label}</p>
      <div className="relative inline-block">
        <motion.span
          className="text-2xl md:text-5xl font-mono tracking-normal text-dark-theme-text"
        >
          <CounterDisplay value={rounded} />
        </motion.span>
        <span className="text-2xl md:text-5xl font-mono tracking-normal text-dark-theme-text">%</span>
      </div>
      <p className="text-[11px] tracking-[0.2em] text-grayscale50 mt-4">{sublabel}</p>
    </div>
  )
}

function CounterDisplay({ value }: { value: ReturnType<typeof useTransform<number, number>> }) {
  const displayed = useTransform(value, (v) => String(v))
  return <motion.span>{displayed}</motion.span>
}
