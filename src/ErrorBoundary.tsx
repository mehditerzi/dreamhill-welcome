import { Component, type ErrorInfo, type ReactNode } from 'react'
import { signageConfig } from './config/signage'
import { formatEuro } from './exchange/currency'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Signage render failed', error, info)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return <main className="fallback-board">
      <img src={signageConfig.brand.logo.fallback} alt={signageConfig.brand.logo.alt} />
      <p>Room rates</p>
      {signageConfig.rooms.map((room) => <div key={room.id}>
        <h2>{room.name}</h2>
        <span>Single {formatEuro(room.single)}</span>
        <span>Double {formatEuro(room.double)}</span>
      </div>)}
      <small>Please ask reception for assistance.</small>
    </main>
  }
}
