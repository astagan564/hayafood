import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  appType: 'spa',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
      manualChunks(id) {
          // React core runtime
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Framer Motion (animation, largest single dep)
          if (id.includes('node_modules/framer-motion/')) {
            return 'vendor-framer';
          }
          // Radix UI components
          if (id.includes('node_modules/@radix-ui/')) {
            return 'vendor-radix';
          }
          // Supabase client
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          // Lucide icons (tree-shaken per-icon but still chunked)
          if (id.includes('node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          // CSS-in-JS / utility helpers
          if (
            id.includes('node_modules/clsx/') ||
            id.includes('node_modules/tailwind-merge/') ||
            id.includes('node_modules/class-variance-authority/')
          ) {
            return 'vendor-utils';
          }
        },

      },
    },
    // Raise warning threshold slightly since we've split chunks
    chunkSizeWarningLimit: 600,
  },
});
