import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { getGlowTexture } from './glowTexture'

// A floating screen playing a real video clip instead of a drawn mockup.
// Decoding video to a GPU texture is expensive, so only a couple of these
// should exist and only on the high tier.
export default function VideoPanel({
  src,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  accent = '#22d3ee',
  seed = 0,
  startAt = 0,
}) {
  const group = useRef(null)

  const video = useMemo(() => {
    const el = document.createElement('video')
    el.src = src
    el.loop = true
    el.muted = true
    el.defaultMuted = true
    el.playsInline = true
    el.setAttribute('playsinline', '')
    el.crossOrigin = 'anonymous'
    el.preload = 'auto'
    return el
  }, [src])

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = false
    return t
  }, [video])

  useEffect(() => {
    let cancelled = false

    const start = () => {
      if (cancelled) return
      if (startAt) {
        try {
          video.currentTime = startAt
        } catch {
          /* seeking before metadata is fine to skip */
        }
      }
      video.play().catch(() => {
        // Autoplay can still be refused; retry once the page is touched.
        const retry = () => {
          video.play().catch(() => {})
          window.removeEventListener('pointerdown', retry)
        }
        window.addEventListener('pointerdown', retry, { once: true })
      })
    }

    if (video.readyState >= 2) start()
    else video.addEventListener('loadeddata', start, { once: true })

    return () => {
      cancelled = true
      video.pause()
      video.removeAttribute('src')
      video.load()
      texture.dispose()
    }
  }, [video, texture, startAt])

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime + seed
    group.current.position.y = position[1] + Math.sin(t * 0.5) * 0.17
    group.current.rotation.z = rotation[2] + Math.sin(t * 0.38) * 0.022
  })

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[4.5, 2.8, 0.09]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color="#141a2e" roughness={0.35} metalness={0.5} />
        <Edges threshold={15} color={accent} scale={1.001} />
      </RoundedBox>

      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[4.28, 2.58]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, -0.16]}>
        <planeGeometry args={[8.8, 6.6]} />
        <meshBasicMaterial
          map={getGlowTexture(accent)}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
