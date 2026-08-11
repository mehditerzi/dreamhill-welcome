import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { usePresentationCycle } from './usePresentationCycle'

describe('usePresentationCycle', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('advances through the automatic focus sequence', () => {
    const { result } = renderHook(() => usePresentationCycle({
      overviewDurationMs: 100,
      focusDurationMs: 80,
      manualFocusDurationMs: 200,
    }))
    expect(result.current.focus).toBe('overview')
    act(() => vi.advanceTimersByTime(100))
    expect(result.current.focus).toBe('suite')
    act(() => vi.advanceTimersByTime(80))
    expect(result.current.focus).toBe('french')
  })

  it('temporarily holds manual focus before returning to overview', () => {
    const { result } = renderHook(() => usePresentationCycle({
      overviewDurationMs: 100,
      focusDurationMs: 80,
      manualFocusDurationMs: 200,
    }))
    act(() => result.current.focusManually('twin'))
    expect(result.current.focus).toBe('twin')
    act(() => vi.advanceTimersByTime(199))
    expect(result.current.focus).toBe('twin')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.focus).toBe('overview')
  })
})
