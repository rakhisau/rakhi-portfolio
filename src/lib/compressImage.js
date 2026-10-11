const MAX_WIDTH = 1600
const QUALITY = 0.82

function canEncodeWebp() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').startsWith('data:image/webp')
}

const WEBP = canEncodeWebp()

// Screenshots come off a desktop at 2-4MB each. Resizing and re-encoding
// in the browser keeps the published page light without a build step.
export async function compressImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const scale = Math.min(1, MAX_WIDTH / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  const type = WEBP ? 'image/webp' : 'image/jpeg'
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY))
  if (!blob || blob.size >= file.size) return file

  const ext = WEBP ? 'webp' : 'jpg'
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext
  return new File([blob], name, { type })
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
