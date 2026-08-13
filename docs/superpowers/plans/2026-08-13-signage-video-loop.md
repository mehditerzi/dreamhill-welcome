# Signage Video Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a repeatable 1080×1920, 36-second, silent H.264 MP4 loop of the Dream Hill signage with EUR-only prices.

**Architecture:** Add a query-controlled video render mode to the existing React screen, driven by a deterministic 36-second timeline and bundled assets. Add a Node export script that records the built page through Chromium, encodes it with FFmpeg, and verifies the finished media with FFprobe.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Playwright, FFmpeg/FFprobe, H.264 `yuv420p`.

## Global Constraints

- Output resolution is exactly 1080×1920 portrait (9:16).
- Duration is 36 seconds at 30 fps with no audio.
- Video shows EUR prices only and no TRY/live-rate UI.
- The normal live web signage remains unchanged.
- Export uses bundled official hotel assets and does not depend on network access.
- Opening and closing composition is the overview state for loop continuity.

---

### Task 1: Deterministic Video Presentation Mode

**Files:**
- Create: `src/video/timeline.ts`
- Create: `src/video/timeline.test.ts`
- Modify: `src/SignageScreen.tsx`
- Modify: `src/components/RoomRates.tsx`
- Modify: `src/components/Extras.tsx`
- Modify: `src/SignageScreen.test.tsx`

**Interfaces:**
- Produces: `videoFocusAt(elapsedMs: number): PresentationFocus`
- Produces: `SignageScreen` query-controlled `video=1` mode.

- [ ] Write tests proving 0–6 seconds is overview, each room receives 8 seconds, and 30–36 seconds returns to overview.
- [ ] Run `npm test -- src/video/timeline.test.ts` and confirm failure because the module does not exist.
- [ ] Implement `videoFocusAt` as a pure boundary-tested function.
- [ ] Add video mode that avoids the exchange-rate hook/provider, supplies deterministic focus, forces bundled image URLs, and marks the root with `signage--video`.
- [ ] Add `showConversion` props to `RoomRates` and `Extras`; omit TRY markup entirely in video mode.
- [ ] Replace the currency-status footer area with an EUR-only video treatment while keeping the service note.
- [ ] Run focused tests and confirm they pass.

### Task 2: Seamless Export Styling

**Files:**
- Modify: `src/styles.css`
- Modify: `src/styles.test.ts`

**Interfaces:**
- Consumes: root class `signage--video`.
- Produces: a fixed 36-second animation phase whose 0% and 100% visual states match.

- [ ] Add failing CSS invariant tests for hidden TRY elements, EUR-only footer balance, and 36-second closed-loop ambient keyframes.
- [ ] Run the focused test and confirm the expected failure.
- [ ] Implement video-only layout rules and closed-loop keyframes for background bloom, sheen, and hero movement.
- [ ] Run the focused test and confirm it passes.

### Task 3: Reproducible Capture and Encode Command

**Files:**
- Create: `scripts/export-video.mjs`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run export:video`.
- Produces: `exports/dream-hill-room-rates-1080x1920.mp4`.

- [ ] Install Playwright as a development dependency and locate/install its Chromium runtime.
- [ ] Implement a script that serves `dist`, launches Chromium at 1080×1920, records exactly 36 seconds from `?video=1`, closes the browser, and passes the recording to FFmpeg.
- [ ] Encode H.264 with 30 fps, `yuv420p`, no audio, and `+faststart`; isolate temporary media in a generated directory.
- [ ] Use FFprobe in the script to reject wrong codec, resolution, duration, frame rate, pixel format, or audio streams.
- [ ] Document the command and output path; ignore temporary recordings but keep the final export deliverable available locally.

### Task 4: Render and Verify the Final Video

**Files:**
- Generate: `exports/dream-hill-room-rates-1080x1920.mp4`
- Generate: `exports/dream-hill-room-rates-1080x1920-usb.mp4`

**Interfaces:**
- Consumes: `npm run export:video`.
- Produces: final standard and USB-friendly MP4 files.

- [ ] Run the complete test suite, typecheck, and production build.
- [ ] Run `npm run export:video` and allow the real-time 36-second capture to finish.
- [ ] Use FFprobe to verify both media files.
- [ ] Extract representative frames at 0, 8, 16, 24, and 35.9 seconds and inspect them at portrait resolution.
- [ ] Compare opening and closing frames for obvious discontinuity.
- [ ] Commit source/build workflow changes and push `main`; report video paths and sizes.
