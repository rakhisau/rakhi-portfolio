import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import { createWorkflowTexture } from './workflowTexture'
import { getGlowTexture } from './glowTexture'

const FPS = 18

export default function WorkflowPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  accent = '#6d28d9',
  seed = 0,
}) {
  const group = useRef(null)
  const acc = useRef(0)
  const elapsed = useRef(0)
  const { texture, draw } = useMemo(() => createWorkflowTexture(accent), [accent])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    // redraw the workflow canvas on a throttled clock
    elapsed.current += delta
    acc.current += delta
    if (acc.current >= 1 / FPS) {
      acc.current = 0
      draw(elapsed.current)
    }

    if (group.current) {
      const t = state.clock.elapsedTime + seed
      group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.16
      group.current.rotation.z = rotation[2] + Math.sin(t * 0.37) * 0.02
    }
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[4.6, 3.1, 0.09]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.08} transparent opacity={0.82} />
        <Edges threshold={15} color={accent} scale={1.001} />
      </RoundedBox>
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[4.36, 2.86]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.16]}>
        <planeGeometry args={[9.0, 7.0]} />
        <meshBasicMaterial
          map={getGlowTexture(accent)}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
