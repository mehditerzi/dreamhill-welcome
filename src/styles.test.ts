import { describe, expect, it } from 'vitest'
import css from './styles.css?raw'

describe('kiosk layout invariants', () => {
  it('uses a lifted warm-charcoal canvas instead of a near-black field', () => {
    expect(css).toMatch(/--obsidian:\s*#151616;/)
    expect(css).toMatch(/linear-gradient\(152deg,\s*#352711 0%,\s*#1b1c1d 26%,\s*#151719 67%,\s*#2c2213 100%\)/s)
  })

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

  it('defines a closed 36-second animation phase for video export', () => {
    expect(css).toMatch(/\.signage--video::before\s*\{[^}]*animation:\s*video-gold-field 36s linear infinite;/s)
    expect(css).toMatch(/@keyframes video-gold-field\s*\{[^}]*0%,\s*100%\s*\{[^}]*transform:[^}]+}[^}]*50%\s*\{/s)
    expect(css).toMatch(/\.signage--video \.video-currency\s*\{/s)
  })
})
