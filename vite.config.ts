import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@supabase/supabase-js',
        'openai',
        'jspdf',
        'jspdf-autotable'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'styled-components', 'lucide-react'],
          radix: [
            '@radix-ui/react-label',
            '@radix-ui/react-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-tabs'
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@radix-ui/react-label',
      'framer-motion',
      'lucide-react',
      'date-fns',
      'lodash',
      'jspdf',
      'jspdf-autotable'
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})