import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import { makeUITexture } from './uiTexture'

const ACCENTS = {
  website: '#7c3aed',
  software: '#0891b2',
  agent: '#d97706',
}

export default function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  kind = 'website',
  seed = 0,
  floatSpeed = 1,
}) {
  const group = useRef(null)
  const texture = useMemo(() => makeUITexture(kind, seed), [kind, seed])
  const accent = ACCENTS[kind] || ACCENTS.website
  const phase = useMemo(() => seed * 1.7, [seed])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime * floatSpeed + phase
    group.current.position.y = position[1] + Math.sin(t * 0.55) * 0.18
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.025
    group.current.rotation.x = rotation[0] + Math.cos(t * 0.33) * 0.02
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      {/* frame */}
      <RoundedBox args={[3.1, 2.1, 0.08]} radius={0.07} smoothness={3}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.72}
        />
        <Edges threshold={15} color={accent} scale={1.001} />
      </RoundedBox>

      {/* screen */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.92, 1.94]} />
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.96} />
      </mesh>

      {/* soft colour wash behind the panel */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshBasicMaterial color={accent} transparent opacity={0.07} />
      </mesh>
    </group>
  )
}
