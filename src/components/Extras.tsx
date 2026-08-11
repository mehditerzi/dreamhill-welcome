import { convertEurToTry, formatEuro, formatTry } from '../exchange/currency'
import { AnimatedNumber } from './AnimatedNumber'

type ExtraItem = { id: 'extra-bed' | 'breakfast'; name: string; price: number }

export function Extras({ items, rate, animationMs }: { items: readonly ExtraItem[]; rate: number | null; animationMs: number }) {
  return <div className="extras">
    {items.map((item) => <div className="extra" key={item.id}>
      <span className={`extra__icon extra__icon--${item.id}`} aria-hidden="true" />
      <span className="extra__name">{item.name}</span>
      <strong>{formatEuro(item.price)}</strong>
      <span className="extra__try">≈ {rate ? <AnimatedNumber value={convertEurToTry(item.price, rate)} duration={animationMs} format={formatTry} /> : '₺—'}</span>
    </div>)}
  </div>
}
