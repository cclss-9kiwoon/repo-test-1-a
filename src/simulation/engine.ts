import type { Body, Vec3, LaunchParams, TrajectoryPoint, SimPhase } from './types'
import { MASSES, RENDER_RADII, DT, AU, MARS_CAPTURE_RADIUS, G_AU, SOFTENING } from './constants'
import { earthPosition, earthVelocity, marsPosition, marsVelocity, moonPosition, moonVelocity } from './orbits'
import * as v from './vectors'

export class SimulationEngine {
  time = 0
  spacecraft: Body | null = null
  phase: SimPhase = 'setup'
  history: TrajectoryPoint[] = []
  marsClosestApproach = Infinity // km
  scrubIndex = -1 // -1 = live (latest)

  /** Get all celestial bodies at time t (analytical positions). */
  getBodiesAt(t: number): Body[] {
    const ep = earthPosition(t)
    const ev = earthVelocity(t)
    const mp = marsPosition(t)
    const mv = marsVelocity(t)
    const moonP = moonPosition(t, ep)
    const moonV = moonVelocity(t, ev)

    return [
      {
        id: 'sun', mass: MASSES.sun,
        position: v.create(), velocity: v.create(),
        radius: 696340, color: '#FDB813', renderRadius: RENDER_RADII.sun,
      },
      {
        id: 'earth', mass: MASSES.earth,
        position: ep, velocity: ev,
        radius: 6371, color: '#4A90D9', renderRadius: RENDER_RADII.earth,
      },
      {
        id: 'moon', mass: MASSES.moon,
        position: moonP, velocity: moonV,
        radius: 1737, color: '#C0C0C0', renderRadius: RENDER_RADII.moon,
      },
      {
        id: 'mars', mass: MASSES.mars,
        position: mp, velocity: mv,
        radius: 3390, color: '#E07040', renderRadius: RENDER_RADII.mars,
      },
    ]
  }

  /** Launch spacecraft from Earth with given parameters. */
  launch(params: LaunchParams): void {
    const ep = earthPosition(this.time)
    const ev = earthVelocity(this.time)

    // Launch direction: rotate Earth's prograde direction by params.angle in XZ plane
    const prograde = v.normalize(ev)
    const cosA = Math.cos(params.angle)
    const sinA = Math.sin(params.angle)
    const launchDir: Vec3 = {
      x: prograde.x * cosA - prograde.z * sinA,
      y: 0,
      z: prograde.x * sinA + prograde.z * cosA,
    }

    // Convert speed from km/s to AU/s
    const speedAU = (params.speed * 1000) / AU

    this.spacecraft = {
      id: 'spacecraft',
      mass: 1000,
      position: { ...ep },
      velocity: v.add(ev, v.scale(launchDir, speedAU)),
      radius: 0.01,
      color: '#00ff88',
      renderRadius: RENDER_RADII.spacecraft,
    }

    this.phase = 'running'
    this.history = []
    this.marsClosestApproach = Infinity
    this.scrubIndex = -1
    this.recordSnapshot()
  }

  /** Advance simulation by one time step (Velocity Verlet for spacecraft only). */
  step(): void {
    if (this.phase !== 'running' || !this.spacecraft) return

    const bodies = this.getBodiesAt(this.time)
    const allBodies = [...bodies, this.spacecraft]
    const craftIdx = allBodies.length - 1

    // Compute acceleration at current position
    const accOld = this.computeSpacecraftAccel(craftIdx, allBodies)

    // Update position: x(t+dt) = x(t) + v*dt + 0.5*a*dt²
    const newPos: Vec3 = {
      x: this.spacecraft.position.x + this.spacecraft.velocity.x * DT + 0.5 * accOld.x * DT * DT,
      y: this.spacecraft.position.y + this.spacecraft.velocity.y * DT + 0.5 * accOld.y * DT * DT,
      z: this.spacecraft.position.z + this.spacecraft.velocity.z * DT + 0.5 * accOld.z * DT * DT,
    }

    // Advance time
    this.time += DT

    // Get bodies at new time, compute new acceleration
    const newBodies = this.getBodiesAt(this.time)
    const tempCraft: Body = { ...this.spacecraft, position: newPos }
    const newAll = [...newBodies, tempCraft]
    const accNew = this.computeSpacecraftAccel(craftIdx, newAll)

    // Update velocity: v(t+dt) = v(t) + 0.5*(a_old + a_new)*dt
    this.spacecraft = {
      ...this.spacecraft,
      position: newPos,
      velocity: {
        x: this.spacecraft.velocity.x + 0.5 * (accOld.x + accNew.x) * DT,
        y: this.spacecraft.velocity.y + 0.5 * (accOld.y + accNew.y) * DT,
        z: this.spacecraft.velocity.z + 0.5 * (accOld.z + accNew.z) * DT,
      },
    }

    this.recordSnapshot()
    this.checkMarsArrival()
  }

  /** Run multiple physics steps. */
  stepN(n: number): void {
    for (let i = 0; i < n; i++) {
      this.step()
      if (this.phase !== 'running') break
    }
  }

  /** Scrub to a specific history index. */
  scrubTo(index: number): void {
    if (index < 0 || index >= this.history.length) return
    this.scrubIndex = index
  }

  /** Get the snapshot at current scrub position (or latest). */
  getCurrentSnapshot(): TrajectoryPoint | null {
    if (this.history.length === 0) return null
    const idx = this.scrubIndex >= 0 ? this.scrubIndex : this.history.length - 1
    return this.history[idx] ?? null
  }

  /** Reset to initial state. */
  reset(): void {
    this.time = 0
    this.spacecraft = null
    this.phase = 'setup'
    this.history = []
    this.marsClosestApproach = Infinity
    this.scrubIndex = -1
  }

  private computeSpacecraftAccel(craftIndex: number, bodies: Body[]): Vec3 {
    let ax = 0, ay = 0, az = 0
    const craft = bodies[craftIndex]

    for (let j = 0; j < bodies.length; j++) {
      if (j === craftIndex) continue
      const bj = bodies[j]
      const dx = bj.position.x - craft.position.x
      const dy = bj.position.y - craft.position.y
      const dz = bj.position.z - craft.position.z
      const distSq = dx * dx + dy * dy + dz * dz + SOFTENING
      const dist = Math.sqrt(distSq)
      const factor = G_AU * bj.mass / (distSq * dist)
      ax += factor * dx
      ay += factor * dy
      az += factor * dz
    }

    return { x: ax, y: ay, z: az }
  }

  private recordSnapshot(): void {
    if (!this.spacecraft) return
    const ep = earthPosition(this.time)
    const mp = marsPosition(this.time)
    const speedKms = v.magnitude(this.spacecraft.velocity) * AU / 1000

    const distMars = v.distance(this.spacecraft.position, mp) * AU / 1000
    if (distMars < this.marsClosestApproach) {
      this.marsClosestApproach = distMars
    }

    this.history.push({
      time: this.time,
      spacecraft: { ...this.spacecraft.position },
      speed: speedKms,
      distanceToEarth: v.distance(this.spacecraft.position, ep) * AU / 1000,
      distanceToMars: distMars,
      distanceToSun: v.magnitude(this.spacecraft.position) * AU / 1000,
    })
  }

  private checkMarsArrival(): void {
    if (!this.spacecraft) return
    const mp = marsPosition(this.time)
    const dist = v.distance(this.spacecraft.position, mp)
    if (dist < MARS_CAPTURE_RADIUS) {
      this.phase = 'completed'
    }
  }
}
