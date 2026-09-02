// Jednoduchý service worker: brožúrku uloží po prvom otvorení do zariadenia,
// aby bola dostupná aj bez internetového pripojenia.
//
// Ukladáme jednak samotné PDF (na stiahnutie), jednak jednotlivé strany
// pripravené ako obrázky, z ktorých sa brožúrka listuje.
const CACHE_NAME = "mbo-offline-v2";

// Staršie verzie medzipamäte po aktualizácii upraceme.
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith("mbo-offline-") && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Ukladáme len obsah brožúrok — nič iné zo stránky do medzipamäte nejde,
// aby sa účastníkom vždy zobrazila aktuálna verzia kurzu.
function isBrochureAsset(url) {
  const path = url.pathname.toLowerCase();
  if (path.endsWith(".pdf")) return true;
  return path.includes("/brozurky/") && (path.endsWith(".jpg") || path.endsWith("manifest.json"));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (!isBrochureAsset(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return cached || Response.error();
      }
    })
  );
});
