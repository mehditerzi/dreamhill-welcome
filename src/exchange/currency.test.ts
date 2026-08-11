import { describe, expect, it } from 'vitest'
import { convertEurToTry, formatEuro, formatRate, formatTry } from './currency'

describe('currency helpers', () => {
  it('converts EUR to TRY without premature rounding', () => {
    expect(convertEurToTry(160, 52.63)).toBeCloseTo(8420.8)
  })

  it('formats signage values consistently', () => {
    expect(formatEuro(160)).toBe('€160')
    expect(formatTry(8420.8)).toBe('₺8.421')
    expect(formatRate(52.6319)).toBe('52.63')
  })
})
