(function(){
'use strict';
const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script)});
Promise.resolve(window.L7_THEME_READY)
 .then(()=>load('l7t1-standard-state.js?v=l7t1-full1'))
 .then(()=>load('l7t1-standard-app.js?v=l7t1-full1'))
 .catch(error=>{console.error(error);const root=document.getElementById('app');if(root)root.innerHTML='<div class="container"><section class="card finish-box"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section></div>'})
})();
