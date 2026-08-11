import type { RoomId } from '../config/signage'

export type PresentationFocus = 'overview' | RoomId

const sequence: readonly PresentationFocus[] = ['overview', 'suite', 'french', 'twin']

export function nextFocus(current: PresentationFocus): PresentationFocus {
  const index = sequence.indexOf(current)
  return sequence[(index + 1) % sequence.length] ?? 'overview'
}
