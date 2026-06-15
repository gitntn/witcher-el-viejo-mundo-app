/* Service Worker — El Viejo Mundo, Compañero de Caza
   Cachea el "app shell" para que funcione sin conexión en la mesa de juego.
   Estrategia: cache-first para los recursos propios; la red solo se usa
   como respaldo o para recursos externos (fuentes de Google). */

const CACHE = "viejo-mundo-v9";

const CARDS = [
  "arachas", "arpia", "arquespor", "barghest", "boira", "demonio-podrido",
  "ekimmara", "nido-de-ghuls", "nido-de-nekkers", "nido-de-sumergidos",
  "aparicion-nocturna", "bruja-del-agua", "bruja-sepulcral", "dama-del-mediodia",
  "demonibestia", "grifo", "hombre-lobo", "manticora", "penitente", "susurradora",
  "tejedora", "wyverno", "babagor", "estrige", "guisadora", "lamia", "leshen",
  "yghern", "trol",
];

const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/data/monsters.js",
  "./js/data/images.js",
  "./manifest.webmanifest",
  "./assets/img/portada.jpg",
  "./assets/img/dagon.jpg",
  "./assets/img/terrenos/bosque.jpg",
  "./assets/img/terrenos/montana.jpg",
  "./assets/img/terrenos/agua.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png",
  ...CARDS.map((c) => `./assets/img/cartas/${c}.jpg`),
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // App shell (HTML/JS/CSS/manifest y navegaciones): RED PRIMERO, para que
  // las actualizaciones de código se vean siempre que haya conexión.
  const isShell = req.mode === "navigate" ||
    (sameOrigin && /\.(html|js|css|webmanifest)$/i.test(url.pathname));

  if (isShell) {
    ev.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
    );
    return;
  }

  // Imágenes, fuentes y demás: CACHÉ PRIMERO + refresco en segundo plano.
  ev.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
