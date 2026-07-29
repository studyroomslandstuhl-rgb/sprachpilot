const CACHE_VERSION="sprachpilot-static-v20260729-l6t4-hardfix8";

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

  const isStatic=/\.(?:js|css|html)($|\?)/i.test(url.pathname+url.search);
  if(request.mode==="navigate"||request.destination==="script"||request.destination==="style"||isStatic){
    event.respondWith(fetch(request,{cache:"no-store"}).catch(()=>fetch(request)));
  }
});