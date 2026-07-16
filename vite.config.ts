import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // appType: 'spa' is the default — Vite automatically serves index.html
  // for unknown routes, enabling path-based SPA routing out of the box.
  appType: 'spa',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
