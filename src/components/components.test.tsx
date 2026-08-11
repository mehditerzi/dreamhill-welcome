import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { signageConfig } from '../config/signage'
import { CurrencyStatus } from './CurrencyStatus'
import { Extras } from './Extras'
import { ResilientImage } from './ResilientImage'
import { RoomRates } from './RoomRates'

describe('signage components', () => {
  it('falls back from remote image to local image then a composed placeholder', () => {
    const { container } = render(<ResilientImage asset={{ remote: 'https://official.test/a.jpg', fallback: '/local.jpg', alt: 'Room' }} />)
    const image = screen.getByRole('img', { name: 'Room' })
    expect(image).toHaveAttribute('src', 'https://official.test/a.jpg')
    fireEvent.error(image)
    expect(image).toHaveAttribute('src', '/local.jpg')
    fireEvent.error(image)
    expect(container.firstChild).toHaveClass('resilient-image--placeholder')
  })

  it('shows exact room and extras prices and focuses a selected room', () => {
    const onFocus = vi.fn()
    render(<>
      <RoomRates rooms={signageConfig.rooms} rate={52.63} focus="overview" onFocus={onFocus} animationMs={0} />
      <Extras items={signageConfig.extras} rate={52.63} animationMs={0} />
    </>)
    expect(screen.getAllByText('€300')).toHaveLength(2)
    expect(screen.getByText('€160')).toBeInTheDocument()
    expect(screen.getByText('€180')).toBeInTheDocument()
    expect(screen.getByText('€150')).toBeInTheDocument()
    expect(screen.getByText('€170')).toBeInTheDocument()
    expect(screen.getByText('€25')).toBeInTheDocument()
    expect(screen.getByText('€18')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Deluxe French Bed Room/i }))
    expect(onFocus).toHaveBeenCalledWith('french')
  })

  it('distinguishes live and cached exchange status', () => {
    const { rerender } = render(<CurrencyStatus status="live" rate={52.63} fetchedAt={Date.UTC(2026, 7, 11, 9, 38)} isOffline={false} />)
    expect(screen.getByText('Live')).toBeInTheDocument()
    expect(screen.getByText(/52.63/)).toBeInTheDocument()
    rerender(<CurrencyStatus status="cached" rate={52.63} fetchedAt={Date.UTC(2026, 7, 11, 9, 38)} isOffline />)
    expect(screen.getByText('Offline · cached')).toBeInTheDocument()
  })
})
