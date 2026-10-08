import * as THREE from 'three'

const W = 640
const H = 420

const NODES = [
  { x: 86, y: 132, label: 'Trigger', sub: 'Incoming lead', icon: '⚡' },
  { x: 258, y: 104, label: 'AI Agent', sub: 'Qualify intent', icon: '🤖' },
  { x: 258, y: 258, label: 'Decision', sub: 'Hot / cold', icon: '⑂' },
  { x: 440, y: 80, label: 'CRM', sub: 'Create record', icon: '▤' },
  { x: 440, y: 210, label: 'Voice Call', sub: 'Dial & talk', icon: '☎' },
  { x: 440, y: 330, label: 'Follow-up', sub: 'Send WhatsApp', icon: '✈' },
]

const EDGES = [
  [0, 1], [1, 2], [2, 3], [2, 4], [4, 5],
]

const STEP = 1.15 // seconds per edge

const r = (ctx, x, y, w, h, rad) => {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, rad)
  ctx.fill()
}

function drawEdge(ctx, a, b, color, active, done) {
  const cx = (a.x + b.x) / 2
  ctx.strokeStyle = done || active ? color : '#d7dde8'
  ctx.lineWidth = done || active ? 2.6 : 2
  ctx.beginPath()
  ctx.moveTo(a.x + 54, a.y)
  ctx.bezierCurveTo(cx, a.y, cx, b.y, b.x - 54, b.y)
  ctx.stroke()

  // arrow head
  ctx.fillStyle = done || active ? color : '#d7dde8'
  ctx.beginPath()
  ctx.moveTo(b.x - 54, b.y)
  ctx.lineTo(b.x - 62, b.y - 4.5)
  ctx.lineTo(b.x - 62, b.y + 4.5)
  ctx.closePath()
  ctx.fill()
}

function edgePoint(a, b, t) {
  const cx = (a.x + b.x) / 2
  const p0 = { x: a.x + 54, y: a.y }
  const p3 = { x: b.x - 54, y: b.y }
  const mt = 1 - t
  return {
    x: mt ** 3 * p0.x + 3 * mt ** 2 * t * cx + 3 * mt * t ** 2 * cx + t ** 3 * p3.x,
    y: mt ** 3 * p0.y + 3 * mt ** 2 * t * p0.y + 3 * mt * t ** 2 * p3.y + t ** 3 * p3.y,
  }
}

function drawNode(ctx, n, state, accent) {
  const w = 108
  const h = 50
  const x = n.x - w / 2
  const y = n.y - h / 2

  // glow for the active node
  if (state === 'active') {
    const g = ctx.createRadialGradient(n.x, n.y, 4, n.x, n.y, 72)
    g.addColorStop(0, accent + '44')
    g.addColorStop(1, accent + '00')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(n.x, n.y, 72, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = '#ffffff'
  r(ctx, x, y, w, h, 11)
  ctx.strokeStyle = state === 'idle' ? '#dfe4ec' : accent
  ctx.lineWidth = state === 'active' ? 2.6 : 1.8
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, 11)
  ctx.stroke()

  // icon chip
  ctx.fillStyle = state === 'idle' ? '#eef1f6' : accent
  r(ctx, x + 9, y + 11, 28, 28, 8)
  ctx.fillStyle = state === 'idle' ? '#9aa3b2' : '#ffffff'
  ctx.font = '600 15px system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(n.icon, x + 23, y + 26)

  ctx.textAlign = 'left'
  ctx.fillStyle = '#1e2434'
  ctx.font = '650 12px system-ui, sans-serif'
  ctx.fillText(n.label, x + 45, y + 19)
  ctx.fillStyle = '#98a1b2'
  ctx.font = '500 10.5px system-ui, sans-serif'
  ctx.fillText(n.sub, x + 45, y + 35)

  // status dot
  if (state === 'done') {
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(x + w - 11, y + 11, 5, 0, Math.PI * 2)
    ctx.fill()
  } else if (state === 'active') {
    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(x + w - 11, y + 11, 5, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function createWorkflowTexture(accent = '#6d28d9') {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const draw = (time) => {
    const total = EDGES.length * STEP
    const cycle = time % total
    const activeEdge = Math.floor(cycle / STEP)
    const t = (cycle % STEP) / STEP

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#fbfcfe'
    ctx.fillRect(0, 0, W, H)

    // faint grid, like an automation canvas
    ctx.strokeStyle = '#eef1f6'
    ctx.lineWidth = 1
    for (let x = 0; x < W; x += 26) {
      ctx.beginPath(); ctx.moveTo(x, 38); ctx.lineTo(x, H); ctx.stroke()
    }
    for (let y = 38; y < H; y += 26) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
    }

    // header
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, W, 38)
    ctx.strokeStyle = '#e8ebf2'
    ctx.beginPath(); ctx.moveTo(0, 38); ctx.lineTo(W, 38); ctx.stroke()
    ctx.fillStyle = accent
    r(ctx, 18, 12, 14, 14, 4)
    ctx.fillStyle = '#1e2434'
    ctx.font = '650 13px system-ui, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText('Lead Qualification Agent', 42, 20)
    // running pill
    const pulse = 0.55 + Math.sin(time * 4) * 0.45
    ctx.fillStyle = '#ecfdf5'
    r(ctx, W - 118, 9, 100, 21, 11)
    ctx.fillStyle = `rgba(16,185,129,${pulse})`
    ctx.beginPath()
    ctx.arc(W - 104, 19.5, 4.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#047857'
    ctx.font = '600 11px system-ui, sans-serif'
    ctx.fillText('running', W - 92, 20)

    // edges
    EDGES.forEach(([ai, bi], i) => {
      drawEdge(ctx, NODES[ai], NODES[bi], accent, i === activeEdge, i < activeEdge)
    })

    // nodes
    const activePair = EDGES[activeEdge]
    NODES.forEach((n, i) => {
      let state = 'idle'
      const reached = EDGES.slice(0, activeEdge).some(([, b]) => b === i) || i === EDGES[0][0]
      if (reached) state = 'done'
      if (i === activePair[0] || (t > 0.75 && i === activePair[1])) state = 'active'
      drawNode(ctx, n, state, accent)
    })

    // travelling packet
    const a = NODES[activePair[0]]
    const b = NODES[activePair[1]]
    const p = edgePoint(a, b, t)
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 16)
    glow.addColorStop(0, accent + 'cc')
    glow.addColorStop(1, accent + '00')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = accent
    ctx.beginPath()
    ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
    ctx.fill()

    texture.needsUpdate = true
  }

  draw(0)
  return { texture, draw }
}
