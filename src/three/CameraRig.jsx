import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Waypoints the camera glides through as the visitor scrolls.
const CAMERA_PATH = [
  [0, 0.5, 10],
  [2.6, 0.8, 3],
  [-2.8, 0.5, -6],
  [2.4, 1.0, -17],
  [-2.2, 0.6, -28],
  [0, 0.4, -38],
]

const TARGET_PATH = [
  [0, 0, 0],
  [0, 0, -7],
  [0, 0, -16],
  [0, 0, -27],
  [0, 0, -38],
  [0, 0, -48],
]

const toCurve = (pts) =>
  new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.4)

export default function CameraRig({ progressRef, interactive = true }) {
  const { camera } = useThree()
  const camCurve = useMemo(() => toCurve(CAMERA_PATH), [])
  const targetCurve = useMemo(() => toCurve(TARGET_PATH), [])

  const current = useRef(0)
  const pos = useRef(new THREE.Vector3(...CAMERA_PATH[0]))
  const look = useRef(new THREE.Vector3(...TARGET_PATH[0]))
  const mouse = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    // ease toward the real scroll position so scrolling feels weighted
    const target = progressRef.current ?? 0
    current.current = THREE.MathUtils.damp(current.current, target, 3.2, delta)
    const u = THREE.MathUtils.clamp(current.current, 0, 1)

    camCurve.getPointAt(u, pos.current)
    targetCurve.getPointAt(u, look.current)

    if (interactive) {
      mouse.current.x = THREE.MathUtils.damp(mouse.current.x, state.pointer.x, 2.5, delta)
      mouse.current.y = THREE.MathUtils.damp(mouse.current.y, state.pointer.y, 2.5, delta)
    }

    camera.position.set(
      pos.current.x + mouse.current.x * 0.9,
      pos.current.y + mouse.current.y * 0.5,
      pos.current.z
    )
    camera.lookAt(look.current)
  })

  return null
}
