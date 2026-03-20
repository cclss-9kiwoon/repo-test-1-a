import { OrbitControls } from '@react-three/drei'

export function CameraController() {
  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      minDistance={10}
      maxDistance={2000}
      zoomSpeed={0.8}
    />
  )
}
