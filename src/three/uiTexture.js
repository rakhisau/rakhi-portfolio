import * as THREE from 'three'

export const PALETTES = [
  { key: 'violet', strong: '#6d28d9', mid: '#8b5cf6', soft: '#ede9fe', ink: '#1e1b33' },
  { key: 'cyan', strong: '#0e7490', mid: '#22d3ee', soft: '#cffafe', ink: '#0d2b33' },
  { key: 'amber', strong: '#b45309', mid: '#f59e0b', soft: '#fef3c7', ink: '#3a2408' },
  { key: 'rose', strong: '#be123c', mid: '#fb7185', soft: '#ffe4e6', ink: '#3b0d1b' },
  { key: 'emerald', strong: '#047857', mid: '#34d399', soft: '#d1fae5', ink: '#06281d' },
  { key: 'indigo', strong: '#3730a3', mid: '#818cf8', soft: '#e0e7ff', ink: '#171a3a' },
]

export const W = 640
export const H = 420

const r = (ctx, x, y, w, h, rad = 4) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, rad)
  ctx.fill()
}

const seeded = (seed) => (n) => {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function chrome(ctx, palette, label) {
  ctx.fillStyle = '#eef0f5'
  ctx.fillRect(0, 0, W, 38)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(24 + i * 20, 19, 6, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = '#ffffff'
  r(ctx, 104, 9, W - 150, 20, 10)
  ctx.fillStyle = '#9aa3b2'
  ctx.font = '500 12px system-ui, sans-serif'
  ctx.fillText(label, 118, 23)
}

/* ---------------- Website templates ---------------- */
function drawWebsite(ctx, p, variant, rand) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 38, W, H - 38)

  // nav
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 38, W, 44)
  ctx.fillStyle = p.strong
  r(ctx, 28, 52, 18, 18, 5)
  ctx.fillStyle = p.ink
  r(ctx, 54, 57, 46, 9, 4)
  ctx.fillStyle = '#c8cedb'
  for (let i = 0; i < 4; i++) r(ctx, 300 + i * 56, 58, 40, 8, 4)
  ctx.fillStyle = p.strong
  r(ctx, W - 96, 50, 68, 22, 11)

  if (variant === 0) {
    // ---- SaaS landing: split hero ----
    const g = ctx.createLinearGradient(0, 82, W, 300)
    g.addColorStop(0, p.soft)
    g.addColorStop(1, '#ffffff')
    ctx.fillStyle = g
    ctx.fillRect(0, 82, W, 218)

    ctx.fillStyle = p.strong
    r(ctx, 40, 110, 96, 20, 10)
    ctx.fillStyle = p.ink
    r(ctx, 40, 144, 252, 22, 6)
    r(ctx, 40, 174, 196, 22, 6)
    ctx.fillStyle = '#aab2c2'
    r(ctx, 40, 212, 236, 10, 5)
    r(ctx, 40, 230, 188, 10, 5)
    ctx.fillStyle = p.strong
    r(ctx, 40, 256, 104, 30, 15)
    ctx.strokeStyle = '#cfd6e4'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(156, 256, 96, 30, 15)
    ctx.stroke()

    // hero visual
    ctx.fillStyle = '#ffffff'
    r(ctx, 330, 112, 272, 174, 12)
    ctx.strokeStyle = '#e4e8f0'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(330, 112, 272, 174, 12)
    ctx.stroke()
    ctx.fillStyle = p.mid
    r(ctx, 346, 128, 240, 70, 8)
    ctx.fillStyle = '#eef1f6'
    r(ctx, 346, 208, 112, 10, 5)
    r(ctx, 346, 226, 170, 10, 5)
    r(ctx, 346, 244, 140, 10, 5)
    ctx.fillStyle = p.soft
    r(ctx, 470, 236, 116, 34, 8)

    // logos strip
    ctx.fillStyle = '#f6f7fa'
    ctx.fillRect(0, 300, W, 52)
    ctx.fillStyle = '#d6dbe5'
    for (let i = 0; i < 5; i++) r(ctx, 48 + i * 112, 318, 72, 16, 5)
    // footer
    ctx.fillStyle = p.ink
    ctx.fillRect(0, 352, W, H - 352)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    for (let i = 0; i < 4; i++) r(ctx, 40 + i * 110, 378, 68, 9, 4)
  } else if (variant === 1) {
    // ---- E-commerce grid ----
    ctx.fillStyle = p.strong
    ctx.fillRect(0, 82, W, 96)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    r(ctx, 40, 104, 210, 18, 6)
    r(ctx, 40, 130, 150, 12, 5)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    r(ctx, 40, 150, 84, 18, 9)

    for (let i = 0; i < 4; i++) {
      const x = 32 + i * 148
      ctx.fillStyle = '#f5f6fa'
      r(ctx, x, 198, 128, 150, 10)
      ctx.fillStyle = i % 2 ? p.soft : '#e7eaf1'
      r(ctx, x + 10, 208, 108, 78, 8)
      ctx.fillStyle = '#c9cfdb'
      r(ctx, x + 10, 296, 80, 9, 4)
      ctx.fillStyle = p.strong
      r(ctx, x + 10, 312, 44, 11, 5)
      ctx.fillStyle = p.mid
      r(ctx, x + 78, 308, 40, 20, 10)
    }
    ctx.fillStyle = p.ink
    ctx.fillRect(0, 362, W, H - 362)
  } else {
    // ---- Agency / portfolio ----
    ctx.fillStyle = '#fbfbfd'
    ctx.fillRect(0, 82, W, H - 82)
    ctx.fillStyle = p.ink
    r(ctx, 40, 112, 320, 26, 7)
    r(ctx, 40, 148, 224, 26, 7)
    ctx.fillStyle = p.strong
    r(ctx, 274, 148, 86, 26, 7)
    ctx.fillStyle = '#aab2c2'
    r(ctx, 40, 190, 268, 10, 5)
    r(ctx, 40, 208, 212, 10, 5)

    const tiles = [
      [40, 240, 170, 142], [222, 240, 170, 96], [222, 348, 170, 34],
      [404, 240, 196, 142],
    ]
    tiles.forEach(([x, y, w, h], i) => {
      ctx.fillStyle = [p.mid, p.soft, '#e9ecf3', p.strong][i % 4]
      r(ctx, x, y, w, h, 10)
    })
  }
}

