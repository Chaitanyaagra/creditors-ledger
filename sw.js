/* Creditors Ledger - offline shell.

   index.html is network-first: if you are online you always get the newest
   version, and the cached copy is only used when the network fails. Icons and
   the manifest are cache-first because they rarely change.

   Bump CACHE when you upload a new index.html. */
const CACHE = 'creditors-v9';
const SHELL = './index.html';
const FILES = [
  './', SHELL, './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(req, res) {
  const copy = res.clone();
  return caches.open(CACHE)
    .then(c => c.put(req, copy))
    .catch(err => {
      // Usually the device is out of space. Say so rather than pretending the
      // offline copy is up to date.
      console.warn('[creditors] could not cache', req.url, err);
    });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin) return;                       // let Firebase and the CDN go straight out

  // The app shell: newest version wins, cache is the fallback.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => { store(req, res); return res; })
        .catch(() => caches.match(SHELL).then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => { store(req, res); return res; })
        .catch(() => {
          // Only hand back the HTML shell for page loads. Returning it for an
          // image or the manifest just produces broken icons and MIME errors.
          if (req.mode === 'navigate') return caches.match(SHELL);
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
