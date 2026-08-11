import type { RoomRate } from '../config/signage'
import type { PresentationFocus } from '../presentation/sequence'
import { ResilientImage } from './ResilientImage'

export function HeroGallery({ rooms, focus }: { rooms: readonly RoomRate[]; focus: PresentationFocus }) {
  const activeId = focus === 'overview' ? 'suite' : focus
  const active = rooms.find((room) => room.id === activeId) ?? rooms[0]

  return <section className="hero" aria-label="Dream Hill rooms">
    <div className="hero__images">
      {rooms.map((room, index) => <ResilientImage
        key={room.id}
        asset={room.image}
        eager={index === 0}
        className={`hero__image ${room.id === activeId ? 'is-active' : ''}`}
      />)}
    </div>
    <div className="hero__veil" aria-hidden="true" />
    <div className="hero__caption">
      <span className="hero__index">0{rooms.findIndex((room) => room.id === activeId) + 1}</span>
      <div>
        <p>Selected accommodation</p>
        <h2>{active?.shortName}</h2>
      </div>
    </div>
    <div className="hero__progress" aria-hidden="true">
      {rooms.map((room) => <span key={room.id} className={room.id === activeId ? 'is-active' : ''} />)}
    </div>
  </section>
}
