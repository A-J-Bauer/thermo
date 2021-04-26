const version = '1.3';

const cacheName = 'cache-' + version;

const resourcesToPreserve = [
    '/thermo/',
    '/thermo/index.html',
    '/thermo/serial.js',
    '/thermo/favicon.ico',        
    '/thermo/img/icon-72.png',
    '/thermo/img/icon-96.png',
    '/thermo/img/icon-144.png',
    '/thermo/img/icon-192.png',
    '/thermo/img/icon-256.png',
    '/thermo/img/icon-512.png',    
    '/thermo/RobotoMono-Regular.ttf'
];

self.addEventListener('install', event => {    
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(resourcesToPreserve);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cn => {
                    return cn !== cacheName;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
            .then(cache => {
                return cache.match(event.request)
                    .then(response => {
                        const fetchPromise = fetch(event.request)
                    .then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    })
                return response || fetchPromise;
            })
        })        
    );      
});

self.addEventListener('message', event => {    
    if (event.data === 'version') {
        event.source.postMessage({msg: 'version', version: version });
    }    
});