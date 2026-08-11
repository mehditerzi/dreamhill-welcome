import { describe, expect, it } from 'vitest'
import css from './styles.css?raw'

describe('kiosk layout invariants', () => {
  it('uses non-scrollable clipping for the animated signage surface', () => {
    expect(css).toMatch(/\.signage\s*\{[^}]*overflow:\s*clip;/s)
  })

  it('centers the primary composition at an explicit 9:16 aspect ratio', () => {
    expect(css).toMatch(/\.signage__frame\s*\{[^}]*max-width:\s*56\.25dvh;[^}]*margin:\s*0 auto;/s)
  })

  it('preserves the supplied logo colors with padded breathing room', () => {
    expect(css).toMatch(/\.brand-header__logo\s*\{[^}]*padding:\s*[^;]+;/s)
    expect(css).toMatch(/\.resilient-image\.brand-header__logo img\s*\{[^}]*object-fit:\s*contain;[^}]*filter:\s*none;/s)
  })

  it('gives extras a dedicated text column that cannot escape the card', () => {
    expect(css).toMatch(/\.extra\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,\s*1fr\);/s)
    expect(css).toMatch(/\.extra__name\s*\{[^}]*white-space:\s*nowrap;/s)
  })
})
