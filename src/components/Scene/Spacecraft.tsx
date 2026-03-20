import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Vector3 } from 'three'
import { useSimulationStore } from '../../state/useSimulationStore'
import { RENDER_SCALE, RENDER_RADII } from '../../simulation/constants'

const _lookTarget = new Vector3()

export function Spacecraft() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const { engine } = useSimulationStore.getState()

    if (!engine.spacecraft || engine.phase === 'setup') {
      meshRef.current.visible = false
      return
    }

    meshRef.current.visible = true

    // Get position from scrub or live
    const snap = engine.getCurrentSnapshot()
    if (!snap) return

    const px = snap.spacecraft.x * RENDER_SCALE
    const py = snap.spacecraft.y * RENDER_SCALE
    const pz = snap.spacecraft.z * RENDER_SCALE
    meshRef.current.position.set(px, py, pz)

    // Orient cone along velocity direction
    const vel = engine.spacecraft.velocity
    _lookTarget.set(
      px + vel.x * 1e10,
      py + vel.y * 1e10,
      pz + vel.z * 1e10,
    )
    meshRef.current.lookAt(_lookTarget)
  })

  return (
    <mesh ref={meshRef} visible={false}>
      <coneGeometry args={[RENDER_RADII.spacecraft * 0.5, RENDER_RADII.spacecraft * 2, 8]} />
      <meshBasicMaterial color="#00ff88" />
    </mesh>
  )
}
