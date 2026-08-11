# Dream Hill Portrait Signage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a resilient, animated 1080×1920 portrait hotel-rate screen using official Dream Hill assets and live cached EUR/TRY conversion.

**Architecture:** A lightweight Vite/React TypeScript client keeps hotel content in one typed configuration module. Pure exchange and presentation modules isolate network/cache/state behavior from UI components; CSS owns the portrait composition and GPU-friendly motion.

**Tech Stack:** Vite 7, React 19, TypeScript 5, Vitest, Testing Library, CSS custom properties and keyframes, Frankfurter public exchange API.

## Global Constraints

- Optimize first for an exact 1080×1920 portrait viewport with no scrolling or clipping.
- Use only branding and photography sourced from `https://www.dreamhillhotel.com/`.
- Bundle local copies of every hotel asset and retain a CSS-only final fallback.
- Store all hotel content, pricing, asset paths, notes, and timings in one typed configuration module.
- Always show EUR prices; exchange and asset failures must never break or shift the layout.
- Refresh EUR/TRY without overlapping calls, cache only validated successful rates, and animate changed values.
- Respect `prefers-reduced-motion` and keep unattended animation calm.
- Avoid animation libraries and unnecessary runtime dependencies.

---

## File Map

- `package.json`, `tsconfig*.json`, `vite.config.ts`, `index.html`: build/test shell and dark pre-render surface.
- `public/assets/dream-hill/*`: local official logo and room-photo fallbacks.
- `src/config/signage.ts`: all typed hotel content, assets, timing, exchange, and notes.
- `src/exchange/types.ts`: normalized provider and snapshot contracts.
- `src/exchange/frankfurter.ts`: replaceable Frankfurter adapter and response validation.
- `src/exchange/cache.ts`: defensive local-storage serialization.
- `src/exchange/currency.ts`: conversion and locale formatting helpers.
- `src/exchange/useExchangeRate.ts`: polling, status, lifecycle, cache, and network orchestration.
- `src/presentation/sequence.ts`: pure focus-sequence transition helpers.
- `src/presentation/usePresentationCycle.ts`: unattended automatic focus timer.
- `src/components/*`: bounded visual units and error fallback.
- `src/styles.css`: tokenized portrait composition, interaction, motion, and ratio adaptations.
- `src/**/*.test.ts(x)`: behavior tests colocated with modules/components.

---

### Task 1: Project Shell, Configuration, and Official Assets

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/config/signage.test.ts`
- Create: `src/config/signage.ts`
- Create: `public/assets/dream-hill/logo.png`
- Create: `public/assets/dream-hill/suite.jpg`
- Create: `public/assets/dream-hill/deluxe-french.jpg`
- Create: `public/assets/dream-hill/deluxe-twin.jpg`

**Interfaces:**
- Produces: `signageConfig: SignageConfig`, `RoomId`, `RoomRate`, and canonical asset mappings consumed by every later task.

- [ ] **Step 1: Scaffold the Vite/React/TypeScript and Vitest configuration**

Create scripts `dev`, `build`, `typecheck`, `test`, and `test:watch`. Configure Vitest for `jsdom`, React, and `src/test/setup.ts`; keep dependencies limited to React/Vite/Vitest/Testing Library.

- [ ] **Step 2: Write the failing configuration integrity test**

```ts
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
})
```

- [ ] **Step 3: Run the test and verify RED**

Run: `npm test -- src/config/signage.test.ts`
Expected: FAIL because `./signage` does not exist.

- [ ] **Step 4: Implement the typed centralized configuration**

Define `RoomId = 'suite' | 'french' | 'twin'`, resilient asset records with `remote`, `fallback`, `alt`, and `position`, the exact supplied rates, official asset URLs, refresh interval `1_800_000`, fetch timeout `8_000`, presentation durations, `EUR`/`TRY`, and one configurable tax note.

- [ ] **Step 5: Download the four verified official assets into their fallback paths**

Use `curl -fL` for the exact URLs recorded in the design specification, then inspect file types and pixel dimensions with `file` and `sips -g pixelWidth -g pixelHeight`.

- [ ] **Step 6: Run the configuration test and verify GREEN**

Run: `npm test -- src/config/signage.test.ts`
Expected: 2 tests pass.

- [ ] **Step 7: Commit the shell, configuration, and assets**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html src/config public/assets
git commit -m "feat: scaffold signage configuration and official assets"
```

