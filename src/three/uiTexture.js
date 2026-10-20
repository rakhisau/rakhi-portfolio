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

const FONT = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'

function text(ctx, str, x, y, opts = {}) {
  const { size = 12, weight = 500, color = '#1e2434', align = 'left', max } = opts
  ctx.font = `${weight} ${size}px ${FONT}`
  ctx.fillStyle = color
  ctx.textAlign = align
  ctx.textBaseline = 'middle'
  ctx.fillText(str, x, y, max)
  ctx.textAlign = 'left'
}

/* ---------------- demo content ---------------- */

const BRANDS = ['Nexora', 'Brightlane', 'Kyra & Co.', 'Vermilion', 'Evergrow', 'Northwind']

const SAAS = {
  nav: ['Home', 'Features', 'Pricing', 'About'],
  h1: ['Grow your business', 'without the busywork.'],
  body: [
    'Everything you need to launch, sell and scale —',
    'in one place, set up in a single afternoon.',
  ],
  cta: ['Get started free', 'Book a demo'],
  badge: 'NEW · AI BUILT IN',
  logos: 'TRUSTED BY 400+ TEAMS',
  features: [
    { t: 'Set up in minutes', d: ['No code, no developers,', 'no long onboarding calls.'] },
    { t: 'Built-in automation', d: ['Let agents handle the', 'repetitive work for you.'] },
    { t: 'Support that answers', d: ['Real humans, replying in', 'under two hours.'] },
  ],
}

const SHOP = {
  nav: ['New In', 'Women', 'Men', 'Sale'],
  h1: 'End of Season Sale',
  sub: 'Up to 50% off everything',
  cta: 'Shop now',
  products: [
    ['Linen Shirt', '₹2,499'], ['Canvas Tote', '₹1,199'],
    ['Wool Scarf', '₹899'], ['Leather Belt', '₹1,750'],
    ['Cotton Kurta', '₹1,999'], ['Suede Loafers', '₹3,450'],
    ['Silk Scrunchie', '₹349'], ['Denim Jacket', '₹4,299'],
  ],
}

const AGENCY = {
  nav: ['Work', 'Studio', 'Journal', 'Contact'],
  h1: ['We build brands', 'people remember.'],
  body: ['Strategy, identity and websites for', 'founders who refuse to blend in.'],
  tiles: ['Mira Coffee', 'Atlas Fintech', 'Form Studio', 'Harbour Co.', 'Lumen Health', 'Ridge Outdoors'],
}

const DASH = {
  nav: ['Dashboard', 'Leads', 'Clients', 'Tasks', 'Invoices', 'Reports', 'Settings'],
  title: 'Overview',
  search: 'Search anything…',
  stats: [
    { label: 'Revenue', value: '₹4.28L', delta: '+12.4%' },
    { label: 'New leads', value: '1,284', delta: '+8.1%' },
    { label: 'Conversion', value: '12.4%', delta: '+1.9%' },
  ],
  chart: 'Revenue · last 30 days',
  donut: 'Lead sources',
  legend: [['Organic', '48%'], ['Paid ads', '31%'], ['Referral', '21%']],
}

