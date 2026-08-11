# Dream Hill Hotel Portrait Signage — Design Specification

## Purpose

Build a production-ready, unattended hotel rate display for a 1080×1920 portrait lobby TV. The screen must present EUR room prices first, approximate TRY conversions second, and feel like a premium hospitality installation rather than a dashboard.

## Approved Direction

The screen uses the **Cinematic Gallery** direction: official Dream Hill photography is the visual anchor, while a quiet charcoal pricing ledger supplies long-distance readability. Motion is slow, synchronized, and atmospheric.

The signature element combines a narrow champagne “focus rail” that travels between room rows with a restrained glossy bloom and slow light sweep. The hero photograph crossfades to the matching official room image, communicating the unattended presentation cycle without resembling a carousel control.

## Visual System

### Palette

- Obsidian — `#090A0B`: base background
- Charcoal glass — `#121416`: elevated surfaces
- Champagne — `#C8A96B`: focus, rules, live indicator
- Warm ivory — `#F3EEE5`: primary text
- Stone — `#A8A29A`: secondary labels and TRY values
- Deep bronze — `#6D5634`: restrained ambient bloom

Gold appears as a deep, glossy ambient bloom over the black base rather than a flat yellow fill. Slow bronze light fields and occasional champagne sweeps create a polished reflective quality while the pricing surfaces remain dark. Photography remains naturally colored under a subtle neutral cinematic grade.

### Typography

- Display and room names: Cormorant Garamond, with a local Georgia fallback
- Prices and interface text: Manrope, with a local system-sans fallback
- Utility labels: Manrope uppercase with expanded tracking

Fonts are requested remotely but the fallback stack preserves layout and legibility if they fail.

### Composition

The 18:9 portrait frame is divided vertically:

1. Brand masthead: about 10%
2. Cinematic official photography: about 33%
3. Room rate ledger: about 43%
4. Extras, live exchange status, and configurable note: about 14%

The app uses a fixed full-viewport shell with safe padding derived from viewport height. It scales as one intentional portrait composition across nearby portrait ratios, rather than reflowing like a desktop page. Landscape receives a readable containment fallback but is not the primary design target.

## Content Model

All presentation data lives in one typed configuration module:

- Hotel name and descriptor
- Base currency and conversion currency
- Suite, Deluxe French Bed, and Deluxe Twin Bed room records
- Single and double EUR prices
- Extra bed and breakfast EUR prices
- Official logo and official room-image URLs
- Bundled fallback asset paths
- Exchange refresh interval and stale threshold
- Overview/focus timing
- Tax/service note

Components receive configuration data rather than embedding hotel content.

## Experience and Motion

The unattended sequence is:

1. Overview
2. Suite focus
3. Deluxe French Bed focus
4. Deluxe Twin Bed focus
5. Overview

Overview lasts slightly longer than focused states. A focused room gains modest height, stronger contrast, the champagne rail, and a restrained halo. Other rows remain fully readable. The hero crossfades to that room’s official photograph and performs a slow GPU-transformed Ken Burns drift.

The display is fully passive. It exposes no hover, pointer, touch, keyboard, click, or focus interactions; room focus is controlled only by the automatic presentation sequence.

Motion respects `prefers-reduced-motion`: transitions become short fades, ambient movement stops, and the automatic content cycle continues without spatial animation.

## Exchange-Rate Architecture

A replaceable exchange-rate provider interface returns a normalized rate and provider timestamp. The initial implementation uses Frankfurter’s public EUR/TRY endpoint, backed by European Central Bank reference data and requiring no API key.

The currency service:

- Loads the last successful normalized snapshot from `localStorage` immediately
- Fetches once at startup and then at the configured interval
- Validates that the response contains a finite, positive TRY rate
- Writes only successful results to cache
- Preserves the prior value on any network, timeout, parsing, or provider error
- Exposes `loading`, `live`, `cached`, and `unavailable` states
- Refetches when connectivity returns and when the tab becomes visible
- Avoids overlapping requests and uses an abort timeout

EUR prices always render. Until a valid rate exists, TRY lines show a stable em dash rather than causing layout movement. Cached rates are labeled as cached/offline. A fetch failure never replaces valid data with an error.

Displayed rate changes and all derived TRY amounts interpolate with `requestAnimationFrame` and an eased curve. The Turkish lira output uses Turkish grouping rules and whole lira precision.

## Asset Strategy

Only assets originating from `https://www.dreamhillhotel.com/` are used for hotel branding and photography:

- `logo-2x-1.png`
- `suite-1485x990.jpg`
- `deluxe_french_room-1485x990.jpg`
- `deluxe_twin_room-1485x990.jpg`

The production project includes optimized local copies of those official files. Runtime image elements prefer the configured official URL, then swap to the corresponding bundled copy on failure. A final CSS gradient/monogram placeholder keeps the composition intact if both fail. Images have reserved dimensions, decoding hints, and controlled object positioning to prevent layout shifts.

## Component Boundaries

- `config`: typed hotel, rates, assets, and timing configuration
- `exchange`: provider adapter, cache, polling service, and formatting helpers
- `presentation`: automatic focus state machine
- `AnimatedNumber`: reusable interpolated numeric display
- `BrandHeader`: resilient official logo and hotel title
- `HeroGallery`: crossfade stack, room captions, and image fallbacks
- `RoomRates`: passive room ledger with automatic focus styling
- `Extras`: extra bed and breakfast prices
- `CurrencyStatus`: live/cached/offline state and update time
- `SignageScreen`: composes the portrait frame and owns cross-component focus state

## Resilience and Kiosk Behavior

The document has no browser-like controls or scrollbars. The app occupies `100dvh`, uses a dark background before JavaScript loads, and prevents accidental text selection. It does not attempt the browser Fullscreen API automatically because browsers require user activation; opening it in browser kiosk/fullscreen mode yields a clean full-screen installation.

An application-level error boundary renders a branded static EUR rate board if an unexpected rendering error occurs. Network errors remain within the exchange and asset services and never reach the boundary.

## Verification

Automated tests cover:

- Exchange response normalization and validation
- Cache read/write and malformed-cache recovery
- EUR-to-TRY conversion and locale formatting
- Complete automatic presentation sequence
- Failed exchange fetch retaining the last successful rate

Production verification includes:

- Type checking and optimized build
- Browser test at exactly 1080×1920
- Screenshot inspection for clipping, hierarchy, contrast, and balanced spacing
- Check that no input controls or interaction affordances are exposed
- Offline check with cached rate and blocked remote images
- Reduced-motion check
- Nearby portrait viewport checks

## Acceptance Criteria

The finished screen fills a 1080×1920 portrait viewport without scrolling or clipping; displays every supplied EUR price accurately; shows validated approximate TRY values whenever live or cached data exists; cycles through overview and room focuses without navigation; uses official Dream Hill branding and room images with local fallbacks; remains legible and intact without network access; and presents a calm, premium visual identity suitable for a modern hotel lobby.
