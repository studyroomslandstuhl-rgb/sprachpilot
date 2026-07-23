(function(){
'use strict';
if(window.__PERFEKT_V2_BOOTSTRAP__)return;
window.__PERFEKT_V2_BOOTSTRAP__=true;

function showError(error){
 console.error('Perfekt v2 konnte nicht geladen werden',error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Perfekt konnte nicht geladen werden</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>';
}

function decodeBase64(value){
 let data=String(value||'').replace(/\s+/g,'').replace(/-/g,'+').replace(/_/g,'/').replace(/=+$/,'');
 const remainder=data.length%4;
 if(remainder===1)throw new Error('Der Perfekt-Datenblock ist beschädigt.');
 data+='='.repeat((4-remainder)%4);
 const raw=atob(data);
 const bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return bytes;
}

async function boot(){
 if(typeof DecompressionStream!=='function')throw new Error('Dieser Browser unterstützt die benötigte GZIP-Dekomprimierung nicht.');
 const response=await fetch('./app-v2-loader.js?v=perfekt-groups3-source',{cache:'no-store'});
 if(!response.ok)throw new Error('Perfekt-Quelldaten konnten nicht geladen werden: HTTP '+response.status);
 const wrapper=await response.text();
 const match=wrapper.match(/const\s+DATA\s*=\s*'([^']+)'/);
 if(!match)throw new Error('Perfekt-Datenblock wurde nicht gefunden.');
 const stream=new Blob([decodeBase64(match[1])]).stream().pipeThrough(new DecompressionStream('gzip'));
 let source=await new Response(stream).text();
 if(!source.includes("'schreiben':'geschrieben'")){
  source=source.replace('const SPECIAL={',"const SPECIAL={'schreiben':'geschrieben',");
 }
 const script=document.createElement('script');
 script.type='module';
 script.textContent=source+'\n//# sourceURL=/perfekt/app-v2-runtime.js';
 const loaded=new Promise((resolve,reject)=>{
  script.addEventListener('load',resolve,{once:true});
  script.addEventListener('error',()=>reject(new Error('Das Perfekt-Modul konnte nicht ausgeführt werden.')),{once:true});
 });
 document.head.appendChild(script);
 await loaded;
}

boot().catch(showError);
})();
