// 1 AU in meters
export const AU = 1.496e11

// Gravitational constant in m³ kg⁻¹ s⁻²
const G_SI = 6.674e-11

// G in AU³ kg⁻¹ s⁻² (for positions in AU)
export const G_AU = G_SI / (AU * AU * AU)

// Body masses in kg
export const MASSES = {
  sun:   1.989e30,
  earth: 5.972e24,
  moon:  7.342e22,
  mars:  6.417e23,
} as const

// Orbital semi-major axes in AU
export const ORBITAL_RADII = {
  earth: 1.0,
  moon:  0.00257,    // ~384,400 km from Earth
  mars:  1.524,
} as const

// Orbital periods in seconds
export const ORBITAL_PERIODS = {
  earth: 365.25 * 24 * 3600,
  moon:  27.322 * 24 * 3600,
  mars:  687.0 * 24 * 3600,
} as const

// Physics timestep in seconds
export const DT = 60

// Rendering: 1 AU = RENDER_SCALE Three.js units
export const RENDER_SCALE = 100

// Moon orbit render multiplier (real distance is too small to see)
export const MOON_ORBIT_RENDER_MULTIPLIER = 20

// Visual radii in Three.js units (not to astronomical scale)
export const RENDER_RADII = {
  sun: 5,
  earth: 1.5,
  moon: 0.4,
  mars: 1.0,
  spacecraft: 0.3,
} as const

// Mars capture proximity in AU (~750,000 km)
export const MARS_CAPTURE_RADIUS = 0.005

// Simulation time rate: sim-seconds per real-second at x1 speed
export const BASE_TIME_RATE = 3600

// Speed multiplier options
export const SPEED_MULTIPLIERS = [1, 10, 100, 1000] as const

// Softening parameter to prevent singularity (AU²)
export const SOFTENING = 1e-10

// Default launch parameters
export const DEFAULT_LAUNCH_ANGLE = 0   // degrees
export const DEFAULT_LAUNCH_SPEED = 3.6 // km/s (Hohmann transfer)

// Initial Mars angle offset to set up favorable transfer window
// Mars should be ~44° ahead of Earth for Hohmann transfer
export const INITIAL_MARS_ANGLE_OFFSET = (44 * Math.PI) / 180
