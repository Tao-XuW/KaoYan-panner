import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: false,
    strategies: 'generateSW',
    includeAssets: ['favicon.svg', 'pwa-192x192.png', 'pwa-512x512.png'],
    manifest: {
      name: '考研408计划表',
      short_name: '考研计划',
      description: '22408考研备考计划管理工具',
      theme_color: '#1E40AF',
      background_color: '#F8FAFC',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf,webp}'],
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/api\//],
    },
  }), cloudflare()],
})