import { describe, expect, it, vi } from 'vitest'
import { createFrankfurterProvider } from './frankfurter'

describe('Frankfurter provider', () => {
  it('normalizes a valid EUR/TRY response', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      amount: 1,
      base: 'EUR',
      date: '2026-08-10',
      rates: { TRY: 52.63 },
    }), { status: 200 }))
    const now = () => 123_456

    const result = await createFrankfurterProvider('https://rates.test', fetcher, now).fetchRate(new AbortController().signal)

    expect(result).toEqual({ rate: 52.63, fetchedAt: 123_456, providerDate: '2026-08-10' })
    expect(fetcher).toHaveBeenCalledWith('https://rates.test', expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it.each([undefined, 0, -2, '52.63'])('rejects an invalid TRY rate: %s', async (rate) => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ date: '2026-08-10', rates: { TRY: rate } }), { status: 200 }))
    const provider = createFrankfurterProvider('https://rates.test', fetcher)
    await expect(provider.fetchRate(new AbortController().signal)).rejects.toThrow('Invalid exchange-rate response')
  })

  it('rejects an unsuccessful HTTP response', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    await expect(createFrankfurterProvider('https://rates.test', fetcher).fetchRate(new AbortController().signal)).rejects.toThrow('Exchange-rate request failed: 503')
  })
})
