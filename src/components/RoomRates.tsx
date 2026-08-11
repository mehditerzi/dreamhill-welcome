import type { RoomRate } from '../config/signage'
import type { PresentationFocus } from '../presentation/sequence'
import { convertEurToTry, formatEuro, formatTry } from '../exchange/currency'
import { AnimatedNumber } from './AnimatedNumber'

type RoomRatesProps = {
  rooms: readonly RoomRate[]
  rate: number | null
  focus: PresentationFocus
  animationMs: number
}

function PriceColumn({ label, euro, rate, animationMs }: { label: string; euro: number; rate: number | null; animationMs: number }) {
  return <div className="price-column">
    <span className="price-column__label">{label}</span>
    <strong>{formatEuro(euro)}</strong>
    <span className="price-column__try">
      <span aria-hidden="true">≈</span>{' '}
      {rate ? <AnimatedNumber value={convertEurToTry(euro, rate)} duration={animationMs} format={formatTry} /> : <span>₺—</span>}
    </span>
  </div>
}

export function RoomRates({ rooms, rate, focus, animationMs }: RoomRatesProps) {
  return <div className="room-rates">
    {rooms.map((room) => {
      const active = focus === room.id
      return <article
        key={room.id}
        className={`room-rate ${active ? 'is-active' : ''}`}
        aria-current={active ? 'true' : undefined}
      >
        <span className="room-rate__rail" aria-hidden="true" />
        <span className="room-rate__heading">
          <span className="room-rate__category">Accommodation</span>
          <span className="room-rate__name">{room.name}</span>
        </span>
        <span className="room-rate__prices">
          <PriceColumn label="Single" euro={room.single} rate={rate} animationMs={animationMs} />
          <PriceColumn label="Double" euro={room.double} rate={rate} animationMs={animationMs} />
        </span>
      </article>
    })}
  </div>
}
