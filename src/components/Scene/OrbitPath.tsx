import { useMemo } from 'react'
import { Line } from '@react-three/drei'

interface Props {
  radius: number
  color: string
}

export function OrbitPath({ radius, color }: Props) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius,
      ])
    }
    return pts
  }, [radius])

  return (
    <Line points={points} color={color} lineWidth={0.5} opacity={0.3} transparent />
  )
}
