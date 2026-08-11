import { describe, expect, it } from 'vitest'
import { nextFocus } from './sequence'

describe('presentation sequence', () => {
  it('cycles overview through every room and back', () => {
    expect(nextFocus('overview')).toBe('suite')
    expect(nextFocus('suite')).toBe('french')
    expect(nextFocus('french')).toBe('twin')
    expect(nextFocus('twin')).toBe('overview')
  })
})
