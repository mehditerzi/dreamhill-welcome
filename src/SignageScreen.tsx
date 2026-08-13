import { BrandHeader } from './components/BrandHeader'
import { CurrencyStatus } from './components/CurrencyStatus'
import { Extras } from './components/Extras'
import { HeroGallery } from './components/HeroGallery'
import { RoomRates } from './components/RoomRates'
import { signageConfig } from './config/signage'
import { createFrankfurterProvider } from './exchange/frankfurter'
import type { ExchangeRateProvider } from './exchange/types'
import { useExchangeRate } from './exchange/useExchangeRate'
import { usePresentationCycle } from './presentation/usePresentationCycle'
import { videoFocusAt } from './video/timeline'

const defaultProvider = createFrankfurterProvider(signageConfig.currency.endpoint)

type SignageScreenProps = { provider?: ExchangeRateProvider; video?: boolean; elapsedMs?: number; capture?: boolean }

function Display({ focus, rate, video, exchange }: {
  focus: ReturnType<typeof videoFocusAt>
  rate: number | null
  video: boolean
  exchange?: ReturnType<typeof useExchangeRate>
}) {
  const config = video ? {
    ...signageConfig,
    brand: { logo: { ...signageConfig.brand.logo, remote: signageConfig.brand.logo.fallback } },
    rooms: signageConfig.rooms.map((room) => ({ ...room, image: { ...room.image, remote: room.image.fallback } })),
  } : signageConfig

  return <main className={`signage ${video ? 'signage--video' : ''}`} data-focus={focus}>
    <div className="ambient ambient--one" aria-hidden="true" />
    <div className="ambient ambient--two" aria-hidden="true" />
    <div className="ambient-grain" aria-hidden="true" />

    <div className="signage__frame">
      <BrandHeader config={config} />
      <HeroGallery rooms={config.rooms} focus={focus} />
      <section className="rates-panel" aria-labelledby="rates-title">
        <header className="rates-panel__header">
          <div><p className="section-kicker">Stay with us</p><h1 id="rates-title">Room rates</h1></div>
          <p className="rates-panel__currency">Nightly rates <span>in EUR</span></p>
        </header>
        <RoomRates rooms={config.rooms} rate={rate} focus={focus} animationMs={config.presentation.numberAnimationMs} showConversion={!video} />
      </section>
      <footer className="signage-footer">
        <Extras items={config.extras} rate={rate} animationMs={config.presentation.numberAnimationMs} showConversion={!video} />
        <div className="signage-footer__meta">
          {video
            ? <div className="video-currency"><span>Nightly room rates</span><strong>Prices in EUR</strong></div>
            : exchange && <CurrencyStatus status={exchange.status} rate={rate} fetchedAt={exchange.snapshot?.fetchedAt ?? null} isOffline={exchange.isOffline} />}
          <p className="signage-footer__note">{config.note}</p>
        </div>
      </footer>
    </div>
  </main>
}

function LiveSignage({ provider }: { provider: ExchangeRateProvider }) {
  const exchange = useExchangeRate({
    provider,
    storage: localStorage,
    cacheKey: signageConfig.currency.cacheKey,
    refreshIntervalMs: signageConfig.currency.refreshIntervalMs,
    fetchTimeoutMs: signageConfig.currency.fetchTimeoutMs,
  })
  const presentation = usePresentationCycle(signageConfig.presentation)
  const rate = exchange.snapshot?.rate ?? null

  return <Display focus={presentation.focus} rate={rate} video={false} exchange={exchange} />
}

function VideoSignage({ elapsedMs, capture = false }: { elapsedMs?: number; capture?: boolean }) {
  const [clock, setClock] = useState(elapsedMs ?? 0)
  useEffect(() => {
    if (elapsedMs !== undefined) return
    let timer: number | undefined
    const start = () => {
      const startedAt = performance.now()
      timer = window.setInterval(() => setClock(performance.now() - startedAt), 100)
    }
    if (capture) window.addEventListener('dreamhill-video-start', start, { once: true })
    else start()
    return () => {
      window.removeEventListener('dreamhill-video-start', start)
      if (timer !== undefined) window.clearInterval(timer)
    }
  }, [capture, elapsedMs])
  return <Display focus={videoFocusAt(elapsedMs ?? clock)} rate={null} video />
}

export function SignageScreen({ provider = defaultProvider, video = false, elapsedMs, capture = false }: SignageScreenProps) {
  return video ? <VideoSignage elapsedMs={elapsedMs} capture={capture} /> : <LiveSignage provider={provider} />
}
import { useEffect, useState } from 'react'
