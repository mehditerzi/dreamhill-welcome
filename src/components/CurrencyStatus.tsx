import type { ExchangeStatus } from '../exchange/types'
import { formatRate } from '../exchange/currency'

function statusLabel(status: ExchangeStatus, isOffline: boolean) {
  if (status === 'live') return 'Live'
  if (status === 'cached') return isOffline ? 'Offline · cached' : 'Cached'
  if (status === 'loading') return 'Connecting'
  return isOffline ? 'Offline' : 'Rate unavailable'
}

export function CurrencyStatus({ status, rate, fetchedAt, isOffline }: {
  status: ExchangeStatus
  rate: number | null
  fetchedAt: number | null
  isOffline: boolean
}) {
  const time = fetchedAt ? new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(fetchedAt) : '—'
  const label = statusLabel(status, isOffline)

  return <div className={`currency-status currency-status--${status}`} aria-live="polite">
    <span className="currency-status__pulse" aria-hidden="true" />
    <span className="currency-status__pair">EUR / TRY <strong>{rate ? formatRate(rate) : '—'}</strong></span>
    <span className="currency-status__label">{label}</span>
    <span className="currency-status__time">Updated {time}</span>
  </div>
}
