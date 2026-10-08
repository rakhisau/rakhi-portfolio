import * as THREE from 'three'

const PALETTES = {
  website: ['#7c3aed', '#a78bfa', '#ede9fe'],
  software: ['#0891b2', '#22d3ee', '#cffafe'],
  agent: ['#d97706', '#fbbf24', '#fef3c7'],
}

function rounded(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fill()
}

// Draws a stylised app/website screen so the 3D panels read as real UI
// without shipping any image assets.
export function makeUITexture(kind = 'website', seed = 0) {
  const W = 512
  const H = 340
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const [strong, mid, soft] = PALETTES[kind] || PALETTES.website

  const rand = (n) => {
    const x = Math.sin(seed * 99.7 + n * 17.3) * 10000
    return x - Math.floor(x)
  }

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // top chrome bar
  ctx.fillStyle = '#f1f3f7'
  ctx.fillRect(0, 0, W, 34)
  const dots = ['#ff5f57', '#febc2e', '#28c840']
  dots.forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(22 + i * 20, 17, 6, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = '#e2e5ec'
  rounded(ctx, 100, 9, W - 130, 17, 8)

  if (kind === 'website') {
    // hero band
    const g = ctx.createLinearGradient(0, 34, W, 160)
    g.addColorStop(0, strong)
    g.addColorStop(1, mid)
    ctx.fillStyle = g
    ctx.fillRect(0, 34, W, 126)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    rounded(ctx, 34, 70, 250, 20, 6)
    rounded(ctx, 34, 100, 180, 12, 5)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    rounded(ctx, 34, 126, 96, 20, 10)
    // card row
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#f4f5f9'
      rounded(ctx, 34 + i * 150, 186, 128, 112, 10)
      ctx.fillStyle = soft
      rounded(ctx, 46 + i * 150, 198, 104, 50, 7)
      ctx.fillStyle = '#dfe3ea'
      rounded(ctx, 46 + i * 150, 258, 86, 9, 4)
      rounded(ctx, 46 + i * 150, 274, 62, 9, 4)
    }
  } else if (kind === 'software') {
    // sidebar
    ctx.fillStyle = '#10212b'
    ctx.fillRect(0, 34, 112, H - 34)
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i === 1 ? strong : 'rgba(255,255,255,0.22)'
      rounded(ctx, 16, 56 + i * 32, 80, 12, 6)
    }
    // stat tiles
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#f4f6fa'
      rounded(ctx, 130 + i * 124, 52, 108, 66, 10)
      ctx.fillStyle = strong
      rounded(ctx, 142 + i * 124, 64, 46, 16, 5)
      ctx.fillStyle = '#d7dde6'
      rounded(ctx, 142 + i * 124, 90, 74, 10, 5)
    }
    // chart
    ctx.fillStyle = '#f4f6fa'
    rounded(ctx, 130, 132, 356, 170, 10)
    ctx.strokeStyle = strong
    ctx.lineWidth = 3
    ctx.beginPath()
    for (let i = 0; i <= 10; i++) {
      const x = 150 + i * 32
      const y = 265 - rand(i) * 95
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
    }
    ctx.stroke()
    ctx.fillStyle = mid + '55'
    ctx.lineTo(470, 288)
    ctx.lineTo(150, 288)
    ctx.closePath()
    ctx.fill()
  } else {
    // agent / automation flow canvas
    ctx.fillStyle = '#fbfcfe'
    ctx.fillRect(0, 34, W, H - 34)
    const nodes = [
      [90, 110], [240, 78], [240, 170], [390, 124], [240, 262], [90, 240],
    ]
    ctx.strokeStyle = mid
    ctx.lineWidth = 2.5
    const links = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [5, 4], [0, 5]]
    links.forEach(([a, b]) => {
      ctx.beginPath()
      ctx.moveTo(nodes[a][0], nodes[a][1])
      const mx = (nodes[a][0] + nodes[b][0]) / 2
      ctx.bezierCurveTo(mx, nodes[a][1], mx, nodes[b][1], nodes[b][0], nodes[b][1])
      ctx.stroke()
    })
    nodes.forEach(([x, y], i) => {
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = i % 2 ? strong : mid
      ctx.lineWidth = 3
      rounded(ctx, x - 34, y - 20, 68, 40, 10)
      ctx.beginPath()
      ctx.roundRect(x - 34, y - 20, 68, 40, 10)
      ctx.stroke()
      ctx.fillStyle = i % 2 ? strong : mid
      rounded(ctx, x - 22, y - 8, 30, 7, 3)
      ctx.fillStyle = '#cfd6df'
      rounded(ctx, x - 22, y + 3, 44, 6, 3)
    })
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