### Task 2: Resilient Exchange-Rate Domain

**Files:**
- Create: `src/exchange/types.ts`
- Create: `src/exchange/frankfurter.test.ts`
- Create: `src/exchange/frankfurter.ts`
- Create: `src/exchange/cache.test.ts`
- Create: `src/exchange/cache.ts`
- Create: `src/exchange/currency.test.ts`
- Create: `src/exchange/currency.ts`
- Create: `src/exchange/useExchangeRate.test.tsx`
- Create: `src/exchange/useExchangeRate.ts`

**Interfaces:**
- Produces: `ExchangeRateProvider.fetchRate(signal): Promise<RateSnapshot>`, `createFrankfurterProvider(url)`, `readCachedRate(storage, key)`, `writeCachedRate(storage, key, snapshot)`, `convertEurToTry(eur, rate)`, `formatTry(value)`, and `useExchangeRate(options): ExchangeRateView`.

- [ ] **Step 1: Write failing provider tests**

Test that a response `{ amount: 1, base: 'EUR', date: '2026-08-10', rates: { TRY: 52.63 } }` normalizes to a finite positive snapshot and that missing, zero, negative, or string rates reject with `Invalid exchange-rate response`.

- [ ] **Step 2: Run provider tests and verify RED**

Run: `npm test -- src/exchange/frankfurter.test.ts`
Expected: FAIL because the adapter is missing.

- [ ] **Step 3: Implement the provider contract and Frankfurter adapter**

The adapter accepts the endpoint in its constructor, uses the supplied `AbortSignal`, checks `response.ok`, validates the nested TRY value, and returns `{ rate, fetchedAt: Date.now(), providerDate }`.

- [ ] **Step 4: Run provider tests and verify GREEN**

Run: `npm test -- src/exchange/frankfurter.test.ts`
Expected: all provider tests pass.

- [ ] **Step 5: Write failing cache and currency tests**

Cover valid snapshot round-trip; missing, malformed, non-finite, and non-positive cached values returning `null`; `160 * 52.63 = 8420.8`; and Turkish whole-lira formatting producing `₺8.421`.

- [ ] **Step 6: Run cache/currency tests and verify RED**

Run: `npm test -- src/exchange/cache.test.ts src/exchange/currency.test.ts`
Expected: FAIL because cache and formatter modules are missing.

- [ ] **Step 7: Implement cache and conversion helpers**

Use guarded JSON parsing and explicit finite-positive validation. Format with `Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 })` and normalize the returned whitespace only for stable display.

- [ ] **Step 8: Run cache/currency tests and verify GREEN**

Run: `npm test -- src/exchange/cache.test.ts src/exchange/currency.test.ts`
Expected: all tests pass.

- [ ] **Step 9: Write failing hook resilience tests**

Using fake timers and a real in-memory `Storage`, test immediate cached display, successful replacement and persistence, failure retention with `cached` state, refresh scheduling, no overlapping requests, and a returned `retry` function.

- [ ] **Step 10: Run hook tests and verify RED**

Run: `npm test -- src/exchange/useExchangeRate.test.tsx`
Expected: FAIL because the hook is missing.

- [ ] **Step 11: Implement the exchange hook**

Initialize from cache synchronously; coordinate one in-flight request with an `AbortController`; set `loading`, `live`, `cached`, or `unavailable`; schedule only the next configured refresh; listen for `online` and visible-document events; and clean up timers/listeners/controllers on unmount.

