import { useCallback, useEffect, useRef, useState } from 'react'
import type { RoomId } from '../config/signage'
import { nextFocus, type PresentationFocus } from './sequence'

type PresentationTiming = {
  overviewDurationMs: number
  focusDurationMs: number
  manualFocusDurationMs: number
}

export function usePresentationCycle(timing: PresentationTiming) {
  const [focus, setFocus] = useState<PresentationFocus>('overview')
  const [isManual, setIsManual] = useState(false)
  const manualTimer = useRef<number | null>(null)

  const clearManualFocus = useCallback(() => {
    if (manualTimer.current) window.clearTimeout(manualTimer.current)
    manualTimer.current = null
    setIsManual(false)
    setFocus('overview')
  }, [])

  const focusManually = useCallback((room: RoomId) => {
    if (manualTimer.current) window.clearTimeout(manualTimer.current)
    setIsManual(true)
    setFocus(room)
    manualTimer.current = window.setTimeout(clearManualFocus, timing.manualFocusDurationMs)
  }, [clearManualFocus, timing.manualFocusDurationMs])

  useEffect(() => {
    if (isManual) return
    const duration = focus === 'overview' ? timing.overviewDurationMs : timing.focusDurationMs
    const timer = window.setTimeout(() => setFocus((current) => nextFocus(current)), duration)
    return () => window.clearTimeout(timer)
  }, [focus, isManual, timing.focusDurationMs, timing.overviewDurationMs])

  useEffect(() => () => {
    if (manualTimer.current) window.clearTimeout(manualTimer.current)
  }, [])

  return { focus, focusManually, clearManualFocus }
}
