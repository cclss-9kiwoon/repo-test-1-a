import { useSimulationStore } from '../../state/useSimulationStore'
import { formatTime, formatDistance, formatSpeed } from '../../utils/formatting'
import styles from './InfoDashboard.module.css'

export function InfoDashboard() {
  const phase = useSimulationStore(s => s.phase)
  const time = useSimulationStore(s => s.time)
  const speed = useSimulationStore(s => s.spacecraftSpeed)
  const distEarth = useSimulationStore(s => s.distanceToEarth)
  const distMars = useSimulationStore(s => s.distanceToMars)
  const distSun = useSimulationStore(s => s.distanceToSun)

  if (phase === 'setup') {
    return (
      <div className={styles.dashboard}>
        <div className={styles.title}>SwingByMe</div>
        <div className={styles.subtitle}>Gravity Assist Simulator</div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.title}>Mission Telemetry</div>
      <div className={styles.row}>
        <span className={styles.label}>Elapsed</span>
        <span className={styles.value}>{formatTime(time)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Speed</span>
        <span className={styles.value}>{formatSpeed(speed)}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.row}>
        <span className={styles.label}>→ Earth</span>
        <span className={styles.value}>{formatDistance(distEarth)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>→ Mars</span>
        <span className={styles.valueMars}>{formatDistance(distMars)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>→ Sun</span>
        <span className={styles.value}>{formatDistance(distSun)}</span>
      </div>
    </div>
  )
}
