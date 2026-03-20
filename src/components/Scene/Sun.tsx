import { RENDER_RADII } from '../../simulation/constants'

export function Sun() {
  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={2} distance={0} decay={0} />
      <mesh>
        <sphereGeometry args={[RENDER_RADII.sun, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
    </group>
  )
}
