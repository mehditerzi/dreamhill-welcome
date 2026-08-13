import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './ErrorBoundary'
import { SignageScreen } from './SignageScreen'
import './styles.css'

const video = new URLSearchParams(window.location.search).get('video') === '1'
const capture = new URLSearchParams(window.location.search).get('capture') === '1'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SignageScreen video={video} capture={capture} />
    </ErrorBoundary>
  </StrictMode>,
)
