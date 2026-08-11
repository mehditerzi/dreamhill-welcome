import { describe, expect, it } from 'vitest'
import css from './styles.css?raw'

describe('kiosk layout invariants', () => {
  it('uses non-scrollable clipping for the animated signage surface', () => {
    expect(css).toMatch(/\.signage\s*\{[^}]*overflow:\s*clip;/s)
  })
})
