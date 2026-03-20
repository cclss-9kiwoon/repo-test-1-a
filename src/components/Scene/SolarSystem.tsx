import { Canvas } from '@react-three/fiber'
import { Sun } from './Sun'
import { CelestialBody } from './CelestialBody'
import { OrbitPath } from './OrbitPath'
import { Spacecraft } from './Spacecraft'
import { TrajectoryLine } from './TrajectoryLine'
import { Starfield } from './Starfield'
import { CameraController } from './CameraController'
import { SimulationLoop } from './SimulationLoop'
import { RENDER_SCALE, ORBITAL_RADII } from '../../simulation/constants'
import styles from './SolarSystem.module.css'

export function SolarSystem() {
  return (
    <div className={styles.container}>
      <Canvas
        camera={{ position: [0, 200, 250], fov: 50, near: 0.1, far: 10000 }}
        gl={{ antialias: true }}
      >
        <SimulationLoop />
        <CameraController />
        <Starfield />
        <ambientLight intensity={0.08} />
        <Sun />
        <OrbitPath radius={RENDER_SCALE * ORBITAL_RADII.earth} color="#4A90D9" />
        <OrbitPath radius={RENDER_SCALE * ORBITAL_RADII.mars} color="#E07040" />
        <CelestialBody bodyId="earth" />
        <CelestialBody bodyId="moon" />
        <CelestialBody bodyId="mars" />
        <Spacecraft />
        <TrajectoryLine />
      </Canvas>
    </div>
  )
}
