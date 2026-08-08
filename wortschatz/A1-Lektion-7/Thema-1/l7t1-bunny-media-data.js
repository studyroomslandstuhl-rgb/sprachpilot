(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_MEDIA_DATA_1)return;
window.__SP_L7T1_BUNNY_MEDIA_DATA_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const BUNNY='https://sprachpilot.b-cdn.net/';
const audit={nonBunnyImages:[],nonBunnyAudios:[],normalizedImages:[],normalizedAudios:[]};
function cleanPath(value){return String(value||'').split(/[?#]/)[0].replace(/^\/+/, '')}
function basename(value){return cleanPath(value).split('/').filter(Boolean).pop()||''}
function mediaValue(value,type){
 if(typeof value!=='string'||!value.trim())return value;
 const raw=value.trim();
 const isHttp=/^https?:\/\//i.test(raw);
 const isBunny=raw.toLowerCase().startsWith(BUNNY);
 const isRoot=raw.startsWith('/');
 if(!isHttp&&!isRoot)return raw;
 let file='';
 if(isBunny){
  const path=cleanPath(raw.slice(BUNNY.length));
  file=basename(path);
 }else{
  file=basename(raw);
  (type==='image'?audit.nonBunnyImages:audit.nonBunnyAudios).push(raw);
 }
 if(!file)return raw;
 (type==='image'?audit.normalizedImages:audit.normalizedAudios).push({from:raw,to:file});
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
