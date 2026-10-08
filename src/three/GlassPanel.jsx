import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import { makeUITexture, PALETTES } from './uiTexture'
import { getGlowTexture } from './glowTexture'

export default function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  kind = 'website',
  seed = 0,
  palette = 0,
  floatSpeed = 1,
}) {
  const group = useRef(null)
  const texture = useMemo(() => makeUITexture(kind, seed, palette), [kind, seed, palette])
  const accent = PALETTES[palette % PALETTES.length].strong
  const phase = useMemo(() => seed * 1.7, [seed])

  useEffect(() => () => texture.dispose(), [texture])

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
      <RoundedBox args={[3.2, 2.16, 0.08]} radius={0.07} smoothness={3}>
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
        <planeGeometry args={[3.02, 1.98]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* soft colour wash behind the panel */}
      <mesh position={[0, 0, -0.14]}>
        <planeGeometry args={[6.4, 5.0]} />
        <meshBasicMaterial
          map={getGlowTexture(accent)}
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
