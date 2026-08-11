const euroFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const tryFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

export function convertEurToTry(euro: number, rate: number): number {
  return euro * rate
}

export function formatEuro(value: number): string {
  return euroFormatter.format(value).replace(/\s/g, '')
}

export function formatTry(value: number): string {
  const parts = tryFormatter.formatToParts(value)
  const number = parts.filter((part) => part.type !== 'currency' && part.type !== 'literal').map((part) => part.value).join('')
  return `₺${number}`
}

export function formatRate(value: number): string {
  return value.toFixed(2)
}
