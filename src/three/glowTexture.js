import * as THREE from 'three'

const cache = new Map()

// Soft radial falloff used for background colour fields and the
// glow behind floating panels, so they never show a hard edge.
export function getGlowTexture(color) {
  if (cache.has(color)) return cache.get(color)

  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, color)
  g.addColorStop(0.45, color + '88')
  g.addColorStop(1, color + '00')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  cache.set(color, texture)
  return texture
}
