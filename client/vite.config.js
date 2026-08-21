import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Important : base = '/actueduc.io/' pour GitHub Pages (projet publié sur /actueduc.io)
export default defineConfig({
  base: '/actueduc.io/',
  plugins: [react()],
  build: {
    outDir: '../docs', // build static directement dans /docs pour GitHub Pages
    emptyOutDir: true
  }
});
