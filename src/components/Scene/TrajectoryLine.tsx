import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial } from 'three'
import { useSimulationStore } from '../../state/useSimulationStore'
import { RENDER_SCALE } from '../../simulation/constants'

const MAX_POINTS = 500000

export function TrajectoryLine() {
  const lineRef = useRef<Line>(null)
  const lastCountRef = useRef(0)

  const positions = useMemo(() => new Float32Array(MAX_POINTS * 3), [])

  const geometry = useMemo(() => {
    const geom = new BufferGeometry()
    geom.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geom.setDrawRange(0, 0)
    return geom
  }, [positions])

  const material = useMemo(() => new LineBasicMaterial({
    color: '#00ff88',
    opacity: 0.7,
    transparent: true,
  }), [])

  const lineObj = useMemo(() => new Line(geometry, material), [geometry, material])

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  // Reset lastCount when simulation resets
  useFrame(() => {
    const { engine } = useSimulationStore.getState()
    const history = engine.history
    const count = Math.min(history.length, MAX_POINTS)

    // Detect reset
    if (count < lastCountRef.current) {
      lastCountRef.current = 0
    }

    if (count === 0) {
      geometry.setDrawRange(0, 0)
      return
    }

    // Only update new points
    const start = lastCountRef.current
    for (let i = start; i < count; i++) {
      const pt = history[i].spacecraft
      const idx = i * 3
      positions[idx] = pt.x * RENDER_SCALE
      positions[idx + 1] = pt.y * RENDER_SCALE
      positions[idx + 2] = pt.z * RENDER_SCALE
    }

    if (count > lastCountRef.current) {
      const attr = geometry.getAttribute('position') as Float32BufferAttribute
      attr.needsUpdate = true
      lastCountRef.current = count
    }

    // Handle scrub
    const scrubIdx = engine.scrubIndex
    if (scrubIdx >= 0) {
      geometry.setDrawRange(0, Math.min(scrubIdx + 1, count))
    } else {
      geometry.setDrawRange(0, count)
    }
  })

  return <primitive ref={lineRef} object={lineObj} />
}
