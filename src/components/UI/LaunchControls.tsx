import { useSimulationStore } from '../../state/useSimulationStore'
import styles from './LaunchControls.module.css'

export function LaunchControls() {
  const phase = useSimulationStore(s => s.phase)
  const angle = useSimulationStore(s => s.launchAngle)
  const speed = useSimulationStore(s => s.launchSpeed)
  const setAngle = useSimulationStore(s => s.setLaunchAngle)
  const setSpeed = useSimulationStore(s => s.setLaunchSpeed)
  const launch = useSimulationStore(s => s.launch)

  if (phase !== 'setup') return null

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Launch Controls</h3>
      <label className={styles.label}>
        <span>Angle: {angle.toFixed(1)}°</span>
        <input
          type="range"
          min={-180}
          max={180}
          step={0.5}
          value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.hint}>0° = prograde</span>
      </label>
      <label className={styles.label}>
        <span>Delta-v: {speed.toFixed(1)} km/s</span>
        <input
          type="range"
          min={0}
          max={50}
          step={0.1}
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className={styles.slider}
        />
        <span className={styles.hint}>Hohmann ≈ 3.6 km/s</span>
      </label>
      <button className={styles.launchBtn} onClick={launch}>
        Launch!
      </button>
    </div>
  )
}
