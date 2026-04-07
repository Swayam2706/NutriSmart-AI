import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion'))  return 'motion';
          if (id.includes('recharts'))       return 'charts';
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
        },
      },
    },
  },
});
