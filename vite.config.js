import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
// Deploy: run `npm run build`. Commit `dist/` on main if your host pulls files from Git; else upload `dist/` contents only.
// (the folder that becomes `/` — must contain index.html and an `assets/` directory).
// If the site is served from a subpath (e.g. example.com/app/), set base: '/app/' (trailing slash).
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
