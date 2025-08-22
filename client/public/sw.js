const CACHE_NAME = 'riazanov-mebel-v1.0.0';
const STATIC_CACHE_NAME = 'static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'dynamic-v1.0.0';

// Статические ресурсы для кеширования
const STATIC_ASSETS = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/favicon.svg',
    '/placeholder.svg',
    '/manifest.json'
];

// Ресурсы для сетевой стратегии
const NETWORK_FIRST_PATTERNS = [
    /\/api\/product/,
    /\/api\/type/,
    /\/api\/factory/
];

// Ресурсы для кеш-стратегии
const CACHE_FIRST_PATTERNS = [
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    /\.(?:css|js)$/,
    /cdn\.jsdelivr\.net/
];

// Установка Service Worker
self.addEventListener('install', event => {
    console.log('Service worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .catch(err => {
                console.error('Failed to cache static assets:', err);
            })
    );
    
    self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
    console.log('Service worker activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE_NAME && 
                        cacheName !== DYNAMIC_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Пропускаем non-GET запросы
    if (request.method !== 'GET') {
        return;
    }
    
    // Стратегия для разных типов ресурсов
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
        // Cache First для статических ресурсов
        event.respondWith(cacheFirst(request));
    } else if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(request.url))) {
        // Network First для API
        event.respondWith(networkFirst(request));
    } else if (url.origin === location.origin) {
        // Stale While Revalidate для остальных запросов
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Стратегия Cache First
async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('Cache first failed:', error);
        // Возвращаем заглушку для изображений
        if (request.destination === 'image') {
            return caches.match('/placeholder.svg');
        }
        throw error;
    }
}

// Стратегия Network First
async function networkFirst(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            // Кешируем только успешные ответы
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('Network first failed, trying cache:', error);
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

// Стратегия Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request)
        .then(response => {
            if (response.status === 200) {
                cache.put(request, response.clone());
            }
            return response;
        })
        .catch(error => {
            console.error('Stale while revalidate fetch failed:', error);
            return null;
        });
    
    return cached || fetchPromise;
}

// Background Sync для оффлайн функциональности
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Логика синхронизации данных при восстановлении соединения
    console.log('Background sync triggered');
} 