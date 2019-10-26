;
//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_programador_fitness',
  urlsToCache = [
    './',
    'https://fonts.googleapis.com/css?family=Raleway:400,700',
    'https://fonts.gstatic.com/s/raleway/v12/1Ptrg8zYS_SKggPNwJYtWqZPAA.woff2',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'https://use.fontawesome.com/releases/v5.0.6/webfonts/fa-brands-400.woff2',
    './style.css',
    './script.js',
    './img/ProgramadorFitness.png',
    './img/favicon.png'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  // ejecutamos un metodo llamado waitUntill(espera hasta)(wey-ontil)
  e.waitUntil(
    //que el objecto cache del sw pueda abrir el caches que hemos definido
    caches.open(CACHE_NAME)
    //Esto devuelve una promesa
      .then(cache => {
        //Ledecimo que retorne todo el cache  
        return cache.addAll(urlsToCache)
        //Ejecutamos un metodo llamado "self" que hace referencia a nuestro sw y "skipWaiting"(ski-wherink )(seguir esperando asta que termine todo la lista)
          .then(() => self.skipWaiting())
      }) 
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  //Creamos una const le pasamos el cache.
  const cacheWhitelist = [CACHE_NAME]
  
  // Aqui para ver que cambios han sufrido
  e.waitUntil(
    //Ejeccutamos el metodo "keys" que nos va apermitir vvos han subrido un cambio que archi
    caches.keys() 
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})
