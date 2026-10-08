import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function AgentNode({
  position = [0, 0, 0],
  color = '#7c3aed',
  size = 0.42,
  seed = 0,
}) {
  const core = useRef(null)
  const shell = useRef(null)
  const ringA = useRef(null)
  const ringB = useRef(null)
  const phase = useMemo(() => seed * 2.3, [seed])

  useFrame((state) => {
    const t = state.clock.elapsedTime + phase
    const pulse = 1 + Math.sin(t * 1.6) * 0.09

    if (core.current) core.current.scale.setScalar(pulse)
    if (shell.current) {
      shell.current.rotation.y = t * 0.3
      shell.current.rotation.x = t * 0.17
      shell.current.scale.setScalar(1 + Math.sin(t * 1.6 + 0.6) * 0.05)
    }
    if (ringA.current) ringA.current.rotation.z = t * 0.6
    if (ringB.current) ringB.current.rotation.z = -t * 0.42
  })

  return (
    <group position={position}>
      {/* glowing core */}
      <mesh ref={core}>
        <icosahedronGeometry args={[size, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[size * 1.75, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>

      {/* orbit rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[size * 2.5, 0.012, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.5, 0]}>
        <torusGeometry args={[size * 3.1, 0.009, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>

      {/* halo */}
      <mesh>
        <planeGeometry args={[size * 9, size * 9]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} depthWrite={false} />
      </mesh>
    </group>
  )
}
