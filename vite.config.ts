import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// In dev, serve /api/chat with the same handler Vercel runs in production,
// so the local chat can never drift from the live one. Keys come from .env.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, process.cwd(), ''))

      server.middlewares.use(async (req, res, next) => {
        const route = req.url?.match(/^\/api\/(chat)(?:\?|$)/)?.[1]
        if (!route) return next()

        const json = (code: number, o: unknown) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(o))
        }

        if (!process.env.GROQ_API_KEY) {
          server.config.logger.warn('[dev-api] GROQ_API_KEY is not set. Copy .env.example to .env and add your Groq key.')
          return json(500, { error: 'GROQ_API_KEY missing' })
        }

        let raw = ''
        for await (const chunk of req) raw += chunk
        let body: unknown = {}
        try {
          body = raw ? JSON.parse(raw) : {}
        } catch {
          return json(400, { error: 'Invalid JSON' })
        }

        try {
          const { default: handler } = await server.ssrLoadModule(`/api/${route}.ts`)
          await handler(
            { method: req.method, headers: req.headers, body },
            {
              status: (code: number) => ({ end: () => ((res.statusCode = code), res.end()), json: (o: unknown) => json(code, o) }),
              json: (o: unknown) => json(200, o),
            },
          )
        } catch (e) {
          server.config.logger.error(`[dev-api] /api/${route} failed: ${String(e)}`)
          if (!res.writableEnded) json(500, { error: 'Handler failed' })
        }
      })
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss(), devApi()],
})
