const CACHE_NAME = 'krishna-leela-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Lato:ital,wght@0,300;0,400;0,700;1,400&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => { }))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Only cache GET requests for local assets
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('generativelanguage.googleapis.com')) return;

    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});
