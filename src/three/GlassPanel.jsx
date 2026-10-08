import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import { createPanelTexture } from './uiTexture'
import { getGlowTexture } from './glowTexture'

export default function GlassPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  kind = 'website',
  seed = 0,
  palette = 0,
  fps = 12,
  floatSpeed = 1,
}) {
  const group = useRef(null)
  const { texture, draw, accent } = useMemo(
    () => createPanelTexture(kind, seed, palette),
    [kind, seed, palette]
  )
  const phase = useMemo(() => seed * 1.7, [seed])
  // stagger redraws so panels don't all upload on the same frame
  const acc = useRef((seed * 0.37) % (1 / fps))
  const elapsed = useRef(seed * 3.1)

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    elapsed.current += delta
    acc.current += delta
    if (acc.current >= 1 / fps) {
      acc.current = 0
      draw(elapsed.current)
    }

    if (!group.current) return
    const t = state.clock.elapsedTime * floatSpeed + phase
    group.current.position.y = position[1] + Math.sin(t * 0.55) * 0.18
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.025
    group.current.rotation.x = rotation[0] + Math.cos(t * 0.33) * 0.02
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[4.3, 2.9, 0.09]} radius={0.08} smoothness={3}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.1}
          transparent
          opacity={0.78}
        />
        <Edges threshold={15} color={accent} scale={1.001} />
      </RoundedBox>

      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[4.08, 2.68]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.16]}>
        <planeGeometry args={[8.4, 6.6]} />
        <meshBasicMaterial
          map={getGlowTexture(accent)}
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
