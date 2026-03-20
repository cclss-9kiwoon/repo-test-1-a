import { useFrame } from '@react-three/fiber'
import { useSimulationStore } from '../../state/useSimulationStore'

export function SimulationLoop() {
  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps when tab is backgrounded
    const clampedDelta = Math.min(delta, 0.1)
    useSimulationStore.getState().tick(clampedDelta)
  })

  return null
}
