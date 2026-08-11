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
    }))
    expect(result.current.focus).toBe('overview')
    act(() => vi.advanceTimersByTime(100))
    expect(result.current.focus).toBe('suite')
    act(() => vi.advanceTimersByTime(80))
    expect(result.current.focus).toBe('french')
  })
})
