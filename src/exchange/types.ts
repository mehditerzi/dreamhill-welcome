export type RateSnapshot = {
  rate: number
  fetchedAt: number
  providerDate: string
}

export type ExchangeRateProvider = {
  fetchRate(signal: AbortSignal): Promise<RateSnapshot>
}

export type ExchangeStatus = 'loading' | 'live' | 'cached' | 'unavailable'

export type ExchangeRateView = {
  snapshot: RateSnapshot | null
  status: ExchangeStatus
  isOffline: boolean
  retry: () => void
}
