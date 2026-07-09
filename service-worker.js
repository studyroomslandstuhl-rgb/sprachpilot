const CACHE_VERSION="sprachpilot-static-v20260709";
const STATIC_TYPES=["style","script","image","font","audio"];
const CACHEABLE_EXT=/\.(css|js|png|jpg|jpeg|webp|svg|gif|ico|woff2?|mp3|wav|ogg|m4a)$/i;

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(["./","./index.html","./style.css","./assets/logo/sprachpilot-logo.png"]).catch(()=>{})));
});

self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_VERSION).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});

function isCacheable(request){
  if(request.method!=="GET")return false;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return false;
  if(url.pathname.includes("/__/"))return false;
  if(CACHEABLE_EXT.test(url.pathname))return true;
  return STATIC_TYPES.includes(request.destination);
}

async function networkFirst(request){
  const cache=await caches.open(CACHE_VERSION);
  try{
    const fresh=await fetch(request);
    if(fresh&&fresh.ok)cache.put(request,fresh.clone()).catch(()=>{});
    return fresh;
  }catch(e){
    return (await cache.match(request)) || Response.error();
  }
}

async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE_VERSION);
  const cached=await cache.match(request);
  const refresh=fetch(request).then(response=>{
    if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});
    return response;
  }).catch(()=>null);
  return cached || refresh || fetch(request);
}

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.mode==="navigate"){
    event.respondWith(networkFirst(request));
    return;
  }
  if(isCacheable(request))event.respondWith(staleWhileRevalidate(request));
});
