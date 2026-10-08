import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getGlowTexture } from './glowTexture'

// Big soft colour fields sitting behind the scene. They give each
// chapter its own mood and make the glass panels read clearly.
// Hues are spaced out along the path so neighbouring fields don't
// overlap into muddy tones.
const ZONES = [
  { color: '#8b5cf6', position: [-9, 3, -9], scale: 36, opacity: 0.62, drift: 1.0 },
  { color: '#22d3ee', position: [11, -3, -17], scale: 38, opacity: 0.55, drift: 1.4 },
  { color: '#f472b6', position: [-11, -2, -25], scale: 36, opacity: 0.5, drift: 0.8 },
  { color: '#34d399', position: [10, 4, -33], scale: 38, opacity: 0.48, drift: 1.6 },
  { color: '#f59e0b', position: [-9, 2, -41], scale: 38, opacity: 0.44, drift: 1.2 },
  { color: '#818cf8', position: [4, -3, -48], scale: 40, opacity: 0.56, drift: 1.1 },
]

function Zone({ color, position, scale, opacity, drift }) {
  const mesh = useRef(null)
  const texture = getGlowTexture(color)

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime * 0.12 * drift
    mesh.current.position.x = position[0] + Math.sin(t) * 2.4
    mesh.current.position.y = position[1] + Math.cos(t * 0.8) * 1.6
  })

  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.NormalBlending}
        fog={false}
      />
    </mesh>
  )
}

export default function ColorZones({ count = ZONES.length }) {
  return (
    <group renderOrder={-1}>
      {ZONES.slice(0, count).map((z, i) => (
        <Zone key={i} {...z} />
      ))}
    </group>
  )
}
