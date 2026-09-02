const CACHE='aae-treino-v11-flexibilidade-videos';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const isNav=event.request.mode==='navigate' || event.request.destination==='document';
  if(isNav){
    event.respondWith(fetch(event.request).then(resp=>{
      const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return resp;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{
    const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return resp;
  })));
});