/* ---------------- Software / dashboard templates ---------------- */
function drawSoftware(ctx, p, variant, rand) {
  ctx.fillStyle = '#f7f8fc'
  ctx.fillRect(0, 38, W, H - 38)

  // sidebar
  ctx.fillStyle = p.ink
  ctx.fillRect(0, 38, 132, H - 38)
  ctx.fillStyle = p.mid
  r(ctx, 20, 58, 20, 20, 6)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  r(ctx, 48, 64, 50, 9, 4)
  for (let i = 0; i < 7; i++) {
    const active = i === 1
    if (active) {
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      r(ctx, 12, 100 + i * 34 - 8, 108, 28, 8)
    }
    ctx.fillStyle = active ? p.mid : 'rgba(255,255,255,0.3)'
    r(ctx, 22, 100 + i * 34, 12, 12, 3)
    ctx.fillStyle = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)'
    r(ctx, 42, 103 + i * 34, 58, 8, 4)
  }

  // topbar
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(132, 38, W - 132, 46)
  ctx.fillStyle = p.ink
  r(ctx, 152, 56, 92, 11, 5)
  ctx.fillStyle = '#eef0f5'
  r(ctx, W - 210, 52, 110, 20, 10)
  ctx.fillStyle = p.mid
  ctx.beginPath()
  ctx.arc(W - 62, 61, 13, 0, Math.PI * 2)
  ctx.fill()

  if (variant === 0) {
    // stat tiles + area chart
    const tints = [p.strong, p.mid, '#64748b']
    for (let i = 0; i < 3; i++) {
      const x = 152 + i * 158
      ctx.fillStyle = '#ffffff'
      r(ctx, x, 100, 142, 74, 10)
      ctx.fillStyle = '#b9c0cd'
      r(ctx, x + 14, 114, 52, 8, 4)
      ctx.fillStyle = tints[i]
      r(ctx, x + 14, 132, 62, 18, 5)
      ctx.fillStyle = p.soft
      r(ctx, x + 92, 130, 36, 20, 10)
    }

    ctx.fillStyle = '#ffffff'
    r(ctx, 152, 188, 300, 196, 10)
    ctx.fillStyle = '#b9c0cd'
    r(ctx, 168, 204, 72, 9, 4)
    // area chart
    const base = 356
    ctx.beginPath()
    ctx.moveTo(170, base)
    const pts = []
    for (let i = 0; i <= 9; i++) {
      const x = 170 + i * 30
      const y = base - 40 - rand(i) * 90
      pts.push([x, y])
    }
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.lineTo(x, y)))
    ctx.lineTo(440, base)
    ctx.closePath()
    const ag = ctx.createLinearGradient(0, 220, 0, base)
    ag.addColorStop(0, p.mid + 'bb')
    ag.addColorStop(1, p.mid + '10')
    ctx.fillStyle = ag
    ctx.fill()
    ctx.strokeStyle = p.strong
    ctx.lineWidth = 2.5
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()

    // right rail: donut + list
    ctx.fillStyle = '#ffffff'
    r(ctx, 466, 188, 150, 196, 10)
    const cx = 541, cy = 248, rad = 38
    let start = -Math.PI / 2
    ;[0.45, 0.3, 0.25].forEach((frac, i) => {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, rad, start, start + frac * Math.PI * 2)
      ctx.closePath()
      ctx.fillStyle = [p.strong, p.mid, p.soft][i]
      ctx.fill()
      start += frac * Math.PI * 2
    })
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(cx, cy, 20, 0, Math.PI * 2)
    ctx.fill()
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = [p.strong, p.mid, p.soft][i]
      r(ctx, 482, 306 + i * 24, 10, 10, 3)
      ctx.fillStyle = '#c3cad6'
      r(ctx, 500, 308 + i * 24, 72, 8, 4)
    }
  } else {
    // CRM table view
    ctx.fillStyle = '#ffffff'
    r(ctx, 152, 100, W - 176, 284, 10)
    ctx.fillStyle = p.ink
    r(ctx, 170, 118, 88, 11, 5)
    ctx.fillStyle = p.strong
    r(ctx, W - 118, 114, 78, 22, 11)

    ctx.fillStyle = '#f1f3f8'
    ctx.fillRect(170, 148, W - 212, 26)
    ctx.fillStyle = '#9aa3b2'
    ;[0, 120, 240, 330].forEach((dx, i) => r(ctx, 182 + dx, 157, [68, 84, 56, 44][i], 8, 4))

    for (let row = 0; row < 6; row++) {
      const y = 182 + row * 32
      ctx.fillStyle = row % 2 ? '#fbfcfe' : '#ffffff'
      ctx.fillRect(170, y, W - 212, 30)
      ctx.fillStyle = [p.strong, p.mid, '#94a3b8'][row % 3]
      ctx.beginPath()
      ctx.arc(192, y + 15, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#cbd2dd'
      r(ctx, 210, y + 11, 62, 8, 4)
      r(ctx, 302, y + 11, 84, 8, 4)
      ctx.fillStyle = p.soft
      r(ctx, 422, y + 7, 54, 16, 8)
      ctx.fillStyle = '#dde2ea'
      r(ctx, 512, y + 11, 44, 8, 4)
    }
  }
}

export function makeUITexture(kind = 'website', seed = 0, paletteIndex = 0) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const p = PALETTES[paletteIndex % PALETTES.length]
  const rand = seeded(seed + 1)
  const variant = Math.floor(rand(0) * (kind === 'website' ? 3 : 2))

  chrome(ctx, p, kind === 'website' ? 'https://clientsite.com' : 'app.dashboard.io')
  if (kind === 'website') drawWebsite(ctx, p, variant, rand)
  else drawSoftware(ctx, p, variant, rand)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}
