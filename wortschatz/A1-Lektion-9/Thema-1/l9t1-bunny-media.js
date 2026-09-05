(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';

function clean(value){
 return String(value||'').trim().replace(/\\/g,'/').replace(/^\/+/, '').replace(/^(?:\.\/)+/,'').replace(/^(?:\.\.\/)+/,'');
}
function encodePath(value){return clean(value).split('/').filter(Boolean).map(encodeURIComponent).join('/')}
function image(value,id=''){
 const original=String(value||'').trim();
 if(/^https?:\/\//i.test(original))return original;
 let file=clean(value)||clean(id);if(!file)return'';
 file=file.replace(/^(?:bilder|images|img)\//i,'');
 if(!/\.[a-z0-9]+$/i.test(file))file+='.webp';
 return CDN+encodePath(file);
}
function audio(value,id=''){
 const original=String(value||'').trim();
 if(/^https?:\/\//i.test(original))return original;
 let file=clean(value)||clean(id);if(!file)return'';
 file=file.replace(/^audio\//i,'');
 if(!/\.[a-z0-9]+$/i.test(file))file+='.mp3';
 return AUDIO+encodePath(file);
}
function cardById(id){return (D.cards||[]).find(x=>String(x.id)===String(id))||null}
function bindCardMedia(item){
 if(!item)return item;
 item.image=image(item.image,item.id);
 item.audio=audio(item.audio,item.id);
 item.mediaSource='bunny';
 return item;
}
function bindOptionalMedia(item){
 if(!item||typeof item!=='object')return item;
 if(item.image!=null||item.img!=null){
  const value=item.image!=null?item.image:item.img;
  item.image=image(value,item.id);
  if('img'in item)item.img=item.image;
 }
 if(item.audio!=null)item.audio=audio(item.audio,item.id);
 return item;
}

/* Karteikarten + Wortschatzübersicht: immer Bild UND Audio direkt von Bunny. */
(D.cards||[]).forEach(bindCardMedia);

/* Aufgabe 2: Wort-Audio von Bunny; alle Antwortbilder werden ebenfalls fest auf Bunny aufgelöst. */
(D.listen||[]).forEach(item=>{
 item.audio=audio(item.audio,item.id);
 item.image=image(item.image,item.id);
 item.optionImages={};
 (item.options||[]).forEach(option=>{
  const id=typeof option==='string'?option:(option?.id||option?.value||'');
  if(!id)return;
  const card=cardById(id);
  item.optionImages[id]=image(card?.image,id);
 });
 item.mediaSource='bunny';
});

/* Aufgabe 3: Definitionen haben die zugehörigen Bunny-Medien am Datensatz verfügbar. */
(D.defs||[]).forEach(item=>{
 const card=cardById(item.id);
 item.image=image(item.image||card?.image,item.id);
 item.audio=audio(item.audio||card?.audio,item.id);
 item.mediaSource='bunny';
});

/* Aufgabe 4: Bildaufgabe + Aussprachewort. */
(D.speak||[]).forEach(item=>{
 const card=cardById(item.id);
 item.image=image(item.image||card?.image,item.id);
 item.audio=audio(item.audio||card?.audio,item.id);
 item.mediaSource='bunny';
});

/* Aufgabe 6: Verbbild immer Bunny; Verb-Audio ist ebenfalls verfügbar. */
(D.gaps||[]).forEach(item=>{
 const verbId=String(item.verbId||item.verb||item.image||item.id||'').replace(/\.webp$/i,'');
 item.image=image(item.image,verbId);
 item.audio=audio(item.audio,verbId);
 item.mediaSource='bunny';
});

/* Aufgabe 8: fünf Anweisungs-Audios + alle Prozessbilder. */
(D.sequences||[]).forEach(group=>{
 group.audio=audio(group.audio,`l9t1_anleitung_${group.id}`);
 group.mediaSource='bunny';
 (group.steps||[]).forEach(step=>{
  step.image=image(step.image,step.id);
  step.mediaSource='bunny';
 });
});

/* Aufgabe 9: alle Schrittbilder aus Bunny. */
(D.writing||[]).forEach(group=>(group.steps||[]).forEach(step=>{
 step.image=image(step.image,step.id);
 step.mediaSource='bunny';
}));

/* Falls spätere/weitere Items bereits image/audio-Felder enthalten, niemals relative Quellen stehen lassen. */
['forms','modals','cloze','exam'].forEach(key=>(D[key]||[]).forEach(bindOptionalMedia));

/* Kleine Laufzeitprüfung: alle von L9T1 verwendeten Medien müssen Bunny oder explizite externe HTTPS-URLs sein. */
function audit(){
 const refs=[];
 const walk=(node,path='L9T1')=>{
  if(!node||typeof node!=='object')return;
  if(Array.isArray(node)){node.forEach((x,i)=>walk(x,`${path}[${i}]`));return}
  for(const [k,v] of Object.entries(node)){
   if((k==='image'||k==='img'||k==='audio')&&typeof v==='string'&&v){refs.push({path:`${path}.${k}`,url:v,bunny:v.startsWith(CDN)})}
   else if(k!=='optionImages'&&v&&typeof v==='object')walk(v,`${path}.${k}`);
  }
 };
 walk(D);
 return {total:refs.length,bunny:refs.filter(x=>x.bunny).length,external:refs.filter(x=>!x.bunny&&/^https:\/\//i.test(x.url)).length,invalid:refs.filter(x=>!/^https:\/\//i.test(x.url))};
}
window.L9T1Bunny={CDN,AUDIO,image,audio,cardById,audit};
})();