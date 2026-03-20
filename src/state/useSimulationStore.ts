import { create } from 'zustand'
import { SimulationEngine } from '../simulation/engine'
import type { SimPhase } from '../simulation/types'
import { BASE_TIME_RATE, SPEED_MULTIPLIERS, DT } from '../simulation/constants'

interface SimulationState {
  engine: SimulationEngine

  // Reactive state for UI
  phase: SimPhase
  time: number
  speedIndex: number
  launchAngle: number   // degrees
  launchSpeed: number   // km/s

  // Telemetry (from latest snapshot)
  spacecraftSpeed: number
  distanceToEarth: number
  distanceToMars: number
  distanceToSun: number
  marsClosestApproach: number

  // History scrubbing
  scrubIndex: number
  historyLength: number

  // Actions
  setLaunchAngle: (deg: number) => void
  setLaunchSpeed: (kms: number) => void
  launch: () => void
  togglePause: () => void
  setSpeedIndex: (idx: number) => void
  scrubTo: (idx: number) => void
  reset: () => void
  tick: (deltaReal: number) => void
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  engine: new SimulationEngine(),

  phase: 'setup',
  time: 0,
  speedIndex: 0,
  launchAngle: 0,
  launchSpeed: 3.6,

  spacecraftSpeed: 0,
  distanceToEarth: 0,
  distanceToMars: 0,
  distanceToSun: 0,
  marsClosestApproach: Infinity,

  scrubIndex: -1,
  historyLength: 0,

  setLaunchAngle: (deg) => set({ launchAngle: deg }),
  setLaunchSpeed: (kms) => set({ launchSpeed: kms }),

  launch: () => {
    const { engine, launchAngle, launchSpeed } = get()
    const angleRad = (launchAngle * Math.PI) / 180
    engine.launch({ angle: angleRad, speed: launchSpeed })
    set({
      phase: 'running',
      time: engine.time,
      historyLength: engine.history.length,
    })
  },

  togglePause: () => {
    const { engine } = get()
    if (engine.phase === 'running') {
      engine.phase = 'paused'
      set({ phase: 'paused' })
    } else if (engine.phase === 'paused') {
      engine.phase = 'running'
      engine.scrubIndex = -1
      set({ phase: 'running', scrubIndex: -1 })
    }
  },

  setSpeedIndex: (idx) => set({ speedIndex: idx }),

  scrubTo: (idx) => {
    const { engine } = get()
    engine.scrubTo(idx)
    const snap = engine.getCurrentSnapshot()
    if (snap) {
      set({
        scrubIndex: idx,
        time: snap.time,
        spacecraftSpeed: snap.speed,
        distanceToEarth: snap.distanceToEarth,
        distanceToMars: snap.distanceToMars,
        distanceToSun: snap.distanceToSun,
      })
    }
  },

  reset: () => {
    const { engine } = get()
    engine.reset()
    set({
      phase: 'setup',
      time: 0,
      scrubIndex: -1,
      historyLength: 0,
      spacecraftSpeed: 0,
      distanceToEarth: 0,
      distanceToMars: 0,
      distanceToSun: 0,
      marsClosestApproach: Infinity,
    })
  },

  tick: (deltaReal) => {
    const state = get()
    if (state.phase !== 'running') {
      // In setup mode, advance time for planet animation
      if (state.phase === 'setup') {
        state.engine.time += deltaReal * BASE_TIME_RATE
        set({ time: state.engine.time })
      }
      return
    }

    const simSeconds = deltaReal * BASE_TIME_RATE * SPEED_MULTIPLIERS[state.speedIndex]
    const steps = Math.max(1, Math.ceil(simSeconds / DT))

    state.engine.stepN(steps)

    const snap = state.engine.getCurrentSnapshot()
    set({
      time: state.engine.time,
      phase: state.engine.phase,
      historyLength: state.engine.history.length,
      marsClosestApproach: state.engine.marsClosestApproach,
      spacecraftSpeed: snap?.speed ?? 0,
      distanceToEarth: snap?.distanceToEarth ?? 0,
      distanceToMars: snap?.distanceToMars ?? 0,
      distanceToSun: snap?.distanceToSun ?? 0,
    })
  },
}))
