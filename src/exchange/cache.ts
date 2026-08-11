import type { RateSnapshot } from './types'

export function isRateSnapshot(value: unknown): value is RateSnapshot {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<RateSnapshot>
  return typeof candidate.rate === 'number'
    && Number.isFinite(candidate.rate)
    && candidate.rate > 0
    && typeof candidate.fetchedAt === 'number'
    && Number.isFinite(candidate.fetchedAt)
    && candidate.fetchedAt > 0
    && typeof candidate.providerDate === 'string'
    && candidate.providerDate.length > 0
}

export function readCachedRate(storage: Storage, key: string): RateSnapshot | null {
  try {
    const raw = storage.getItem(key)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isRateSnapshot(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function writeCachedRate(storage: Storage, key: string, snapshot: RateSnapshot): void {
  if (!isRateSnapshot(snapshot)) return
  try {
    storage.setItem(key, JSON.stringify(snapshot))
  } catch {
    // Storage can be unavailable in strict kiosk/privacy modes.
  }
}
