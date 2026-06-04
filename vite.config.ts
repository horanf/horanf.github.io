import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    {
      name: 'fix-ts-mime',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.match(/\.(ts|tsx|mts|cts)$/)) {
            res.setHeader('Content-Type', 'application/javascript')
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['**/*.md'],
})
