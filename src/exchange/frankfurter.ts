import type { ExchangeRateProvider, RateSnapshot } from './types'

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

type FrankfurterResponse = {
  date?: unknown
  rates?: { TRY?: unknown }
}

export function createFrankfurterProvider(
  endpoint: string,
  fetcher: Fetcher = fetch,
  now: () => number = Date.now,
): ExchangeRateProvider {
  return {
    async fetchRate(signal: AbortSignal): Promise<RateSnapshot> {
      const response = await fetcher(endpoint, {
        signal,
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Exchange-rate request failed: ${response.status}`)
      }

      const data = await response.json() as FrankfurterResponse
      const rate = data.rates?.TRY
      if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0 || typeof data.date !== 'string') {
        throw new Error('Invalid exchange-rate response')
      }

      return { rate, fetchedAt: now(), providerDate: data.date }
    },
  }
}
