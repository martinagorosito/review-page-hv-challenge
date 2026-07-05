import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true, 
  },
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@domain': resolve(__dirname, 'src/domain'),
      '@application': resolve(__dirname, 'src/application'),
      '@infrastructure': resolve(__dirname, 'src/infrastructure'),
      '@presentation': resolve(__dirname, 'src/presentation'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@app': resolve(__dirname, 'src/app'),
      '@design-system': resolve(__dirname, 'src/presentation/design-system'),
    },
  },
})
