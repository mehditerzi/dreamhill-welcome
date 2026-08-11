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

const defaultProvider = createFrankfurterProvider(signageConfig.currency.endpoint)

export function SignageScreen({ provider = defaultProvider }: { provider?: ExchangeRateProvider }) {
  const exchange = useExchangeRate({
    provider,
    storage: localStorage,
    cacheKey: signageConfig.currency.cacheKey,
    refreshIntervalMs: signageConfig.currency.refreshIntervalMs,
    fetchTimeoutMs: signageConfig.currency.fetchTimeoutMs,
  })
  const presentation = usePresentationCycle(signageConfig.presentation)
  const rate = exchange.snapshot?.rate ?? null

  return <main className="signage" data-focus={presentation.focus}>
    <div className="ambient ambient--one" aria-hidden="true" />
    <div className="ambient ambient--two" aria-hidden="true" />
    <div className="ambient-grain" aria-hidden="true" />

    <div className="signage__frame">
      <BrandHeader config={signageConfig} />

      <HeroGallery rooms={signageConfig.rooms} focus={presentation.focus} />

      <section className="rates-panel" aria-labelledby="rates-title">
        <header className="rates-panel__header">
          <div>
            <p className="section-kicker">Stay with us</p>
            <h1 id="rates-title">Room rates</h1>
          </div>
          <p className="rates-panel__currency">Nightly rates <span>in EUR</span></p>
        </header>
        <RoomRates
          rooms={signageConfig.rooms}
          rate={rate}
          focus={presentation.focus}
          animationMs={signageConfig.presentation.numberAnimationMs}
        />
      </section>

      <footer className="signage-footer">
        <Extras items={signageConfig.extras} rate={rate} animationMs={signageConfig.presentation.numberAnimationMs} />
        <div className="signage-footer__meta">
          <CurrencyStatus
            status={exchange.status}
            rate={rate}
            fetchedAt={exchange.snapshot?.fetchedAt ?? null}
            isOffline={exchange.isOffline}
          />
          <p className="signage-footer__note">{signageConfig.note}</p>
        </div>
      </footer>
    </div>
  </main>
}
