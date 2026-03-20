import { useSimulationStore } from '../../state/useSimulationStore'
import { SPEED_MULTIPLIERS } from '../../simulation/constants'
import styles from './SimControls.module.css'

export function SimControls() {
  const phase = useSimulationStore(s => s.phase)
  const speedIndex = useSimulationStore(s => s.speedIndex)
  const setSpeedIndex = useSimulationStore(s => s.setSpeedIndex)
  const togglePause = useSimulationStore(s => s.togglePause)
  const reset = useSimulationStore(s => s.reset)

  if (phase === 'setup') return null

  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        onClick={togglePause}
        title={phase === 'running' ? 'Pause' : 'Play'}
      >
        {phase === 'running' ? '⏸' : '▶'}
      </button>

      <div className={styles.speedGroup}>
        {SPEED_MULTIPLIERS.map((mult, i) => (
          <button
            key={mult}
            className={`${styles.speedBtn} ${i === speedIndex ? styles.active : ''}`}
            onClick={() => setSpeedIndex(i)}
          >
            x{mult}
          </button>
        ))}
      </div>

      <button className={styles.btn} onClick={reset} title="Reset">
        ↺
      </button>
    </div>
  )
}
