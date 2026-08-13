import type { PresentationFocus } from '../presentation/sequence'

export const VIDEO_LOOP_MS = 36_000

export function videoFocusAt(elapsedMs: number): PresentationFocus {
  const time = ((elapsedMs % VIDEO_LOOP_MS) + VIDEO_LOOP_MS) % VIDEO_LOOP_MS
  if (time < 6_000) return 'overview'
  if (time < 14_000) return 'suite'
  if (time < 22_000) return 'french'
  if (time < 30_000) return 'twin'
  return 'overview'
}
