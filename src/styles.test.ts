import { describe, expect, it } from 'vitest'
import css from './styles.css?raw'

describe('kiosk layout invariants', () => {
  it('uses non-scrollable clipping for the animated signage surface', () => {
    expect(css).toMatch(/\.signage\s*\{[^}]*overflow:\s*clip;/s)
  })

  it('centers the primary composition at an explicit 9:16 aspect ratio', () => {
    expect(css).toMatch(/\.signage__frame\s*\{[^}]*max-width:\s*56\.25dvh;[^}]*margin:\s*0 auto;/s)
  })

  it('displays the supplied logo larger without a decorative container', () => {
    expect(css).toMatch(/\.brand-header\s*\{[^}]*grid-template-columns:\s*minmax\(210px,\s*35%\) 1fr;/s)
    expect(css).toMatch(/\.resilient-image\.brand-header__logo\s*\{[^}]*max-width:\s*340px;[^}]*padding:\s*0;[^}]*border:\s*0;[^}]*background:\s*transparent;[^}]*box-shadow:\s*none;[^}]*overflow:\s*visible;/s)
    expect(css).toMatch(/\.resilient-image\.brand-header__logo::before\s*\{[^}]*inset:\s*-8% -7%;[^}]*background:\s*radial-gradient\([^}]*filter:\s*blur\(14px\);/s)
    expect(css).toMatch(/\.resilient-image\.brand-header__logo img\s*\{[^}]*object-fit:\s*contain;[^}]*filter:\s*none;/s)
  })

  it('gives extras a dedicated text column that cannot escape the card', () => {
    expect(css).toMatch(/\.extra\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,\s*1fr\);/s)
    expect(css).toMatch(/\.extra__name\s*\{[^}]*white-space:\s*nowrap;/s)
  })
})
