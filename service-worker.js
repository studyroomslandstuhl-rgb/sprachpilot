const CACHE_VERSION="sprachpilot-static-v20260713-l3t2-a14-units-1";

self.addEventListener("install",event=>{
  self.skipWaiting();
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.destination==="script" || /\.js($|\?)/i.test(url.pathname+url.search)){
    event.respondWith(fetch(request,{cache:"no-store"}).catch(()=>fetch(request)));
    return;
  }

  if(request.mode==="navigate"){
    event.respondWith(fetch(request,{cache:"no-store"}).catch(()=>fetch(request)));
    return;
  }
});