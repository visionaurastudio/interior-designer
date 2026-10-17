import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build portable (works from any folder or sub-path).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', sourcemap: false },
});
