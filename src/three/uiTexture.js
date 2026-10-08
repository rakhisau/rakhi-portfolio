import * as THREE from 'three'

export const PALETTES = [
  { key: 'violet', strong: '#6d28d9', mid: '#8b5cf6', soft: '#ede9fe', ink: '#1e1b33' },
  { key: 'cyan', strong: '#0e7490', mid: '#22d3ee', soft: '#cffafe', ink: '#0d2b33' },
  { key: 'amber', strong: '#b45309', mid: '#f59e0b', soft: '#fef3c7', ink: '#3a2408' },
  { key: 'rose', strong: '#be123c', mid: '#fb7185', soft: '#ffe4e6', ink: '#3b0d1b' },
  { key: 'emerald', strong: '#047857', mid: '#34d399', soft: '#d1fae5', ink: '#06281d' },
  { key: 'indigo', strong: '#3730a3', mid: '#818cf8', soft: '#e0e7ff', ink: '#171a3a' },
]

const W = 640
const H = 420
const CHROME = 38
const VIEW_H = H - CHROME

const r = (ctx, x, y, w, h, rad = 4) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, rad)
  ctx.fill()
}

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (a, b, x) => clamp((x - a) / (b - a))
const smooth = (x) => x * x * (3 - 2 * x)

const seeded = (seed) => (n) => {
  const x = Math.sin(seed * 127.1 + n * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/* ---------------- shared chrome + cursor ---------------- */

function drawChrome(ctx, label) {
  ctx.fillStyle = '#eef0f5'
  ctx.fillRect(0, 0, W, CHROME)
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
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 118, 20)
}

// Pointer that drifts between hotspots and clicks when it arrives.
function computeCursor(points, t, period) {
  const p = (t % period) / period
  const n = points.length
  const idx = Math.floor(p * n)
  const local = p * n - idx
  const a = points[idx]
  const b = points[(idx + 1) % n]
  const travel = smooth(clamp(local / 0.65))
  return {
    x: a[0] + (b[0] - a[0]) * travel,
    y: a[1] + (b[1] - a[1]) * travel,
    local,
  }
}

function drawCursor(ctx, { x, y, local }, accent) {
  if (local > 0.7) {
    const k = (local - 0.7) / 0.3
    ctx.strokeStyle = accent
    ctx.globalAlpha = 1 - k
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, 6 + k * 18, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = '#10131c'
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(0, 17)
  ctx.lineTo(4.6, 13)
  ctx.lineTo(7.6, 19.5)
  ctx.lineTo(10.4, 18)
  ctx.lineTo(7.5, 11.8)
  ctx.lineTo(13, 11.4)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.2
  ctx.stroke()
  ctx.restore()
}

const near = (cursor, x, y, w, h) =>
  cursor.x >= x && cursor.x <= x + w && cursor.y >= y && cursor.y <= y + h

/* ---------------- website page (scrolls) ---------------- */

function websitePage(ctx, p, variant, rand, t, cursor) {
  // nav is drawn by the caller on top; this is the scrolling body
  if (variant === 0) {
    const g = ctx.createLinearGradient(0, 0, W, 240)
    g.addColorStop(0, p.soft)
    g.addColorStop(1, '#ffffff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, 240)

    ctx.fillStyle = p.strong
    r(ctx, 40, 28, 96, 20, 10)
    ctx.fillStyle = p.ink
    r(ctx, 40, 62, 252, 22, 6)
    r(ctx, 40, 92, 196, 22, 6)
    ctx.fillStyle = '#aab2c2'
    r(ctx, 40, 130, 236, 10, 5)
    r(ctx, 40, 148, 188, 10, 5)

    // CTA reacts to the cursor
    const hot = near(cursor, 40, 174, 104, 30)
    ctx.fillStyle = hot ? p.mid : p.strong
    r(ctx, 40 - (hot ? 2 : 0), 174 - (hot ? 2 : 0), 104 + (hot ? 4 : 0), 30 + (hot ? 4 : 0), 15)
    ctx.strokeStyle = '#cfd6e4'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(156, 174, 96, 30, 15)
    ctx.stroke()

    // hero visual with a live mini bar chart
    ctx.fillStyle = '#ffffff'
    r(ctx, 330, 30, 272, 174, 12)
    ctx.strokeStyle = '#e4e8f0'
    ctx.beginPath()
    ctx.roundRect(330, 30, 272, 174, 12)
    ctx.stroke()
    ctx.fillStyle = p.mid
    r(ctx, 346, 46, 240, 70, 8)
    for (let i = 0; i < 7; i++) {
      const h = 14 + (Math.sin(t * 1.6 + i * 0.8) * 0.5 + 0.5) * 38
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      r(ctx, 360 + i * 32, 106 - h, 18, h, 3)
    }
    ctx.fillStyle = '#eef1f6'
    r(ctx, 346, 126, 112, 10, 5)
    r(ctx, 346, 144, 170, 10, 5)
    ctx.fillStyle = p.soft
    r(ctx, 470, 154, 116, 34, 8)

    // logo strip
    ctx.fillStyle = '#f6f7fa'
    ctx.fillRect(0, 240, W, 52)
    ctx.fillStyle = '#d6dbe5'
    for (let i = 0; i < 5; i++) r(ctx, 48 + i * 112, 258, 72, 16, 5)

    // feature cards lift in sequence
    for (let i = 0; i < 3; i++) {
      const lift = Math.max(0, Math.sin(t * 1.1 - i * 0.9)) * 6
      const x = 40 + i * 190
      ctx.fillStyle = '#f4f5f9'
      r(ctx, x, 316 - lift, 170, 128, 12)
      ctx.fillStyle = [p.soft, p.mid, p.soft][i]
      r(ctx, x + 14, 330 - lift, 56, 56, 10)
      ctx.fillStyle = '#d3d9e3'
      r(ctx, x + 14, 398 - lift, 104, 10, 5)
      r(ctx, x + 14, 416 - lift, 76, 10, 5)
    }

    ctx.fillStyle = p.ink
    ctx.fillRect(0, 468, W, 90)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    for (let i = 0; i < 4; i++) r(ctx, 40 + i * 110, 496, 68, 9, 4)
  } else if (variant === 1) {
    ctx.fillStyle = p.strong
    ctx.fillRect(0, 0, W, 110)
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    r(ctx, 40, 24, 210, 18, 6)
    r(ctx, 40, 50, 150, 12, 5)
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    r(ctx, 40, 72, 84, 18, 9)

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        const x = 32 + i * 148
        const y = 130 + row * 170
        const idx = row * 4 + i
        const hot = near(cursor, x, y, 128, 150)
        const lift = hot ? 5 : 0
        ctx.fillStyle = '#f5f6fa'
        r(ctx, x, y - lift, 128, 150, 10)
        ctx.fillStyle = idx % 3 === 0 ? p.soft : idx % 3 === 1 ? '#e7eaf1' : p.mid + '55'
        r(ctx, x + 10, y + 10 - lift, 108, 78, 8)
        ctx.fillStyle = '#c9cfdb'
        r(ctx, x + 10, y + 98 - lift, 80, 9, 4)
        ctx.fillStyle = p.strong
        r(ctx, x + 10, y + 114 - lift, 44, 11, 5)
        ctx.fillStyle = hot ? p.strong : p.mid
        r(ctx, x + 78, y + 110 - lift, 40, 20, 10)
      }
    }
    ctx.fillStyle = p.ink
    ctx.fillRect(0, 480, W, 80)
  } else {
    ctx.fillStyle = '#fbfbfd'
    ctx.fillRect(0, 0, W, 560)
    ctx.fillStyle = p.ink
    r(ctx, 40, 30, 320, 26, 7)
    r(ctx, 40, 66, 224, 26, 7)
    ctx.fillStyle = p.strong
    r(ctx, 274, 66, 86, 26, 7)
    ctx.fillStyle = '#aab2c2'
    r(ctx, 40, 108, 268, 10, 5)
    r(ctx, 40, 126, 212, 10, 5)

    const tiles = [
      [40, 158, 170, 142], [222, 158, 170, 96], [222, 266, 170, 34], [404, 158, 196, 142],
      [40, 312, 260, 120], [312, 312, 288, 120],
    ]
    tiles.forEach(([x, y, w, h], i) => {
      const hot = near(cursor, x, y, w, h)
      const k = hot ? 1 : 0
      ctx.fillStyle = [p.mid, p.soft, '#e9ecf3', p.strong, p.soft, p.mid][i % 6]
      ctx.globalAlpha = hot ? 1 : 0.85
      r(ctx, x - k * 3, y - k * 3, w + k * 6, h + k * 6, 10)
      ctx.globalAlpha = 1
    })
  }
}

function drawWebsite(ctx, p, variant, rand, t) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, CHROME, W, VIEW_H)

  const pageH = variant === 1 ? 560 : 560
  const maxScroll = Math.max(0, pageH - (VIEW_H - 44))
  const period = 11
  const pr = (t % period) / period
  const scroll = maxScroll * (smooth(seg(0.18, 0.45, pr)) - smooth(seg(0.68, 0.95, pr)))

  const hotspots = variant === 1
    ? [[120, 240], [420, 250], [250, 330], [540, 180]]
    : [[92, 250], [470, 150], [250, 330], [520, 300]]

  // hotspots are screen-space; convert to page space for hover tests
  const cursor = computeCursor(hotspots, t, 9)
  const pageCursor = { x: cursor.x, y: cursor.y - (CHROME + 44) + scroll }

  ctx.save()
  ctx.beginPath()
  ctx.rect(0, CHROME + 44, W, VIEW_H - 44)
  ctx.clip()
  ctx.translate(0, CHROME + 44 - scroll)
  websitePage(ctx, p, variant, rand, t, pageCursor)
  ctx.restore()

  // sticky nav
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, CHROME, W, 44)
  ctx.fillStyle = p.strong
  r(ctx, 28, CHROME + 14, 18, 18, 5)
  ctx.fillStyle = p.ink
  r(ctx, 54, CHROME + 19, 46, 9, 4)
  ctx.fillStyle = '#c8cedb'
  for (let i = 0; i < 4; i++) r(ctx, 300 + i * 56, CHROME + 20, 40, 8, 4)
  ctx.fillStyle = p.strong
  r(ctx, W - 96, CHROME + 12, 68, 22, 11)
  ctx.strokeStyle = '#eceff4'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, CHROME + 44)
  ctx.lineTo(W, CHROME + 44)
  ctx.stroke()

  // scrollbar
  const track = VIEW_H - 44
  const thumb = Math.max(28, track * (track / pageH))
  ctx.fillStyle = '#d9dee7'
  r(ctx, W - 6, CHROME + 44 + (maxScroll ? (scroll / maxScroll) * (track - thumb) : 0), 4, thumb, 2)

  drawCursor(ctx, cursor, p.strong)
}

