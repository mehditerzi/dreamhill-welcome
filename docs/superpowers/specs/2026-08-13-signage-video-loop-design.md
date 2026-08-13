# Dream Hill Signage Video Loop Design

## Objective

Export the existing Dream Hill portrait signage as a seamless, unattended video loop for hotel TVs and digital-signage players.

## Output

- Primary file: H.264 MP4
- Resolution: 1080 × 1920 portrait (9:16)
- Duration: 36 seconds
- Frame rate: 30 fps
- Pixel format: `yuv420p` for broad TV compatibility
- Audio: none
- Playback: seamless repeating loop

An additional compressed H.264 copy may be generated for USB players with conservative bit-rate requirements.

## Content

The video uses EUR prices only. It does not show TRY conversions, live/cached exchange-rate status, update times, or offline indicators.

The approved prices remain:

- Suite Room — Single €300 / Double €300
- Deluxe French Bed Room — Single €160 / Double €180
- Deluxe Twin Bed Room — Single €150 / Double €170
- Extra Bed — €25
- Breakfast — €18

The hotel logo, hotel name, room photography, room-rate panel, extras, and configured service note remain visible.

## Timeline and Motion

The 36-second loop follows a deterministic sequence:

1. Overview
2. Suite Room focus
3. Deluxe French Bed Room focus
4. Deluxe Twin Bed Room focus
5. Return visually to the same overview state used by the first frame

Motion retains the current restrained ambient bloom, background movement, light sweeps, room-photo transitions, Ken Burns treatment, and room highlighting. Export mode uses a fixed clock so repeated captures produce the same frames and never depend on network timing.

The opening and closing frames must be visually compatible enough to avoid an obvious cut when a signage player repeats the file.

## Architecture

The existing live web signage remains intact. A dedicated export mode disables live currency fetching, hides TRY/status UI, uses EUR-only presentation data, and drives the presentation from deterministic elapsed time.

A repository script will:

1. Build or serve the export-mode application locally.
2. Capture the 1080×1920 canvas for exactly 36 seconds at 30 fps.
3. Encode frames with FFmpeg into H.264 MP4 using `yuv420p` and fast-start metadata.
4. Validate resolution, duration, codec, frame rate, pixel format, and absence of audio.

Generated video artifacts will be placed in a clearly named export directory and documented in the README. Large generated MP4 files will not be pushed to Git unless they fit normal repository limits and the user explicitly requests that distribution method.

## Failure Handling

Video export must use bundled fallback logo and room photographs so it does not fail or change when the network is unavailable. A failed capture or encode exits non-zero and does not report success. Temporary frame files are isolated from source and deployable web assets.

## Verification

- Automated UI tests confirm export mode contains EUR prices and omits TRY/live-rate elements.
- A deterministic timing test confirms the focus sequence and 36-second boundary.
- The rendered first and final frames are compared for loop continuity.
- FFprobe confirms the finished media properties.
- Representative frames are visually inspected at full portrait resolution.
