/* sw.js - Service Worker com Workbox (import do CDN) */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Workbox carregado');

  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/src/style.css', revision: '1' },
    { url: '/src/main.js', revision: '1' },
    { url: '/public/offline.html', revision: '1' }
  ]);

  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 })
      ]
    })
  );

  workbox.routing.registerRoute(
    ({request}) => request.destination === 'script' ||
                   request.destination === 'style' ||
                   request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'assets-cache',
      plugins: [ new workbox.expiration.ExpirationPlugin({ maxEntries: 100 }) ]
    })
  );

  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match('/offline.html'))
      );
    }
  });

} else {
  console.log('Workbox não carregado');
}
