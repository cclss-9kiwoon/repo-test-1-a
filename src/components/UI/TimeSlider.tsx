import { useSimulationStore } from '../../state/useSimulationStore'
import { formatTime } from '../../utils/formatting'
import styles from './TimeSlider.module.css'

export function TimeSlider() {
  const phase = useSimulationStore(s => s.phase)
  const historyLength = useSimulationStore(s => s.historyLength)
  const scrubIndex = useSimulationStore(s => s.scrubIndex)
  const time = useSimulationStore(s => s.time)
  const scrubTo = useSimulationStore(s => s.scrubTo)
  const togglePause = useSimulationStore(s => s.togglePause)

  if (phase === 'setup' || historyLength === 0) return null

  const currentIdx = scrubIndex >= 0 ? scrubIndex : historyLength - 1

  return (
    <div className={styles.timeline}>
      <span className={styles.time}>T+0</span>
      <input
        type="range"
        className={styles.slider}
        min={0}
        max={Math.max(historyLength - 1, 0)}
        value={currentIdx}
        onChange={e => {
          const idx = Number(e.target.value)
          // Pause when scrubbing
          if (useSimulationStore.getState().phase === 'running') {
            togglePause()
          }
          scrubTo(idx)
        }}
      />
      <span className={styles.time}>T+{formatTime(time)}</span>
    </div>
  )
}
