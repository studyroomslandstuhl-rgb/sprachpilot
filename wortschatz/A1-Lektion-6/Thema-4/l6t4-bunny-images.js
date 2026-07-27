(function(){
'use strict';
const BASE='https://sprachpilot.b-cdn.net/';

function encodePath(value){
 return String(value||'').split('/').filter(Boolean).map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
}
function url(file){
 const value=String(file||'').trim();
 if(!value)return'';
 if(/^https?:\/\//i.test(value))return value;
 return BASE+encodePath(value.replace(/^\/+/,''));
}
function clean(value){
 return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…!?,;:„“"']/g,'').replace(/\s+/g,' ');
}

const IMAGE_FILES={
 'gitarre spielen':'gitarre_spielen.webp',
 'freunde treffen':'freunde_treffen.webp',
 'fahrrad fahren':'fahrrad_fahren.webp',
 'im internet surfen':'im_internet_surfen.webp',
 'der hunger':'hunger.webp',
 'hunger':'hunger.webp',
 'der durst':'durst.webp',
 'durst':'durst.webp',
 'das hobby':'hobby.webp',
 'hobby':'hobby.webp',
 'der beruf':'beruf.webp',
 'beruf':'beruf.webp',
 'das alter':'alter.webp',
 'alter':'alter.webp',
 'die freizeit':'freizeit.webp',
 'freizeit':'freizeit.webp',
 'der würfel':'wuerfel.webp',
 'würfel':'wuerfel.webp',
 'der spass':'spass.webp',
 'spass':'spass.webp',
 'es macht spass':'spass.webp',
 'immer':'immer.webp',
 'meistens':'meistens.webp',
 'oft':'oft.webp',
 'manchmal':'manchmal.webp',
 'selten':'selten.webp',
 'nie':'nie.webp',
 'wichtig':'wichtig.webp',
 'nur':'nur.webp',
 'guck mal':'guck_mal.webp',
 'vielleicht':'vielleicht.webp',
 'moment mal':'moment_mal.webp',
 'toll':'toll.webp',
 'es gibt':'es_gibt.webp',
 'ich weiss es nicht':'ich_weiss_es_nicht.webp',
 'noch':'noch.webp',
 'kein problem':'kein_problem.webp',
 'na klar':'na_klar.webp',
 'ich glaube':'ich_glaube.webp',
 'aktivität':'finden-entdecken.webp',
 'suchen oder entdecken':'finden-entdecken.webp',
 'meinung':'finden-meinung.webp',
 'eine meinung sagen':'finden-meinung.webp'
};

function mappedImage(value){
 const file=IMAGE_FILES[clean(value)];
 return file?url(file):'';
}
function applyMappings(){
 const data=window.L6T4_DATA;
 if(!data)return;
 (data.vocabulary||[]).forEach(item=>{
  const image=mappedImage(item.word)||mappedImage(item.id);
  if(image)item.image=image;
 });
 (data.imageItems||[]).forEach(item=>{
  const image=mappedImage(item.word);
  if(image)item.image=image;
 });
 if(data.imageFile&&typeof data.imageFile==='object'){
  Object.keys(data.imageFile).forEach(word=>{
   const image=mappedImage(word);
   if(image)data.imageFile[word]=image;
  });
 }
 (data.tasks||[]).forEach(task=>{
  (task.items||[]).forEach(item=>{
   if(item&&item.image){
    const image=mappedImage(item.word)||mappedImage(item.answer)||mappedImage(item.prompt);
    if(image)item.image=image;
   }
   if(Array.isArray(item?.options))item.options.forEach(option=>{
    if(!option||typeof option!=='object')return;
    const image=mappedImage(option.label)||mappedImage(option.word);
    if(image)option.image=image;
   });
  });
 });
}
function vocabularyItem(word){
 const target=clean(word);
 const item=(window.L6T4_DATA?.vocabulary||[]).find(entry=>clean(entry.word)===target||clean(entry.id)===target)||null;
 const image=mappedImage(word);
 if(item){if(image)item.image=image;return item}
 return image?{word,image,meaning:''}:null;
}
function originalFile(img){
 const explicit=img.dataset.bunnyFile;
 if(explicit)return explicit;
 const source=String(img.getAttribute('src')||'').trim();
 if(!source||source.startsWith('data:')||source.startsWith('blob:')||source.includes('/assets/logo/'))return'';
 if(source.startsWith(BASE))return'';
 try{
  if(/^https?:\/\//i.test(source))return new URL(source).pathname.replace(/^\/+/, '');
 }catch(e){}
 return source.replace(/^\.\//,'').replace(/^\/+/, '');
}
function enforce(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 root.querySelectorAll('img').forEach(img=>{
  const file=originalFile(img);
  if(!file)return;
  img.dataset.bunnyFile=file;
  img.src=url(file);
 });
}
function observe(target){
 if(!target)return;
 enforce(target);
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
  if(node.nodeType!==1)return;
  if(node.matches?.('img'))enforce(node.parentElement||target);
  else enforce(node);
 }))).observe(target,{childList:true,subtree:true});
}
function install(){
 applyMappings();
 observe(document.getElementById('area'));
 observe(document.getElementById('wordList'));
}
applyMappings();
window.L6T4Bunny={base:BASE,url,vocabularyItem,enforce,applyMappings,mappedImage};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();