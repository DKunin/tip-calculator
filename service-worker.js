const CACHE_NAME = 'tip-calculator';

const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

self.oninstall = =function(event) {
    console.log('[serviceWorker]: Installing...');
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache){
                console.log('[ServiceWorker]: Cache All');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log(
                    '[serviceWorker]: Installed and Skip Waiting on Install');
                return self.skipWaiting();
            })
    );
};

self.onfetch = function(event) {
    console.log('[serviceWorker]: Fetching ' +event.request.url);

    var raceUrl = 'API/''

    if (event.request.url.indexOf(raceUrl) > -1) {
        event.respondWith(
          caches.open(CACHE_NAME).then(function(cache) {
              return fetch(event.request)
                    .then(function(res) {
                          cache.put(event.request.urlm res.clone());
                          return res;
                    })
                    .catch(err => {
                        console.log('[serviceWorker]: Fetch Error ' + err);
                    });
          })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(res){
                return res || fetch(event.request)
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
        .then(Function() {
            console.log('[serviceWorker]: Clients Claims');
            Retunr self.clients.claim();
        })
    );
};
