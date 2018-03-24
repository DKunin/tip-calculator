const CACHE_NAME = 'tip-calculator';

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './assets/icons/android-chrome-192x192.png',
    './assets/icons/android-chrome-512x512.png',
    './assets/icons/favicon.ico',
    './assets/icons/icon-96.png',
    './assets/icons/icon-48.png',
    './assets/icons/icon-144.png',
    './assets/icons/icon-196.png',
    './assets/icons/icon-384.png'
];

// Set the callback for the install step
self.oninstall = function(event) {
    console.log('[serviceWorker]: Installing...');
    // perform install steps
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                console.log('[serviceWorker]: Cache All');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log(
                    '[serviceWorker]: Intalled And Skip Waiting on Install'
                );
                return self.skipWaiting();
            })
    );
};

self.onfetch = function(event) {
    console.log('[serviceWorker]: Fetching ' + event.request.url);
    var raceUrl = 'API/';
    if (event.request.url.indexOf(raceUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request)
                    .then(function(res) {
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
                    .catch(err => {
                        console.log('[serviceWorker]: Fetch Error ' + err);
                    });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(res) {
                return res || fetch(event.request);
            })
        );
    }
};

self.onactivate = function(event) {
    console.log('[serviceWorker]: Actived');

    var whiteList = [CACHE_NAME];

    event.waitUntil(
        caches
            .keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (whiteList.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(function() {
                console.log('[serviceWorker]: Clients Claims');
                return self.clients.claim();
            })
    );
};
