import { defineConfig } from 'vite';

const useLocalBackend = true;

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: useLocalBackend
          ? 'http://localhost:8080'
          : 'http://13.53.198.252:5863',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  },
});
