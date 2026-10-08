import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles({ count = 200, spread = [40, 22, 70], color = '#8b5cf6' }) {
  const points = useRef(null)

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread[0]
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      positions[i * 3 + 2] = -Math.random() * spread[2] + 6
      speeds[i] = 0.08 + Math.random() * 0.22
    }
    return { positions, speeds }
  }, [count, spread])

  useFrame((state, delta) => {
    if (!points.current) return
    const arr = points.current.geometry.attributes.position.array
    const halfH = spread[1] / 2
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta
      if (arr[i * 3 + 1] > halfH) arr[i * 3 + 1] = -halfH
    }
    points.current.geometry.attributes.position.needsUpdate = true
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.04) * 0.04
  })

  if (!count) return null

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
