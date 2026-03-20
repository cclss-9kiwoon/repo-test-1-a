import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Html } from '@react-three/drei'
import { useSimulationStore } from '../../state/useSimulationStore'
import { RENDER_SCALE, RENDER_RADII, MOON_ORBIT_RENDER_MULTIPLIER, ORBITAL_RADII } from '../../simulation/constants'
import { earthPosition, marsPosition, moonPosition } from '../../simulation/orbits'

interface Props {
  bodyId: 'earth' | 'moon' | 'mars'
}

const CONFIG = {
  earth: { color: '#4A90D9', label: 'Earth', radius: RENDER_RADII.earth },
  moon:  { color: '#C0C0C0', label: 'Moon',  radius: RENDER_RADII.moon },
  mars:  { color: '#E07040', label: 'Mars',  radius: RENDER_RADII.mars },
} as const

export function CelestialBody({ bodyId }: Props) {
  const meshRef = useRef<Mesh>(null)
  const config = CONFIG[bodyId]

  useFrame(() => {
    if (!meshRef.current) return
    const t = useSimulationStore.getState().engine.time

    let pos
    if (bodyId === 'earth') {
      pos = earthPosition(t)
    } else if (bodyId === 'mars') {
      pos = marsPosition(t)
    } else {
      // Moon: render with exaggerated orbit distance
      const ep = earthPosition(t)
      const realMoonPos = moonPosition(t, ep)
      const dx = realMoonPos.x - ep.x
      const dz = realMoonPos.z - ep.z
      pos = {
        x: ep.x + dx * MOON_ORBIT_RENDER_MULTIPLIER,
        y: 0,
        z: ep.z + dz * MOON_ORBIT_RENDER_MULTIPLIER,
      }
    }

    meshRef.current.position.set(
      pos.x * RENDER_SCALE,
      pos.y * RENDER_SCALE,
      pos.z * RENDER_SCALE,
    )
  })

  // Moon orbit ring around Earth (rendered in Earth-local space)
  const moonOrbitRadius = bodyId === 'earth'
    ? ORBITAL_RADII.moon * MOON_ORBIT_RENDER_MULTIPLIER * RENDER_SCALE
    : 0

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.radius, 32, 32]} />
        <meshStandardMaterial color={config.color} roughness={0.7} metalness={0.1} />
        <Html distanceFactor={60} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: 'white', fontSize: '12px', fontWeight: 'bold',
            textShadow: '0 0 4px black', whiteSpace: 'nowrap',
            transform: 'translateY(-20px)',
          }}>
            {config.label}
          </div>
        </Html>
      </mesh>
      {moonOrbitRadius > 0 && (
        <MoonOrbitRing parentRef={meshRef} radius={moonOrbitRadius} />
      )}
    </group>
  )
}

function MoonOrbitRing({ parentRef, radius }: { parentRef: React.RefObject<Mesh | null>, radius: number }) {
  const ringRef = useRef<Mesh>(null)

  useFrame(() => {
    if (!ringRef.current || !parentRef.current) return
    ringRef.current.position.copy(parentRef.current.position)
  })

  return (
    <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
      <meshBasicMaterial color="#C0C0C0" opacity={0.2} transparent />
    </mesh>
  )
}
