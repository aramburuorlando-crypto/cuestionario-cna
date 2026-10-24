const CACHE_NAME = 'poder-canalla-v1';
// Lista de archivos locales estáticos que se guardarán en la memoria del dispositivo
const ASSETS_TO_CACHE = [
  'index.html',
  'preguntas.json',
  'manifest.json'
];

// Evento de Instalación: Guarda los archivos esenciales en el almacenamiento local
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Servidor Interno: Guardando archivos de la hinchada en caché...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de Activación: Limpia memorias viejas si actualizás la app en el futuro
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Servidor Interno: Eliminando caché antigua...');
            return caches.delete(cache);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Evento Fetch: Estrategia de responder desde el almacenamiento local si no hay internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si el archivo está en la memoria del celular, lo devuelve inmediatamente
        if (response) {
          return response;
        }
        // Si no está (como los enlaces externos de mapas/videos), lo va a buscar a internet
        return fetch(event.request);
      })
  );
});
