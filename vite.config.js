import react from '@vitejs/plugin-react'
import { defineConfig, transformWithOxc } from 'vite'

// https://vite.dev/config/
// I had to do some workaround because vite OXC transformer intercepting main.js
// and doesn't know it contains JSX. The provided file are in .js format
// and it is forbidded to modify those files to .jsx
const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/src\/.*\.js$/.test(id)) return null
    return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } })
  },
}

export default defineConfig({
  plugins: [jsxInJs, react()],
})