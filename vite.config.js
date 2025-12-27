import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    preact(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      manifest: {
        name: 'ibtwil blogs',
        short_name: 'ibtwil blogs',
        description: 'ibtwil',
        background_color: "#D3EB50",
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'Icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'Icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'Icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          }
        ],
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,json}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          // Rule #1: Navigation (HTML Pages) - MOST IMPORTANT
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 10, // Wait max 3 seconds for network
              plugins: [
                {
                  // CRITICAL: Validate HTML before caching
                  cacheWillUpdate: async ({ response }) => {
                    // Reject non-200 responses immediately
                    if (response.status !== 200) {
                      console.log('🚫 SW: Not caching - Status:', response.status);
                      return null;
                    }

                    try {
                      // Read the HTML content
                      const responseClone = response.clone();
                      const text = await responseClone.text();

                      // Check if it's your real app (flexible matching)
                      // This will match: <div id="blogs-ibtwil-app"></div>
                      // Or: <div id="blogs-ibtwil-app">...</div>
                      // Or even: <div id='blogs-ibtwil-app'>
                      if (text.includes('blogs-ibtwil-app')) {
                        console.log('✅ SW: Valid HTML - caching');
                        return response;
                      } else {
                        console.log('🚫 SW: Not your app HTML - not caching (probably error page)');
                        return null;
                      }
                    } catch (err) {
                      console.error('❌ SW: Error reading response:', err);
                      return null;
                    }
                  }
                }
              ],
            },
          },

          // Rule #2: Images
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },

          // Rule #3: JS and CSS (your app code)
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      }
    })
  ],
  
  server: {
    port: 5173,
    host: true
  }
});