/* Offline interface shell only; Spotify tracks and API calls are not cached. */
const CACHE='spotify-cue-board-shell-v5-immediate-replay';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('spotify-cue-board-shell-')&&k!==CACHE).map(k=>caches.delete(k))))])));
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET'||req.mode==='no-cors')return;
 const u=new URL(req.url);if(u.origin!==self.location.origin)return;
 if(u.pathname!==new URL('./',self.location).pathname&&u.pathname!==new URL('./index.html',self.location).pathname)return;
 e.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
});
