import type { SignageConfig } from '../config/signage'
import { ResilientImage } from './ResilientImage'

export function BrandHeader({ config }: { config: SignageConfig }) {
  return <header className="brand-header">
    <ResilientImage asset={config.brand.logo} className="brand-header__logo" eager />
    <div className="brand-header__copy">
      <p className="brand-header__eyebrow">{config.hotel.location}</p>
      <p className="brand-header__name"><span>{config.hotel.name}</span> {config.hotel.descriptor}</p>
    </div>
    <span className="brand-header__rule" aria-hidden="true" />
  </header>
}
