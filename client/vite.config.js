import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Vite Plugin to inject all emitted bundle assets into sw.js precache list
function pwaAssetInjector() {
  return {
    name: 'pwa-asset-injector',
    apply: 'build',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const swPath = path.join(distDir, 'sw.js');
        if (!fs.existsSync(swPath)) return;

        const assetList = ['/', '/index.html', '/manifest.json', '/logo.svg'];
        const assetsDir = path.join(distDir, 'assets');

        if (fs.existsSync(assetsDir)) {
          const assetFiles = fs.readdirSync(assetsDir);
          for (const file of assetFiles) {
            assetList.push(`/assets/${file}`);
          }
        }

        let swContent = fs.readFileSync(swPath, 'utf8');
        swContent = swContent.replace(
          'self.__SW_PRECACHE_ASSETS__',
          JSON.stringify(assetList, null, 2)
        );

        fs.writeFileSync(swPath, swContent, 'utf8');
        console.log(`[PWA Plugin] Successfully injected ${assetList.length} precache assets into dist/sw.js`);
      } catch (err) {
        console.warn('[PWA Plugin] Warning during asset injection:', err);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), pwaAssetInjector()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
});

