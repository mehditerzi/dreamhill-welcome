import { describe, expect, it } from 'vitest'
import { VIDEO_LOOP_MS, videoFocusAt } from './timeline'

describe('videoFocusAt', () => {
  it.each([
    [0, 'overview'],
    [5_999, 'overview'],
    [6_000, 'suite'],
    [13_999, 'suite'],
    [14_000, 'french'],
    [21_999, 'french'],
    [22_000, 'twin'],
    [29_999, 'twin'],
    [30_000, 'overview'],
    [35_999, 'overview'],
    [VIDEO_LOOP_MS, 'overview'],
  ] as const)('maps %dms to %s', (elapsedMs, expected) => {
    expect(videoFocusAt(elapsedMs)).toBe(expected)
  })
})
