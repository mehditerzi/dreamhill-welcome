import { useEffect, useRef, useState } from 'react'

type AnimatedNumberProps = {
  value: number
  duration: number
  format: (value: number) => string
  className?: string
}

export function AnimatedNumber({ value, duration, format, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value)
  const displayRef = useRef(value)

  useEffect(() => {
    if (duration <= 0 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      displayRef.current = value
      setDisplay(value)
      return
    }
    const from = displayRef.current
    const difference = value - from
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      const next = from + difference * eased
      displayRef.current = next
      setDisplay(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, value])

  return <span className={className}>{format(display)}</span>
}
