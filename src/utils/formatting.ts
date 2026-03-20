export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  if (days > 0) return `${days}d ${hours}h`
  const mins = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${mins}m`
}

export function formatDistance(km: number): string {
  if (km >= 1e6) return `${(km / 1e6).toFixed(1)}M km`
  if (km >= 1e3) return `${(km / 1e3).toFixed(0)}K km`
  return `${km.toFixed(0)} km`
}

export function formatSpeed(kms: number): string {
  return `${kms.toFixed(1)} km/s`
}
