import { describe, expect, it } from 'vitest'
import { signageConfig } from './signage'

describe('signageConfig', () => {
  it('contains the three approved rooms and all supplied EUR prices', () => {
    expect(signageConfig.rooms.map(({ id, single, double }) => ({ id, single, double }))).toEqual([
      { id: 'suite', single: 300, double: 300 },
      { id: 'french', single: 160, double: 180 },
      { id: 'twin', single: 150, double: 170 },
    ])
    expect(signageConfig.extras).toEqual([
      expect.objectContaining({ id: 'extra-bed', price: 25 }),
      expect.objectContaining({ id: 'breakfast', price: 18 }),
    ])
  })

  it('keeps every remote hotel asset on the official domain', () => {
    const urls = [signageConfig.brand.logo.remote, ...signageConfig.rooms.map((room) => room.image.remote)]
    expect(urls.every((url) => new URL(url).hostname === 'www.dreamhillhotel.com')).toBe(true)
  })

  it('uses the current browser-compatible Frankfurter v1 endpoint', () => {
    const endpoint = new URL(signageConfig.currency.endpoint)
    expect(endpoint.hostname).toBe('api.frankfurter.dev')
    expect(endpoint.pathname).toBe('/v1/latest')
    expect(endpoint.searchParams.get('base')).toBe('EUR')
    expect(endpoint.searchParams.get('symbols')).toBe('TRY')
  })
})
