/* Creditors Ledger - offline shell.

   The cache name is derived from index.html's own BUILD marker, instead of
   being a separate number kept by hand in this file - ship a new index.html
   and this file works it out on its own, with nothing to forget to bump.

   That name is resolved ONCE per service-worker lifetime, at install, and
   reused from then on. Deriving it fresh on every single cached file (the
   earlier version of this file did that) meant a flaky connection could
   make different assets land in different cache buckets within the same
   session - the exact kind of "unpredictable offline behaviour" this
   design is meant to avoid.

   index.html itself uses stale-while-revalidate: the cached copy answers
   immediately (important on a slow or intermittent connection - a shop's
   patchy mobile data, a moving vehicle), while a background fetch quietly
   refreshes the cache for next time. This is safe here specifically because
   the ledger's actual figures never live in this cached shell - they live
   in the browser's local storage and in Firebase - so an instant answer
   from a slightly older cached copy of the CODE never means showing an
   older number on screen, only running that one session on code that is at
   most one version behind until the background refresh catches up. */
const SHELL = './index.html';
const FILES = [
  './', SHELL, './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];
const FALLBACK_CACHE = 'creditors-app';   // used only if the version can't be read even once (should not happen when hosted)

let cacheNamePromise = null;
function currentCacheName() {
  if (!cacheNamePromise) {
    cacheNamePromise = fetch(SHELL, { cache: 'no-store' })
      .then(res => res.text())
      .then(text => {
        const m = text.match(/var BUILD=['"]([^'"]*)['"]/);
        const tag = m ? m[1].replace(/[^a-z0-9.]+/gi, '-') : 'unknown';
        return 'creditors-' + tag;
      })
      .catch(() => FALLBACK_CACHE);
  }
  return cacheNamePromise;
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

  // The app shell: answer from cache immediately if we have it, and quietly
  // refresh the cache in the background either way. Falls back to a plain
  // network fetch only the very first time, before anything is cached yet.
  //
  // The background refresh's own promise (passed to waitUntil) only resolves
  // once the cache write itself is done, not just once the fetch is done -
  // otherwise the browser is free to end the service worker right after the
  // fetch completes, and a slow write (a full device, a bad moment) could be
  // cut off before the newer copy is actually saved for next time.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      currentCacheName()
        .then(name => caches.open(name))
        .then(c => c.match(SHELL).then(cached => {
          const network = fetch(req)
            .then(res => store(req, res.clone()).then(() => res))
            .catch(() => null);
          if (cached) { e.waitUntil(network); return cached; }
          return network.then(res => res || caches.match('./'));
        }))
    );
    return;
  }

  // Everything else: cache first, then network. The response itself goes back
  // to the page as soon as the fetch completes - it does not wait on the
  // cache write - but that write is still separately protected by waitUntil
  // so it is not silently dropped if the service worker is torn down right
  // after the response is delivered.
  e.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req)
        .then(res => {
          e.waitUntil(store(req, res.clone()));
          return res;
        })
        .catch(() => {
          // Only hand back the HTML shell for page loads. Returning it for an
          // image or the manifest just produces broken icons and MIME errors.
          if (req.mode === 'navigate') return caches.match(SHELL);
          return new Response('', { status: 504, statusText: 'Offline' });
        });
    })
  );
});