const CRM = {
  nav: ['Dashboard', 'Leads', 'Pipeline', 'Clients', 'Team', 'Payroll', 'Settings'],
  title: 'All leads',
  add: '+ Add lead',
  cols: ['Name', 'Email', 'Status', 'Added'],
  rows: [
    ['Amit Sharma', 'amit@novaretail.in', 'Qualified', '2 Apr'],
    ['Priya Patel', 'priya.p@kyraco.com', 'Contacted', '2 Apr'],
    ['Rahul Verma', 'rahul@brightlane.io', 'New', '1 Apr'],
    ['Sneha Roy', 'sneha@harbour.co', 'Won', '1 Apr'],
    ['Vikram Singh', 'vikram@atlasfin.in', 'Contacted', '31 Mar'],
    ['Anjali Das', 'anjali@formstudio.in', 'Qualified', '31 Mar'],
    ['Imran Khan', 'imran@ridgeout.com', 'New', '30 Mar'],
    ['Neha Gupta', 'neha@lumenhealth.in', 'Won', '30 Mar'],
  ],
  statusColor: { New: '#0ea5e9', Contacted: '#f59e0b', Qualified: '#8b5cf6', Won: '#10b981' },
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

function websitePage(ctx, p, variant, rand, t, cursor, brand) {
  // nav is drawn by the caller on top; this is the scrolling body
  if (variant === 0) {
    const g = ctx.createLinearGradient(0, 0, W, 240)
    g.addColorStop(0, p.soft)
    g.addColorStop(1, '#ffffff')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, 240)

    // badge
    ctx.fillStyle = p.strong
    r(ctx, 40, 26, 132, 22, 11)
    text(ctx, SAAS.badge, 50, 37, { size: 10, weight: 700, color: '#ffffff' })

    text(ctx, SAAS.h1[0], 40, 74, { size: 27, weight: 700, color: p.ink })
    text(ctx, SAAS.h1[1], 40, 104, { size: 27, weight: 700, color: p.ink })
    text(ctx, SAAS.body[0], 40, 136, { size: 12.5, color: '#6c7689' })
    text(ctx, SAAS.body[1], 40, 154, { size: 12.5, color: '#6c7689' })

    // CTA reacts to the cursor
    const hot = near(cursor, 40, 174, 128, 32)
    ctx.fillStyle = hot ? p.mid : p.strong
    r(ctx, 40 - (hot ? 2 : 0), 174 - (hot ? 2 : 0), 128 + (hot ? 4 : 0), 32 + (hot ? 4 : 0), 16)
    text(ctx, SAAS.cta[0], 104, 190, { size: 12.5, weight: 650, color: '#ffffff', align: 'center' })
    ctx.strokeStyle = '#cfd6e4'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(180, 174, 110, 32, 16)
    ctx.stroke()
    text(ctx, SAAS.cta[1], 235, 190, { size: 12.5, weight: 600, color: p.ink, align: 'center' })

    // hero visual with a live mini bar chart
    ctx.fillStyle = '#ffffff'
    r(ctx, 330, 30, 272, 174, 12)
    ctx.strokeStyle = '#e4e8f0'
    ctx.beginPath()
    ctx.roundRect(330, 30, 272, 174, 12)
    ctx.stroke()
    ctx.fillStyle = p.mid
    r(ctx, 346, 46, 240, 70, 8)
    text(ctx, 'Monthly signups', 356, 58, { size: 10, weight: 650, color: 'rgba(255,255,255,0.9)' })
    for (let i = 0; i < 7; i++) {
      const h = 10 + (Math.sin(t * 1.6 + i * 0.8) * 0.5 + 0.5) * 34
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      r(ctx, 360 + i * 32, 106 - h, 18, h, 3)
    }
    text(ctx, 'Revenue this quarter', 346, 131, { size: 11, weight: 600, color: p.ink })
    text(ctx, '₹12,40,000 · up 18% on last quarter', 346, 149, { size: 10.5, color: '#8b94a6' })
    ctx.fillStyle = p.soft
    r(ctx, 470, 158, 116, 32, 8)
    text(ctx, 'View report →', 528, 174, { size: 10.5, weight: 650, color: p.strong, align: 'center' })

    // logo strip
    ctx.fillStyle = '#f6f7fa'
    ctx.fillRect(0, 240, W, 52)
    text(ctx, SAAS.logos, 40, 266, { size: 10, weight: 700, color: '#9aa3b2' })
    ctx.fillStyle = '#d6dbe5'
    BRANDS.slice(0, 4).forEach((b, i) =>
      text(ctx, b, 240 + i * 100, 266, { size: 12, weight: 700, color: '#c3cad6' })
    )

    // feature cards lift in sequence
    SAAS.features.forEach((f, i) => {
      const lift = Math.max(0, Math.sin(t * 1.1 - i * 0.9)) * 6
      const x = 40 + i * 190
      ctx.fillStyle = '#f4f5f9'
      r(ctx, x, 316 - lift, 170, 128, 12)
      ctx.fillStyle = [p.soft, p.mid, p.soft][i]
      r(ctx, x + 14, 330 - lift, 36, 36, 10)
      text(ctx, f.t, x + 14, 388 - lift, { size: 12.5, weight: 650, color: p.ink })
      text(ctx, f.d[0], x + 14, 408 - lift, { size: 10.5, color: '#8b94a6' })
      text(ctx, f.d[1], x + 14, 423 - lift, { size: 10.5, color: '#8b94a6' })
    })

    ctx.fillStyle = p.ink
    ctx.fillRect(0, 468, W, 90)
    text(ctx, brand, 40, 496, { size: 13, weight: 700, color: 'rgba(255,255,255,0.9)' })
    SAAS.nav.forEach((n, i) =>
      text(ctx, n, 240 + i * 92, 496, { size: 11, color: 'rgba(255,255,255,0.45)' })
    )
    text(ctx, `© 2026 ${brand}. All rights reserved.`, 40, 526, {
      size: 10, color: 'rgba(255,255,255,0.3)',
    })
  } else if (variant === 1) {
    ctx.fillStyle = p.strong
    ctx.fillRect(0, 0, W, 110)
    text(ctx, SHOP.h1, 40, 36, { size: 24, weight: 700, color: '#ffffff' })
    text(ctx, SHOP.sub, 40, 62, { size: 13, color: 'rgba(255,255,255,0.8)' })
    ctx.fillStyle = 'rgba(255,255,255,0.95)'
    r(ctx, 40, 76, 94, 24, 12)
    text(ctx, SHOP.cta, 87, 88, { size: 11.5, weight: 700, color: p.strong, align: 'center' })

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 4; i++) {
        const x = 32 + i * 148
        const y = 130 + row * 170
        const idx = row * 4 + i
        const [pname, price] = SHOP.products[idx]
        const hot = near(cursor, x, y, 128, 150)
        const lift = hot ? 5 : 0
        ctx.fillStyle = '#f5f6fa'
        r(ctx, x, y - lift, 128, 150, 10)
        ctx.fillStyle = idx % 3 === 0 ? p.soft : idx % 3 === 1 ? '#e7eaf1' : p.mid + '55'
        r(ctx, x + 10, y + 10 - lift, 108, 74, 8)
        text(ctx, pname, x + 10, y + 100 - lift, { size: 11.5, weight: 600, color: p.ink, max: 108 })
        text(ctx, price, x + 10, y + 120 - lift, { size: 13, weight: 700, color: p.strong })
        ctx.fillStyle = hot ? p.strong : p.mid
        r(ctx, x + 72, y + 110 - lift, 46, 22, 11)
        text(ctx, 'Add', x + 95, y + 121 - lift, { size: 10.5, weight: 700, color: '#ffffff', align: 'center' })
      }
    }
    ctx.fillStyle = p.ink
    ctx.fillRect(0, 480, W, 80)
    text(ctx, brand, 40, 508, { size: 13, weight: 700, color: 'rgba(255,255,255,0.9)' })
    text(ctx, 'Free shipping over ₹1,499 · 7-day returns', 40, 530, {
      size: 10.5, color: 'rgba(255,255,255,0.4)',
    })
  } else {
    ctx.fillStyle = '#fbfbfd'
    ctx.fillRect(0, 0, W, 560)
    text(ctx, AGENCY.h1[0], 40, 42, { size: 30, weight: 700, color: p.ink })
    text(ctx, AGENCY.h1[1], 40, 80, { size: 30, weight: 700, color: p.strong })
    text(ctx, AGENCY.body[0], 40, 114, { size: 12.5, color: '#6c7689' })
    text(ctx, AGENCY.body[1], 40, 132, { size: 12.5, color: '#6c7689' })

    const tiles = [
      [40, 158, 170, 142], [222, 158, 170, 142], [404, 158, 196, 142],
      [40, 312, 260, 120], [312, 312, 288, 120],
    ]
    const fills = [p.mid, p.soft, p.strong, '#e9ecf3', p.mid]
    const onDark = [true, false, true, false, true]
    tiles.forEach(([x, y, w, h], i) => {
      const hot = near(cursor, x, y, w, h)
      const k = hot ? 1 : 0
      ctx.fillStyle = fills[i]
      ctx.globalAlpha = hot ? 1 : 0.9
      r(ctx, x - k * 3, y - k * 3, w + k * 6, h + k * 6, 10)
      ctx.globalAlpha = 1
      const label = AGENCY.tiles[i]
      const sub = ['Brand identity', 'Website', 'Brand + site', 'Packaging', 'Website'][i]
      text(ctx, label, x + 14, y + h - 34, {
        size: 12.5, weight: 700, color: onDark[i] ? '#ffffff' : p.ink, max: w - 28,
      })
      text(ctx, sub, x + 14, y + h - 17, {
        size: 10.5, color: onDark[i] ? 'rgba(255,255,255,0.7)' : '#8b94a6', max: w - 28,
      })
    })

    text(ctx, 'Selected work · 2024—2026', 40, 460, { size: 11, weight: 650, color: '#9aa3b2' })
    text(ctx, `${brand} — independent design studio`, 40, 484, { size: 11, color: '#b4bcc9' })
  }
}

