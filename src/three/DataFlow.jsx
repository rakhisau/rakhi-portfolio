import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const dummy = new THREE.Object3D()

// A curved connection with pulses travelling along it, so the scene
// reads as "agents passing work between each other".
export default function DataFlow({
  from = [0, 0, 0],
  to = [1, 0, 0],
  color = '#7c3aed',
  pulses = 3,
  speed = 0.35,
  sag = 0.6,
  seed = 0,
}) {
  const instances = useRef(null)

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const mid = a.clone().lerp(b, 0.5)
    mid.y -= sag
    mid.z += sag * 0.4
    return new THREE.QuadraticBezierCurve3(a, mid, b)
  }, [from, to, sag])

  const points = useMemo(() => curve.getPoints(40), [curve])

  useFrame((state) => {
    if (!instances.current) return
    const t = state.clock.elapsedTime * speed + seed
    for (let i = 0; i < pulses; i++) {
      const u = (t + i / pulses) % 1
      const p = curve.getPointAt(u)
      dummy.position.copy(p)
      // fade in/out at the ends
      const fade = Math.sin(u * Math.PI)
      dummy.scale.setScalar(0.055 * fade + 0.012)
      dummy.updateMatrix()
      instances.current.setMatrixAt(i, dummy.matrix)
    }
    instances.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <Line points={points} color={color} lineWidth={1} transparent opacity={0.28} />
      <instancedMesh ref={instances} args={[undefined, undefined, pulses]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </instancedMesh>
    </group>
  )
}
