(function(){
'use strict';
if(window.__PERFEKT_V2_BOOTSTRAP__)return;
window.__PERFEKT_V2_BOOTSTRAP__=true;

function showError(error){
 console.error('Perfekt v2 konnte nicht geladen werden',error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Perfekt konnte nicht geladen werden</h2><p>Bitte lade die Seite neu.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>';
}

function cleanBase64(value){
 return String(value||'').replace(/\s+/g,'').replace(/-/g,'+').replace(/_/g,'/').replace(/=+$/,'');
}

function base64Bytes(value){
 let data=cleanBase64(value);
 const remainder=data.length%4;
 if(remainder===1)throw new Error('Ungültige Base64-Länge.');
 data+='='.repeat((4-remainder)%4);
 const raw=atob(data);
 const bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return bytes;
}

async function gunzip(value){
 const stream=new Blob([base64Bytes(value)]).stream().pipeThrough(new DecompressionStream('gzip'));
 const source=await new Response(stream).text();
 if(!source.includes("from'/js/auth.js")||!source.includes('const TASKS=')){
  throw new Error('Der entpackte Perfekt-Quelltext ist unvollständig.');
 }
 return source;
}

async function recoverSource(value){
 const data=cleanBase64(value);
 const candidates=[data];
 // Im aktuell veröffentlichten Datenblock fehlt ein einzelnes Base64-Zeichen.
 // Die benachbarten Positionen werden ebenfalls geprüft, damit kleine Build-Abweichungen nicht erneut die Seite sperren.
 for(const index of [1015,1014,1016]){
  if(index<=data.length)candidates.push(data.slice(0,index)+'n'+data.slice(index));
 }
 let lastError=null;
 for(const candidate of [...new Set(candidates)]){
  try{return await gunzip(candidate)}catch(error){lastError=error}
 }
 throw new Error('Der Perfekt-Datenblock konnte nicht wiederhergestellt werden.',{cause:lastError});
}

function installImageOverrides(source){
 const pattern=/const\s+imageUrl\s*=\s*v\s*=>[^;]+;/;
 if(!pattern.test(source)){
  console.warn('Perfekt-Bildfunktion wurde nicht gefunden; DOM-Bildkorrektur bleibt aktiv.');
  return source;
 }
 return source.replace(pattern,"const imageUrl=v=>(typeof window.SP_VERB_IMAGE_OVERRIDE==='function'&&window.SP_VERB_IMAGE_OVERRIDE(v))||'https://sprachpilot.b-cdn.net/'+encodeURIComponent(slug(v)+'.webp');");
}

async function boot(){
 if(typeof DecompressionStream!=='function')throw new Error('Dieser Browser unterstützt die benötigte GZIP-Dekomprimierung nicht.');
 const response=await fetch('./app-v2-loader.js?v=perfekt-groups3-source',{cache:'no-store'});
 if(!response.ok)throw new Error('Perfekt-Quelldaten konnten nicht geladen werden: HTTP '+response.status);
 const wrapper=await response.text();
 const match=wrapper.match(/const\s+DATA\s*=\s*'([^']+)'/);
 if(!match)throw new Error('Perfekt-Datenblock wurde nicht gefunden.');
 let source=await recoverSource(match[1]);
 if(!source.includes("'schreiben':'geschrieben'")){
  source=source.replace('const SPECIAL={',"const SPECIAL={'schreiben':'geschrieben',");
 }
 source=installImageOverrides(source);
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