function drawWebsite(ctx, p, variant, rand, t, brand) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, CHROME, W, VIEW_H)

  const pageH = 560
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
  websitePage(ctx, p, variant, rand, t, pageCursor, brand)
  ctx.restore()

  // sticky nav
  const navLinks = variant === 1 ? SHOP.nav : variant === 2 ? AGENCY.nav : SAAS.nav
  const navCta = variant === 1 ? 'Cart (2)' : variant === 2 ? 'Enquire' : 'Sign up'
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, CHROME, W, 44)
  ctx.fillStyle = p.strong
  r(ctx, 28, CHROME + 13, 20, 20, 6)
  text(ctx, brand, 56, CHROME + 23, { size: 13, weight: 700, color: p.ink })
  navLinks.forEach((n, i) =>
    text(ctx, n, 286 + i * 62, CHROME + 23, { size: 11.5, weight: 500, color: '#8b94a6' })
  )
  ctx.fillStyle = p.strong
  r(ctx, W - 104, CHROME + 11, 76, 24, 12)
  text(ctx, navCta, W - 66, CHROME + 23, { size: 11, weight: 650, color: '#ffffff', align: 'center' })
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

function drawSoftware(ctx, p, variant, rand, t, brand) {
  const nav = variant === 1 ? CRM.nav : DASH.nav
  ctx.fillStyle = '#f7f8fc'
  ctx.fillRect(0, CHROME, W, VIEW_H)

  // sidebar with a cycling active item
  const activeNav = Math.floor(t / 2.6) % nav.length
  ctx.fillStyle = p.ink
  ctx.fillRect(0, CHROME, 132, VIEW_H)
  ctx.fillStyle = p.mid
  r(ctx, 20, CHROME + 18, 22, 22, 7)
  text(ctx, brand, 50, CHROME + 29, { size: 12, weight: 700, color: 'rgba(255,255,255,0.92)' })
  nav.forEach((label, i) => {
    const active = i === activeNav
    const y = CHROME + 64 + i * 32
    if (active) {
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      r(ctx, 12, y - 11, 108, 26, 8)
    }
    ctx.fillStyle = active ? p.mid : 'rgba(255,255,255,0.3)'
    r(ctx, 22, y - 4, 10, 10, 3)
    text(ctx, label, 40, y + 1, {
      size: 11, weight: active ? 650 : 500,
      color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.42)',
    })
  })

  // topbar
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(132, CHROME, W - 132, 46)
  text(ctx, variant === 1 ? CRM.title : DASH.title, 152, CHROME + 23, {
    size: 14, weight: 700, color: p.ink,
  })
  ctx.fillStyle = '#eef0f5'
  r(ctx, W - 212, CHROME + 13, 112, 22, 11)
  text(ctx, DASH.search, W - 200, CHROME + 24, { size: 10, color: '#9aa3b2' })
  ctx.fillStyle = p.mid
  ctx.beginPath()
  ctx.arc(W - 62, CHROME + 23, 13, 0, Math.PI * 2)
  ctx.fill()
  text(ctx, 'RS', W - 62, CHROME + 24, { size: 10, weight: 700, color: '#ffffff', align: 'center' })
  // live dot
  ctx.fillStyle = `rgba(16,185,129,${0.45 + Math.sin(t * 4) * 0.45})`
  ctx.beginPath()
  ctx.arc(W - 242, CHROME + 24, 4.5, 0, Math.PI * 2)
  ctx.fill()
  text(ctx, 'Live', W - 232, CHROME + 24, { size: 10, weight: 600, color: '#10b981' })

  if (variant === 0) {
    const tints = [p.strong, p.mid, '#64748b']
    DASH.stats.forEach((stat, i) => {
      const x = 152 + i * 158
      ctx.fillStyle = '#ffffff'
      r(ctx, x, CHROME + 62, 142, 74, 10)
      text(ctx, stat.label, x + 14, CHROME + 80, { size: 10.5, weight: 600, color: '#9aa3b2' })
      // value ticks slightly so it reads as live
      const jitter = Math.sin(t * 0.9 + i * 1.3)
      text(ctx, stat.value, x + 14, CHROME + 103, { size: 19, weight: 700, color: tints[i] })
      ctx.fillStyle = jitter > 0 ? '#dcfce7' : p.soft
      r(ctx, x + 14, CHROME + 116, 52, 16, 8)
      text(ctx, stat.delta, x + 40, CHROME + 124, {
        size: 9.5, weight: 700, color: jitter > 0 ? '#047857' : p.strong, align: 'center',
      })
    })

    // scrolling live area chart
    ctx.fillStyle = '#ffffff'
    r(ctx, 152, CHROME + 150, 300, 196, 10)
    text(ctx, DASH.chart, 168, CHROME + 170, { size: 11.5, weight: 650, color: p.ink })

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
    text(ctx, DASH.donut, 482, CHROME + 170, { size: 11.5, weight: 650, color: p.ink })
    DASH.legend.forEach(([label, pct], i) => {
      ctx.fillStyle = [p.strong, p.mid, p.soft][i]
      r(ctx, 482, CHROME + 266 + i * 24, 10, 10, 3)
      text(ctx, label, 500, CHROME + 271 + i * 24, { size: 10.5, color: '#6c7689' })
      text(ctx, pct, 600, CHROME + 271 + i * 24, {
        size: 10.5, weight: 650, color: p.ink, align: 'right',
      })
    })
  } else {
    // CRM table: rows slide in from the top
    ctx.fillStyle = '#ffffff'
    r(ctx, 152, CHROME + 62, W - 176, 284, 10)
    text(ctx, 'Recent activity', 170, CHROME + 86, { size: 12, weight: 650, color: p.ink })
    ctx.fillStyle = p.strong
    r(ctx, W - 124, CHROME + 74, 84, 24, 12)
    text(ctx, CRM.add, W - 82, CHROME + 86, {
      size: 10.5, weight: 650, color: '#ffffff', align: 'center',
    })

    const colX = [182, 302, 422, 512]
    ctx.fillStyle = '#f1f3f8'
    ctx.fillRect(170, CHROME + 110, W - 212, 26)
    CRM.cols.forEach((c, i) =>
      text(ctx, c, colX[i], CHROME + 123, { size: 10, weight: 700, color: '#8b94a6' })
    )

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
      const row = CRM.rows[((n % CRM.rows.length) + CRM.rows.length) % CRM.rows.length]
      const [name, email, status, added] = row
      const fresh = i <= 0
      ctx.fillStyle = n % 2 ? '#fbfcfe' : '#ffffff'
      ctx.fillRect(170, y, W - 212, rowH - 2)
      ctx.globalAlpha = fresh ? clamp(offset / rowH) : 1

      // avatar with initials
      ctx.fillStyle = [p.strong, p.mid, '#94a3b8'][Math.abs(n) % 3]
      ctx.beginPath()
      ctx.arc(192, y + 15, 9, 0, Math.PI * 2)
      ctx.fill()
      const initials = name.split(' ').map((w) => w[0]).join('')
      text(ctx, initials, 192, y + 16, { size: 8.5, weight: 700, color: '#ffffff', align: 'center' })

      text(ctx, name, 210, y + 15, { size: 11, weight: 600, color: p.ink, max: 86 })
      text(ctx, email, colX[1], y + 15, { size: 10, color: '#8b94a6', max: 112 })

      const sc = CRM.statusColor[status] || p.strong
      ctx.fillStyle = sc + '22'
      r(ctx, colX[2] - 4, y + 6, 62, 18, 9)
      text(ctx, status, colX[2] + 27, y + 16, { size: 9.5, weight: 700, color: sc, align: 'center' })

      text(ctx, added, colX[3], y + 15, { size: 10, color: '#9aa3b2' })
      ctx.globalAlpha = 1
    }
    ctx.restore()
  }
}

/* ---------------- factory ---------------- */

export function createPanelTexture(kind = 'website', seed = 0, paletteIndex = 0, variantOverride) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const p = PALETTES[paletteIndex % PALETTES.length]
  const rand = seeded(seed + 1)
  const variantCount = kind === 'website' ? 3 : 2
  const variant = variantOverride != null
    ? variantOverride % variantCount
    : Math.floor(rand(0) * variantCount)
  const brand = BRANDS[Math.floor(rand(3) * BRANDS.length)]
  const slug = brand.toLowerCase().replace(/[^a-z]/g, '')
  const label = kind === 'website' ? `https://${slug}.com` : `app.${slug}.io/dashboard`

  const draw = (t) => {
    ctx.clearRect(0, 0, W, H)
    if (kind === 'website') drawWebsite(ctx, p, variant, rand, t, brand)
    else drawSoftware(ctx, p, variant, rand, t, brand)
    drawChrome(ctx, label)
    texture.needsUpdate = true
  }

  draw(0)
  return { texture, draw, accent: p.strong }
}
