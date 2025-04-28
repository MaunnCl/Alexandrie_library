import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://13.53.198.252:5863',  // Le serveur backend
        changeOrigin: true,
        secure: false,  // si tu utilises HTTPS, passe à true
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    port: 5173,
    host: "0.0.0.0"
  }
});
