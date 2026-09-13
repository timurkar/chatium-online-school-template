// @shared

export function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} ч ${m} мин` : `${h} ч`
}

/** Превращает ссылку на YouTube / VK Video / Rutube в адрес для iframe; иначе возвращает null. */
export function toEmbedUrl(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null
  const yt = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  const rutube = trimmed.match(/rutube\.ru\/video\/([\w]+)/)
  if (rutube) return `https://rutube.ru/play/embed/${rutube[1]}`
  const vk = trimmed.match(/vk(?:video)?\.(?:com|ru)\/video(-?\d+)_(\d+)/)
  if (vk) return `https://vk.com/video_ext.php?oid=${vk[1]}&id=${vk[2]}`
  if (/\.(mp4|webm)(\?|$)/i.test(trimmed)) return null
  return trimmed.includes('/embed') || trimmed.includes('player') ? trimmed : null
}

export function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm)(\?|$)/i.test(url.trim())
}
