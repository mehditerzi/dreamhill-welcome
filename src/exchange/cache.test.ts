import { describe, expect, it } from 'vitest'
import { readCachedRate, writeCachedRate } from './cache'

const snapshot = { rate: 52.63, fetchedAt: 123_456, providerDate: '2026-08-10' }

describe('rate cache', () => {
  it('round-trips a valid snapshot', () => {
    writeCachedRate(localStorage, 'rate', snapshot)
    expect(readCachedRate(localStorage, 'rate')).toEqual(snapshot)
  })

  it.each(['{', '{}', '{"rate":0,"fetchedAt":1,"providerDate":"x"}', '{"rate":"52","fetchedAt":1,"providerDate":"x"}'])('ignores invalid cache data', (value) => {
    localStorage.setItem('rate', value)
    expect(readCachedRate(localStorage, 'rate')).toBeNull()
  })
})
