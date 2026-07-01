const LMNT_URL = 'https://api.lmnt.com/v1/ai/speech/bytes'

export default async function handler(
  req: { method: string; body: { text: string } },
  res: {
    status: (n: number) => { end: () => void; json: (o: unknown) => void }
    setHeader: (k: string, v: string) => void
    send: (b: Buffer) => void
  }
) {
  if (req.method !== 'POST') return res.status(405).end()

  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'No text' })

  const lmntRes = await fetch(LMNT_URL, {
    method: 'POST',
    headers: {
      'X-API-Key': process.env.LMNT_API_KEY ?? '',
      'lmnt-version': '1.2',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text.slice(0, 5000),
      voice: process.env.LMNT_VOICE_ID,
      format: 'mp3',
    }),
  })

  if (!lmntRes.ok) {
    return res.status(502).json({ error: 'LMNT synthesis failed' })
  }

  const audio = Buffer.from(await lmntRes.arrayBuffer())
  res.setHeader('Content-Type', 'audio/mpeg')
  res.send(audio)
}
