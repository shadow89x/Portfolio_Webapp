import { defineConfig } from 'vite'

export default defineConfig({
  // Base public path when served in production
  base: './',
  
  // Development server configuration
  server: {
    port: 3000,
    open: true, // Automatically open browser
    host: true  // Allow external access
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'src/pages/home/index.html',
        portfolio: 'src/pages/portfolio/index.html',
        contact: 'src/pages/contact/index.html'
      }
    }
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['lucide']
  }
}) 