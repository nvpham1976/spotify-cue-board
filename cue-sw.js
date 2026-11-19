/* Spotify Cue Board offline interface cache.
   No Spotify recordings, authentication, or API requests are cached. */
const CACHE='spotify-cue-board-shell-v2-timer-fix';
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./','./index.html'])).then(()=>self.skipWaiting()).catch(()=>{}));
});
self.addEventListener('activate',event=>{
 event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('spotify-cue-board-shell-')&&k!==CACHE).map(k=>caches.delete(k))))]));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||request.mode==='no-cors')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname!==new URL('./',self.location).pathname&&url.pathname!==new URL('./index.html',self.location).pathname)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}
  return response;
 }).catch(()=>caches.match(request).then(r=>r||caches.match('./index.html'))));
});
