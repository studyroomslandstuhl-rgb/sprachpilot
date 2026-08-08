(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_MEDIA_DATA_3)return;
window.__SP_L7T1_BUNNY_MEDIA_DATA_3=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const BUNNY='https://sprachpilot.b-cdn.net/';
const audit={nonBunnyImages:[],nonBunnyAudios:[],normalizedImages:[],normalizedAudios:[],convertedImages:[]};
function cleanPath(value){return String(value||'').split(/[?#]/)[0].replace(/^\/+/, '')}
function basename(value){return cleanPath(value).split('/').filter(Boolean).pop()||''}
function asWebp(file){
 const raw=String(file||'').trim();
 if(!raw)return raw;
 if(/\.webp$/i.test(raw))return raw;
 const converted=/\.(png|jpe?g|gif|svg)$/i.test(raw)?raw.replace(/\.(png|jpe?g|gif|svg)$/i,'.webp'):/\.[a-z0-9]{2,5}$/i.test(raw)?raw:raw+'.webp';
 if(converted!==raw)audit.convertedImages.push({from:raw,to:converted});
 return converted;
}
function mediaValue(value,type){
 if(typeof value!=='string'||!value.trim())return value;
 const raw=value.trim();
 const isHttp=/^https?:\/\//i.test(raw);
 const isBunny=raw.toLowerCase().startsWith(BUNNY);
 const isRoot=raw.startsWith('/');
 const hasPath=raw.includes('/');
 let file=raw;
 if(isHttp||isRoot||hasPath){
  if(isBunny)file=basename(raw.slice(BUNNY.length));
  else{
   file=basename(raw);
   if(isHttp||isRoot)(type==='image'?audit.nonBunnyImages:audit.nonBunnyAudios).push(raw);
  }
 }
 if(type==='image')file=asWebp(file);
 if(!file)return raw;
 if(file!==raw)(type==='image'?audit.normalizedImages:audit.normalizedAudios).push({from:raw,to:file});
 return file;
}
function normalizeObject(value,seen=new Set()){
 if(!value||typeof value!=='object'||seen.has(value))return;
 seen.add(value);
 if(Array.isArray(value)){value.forEach(item=>normalizeObject(item,seen));return}
 for(const [key,current] of Object.entries(value)){
  if(/^(image|img)$/i.test(key)&&typeof current==='string')value[key]=mediaValue(current,'image');
  else if(/^(audio|audioFile|sound)$/i.test(key)&&typeof current==='string')value[key]=mediaValue(current,'audio');
  else if(current&&typeof current==='object')normalizeObject(current,seen);
 }
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 normalizeObject(theme);
 window.L7T1MediaAudit=audit;
 return theme;
});
})();
