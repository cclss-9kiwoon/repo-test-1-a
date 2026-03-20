import { SolarSystem } from './components/Scene/SolarSystem'
import { Overlay } from './components/UI/Overlay'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.app}>
      <SolarSystem />
      <Overlay />
    </div>
  )
}
