import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

// Serves /api/chat locally under `vite dev`, mirroring the api/chat.ts
// Vercel function, so the chatbot works without deploying or linking Vercel.
function chatApiDevMiddleware(env: Record<string, string>) {
  return {
    name: 'chat-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY

        let raw = ''
        req.on('data', (chunk) => (raw += chunk))
        req.on('end', async () => {
          try {
            const { handleChatRequest } = await import('./api/_chatHandler')
            const body = raw ? JSON.parse(raw) : {}
            const { status, body: respBody } = await handleChatRequest(body)
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(respBody))
          } catch {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Bad request' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  return {
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    chatApiDevMiddleware(env),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv', '**/*.pdf'],
  }
})
