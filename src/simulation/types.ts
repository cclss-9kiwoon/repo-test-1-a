export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface Body {
  id: string
  mass: number        // kg
  position: Vec3      // AU
  velocity: Vec3      // AU/s
  radius: number      // km (physical radius for collision detection)
  color: string
  renderRadius: number // Three.js units
}

export interface LaunchParams {
  angle: number       // radians, 0 = prograde from Earth's velocity
  speed: number       // km/s, delta-v added to Earth's orbital velocity
}

export interface TrajectoryPoint {
  time: number        // simulation seconds
  spacecraft: Vec3    // AU
  speed: number       // km/s
  distanceToEarth: number  // km
  distanceToMars: number   // km
  distanceToSun: number    // km
}

export type SimPhase = 'setup' | 'running' | 'paused' | 'completed'
