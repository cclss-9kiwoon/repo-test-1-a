import { LaunchControls } from './LaunchControls'
import { SimControls } from './SimControls'
import { TimeSlider } from './TimeSlider'
import { InfoDashboard } from './InfoDashboard'
import { ResultPanel } from './ResultPanel'
import styles from './Overlay.module.css'

export function Overlay() {
  return (
    <div className={styles.overlay}>
      <div className={styles.topLeft}>
        <InfoDashboard />
      </div>
      <div className={styles.topRight}>
        <LaunchControls />
      </div>
      <div className={styles.bottomCenter}>
        <SimControls />
        <TimeSlider />
      </div>
      <ResultPanel />
    </div>
  )
}
