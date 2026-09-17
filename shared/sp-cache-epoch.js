(function(){
'use strict';
const EPOCH='20260916-role2';
const KEY='SP_CACHE_EPOCH';
const RELEASE_ASSETS=[
 '/js/course-releases.js?v=strict-themes2',
 '/js/course-releases.js?v=20260901-course-release-fix2',
 '/js/course-releases.js?v=20260822-cache2',
 '/js/course-releases.js?v=release-core-20260701b',
 '/js/course-releases.js?v=verb-stable3',
 '/js/release-helper.js?v=20260908-theme-release1',
 '/js/student-login-v2.js?v=20260901-course-release-fix2',
 '/js/student-login-v2.js?v=20260825-link5',
 '/dativverben/access.js?v=20260901-course-release-fix2',
 '/dativverben/access.js?v=2',
 '/teacher/release-course-code-fix.js?v=teacher-lite1',
 '/teacher/release-parent-rules.js?v=teacher-lite1',
 '/teacher/releases.js?v=teacher-lite1',
 '/teacher/theme-release-hotfix.js?v=20260908-theme-release1',
 '/shared/release-catalog-a1-l3-l7.js?v=20260824-2'
];
if(window.__SP_CACHE_EPOCH_V18)return;window.__SP_CACHE_EPOCH_V18=true;
async function refreshReleaseAssets(){
 // Refresh in the background. Versioned URLs already invalidate changed files;
 // deleting every browser cache and forcing a reload made each release feel like
 // two cold page loads, especially on phones and slow connections.
 try{await Promise.allSettled(RELEASE_ASSETS.map(src=>fetch(src,{cache:'no-cache',credentials:'same-origin'})))}catch(e){}
}
async function run(){
 let old='';try{old=localStorage.getItem(KEY)||''}catch(e){}
 if(old===EPOCH)return;
 try{localStorage.setItem(KEY,EPOCH)}catch(e){}
 const start=()=>refreshReleaseAssets();
 if('requestIdleCallback'in window)requestIdleCallback(start,{timeout:4000});
 else setTimeout(start,1500);
}
window.SPCacheEpoch={epoch:EPOCH,run};run().catch(()=>{});
})();
