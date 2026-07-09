import { Suspense, lazy } from 'react'
import { useNavStore } from '../stores/useNavStore'
import BingBackground from './BingBackground'

const ParticlePlanet = lazy(() => import('./ParticlePlanet'))

export default function Background() {
  const backgroundSource = useNavStore((s) => s.backgroundSource)

  if (backgroundSource === 'planet') {
    return (
      <Suspense fallback={
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
      }>
        <ParticlePlanet />
      </Suspense>
    )
  }

  return <BingBackground />
}
