import { act, cleanup, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signageConfig } from './config/signage'
import type { ExchangeRateProvider, RateSnapshot } from './exchange/types'
import { SignageScreen } from './SignageScreen'

describe('SignageScreen', () => {
  beforeEach(() => {
    cleanup()
    localStorage.setItem(signageConfig.currency.cacheKey, JSON.stringify({
      rate: 52.63,
      fetchedAt: Date.UTC(2026, 7, 11, 9, 38),
      providerDate: '2026-08-11',
    }))
  })

  it('renders the complete hotel rate board from centralized configuration', () => {
    const provider: ExchangeRateProvider = { fetchRate: vi.fn(() => new Promise<RateSnapshot>(() => undefined)) }
    render(<SignageScreen provider={provider} />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Business Deluxe Hotel')).toBeInTheDocument()
    for (const room of signageConfig.rooms) expect(screen.getByText(room.name)).toBeInTheDocument()
    expect(screen.getAllByText('€300')).toHaveLength(2)
    expect(screen.getByText('€160')).toBeInTheDocument()
    expect(screen.getByText('€180')).toBeInTheDocument()
    expect(screen.getByText('€150')).toBeInTheDocument()
    expect(screen.getByText('€170')).toBeInTheDocument()
    expect(screen.getByText('€25')).toBeInTheDocument()
    expect(screen.getByText('€18')).toBeInTheDocument()
    expect(screen.getAllByText('₺8.421').length).toBeGreaterThan(0)
    expect(screen.getByText(signageConfig.note)).toBeInTheDocument()
  })

  it('renders an offline-safe EUR-only video frame without currency UI', () => {
    render(<SignageScreen video elapsedMs={14_000} />)

    expect(screen.getByRole('main')).toHaveClass('signage--video')
    expect(screen.getByRole('main')).toHaveAttribute('data-focus', 'french')
    expect(screen.getAllByText('€300')).toHaveLength(2)
    expect(screen.queryByText(/TRY/)).not.toBeInTheDocument()
    expect(screen.queryByText(/₺/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument()
    expect(screen.getByText('Prices in EUR')).toBeInTheDocument()
  })

  it('holds capture mode on the opening frame until the recorder starts it', () => {
    vi.useFakeTimers()
    render(<SignageScreen video capture />)
    expect(screen.getByRole('main')).toHaveAttribute('data-focus', 'overview')
    act(() => vi.advanceTimersByTime(7_000))
    expect(screen.getByRole('main')).toHaveAttribute('data-focus', 'overview')
    act(() => window.dispatchEvent(new Event('dreamhill-video-start')))
    act(() => vi.advanceTimersByTime(6_100))
    expect(screen.getByRole('main')).toHaveAttribute('data-focus', 'suite')
    vi.useRealTimers()
  })
})
