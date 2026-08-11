export type RoomId = 'suite' | 'french' | 'twin'

export type ResilientAsset = {
  remote: string
  fallback: string
  alt: string
  position?: string
}

export type RoomRate = {
  id: RoomId
  name: string
  shortName: string
  single: number
  double: number
  image: ResilientAsset
}

export type SignageConfig = {
  hotel: { name: string; descriptor: string; location: string }
  brand: { logo: ResilientAsset }
  currency: {
    base: 'EUR'
    quote: 'TRY'
    endpoint: string
    cacheKey: string
    refreshIntervalMs: number
    fetchTimeoutMs: number
    staleAfterMs: number
  }
  presentation: {
    overviewDurationMs: number
    focusDurationMs: number
    numberAnimationMs: number
  }
  rooms: readonly RoomRate[]
  extras: readonly { id: 'extra-bed' | 'breakfast'; name: string; price: number }[]
  note: string
}

const official = 'https://www.dreamhillhotel.com/wp-content/uploads'

export const signageConfig: SignageConfig = {
  hotel: {
    name: 'Dream Hill',
    descriptor: 'Business Deluxe Hotel',
    location: 'İstanbul · Maltepe',
  },
  brand: {
    logo: {
      remote: `${official}/logo-2x-1.png`,
      fallback: './assets/dream-hill/logo.png',
      alt: 'Dream Hill Business Deluxe Hotel',
    },
  },
  currency: {
    base: 'EUR',
    quote: 'TRY',
    endpoint: 'https://api.frankfurter.dev/v1/latest?base=EUR&symbols=TRY',
    cacheKey: 'dream-hill:eur-try-rate:v1',
    refreshIntervalMs: 1_800_000,
    fetchTimeoutMs: 8_000,
    staleAfterMs: 86_400_000,
  },
  presentation: {
    overviewDurationMs: 12_000,
    focusDurationMs: 8_000,
    numberAnimationMs: 1_200,
  },
  rooms: [
    {
      id: 'suite',
      name: 'Suite Room',
      shortName: 'Suite',
      single: 300,
      double: 300,
      image: {
        remote: `${official}/suite-1485x990.jpg`,
        fallback: './assets/dream-hill/suite.jpg',
        alt: 'Dream Hill Suite Room',
        position: 'center 55%',
      },
    },
    {
      id: 'french',
      name: 'Deluxe French Bed Room',
      shortName: 'French Bed',
      single: 160,
      double: 180,
      image: {
        remote: `${official}/deluxe_french_room-1485x990.jpg`,
        fallback: './assets/dream-hill/deluxe-french.jpg',
        alt: 'Dream Hill Deluxe French Bed Room',
        position: 'center 58%',
      },
    },
    {
      id: 'twin',
      name: 'Deluxe Twin Bed Room',
      shortName: 'Twin Bed',
      single: 150,
      double: 170,
      image: {
        remote: `${official}/deluxe_twin_room-1485x990.jpg`,
        fallback: './assets/dream-hill/deluxe-twin.jpg',
        alt: 'Dream Hill Deluxe Twin Bed Room',
        position: 'center 54%',
      },
    },
  ],
  extras: [
    { id: 'extra-bed', name: 'Extra Bed', price: 25 },
    { id: 'breakfast', name: 'Breakfast', price: 18 },
  ],
  note: 'Rates are per room, per night. Tax and service information is available at reception.',
}