- [ ] **Step 12: Run all exchange tests and verify GREEN**

Run: `npm test -- src/exchange`
Expected: all exchange tests pass without console warnings.

- [ ] **Step 13: Commit the exchange domain**

```bash
git add src/exchange
git commit -m "feat: add resilient live exchange-rate service"
```

### Task 3: Presentation State and Core Components

**Files:**
- Create: `src/presentation/sequence.test.ts`
- Create: `src/presentation/sequence.ts`
- Create: `src/presentation/usePresentationCycle.test.tsx`
- Create: `src/presentation/usePresentationCycle.ts`
- Create: `src/components/AnimatedNumber.tsx`
- Create: `src/components/ResilientImage.tsx`
- Create: `src/components/BrandHeader.tsx`
- Create: `src/components/HeroGallery.tsx`
- Create: `src/components/RoomRates.tsx`
- Create: `src/components/Extras.tsx`
- Create: `src/components/CurrencyStatus.tsx`

**Interfaces:**
- Consumes: `RoomId`, `RoomRate`, `RateSnapshot`, conversion helpers, and `signageConfig`.
- Produces: `PresentationFocus = 'overview' | RoomId`, `nextFocus(current)`, `usePresentationCycle(config)`, and bounded render components used by `SignageScreen`.

- [ ] **Step 1: Write failing pure sequence tests**

Assert `overview → suite → french → twin → overview` and unknown values falling back to `overview`.

- [ ] **Step 2: Run the sequence test and verify RED**

Run: `npm test -- src/presentation/sequence.test.ts`
Expected: FAIL because `sequence.ts` is missing.

- [ ] **Step 3: Implement the focus transition helper**

Export the literal focus type, ordered sequence, and deterministic `nextFocus` function.

- [ ] **Step 4: Run the sequence test and verify GREEN**

Run: `npm test -- src/presentation/sequence.test.ts`
Expected: all sequence tests pass.

- [ ] **Step 5: Write failing hook tests for automatic focus**

With fake timers, assert focus advances after the configured overview/focus durations through every room and returns to overview.

- [ ] **Step 6: Run the hook test and verify RED**

Run: `npm test -- src/presentation/usePresentationCycle.test.tsx`
Expected: FAIL because the hook is missing.

- [ ] **Step 7: Implement the presentation hook**

Use one automatic timer, expose `{ focus }`, and clean up on unmount.

- [ ] **Step 8: Run presentation tests and verify GREEN**

Run: `npm test -- src/presentation`
Expected: all presentation tests pass.

- [ ] **Step 9: Implement the bounded visual components**

`AnimatedNumber` interpolates from its last displayed value with `requestAnimationFrame`; `ResilientImage` attempts remote, then local, then invokes a CSS-placeholder state; hero layers use `aria-hidden` for inactive images; passive room rows use explicit Single/Double columns and secondary TRY lines; status copy distinguishes Live, Cached, Offline, and Connecting.

- [ ] **Step 10: Add focused component tests**

Test remote-to-local image fallback and final placeholder, exact visible EUR copy in room rows/extras, absence of interactive controls, and cached/live status labels. Run once before component implementation completion to observe missing-behavior failures, then run again after implementation.

- [ ] **Step 11: Run all component and presentation tests**

Run: `npm test -- src/components src/presentation`
Expected: all tests pass without accessibility-role ambiguity.

- [ ] **Step 12: Commit presentation state and components**

```bash
git add src/presentation src/components
git commit -m "feat: add automatic room presentation and rate components"
```

### Task 4: Compose and Style the Premium Portrait Screen

**Files:**
- Create: `src/SignageScreen.test.tsx`
- Create: `src/SignageScreen.tsx`
- Create: `src/ErrorBoundary.tsx`
- Create: `src/main.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`
- Create: `src/vite-env.d.ts`

