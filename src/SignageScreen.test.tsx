import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signageConfig } from './config/signage'
import type { ExchangeRateProvider, RateSnapshot } from './exchange/types'
import { SignageScreen } from './SignageScreen'

describe('SignageScreen', () => {
  beforeEach(() => {
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
})
