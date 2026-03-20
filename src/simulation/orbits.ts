import type { Vec3 } from './types'
import { ORBITAL_RADII, ORBITAL_PERIODS, INITIAL_MARS_ANGLE_OFFSET } from './constants'

// All orbits are circular and coplanar in the XZ plane (Y = 0).
// Angles measured from +X axis, counter-clockwise when viewed from +Y.

export function earthPosition(t: number): Vec3 {
  const angle = (2 * Math.PI * t) / ORBITAL_PERIODS.earth
  return {
    x: ORBITAL_RADII.earth * Math.cos(angle),
    y: 0,
    z: ORBITAL_RADII.earth * Math.sin(angle),
  }
}

export function earthVelocity(t: number): Vec3 {
  const omega = (2 * Math.PI) / ORBITAL_PERIODS.earth
  const angle = omega * t
  return {
    x: -ORBITAL_RADII.earth * omega * Math.sin(angle),
    y: 0,
    z: ORBITAL_RADII.earth * omega * Math.cos(angle),
  }
}

export function marsPosition(t: number): Vec3 {
  const angle = INITIAL_MARS_ANGLE_OFFSET + (2 * Math.PI * t) / ORBITAL_PERIODS.mars
  return {
    x: ORBITAL_RADII.mars * Math.cos(angle),
    y: 0,
    z: ORBITAL_RADII.mars * Math.sin(angle),
  }
}

export function marsVelocity(t: number): Vec3 {
  const omega = (2 * Math.PI) / ORBITAL_PERIODS.mars
  const angle = INITIAL_MARS_ANGLE_OFFSET + omega * t
  return {
    x: -ORBITAL_RADII.mars * omega * Math.sin(angle),
    y: 0,
    z: ORBITAL_RADII.mars * omega * Math.cos(angle),
  }
}

export function moonPosition(t: number, earthPos: Vec3): Vec3 {
  const angle = (2 * Math.PI * t) / ORBITAL_PERIODS.moon
  return {
    x: earthPos.x + ORBITAL_RADII.moon * Math.cos(angle),
    y: 0,
    z: earthPos.z + ORBITAL_RADII.moon * Math.sin(angle),
  }
}

export function moonVelocity(t: number, earthVel: Vec3): Vec3 {
  const omega = (2 * Math.PI) / ORBITAL_PERIODS.moon
  const angle = omega * t
  return {
    x: earthVel.x - ORBITAL_RADII.moon * omega * Math.sin(angle),
    y: 0,
    z: earthVel.z + ORBITAL_RADII.moon * omega * Math.cos(angle),
  }
}
