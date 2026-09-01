(function(){
'use strict';
const EPOCH='20260901-course-release-fix2';
const KEY='SP_CACHE_EPOCH';
if(window.__SP_CACHE_EPOCH_V12)return;window.__SP_CACHE_EPOCH_V12=true;
async function clearAppCaches(){
 const jobs=[];
 try{if('caches'in window)jobs.push(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))))}catch(e){}
 try{if(navigator.serviceWorker?.getRegistrations)jobs.push(navigator.serviceWorker.getRegistrations().then(rows=>Promise.all(rows.map(row=>row.unregister()))))}catch(e){}
 await Promise.allSettled(jobs);
}
async function run(){
 let old='';try{old=localStorage.getItem(KEY)||''}catch(e){}
 if(old===EPOCH)return;
 try{localStorage.setItem(KEY,EPOCH)}catch(e){}
 await clearAppCaches();
 const url=new URL(location.href);
 if(url.searchParams.get('spcache')!==EPOCH){url.searchParams.set('spcache',EPOCH);location.replace(url.href)}
}
window.SPCacheEpoch={epoch:EPOCH,run};run().catch(()=>{});
})();