/* ---------------- software dashboard (live data) ---------------- */

function drawSoftware(ctx, p, variant, rand, t) {
  ctx.fillStyle = '#f7f8fc'
  ctx.fillRect(0, CHROME, W, VIEW_H)

  // sidebar with a cycling active item
  const activeNav = Math.floor(t / 2.6) % 7
  ctx.fillStyle = p.ink
  ctx.fillRect(0, CHROME, 132, VIEW_H)
  ctx.fillStyle = p.mid
  r(ctx, 20, CHROME + 20, 20, 20, 6)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  r(ctx, 48, CHROME + 26, 50, 9, 4)
  for (let i = 0; i < 7; i++) {
    const active = i === activeNav
    const y = CHROME + 62 + i * 34
    if (active) {
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      r(ctx, 12, y - 8, 108, 28, 8)
    }
    ctx.fillStyle = active ? p.mid : 'rgba(255,255,255,0.3)'
    r(ctx, 22, y, 12, 12, 3)
    ctx.fillStyle = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.28)'
    r(ctx, 42, y + 3, 58, 8, 4)
  }

  // topbar
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(132, CHROME, W - 132, 46)
  ctx.fillStyle = p.ink
  r(ctx, 152, CHROME + 18, 92, 11, 5)
  ctx.fillStyle = '#eef0f5'
  r(ctx, W - 210, CHROME + 14, 110, 20, 10)
  ctx.fillStyle = p.mid
  ctx.beginPath()
  ctx.arc(W - 62, CHROME + 23, 13, 0, Math.PI * 2)
  ctx.fill()
  // live dot
  ctx.fillStyle = `rgba(16,185,129,${0.45 + Math.sin(t * 4) * 0.45})`
  ctx.beginPath()
  ctx.arc(W - 186, CHROME + 24, 4.5, 0, Math.PI * 2)
  ctx.fill()

  if (variant === 0) {
    const tints = [p.strong, p.mid, '#64748b']
    for (let i = 0; i < 3; i++) {
      const x = 152 + i * 158
      ctx.fillStyle = '#ffffff'
      r(ctx, x, CHROME + 62, 142, 74, 10)
      ctx.fillStyle = '#b9c0cd'
      r(ctx, x + 14, CHROME + 76, 52, 8, 4)
      // value bar "ticks" up and down
      const wv = 40 + (Math.sin(t * 0.9 + i * 1.3) * 0.5 + 0.5) * 34
      ctx.fillStyle = tints[i]
      r(ctx, x + 14, CHROME + 94, wv, 18, 5)
      ctx.fillStyle = p.soft
      r(ctx, x + 92, CHROME + 92, 36, 20, 10)
    }

    // scrolling live area chart
    ctx.fillStyle = '#ffffff'
    r(ctx, 152, CHROME + 150, 300, 196, 10)
    ctx.fillStyle = '#b9c0cd'
    r(ctx, 168, CHROME + 166, 72, 9, 4)

    const base = CHROME + 318
    const step = 30
    const shift = (t * 14) % step
    const pts = []
    for (let i = -1; i <= 10; i++) {
      const phase = Math.floor(t * 14 / step)
      const x = 170 + i * step - shift
      const y = base - 40 - (Math.sin((i + phase) * 1.1) * 0.5 + 0.5) * 86
      pts.push([x, y])
    }
    ctx.save()
    ctx.beginPath()
    ctx.rect(168, CHROME + 182, 268, 150)
    ctx.clip()
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.lineTo(pts[pts.length - 1][0], base)
    ctx.lineTo(pts[0][0], base)
    ctx.closePath()
    const ag = ctx.createLinearGradient(0, CHROME + 182, 0, base)
    ag.addColorStop(0, p.mid + 'bb')
    ag.addColorStop(1, p.mid + '10')
    ctx.fillStyle = ag
    ctx.fill()
    ctx.strokeStyle = p.strong
    ctx.lineWidth = 2.5
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
    ctx.restore()

    // donut that fills
    ctx.fillStyle = '#ffffff'
    r(ctx, 466, CHROME + 150, 150, 196, 10)
    const cx = 541
    const cy = CHROME + 210
    const rad = 38
    const sweep = 0.55 + Math.sin(t * 0.7) * 0.25
    let start = -Math.PI / 2
    ;[sweep * 0.6, sweep * 0.25, 1 - sweep * 0.85].forEach((frac, i) => {
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
      r(ctx, 482, CHROME + 268 + i * 24, 10, 10, 3)
      ctx.fillStyle = '#c3cad6'
      r(ctx, 500, CHROME + 270 + i * 24, 72, 8, 4)
    }
  } else {
    // CRM table: rows slide in from the top
    ctx.fillStyle = '#ffffff'
    r(ctx, 152, CHROME + 62, W - 176, 284, 10)
    ctx.fillStyle = p.ink
    r(ctx, 170, CHROME + 80, 88, 11, 5)
    ctx.fillStyle = p.strong
    r(ctx, W - 118, CHROME + 76, 78, 22, 11)
    ctx.fillStyle = '#f1f3f8'
    ctx.fillRect(170, CHROME + 110, W - 212, 26)
    ctx.fillStyle = '#9aa3b2'
    ;[0, 120, 240, 330].forEach((dx, i) => r(ctx, 182 + dx, CHROME + 119, [68, 84, 56, 44][i], 8, 4))

    const rowH = 32
    const feed = t * 0.55
    const offset = (feed % 1) * rowH
    const topIndex = Math.floor(feed)

    ctx.save()
    ctx.beginPath()
    ctx.rect(170, CHROME + 144, W - 212, 194)
    ctx.clip()
    for (let i = -1; i < 7; i++) {
      const y = CHROME + 144 + i * rowH + offset
      const n = topIndex - i
      const fresh = i <= 0
      ctx.fillStyle = n % 2 ? '#fbfcfe' : '#ffffff'
      ctx.fillRect(170, y, W - 212, rowH - 2)
      ctx.globalAlpha = fresh ? clamp(offset / rowH) : 1
      ctx.fillStyle = [p.strong, p.mid, '#94a3b8'][Math.abs(n) % 3]
      ctx.beginPath()
      ctx.arc(192, y + 15, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#cbd2dd'
      r(ctx, 210, y + 11, 50 + (Math.abs(n) % 4) * 10, 8, 4)
      r(ctx, 302, y + 11, 70 + (Math.abs(n) % 3) * 14, 8, 4)
      ctx.fillStyle = fresh ? '#d1fae5' : p.soft
      r(ctx, 422, y + 7, 54, 16, 8)
      ctx.fillStyle = '#dde2ea'
      r(ctx, 512, y + 11, 44, 8, 4)
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }
}

/* ---------------- factory ---------------- */

export function createPanelTexture(kind = 'website', seed = 0, paletteIndex = 0) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const p = PALETTES[paletteIndex % PALETTES.length]
  const rand = seeded(seed + 1)
  const variant = Math.floor(rand(0) * (kind === 'website' ? 3 : 2))
  const label = kind === 'website' ? 'https://clientsite.com' : 'app.dashboard.io'

  const draw = (t) => {
    ctx.clearRect(0, 0, W, H)
    if (kind === 'website') drawWebsite(ctx, p, variant, rand, t)
    else drawSoftware(ctx, p, variant, rand, t)
    drawChrome(ctx, label)
    texture.needsUpdate = true
  }

  draw(0)
  return { texture, draw, accent: p.strong }
}
