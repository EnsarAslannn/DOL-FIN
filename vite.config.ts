/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    // e2e/ holds Playwright specs (a different test runner, run via
    // `npm run test:e2e`) -- Vitest's default include glob would otherwise
    // try to load them too and fail on the incompatible `test`/`expect` API.
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
