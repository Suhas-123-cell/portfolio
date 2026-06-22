export default async function handler(
  req: { method: string; body: { text: string } },
  res: {
    status: (n: number) => { end: () => void; json: (o: unknown) => void }
    setHeader: (k: string, v: string) => void
    end: (buf: Buffer) => void
    json: (o: unknown) => void
  }
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'no text' })

  const r = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FISH_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text.trim(),
      reference_id: process.env.FISH_VOICE_ID,
      format: 'mp3',
      latency: 'normal',
    }),
  })

  if (!r.ok) return res.status(502).json({ error: 'TTS failed' })

  const buf = Buffer.from(await r.arrayBuffer())
  res.setHeader('Content-Type', 'audio/mpeg')
  res.end(buf)
}
