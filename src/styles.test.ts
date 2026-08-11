import { describe, expect, it } from 'vitest'
import css from './styles.css?raw'

describe('kiosk layout invariants', () => {
  it('uses non-scrollable clipping for the animated signage surface', () => {
    expect(css).toMatch(/\.signage\s*\{[^}]*overflow:\s*clip;/s)
  })

  it('preserves the supplied logo colors with padded breathing room', () => {
    expect(css).toMatch(/\.brand-header__logo\s*\{[^}]*padding:\s*[^;]+;/s)
    expect(css).toMatch(/\.brand-header__logo img\s*\{[^}]*filter:\s*none;/s)
  })

  it('gives extras a dedicated text column that cannot escape the card', () => {
    expect(css).toMatch(/\.extra\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,\s*1fr\);/s)
    expect(css).toMatch(/\.extra__name\s*\{[^}]*white-space:\s*nowrap;/s)
  })
})
