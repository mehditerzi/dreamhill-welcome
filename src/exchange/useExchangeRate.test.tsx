import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ExchangeRateProvider, RateSnapshot } from './types'
import { useExchangeRate } from './useExchangeRate'

const cached: RateSnapshot = { rate: 50, fetchedAt: 1_000, providerDate: '2026-08-09' }
const live: RateSnapshot = { rate: 52.63, fetchedAt: 2_000, providerDate: '2026-08-10' }

function options(provider: ExchangeRateProvider) {
  return {
    provider,
    storage: localStorage,
    cacheKey: 'rate',
    refreshIntervalMs: 30_000,
    fetchTimeoutMs: 5_000,
  }
}

describe('useExchangeRate', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('shows cache immediately and replaces it with a successful live rate', async () => {
    localStorage.setItem('rate', JSON.stringify(cached))
    const provider = { fetchRate: vi.fn().mockResolvedValue(live) }

    const { result } = renderHook(() => useExchangeRate(options(provider)))

    expect(result.current.snapshot).toEqual(cached)
    expect(result.current.status).toBe('cached')
    await waitFor(() => expect(result.current.status).toBe('live'))
    expect(result.current.snapshot).toEqual(live)
    expect(JSON.parse(localStorage.getItem('rate') ?? '')).toEqual(live)
  })

  it('retains the cached rate when refresh fails', async () => {
    localStorage.setItem('rate', JSON.stringify(cached))
    const provider = { fetchRate: vi.fn().mockRejectedValue(new Error('offline')) }

    const { result } = renderHook(() => useExchangeRate(options(provider)))

    await waitFor(() => expect(provider.fetchRate).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(result.current.status).toBe('cached'))
    expect(result.current.snapshot).toEqual(cached)
  })

  it('exposes unavailable when the first request fails without cache', async () => {
    const provider = { fetchRate: vi.fn().mockRejectedValue(new Error('offline')) }
    const { result } = renderHook(() => useExchangeRate(options(provider)))
    await waitFor(() => expect(result.current.status).toBe('unavailable'))
    expect(result.current.snapshot).toBeNull()
  })

  it('does not overlap retries while a request is pending', async () => {
    let resolve!: (value: RateSnapshot) => void
    const pending = new Promise<RateSnapshot>((done) => { resolve = done })
    const provider = { fetchRate: vi.fn().mockReturnValue(pending) }
    const { result } = renderHook(() => useExchangeRate(options(provider)))

    act(() => {
      result.current.retry()
      result.current.retry()
    })
    expect(provider.fetchRate).toHaveBeenCalledTimes(1)

    await act(async () => resolve(live))
    await waitFor(() => expect(result.current.status).toBe('live'))
  })
})
