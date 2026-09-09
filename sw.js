/* Creditors Ledger - offline shell.

   index.html is network-first: if you are online you always get the newest
   version, and the cached copy is only used when the network fails. Icons and
   the manifest are cache-first because they rarely change.

   The cache name is read from index.html's own BUILD marker at install time,
   instead of being a separate number kept by hand in this file. That removes
   the "forgot to bump the version here too" mistake entirely - ship a new
   index.html and this file works it out on its own. */
const SHELL = './index.html';
const FILES = [
  './', SHELL, './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];
const FALLBACK_CACHE = 'creditors-app';   // used only if the version can't be read (should not happen when hosted)

function currentCacheName() {
  return fetch(SHELL, { cache: 'no-store' })
    .then(res => res.text())
    .then(text => {
      const m = text.match(/var BUILD=['"]([^'"]*)['"]/);
      const tag = m ? m[1].replace(/[^a-z0-9.]+/gi, '-') : 'unknown';
      return 'creditors-' + tag;
    })
    .catch(() => FALLBACK_CACHE);
}

self.addEventListener('install', e => {
  e.waitUntil(
    currentCacheName()
      .then(name => caches.open(name).then(c => c.addAll(FILES)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    currentCacheName().then(name =>
      caches.keys().then(ks =>
        Promise.all(ks.filter(k => k !== name && k.indexOf('creditors-') === 0).map(k => caches.delete(k)))
      ).then(() => self.clients.claim())
    )
  );
});

function store(req, res) {
  return currentCacheName()
    .then(name => caches.open(name))
    .then(c => c.put(req, res))
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
  if (url.origin !== self.location.origin) return;   // let Firebase and the CDN go straight out

  // The app shell: newest version wins, cache is the fallback.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => { store(req, res.clone()); return res; })
        .catch(() => caches.match(SHELL).then(hit => hit || caches.match('./')))
    );
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => { store(req, res.clone()); return res; })
        .catch(() => {
          // Only hand back the HTML shell for page loads. Returning it for an
          // image or the manifest just produces broken icons and MIME errors.
          if (req.mode === 'navigate') return caches.match(SHELL);
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
