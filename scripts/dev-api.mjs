// Local dev API server — proxied from Vite at /api -> http://localhost:3001
// Run: node scripts/dev-api.mjs
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import Groq from 'groq-sdk'

const __dir = dirname(fileURLToPath(import.meta.url))

// Load .env manually
try {
  const env = readFileSync(join(__dir, '../.env'), 'utf8')
  for (const line of env.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/)
    if (m) process.env[m[1]] = m[2].trim()
  }
} catch {}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are Suhas Choudary, an AI engineer and full-stack developer based in India. Answer questions about yourself in first person. Be conversational and concise — 2-3 sentences max.

Skills: Python, FastAPI, React, React Native, RAG, LLMs, Computer Vision, Supabase.
Projects: StreakFight (group habit tracker, RN+FastAPI+Gemini), HALLU-CHECK (hallucination detector, DeBERTa), Purplle Analytics (CCTV retail analytics, YOLOv8), ANIGO (AR mobile game), Venture Radar (4-agent B2B scout), StayChat (hotel RAG chatbot, live on HF).
Available: immediately, open to AI/ML and fullstack roles, India IST, remote OK.
Email: suhaschowdary25@gmail.com  GitHub: github.com/Suhas-123-cell`

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', async () => {
      try {
        const { message, history = [] } = JSON.parse(body)
        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history.slice(-6),
            { role: 'user', content: message },
          ],
          max_tokens: 120,
          temperature: 0.7,
        })
        const text = completion.choices[0]?.message?.content ?? ''
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ text }))
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: String(e) }))
      }
    })
    return
  }

  if (req.method === 'POST' && req.url === '/api/voice') {
    let body = ''
    req.on('data', c => body += c)
    req.on('end', async () => {
      try {
        const { text } = JSON.parse(body)
        const lmntRes = await fetch('https://api.lmnt.com/v1/ai/speech/bytes', {
          method: 'POST',
          headers: {
            'X-API-Key': process.env.LMNT_API_KEY ?? '',
            'lmnt-version': '1.2',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: String(text).slice(0, 5000), voice: process.env.LMNT_VOICE_ID, format: 'mp3' }),
        })
        if (!lmntRes.ok) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'LMNT synthesis failed' }))
          return
        }
        const audio = Buffer.from(await lmntRes.arrayBuffer())
        res.writeHead(200, { 'Content-Type': 'audio/mpeg' })
        res.end(audio)
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: String(e) }))
      }
    })
    return
  }

  res.writeHead(405); res.end()
})

server.listen(3001, () => console.log('API dev server → http://localhost:3001'))
