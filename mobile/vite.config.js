import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'
import { fileURLToPath, URL } from 'node:url'

const uni = uniPlugin.default || uniPlugin

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
      components: fileURLToPath(new URL('./components', import.meta.url)),
    },
  },
})
