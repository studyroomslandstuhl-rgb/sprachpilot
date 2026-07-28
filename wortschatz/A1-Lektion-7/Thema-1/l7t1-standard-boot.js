(function(){
'use strict';
const VERSION='l7t1-full1';
const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script)});
async function loadApplication(){
 const files=['l7t1-standard-app-1.txt','l7t1-standard-app-2.txt','l7t1-standard-app-3.txt'];
 const parts=await Promise.all(files.map(file=>fetch(`${file}?v=${VERSION}`,{cache:'no-store'}).then(response=>{if(!response.ok)throw new Error(`${file}: ${response.status}`);return response.text()})));
 const blob=new Blob([parts.join('')],{type:'text/javascript'}),url=URL.createObjectURL(blob);
 try{await load(url)}finally{URL.revokeObjectURL(url)}
}
Promise.resolve(window.L7_THEME_READY)
 .then(()=>load(`l7t1-standard-state.js?v=${VERSION}`))
 .then(loadApplication)
 .catch(error=>{console.error(error);const root=document.getElementById('app');if(root)root.innerHTML='<div class="container"><section class="card finish-box"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section></div>'})
})();
