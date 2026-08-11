import { useEffect, useState } from 'react'
import { nextFocus, type PresentationFocus } from './sequence'

type PresentationTiming = {
  overviewDurationMs: number
  focusDurationMs: number
}

export function usePresentationCycle(timing: PresentationTiming) {
  const [focus, setFocus] = useState<PresentationFocus>('overview')

  useEffect(() => {
    const duration = focus === 'overview' ? timing.overviewDurationMs : timing.focusDurationMs
    const timer = window.setTimeout(() => setFocus((current) => nextFocus(current)), duration)
    return () => window.clearTimeout(timer)
  }, [focus, timing.focusDurationMs, timing.overviewDurationMs])

  return { focus }
}
