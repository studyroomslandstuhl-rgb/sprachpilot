(function(){
'use strict';
if(window.__SP_L9T2_BUNNY_MEDIA_V1)return;
window.__SP_L9T2_BUNNY_MEDIA_V1=true;
const CDN='https://sprachpilot.b-cdn.net/';
const MEDIA=Object.freeze({
 leise:{image:'leise.webp',audio:'audio/leise.mp3'},
 erklaeren:{image:'erklaeren.webp',audio:'audio/erklaeren.mp3'},
 laut:{image:'laut.webp',audio:'audio/laut.mp3'},
 ausmachen:{image:'ausmachen.webp',audio:'audio/ausmachen.mp3'},
 zuhoeren:{image:'zuhoeren.webp',audio:'audio/zuhoeren.mp3'},
 aufstehen:{image:'aufstehen.webp',audio:'audio/aufstehen.mp3'},
 warten:{image:'warten.webp',audio:'audio/warten.mp3'},
 gebuehr:{image:'gebuehr.webp',audio:'audio/gebuehr.mp3'},
 kasse:{image:'kasse.webp',audio:'audio/kasse.mp3'},
 lachen:{image:'lachen.webp',audio:'audio/lachen.mp3'},
 aufhoeren:{image:'aufhoeren.webp',audio:'audio/aufhoeren.mp3'},
 anmeldung:{image:'anmeldung.webp',audio:'audio/anmeldung.mp3'},
 stock:{image:'stock.webp',audio:'audio/stock.mp3'},
 unterricht:{image:'unterricht.webp',audio:'audio/unterricht.mp3'},
 sprachschule:{image:'sprachschule.webp',audio:'audio/sprachschule.mp3'},
 autovermietung:{image:'autovermietung.webp',audio:'audio/autovermietung.mp3'},
 hingehen:{image:'hingehen.webp',audio:'audio/hingehen.mp3'},
 laden:{image:'laden.webp',audio:'audio/laden.mp3'},
 wartebereich:{image:'wartebereich.webp',audio:'audio/wartebereich.mp3'},
 doch:{image:'',audio:'audio/doch.mp3'},
 bitte:{image:'',audio:'audio/bitte.mp3'},
 mal:{image:'',audio:'audio/mal.mp3'}
});
const aliases={grammar_doch:'doch',grammar_bitte:'bitte',grammar_mal:'mal',leiser:'leise'};
const clean=v=>String(v||'').trim().toLowerCase();
function idOf(v){
 let id=clean(v).replace(/^(pic|aud|mem)-/,'');
 return aliases[id]||id;
}
function url(path){return path?CDN+path:''}
function entry(id){return MEDIA[idOf(id)]||null}
function image(id){return url(entry(id)?.image||'')}
function audio(id){return url(entry(id)?.audio||'')}
function basename(v){try{return decodeURIComponent(String(v||'').split(/[?#]/)[0].split('/').pop()||'').toLowerCase()}catch(e){return''}}
const BY_IMAGE=new Map(),BY_AUDIO=new Map();
for(const [id,m] of Object.entries(MEDIA)){
 if(m.image)BY_IMAGE.set(basename(m.image),id);
 if(m.audio)BY_AUDIO.set(basename(m.audio),id);
}
function patchObject(obj){
 if(!obj||typeof obj!=='object')return;
 let id=idOf(obj.translationKey||obj.id||'');
 let m=MEDIA[id];
 if(!m&&obj.image){const k=BY_IMAGE.get(basename(obj.image));if(k){id=k;m=MEDIA[k]}}
 if(!m&&obj.audio){const k=BY_AUDIO.get(basename(obj.audio));if(k){id=k;m=MEDIA[k]}}
 if(!m)return;
 const isGrammar=obj.type==='grammar'||id==='doch'||id==='bitte'||id==='mal';
 if(m.image&&!isGrammar){obj.image=url(m.image);if('img' in obj)obj.img=obj.image;if('bild' in obj)obj.bild=obj.image}
 if(m.audio){obj.audio=url(m.audio);obj.audioFile=obj.audio}
}
function deepPatch(v,seen=new Set()){
 if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);
 if(Array.isArray(v)){v.forEach(x=>deepPatch(x,seen));return}
 patchObject(v);Object.values(v).forEach(x=>deepPatch(x,seen));
}
function patchAll(){
 const D=window.L9T2;if(!D)return;
 deepPatch(D);
 for(const listName of ['cards','flashcards','visualWords','mixedWords','exam']){
  const list=D[listName];if(Array.isArray(list))list.forEach(patchObject);
 }
 D.assets={...(D.assets||{}),base:CDN,media:MEDIA,image,audio,entry};
 window.L9T2Assets=D.assets;
 window.L9T2BunnyMedia={base:CDN,media:MEDIA,image,audio,entry,patchAll};
}
function patchDom(root=document){
 root.querySelectorAll?.('img').forEach(img=>{
  const b=basename(img.getAttribute('src'));
  const id=BY_IMAGE.get(b);if(id){const src=image(id);if(src&&img.src!==src)img.src=src}
 });
}
patchAll();patchDom();
const observer=new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes||[])if(n.nodeType===1)patchDom(n)});
if(document.documentElement)observer.observe(document.documentElement,{childList:true,subtree:true});
window.__SP_L9T2_BUNNY_OBSERVER=observer;
})();