**Interfaces:**
- Consumes: all configuration, exchange, presentation, and component interfaces.
- Produces: the complete application mounted into `#root`.

- [ ] **Step 1: Write the failing screen integration test**

Render the screen with a deterministic provider and assert the official hotel name, all room names, all six main EUR prices, both extras, converted TRY amounts, configurable note, and a single `main` landmark.

- [ ] **Step 2: Run the integration test and verify RED**

Run: `npm test -- src/SignageScreen.test.tsx`
Expected: FAIL because `SignageScreen.tsx` is missing.

- [ ] **Step 3: Compose the application and branded error boundary**

Connect one exchange hook and one presentation hook at screen level; feed the same focus into hero and ledger; render a static EUR-only fallback rate board from configuration if React catches an unexpected error.

- [ ] **Step 4: Implement the tokenized portrait CSS**

Define the approved six-color palette, type stacks, safe portrait padding, masthead/hero/ledger/footer grid, precise 1080×1920 `clamp()` sizing, focus rail, soft glass surfaces, photograph veil, crossfade/Ken Burns, slow ambient pseudo-elements, glossy gold light sweep, automatic focus states, nearby portrait breakpoints, landscape containment, and complete reduced-motion overrides.

- [ ] **Step 5: Run the integration test and verify GREEN**

Run: `npm test -- src/SignageScreen.test.tsx`
Expected: the screen integration test passes.

- [ ] **Step 6: Run complete unit tests and type checking**

Run: `npm test && npm run typecheck`
Expected: all tests pass and TypeScript exits 0.

- [ ] **Step 7: Commit the composed screen**

```bash
git add index.html src
git commit -m "feat: build cinematic Dream Hill portrait signage"
```

### Task 5: Production and Visual Verification

**Files:**
- Modify only files shown by verification to need correction.

**Interfaces:**
- Consumes: complete app.
- Produces: verified production build and visual evidence.

- [ ] **Step 1: Build the optimized application**

Run: `npm run build`
Expected: Vite exits 0 and writes `dist/` with no unresolved assets.

- [ ] **Step 2: Start the production preview**

Run: `npm run dev -- --host 127.0.0.1`
Expected: server reports a local URL and remains running for browser checks.

- [ ] **Step 3: Verify at exact 1080×1920**

Open the local app in the in-app browser, set the viewport to 1080×1920, wait for image decode, capture a screenshot, and inspect: no scrollbars, no clipping, hero near one-third height, every EUR/TRY value readable, balanced bottom spacing, restrained gold, and official logo/photo rendering.

- [ ] **Step 4: Verify interaction and timing**

Confirm there are no buttons, links, tabbable elements, or pointer/keyboard affordances; use controlled timing to confirm the complete unattended sequence returns to overview and keeps the hero synchronized.

- [ ] **Step 5: Verify degraded operation**

Block the exchange request after a successful load and confirm the prior value remains with cached/offline status. Block official image URLs and confirm local copies render; force both image attempts to fail and confirm the CSS placeholder remains composed.

- [ ] **Step 6: Verify reduced motion and nearby portrait sizes**

Emulate reduced motion and confirm ambient transforms stop. Inspect at 900×1600 and 1200×1920 for clipping and hierarchy.

- [ ] **Step 7: Correct only evidenced visual or behavioral defects**

For each defect, add a failing regression test when behavior is testable, observe RED, implement the smallest correction, rerun GREEN, and recapture the affected viewport.

- [ ] **Step 8: Run the final verification gate**

Run: `npm test && npm run typecheck && npm run build && git status --short`
Expected: zero failing tests, typecheck/build exit 0, and only intentionally uncommitted verification artifacts if any.

- [ ] **Step 9: Commit verified corrections**

```bash
git add src package.json package-lock.json vite.config.ts
git commit -m "fix: polish portrait signage verification details"
```
