(function(){
'use strict';
if(window.__SP_L7T1_NEW_IMAGES_1)return;
window.__SP_L7T1_NEW_IMAGES_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const CDN='https://sprachpilot.b-cdn.net/';
const MAP=Object.freeze({
 'auf jeden fall':'auf_jeden_fall.webp',
 'auf keinen fall':'auf_keinen_fall.webp',
 'nach hause':'nach_hause.webp',
 'los sein':'los_sein.webp',
 'französisch':'franzoesisch.webp',
 'franzoesisch':'franzoesisch.webp',
 'mathematik':'mathematik.webp',
 'pünktlich':'puenktlich.webp',
 'puenktlich':'puenktlich.webp',
 'jonglieren':'jonglieren.webp',
 'endlich':'endlich.webp',
 'fertig':'fertig.webp',
 'prima':'prima.webp',
 'der test':'test.webp',
 'test':'test.webp'
});
const KEYS=Object.keys(MAP).sort((a,b)=>b.length-a.length);
const FILES=new Set(Object.values(MAP));

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFC')
  .replace(/[„“”"'`´.,!?;:()\[\]{}]/g,' ')
  .replace(/\s+/g,' ').trim();
}
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function fileFor(value){
 const text=' '+norm(value)+' ';
 for(const key of KEYS){
  const needle=' '+key+' ';
  if(text.includes(needle))return MAP[key];
 }
 return '';
}
function semantic(value){
 return [value.full,value.word,value.term,value.answer,value.prompt,value.context,value.meaning,value.label,value.title,value.text,value.solution]
  .filter(Boolean).join(' ');
}
function patchTheme(theme){
 const seen=new Set();
 function walk(value){
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach(walk);return}
  const current=basename(value.image||value.img||'');
  const file=fileFor(semantic(value))||fileFor(current.replace(/\.webp$/i,'').replace(/_/g,' '));
  if(file){
   if('image' in value||!('img' in value))value.image=file;
   if('img' in value)value.img=file;
  }
  Object.values(value).forEach(walk);
 }
 walk(theme);
 return theme;
}
function cardText(img){
 const scope=img.closest('.overview-card,.word-card,.vocab-card,.l7-overview-card,.l7-learning,.l7-question-card,.flip-card,.card,.l7-card,article');
 return [img.getAttribute('alt')||'',scope?.innerText||scope?.textContent||''].join(' ');
}
function patchImage(img){
 if(!(img instanceof HTMLImageElement)||!img.closest('#app'))return;
 if(img.closest('.l7-brand,.brand,.topbar,.l7-topbar'))return;
 const wanted=fileFor(cardText(img));
 if(!wanted)return;
 const current=basename(img.currentSrc||img.src||'');
 if(current===wanted)return;
 const previous=img.src;
 img.dataset.l7t1NewImage=wanted;
 img.onerror=function(){
  if(this.dataset.l7t1NewImage===wanted&&previous&&this.src!==previous){
   delete this.dataset.l7t1NewImage;
   this.onerror=null;
   this.src=previous;
  }
 };
 img.src=CDN+encodeURIComponent(wanted);
}
function patchAll(root=document){root.querySelectorAll?.('#app img').forEach(patchImage)}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const patched=patchTheme(theme);
 queueMicrotask(()=>patchAll(document));
 return patched;
});

window.L7T1NewImages={map:{...MAP},files:[...FILES],patchAll,fileFor};

const observer=new MutationObserver(mutations=>{
 for(const mutation of mutations){
  mutation.addedNodes.forEach(node=>{
   if(node.nodeType!==1)return;
   if(node.matches?.('img'))patchImage(node);
   patchAll(node);
  });
 }
});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{patchAll(document);setTimeout(()=>patchAll(document),250);setTimeout(()=>patchAll(document),1000)});
patchAll(document);
})();
