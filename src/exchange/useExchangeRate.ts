import { useCallback, useEffect, useRef, useState } from 'react'
import { readCachedRate, writeCachedRate } from './cache'
import type { ExchangeRateProvider, ExchangeRateView, ExchangeStatus, RateSnapshot } from './types'

type UseExchangeRateOptions = {
  provider: ExchangeRateProvider
  storage: Storage
  cacheKey: string
  refreshIntervalMs: number
  fetchTimeoutMs: number
}

export function useExchangeRate({
  provider,
  storage,
  cacheKey,
  refreshIntervalMs,
  fetchTimeoutMs,
}: UseExchangeRateOptions): ExchangeRateView {
  const initial = useRef<RateSnapshot | null>(readCachedRate(storage, cacheKey))
  const [snapshot, setSnapshot] = useState<RateSnapshot | null>(initial.current)
  const [status, setStatus] = useState<ExchangeStatus>(initial.current ? 'cached' : 'loading')
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const snapshotRef = useRef(snapshot)
  const inFlight = useRef<AbortController | null>(null)
  const mounted = useRef(true)

  const refresh = useCallback(async () => {
    if (inFlight.current) return
    const controller = new AbortController()
    inFlight.current = controller
    const timeout = window.setTimeout(() => controller.abort(), fetchTimeoutMs)

    try {
      const next = await provider.fetchRate(controller.signal)
      if (!mounted.current) return
      snapshotRef.current = next
      setSnapshot(next)
      setStatus('live')
      setIsOffline(false)
      writeCachedRate(storage, cacheKey, next)
    } catch {
      if (!mounted.current) return
      setIsOffline(typeof navigator !== 'undefined' && !navigator.onLine)
      setStatus(snapshotRef.current ? 'cached' : 'unavailable')
    } finally {
      window.clearTimeout(timeout)
      if (inFlight.current === controller) inFlight.current = null
    }
  }, [cacheKey, fetchTimeoutMs, provider, storage])

  useEffect(() => {
    mounted.current = true
    void refresh()
    const interval = window.setInterval(() => void refresh(), refreshIntervalMs)
    const handleOnline = () => {
      setIsOffline(false)
      void refresh()
    }
    const handleOffline = () => setIsOffline(true)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      mounted.current = false
      window.clearInterval(interval)
      inFlight.current?.abort()
      inFlight.current = null
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refresh, refreshIntervalMs])

  return { snapshot, status, isOffline, retry: refresh }
}
