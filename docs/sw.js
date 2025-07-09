const CACHE_NAME = 'optical-warehouse-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/vector_search.html',
  '/sample/images/KakaoTalk_20220610_132225838.jpg',
  '/sample/images/python.jpg',
  '/sample/images/sql.jpg',
  '/sample/images/powerbi.jpg',
  '/sample/images/excel.jpg',
  '/sample/images/powerpoint.jpg',
  '/sample/images/html-css.jpg',
  '/sample/images/javascript.jpg',
  '/sample/images/git.jpg',
  '/sample/images/quickbooks.jpg'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 