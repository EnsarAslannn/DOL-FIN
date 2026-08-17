/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // `src/assets/extra/` is where raw art and screen recordings land, and
      // a file that is still being written is locked on Windows. chokidar
      // calls fs.watch() the moment it sees the new path, that throws EBUSY,
      // and the unhandled FSWatcher error takes the whole dev server down —
      // it happened three times while the redesign assets were being added.
      //
      // Ignoring the directory rather than a set of extensions, because the
      // problem is the write, not the file type: the same crash came from an
      // .mp4 and a .png. `awaitWriteFinish` does not help, since it delays
      // the add *event* while chokidar still tries to watch the locked file.
      //
      // Cost: editing an asset in here no longer triggers HMR. These files
      // change rarely and a manual refresh picks them up, which is a better
      // trade than losing the server mid-session.
      ignored: ["**/src/assets/extra/**"],
    },
  },
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
