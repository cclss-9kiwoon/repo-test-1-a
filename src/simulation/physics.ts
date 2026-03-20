import type { Body, Vec3 } from './types'
import { G_AU, SOFTENING } from './constants'

/**
 * Compute gravitational acceleration on bodies[bodyIndex] from all other bodies.
 * a_i = Σ (j≠i) G * m_j * (r_j - r_i) / |r_j - r_i|³
 */
export function computeAcceleration(bodyIndex: number, bodies: Body[]): Vec3 {
  let ax = 0
  let ay = 0
  let az = 0
  const bi = bodies[bodyIndex]

  for (let j = 0; j < bodies.length; j++) {
    if (j === bodyIndex) continue
    const bj = bodies[j]
    const dx = bj.position.x - bi.position.x
    const dy = bj.position.y - bi.position.y
    const dz = bj.position.z - bi.position.z
    const distSq = dx * dx + dy * dy + dz * dz + SOFTENING
    const dist = Math.sqrt(distSq)
    const factor = G_AU * bj.mass / (distSq * dist)
    ax += factor * dx
    ay += factor * dy
    az += factor * dz
  }

  return { x: ax, y: ay, z: az }
}
