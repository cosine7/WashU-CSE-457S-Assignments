import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dsv from '@rollup/plugin-dsv';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    dsv(),
  ],
});
