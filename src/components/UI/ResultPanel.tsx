import { useSimulationStore } from '../../state/useSimulationStore'
import { formatTime, formatDistance } from '../../utils/formatting'
import styles from './ResultPanel.module.css'

export function ResultPanel() {
  const phase = useSimulationStore(s => s.phase)
  const time = useSimulationStore(s => s.time)
  const closestApproach = useSimulationStore(s => s.marsClosestApproach)
  const reset = useSimulationStore(s => s.reset)

  if (phase !== 'completed') return null

  return (
    <div className={styles.backdrop}>
      <div className={styles.panel}>
        <div className={styles.icon}>🎯</div>
        <h2 className={styles.title}>Mars Reached!</h2>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Travel Time</span>
            <span className={styles.statValue}>{formatTime(time)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Closest Approach</span>
            <span className={styles.statValue}>{formatDistance(closestApproach)}</span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={reset}>
          Try Again
        </button>
      </div>
    </div>
  )
}
