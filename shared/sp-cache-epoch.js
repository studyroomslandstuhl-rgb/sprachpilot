(function(){
'use strict';
const EPOCH='20260901-course-release-save-fix4';
const KEY='SP_CACHE_EPOCH';
const RELEASE_ASSETS=[
 '/js/course-releases.js?v=20260901-course-release-fix2',
 '/js/course-releases.js?v=20260822-cache2',
 '/js/course-releases.js?v=release-core-20260701b',
 '/js/course-releases.js?v=verb-stable3',
 '/js/student-login-v2.js?v=20260901-course-release-fix2',
 '/js/student-login-v2.js?v=20260825-link5',
 '/dativverben/access.js?v=20260901-course-release-fix2',
 '/dativverben/access.js?v=2',
 '/teacher/release-course-code-fix.js?v=teacher-lite1',
 '/teacher/release-parent-rules.js?v=teacher-lite1',
 '/teacher/releases.js?v=teacher-lite1',
 '/shared/release-catalog-a1-l3-l7.js?v=20260824-2'
];
if(window.__SP_CACHE_EPOCH_V14)return;window.__SP_CACHE_EPOCH_V14=true;
async function clearAppCaches(){
 const jobs=[];
 try{if('caches'in window)jobs.push(caches.keys().then(keys=>Promise.all(keys.map(key=>caches.delete(key)))))}catch(e){}
 try{if(navigator.serviceWorker?.getRegistrations)jobs.push(navigator.serviceWorker.getRegistrations().then(rows=>Promise.all(rows.map(row=>row.unregister()))))}catch(e){}
 await Promise.allSettled(jobs);
}
async function refreshReleaseAssets(){
 try{await Promise.allSettled(RELEASE_ASSETS.map(src=>fetch(src,{cache:'reload',credentials:'same-origin'})))}catch(e){}
}
async function run(){
 let old='';try{old=localStorage.getItem(KEY)||''}catch(e){}
 if(old===EPOCH)return;
 try{localStorage.setItem(KEY,EPOCH)}catch(e){}
 await clearAppCaches();
 await refreshReleaseAssets();
 const url=new URL(location.href);
 if(url.searchParams.get('spcache')!==EPOCH){url.searchParams.set('spcache',EPOCH);location.replace(url.href)}
}
window.SPCacheEpoch={epoch:EPOCH,run};run().catch(()=>{});
})();
