// In-memory sliding window, scoped to a single warm Vercel function instance.
// Doesn't survive cold starts or scale-out across instances, but stops the
// trivial single-script abuse loop that hit these endpoints unthrottled.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 5
const hits = new Map<string, number[]>()

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_REQUESTS
}

export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-forwarded-for']
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return first?.split(',')[0]?.trim() ?? 'unknown'
}
