import { useEffect, useState } from 'react'
import type { ResilientAsset } from '../config/signage'

type ResilientImageProps = {
  asset: ResilientAsset
  className?: string
  eager?: boolean
}

export function ResilientImage({ asset, className = '', eager = false }: ResilientImageProps) {
  const [stage, setStage] = useState<'remote' | 'fallback' | 'placeholder'>('remote')

  useEffect(() => setStage('remote'), [asset.remote])

  if (stage === 'placeholder') {
    return <div className={`resilient-image resilient-image--placeholder ${className}`} role="img" aria-label={asset.alt}>
      <span aria-hidden="true">DH</span>
    </div>
  }

  return <div className={`resilient-image ${className}`}>
    <img
      src={stage === 'remote' ? asset.remote : asset.fallback}
      alt={asset.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      style={{ objectPosition: asset.position }}
      onError={() => setStage((current) => current === 'remote' ? 'fallback' : 'placeholder')}
    />
  </div>
}
