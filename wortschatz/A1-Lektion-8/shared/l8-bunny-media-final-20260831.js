(function(){
'use strict';
if(window.__SP_L8_BUNNY_MEDIA_FINAL_20260831)return;window.__SP_L8_BUNNY_MEDIA_FINAL_20260831=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const filename=value=>{try{return decodeURIComponent(String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'')}catch(e){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}};
function imageUrl(value){const raw=String(value||'').trim();if(!raw)return'';if(/^https:\/\/sprachpilot\.b-cdn\.net\//i.test(raw))return raw;const name=filename(raw);if(!name)return'';return CDN+encodeURIComponent(name.replace(/\.(png|jpe?g|gif|svg|webp)$/i,''))+'.webp'}
function audioUrl(value){const raw=String(value||'').trim();if(!raw)return'';if(/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw))return raw;const name=filename(raw);if(!name)return'';return AUDIO+encodeURIComponent(name.replace(/\.(mp3|wav|ogg|m4a)$/i,''))+'.mp3'}
function walk(value,seen=new Set()){
 if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);
 if(Array.isArray(value)){value.forEach(v=>walk(v,seen));return}
 for(const key of Object.keys(value)){
  const current=value[key];
  if(typeof current==='string'){
   if(/^(image|img|imageUrl|picture)$/i.test(key)&&current)value[key]=imageUrl(current);
   else if(/^(audio|audioFile|wordAudio|audio_file|audioSrc)$/i.test(key)&&current)value[key]=audioUrl(current);
  }else if(current&&typeof current==='object')walk(current,seen);
 }
}
const n=Number(document.body?.dataset?.theme||0);
const gate=n===2?(window.L8_T2_VOCAB_FINAL_READY||window.L8_T2_MEDIA_FIXES_READY||window.L8_CONTENT_READY):n===3?(window.L8_T3_VOCAB_READY||window.L8_CONTENT_READY):window.L8_CONTENT_READY;
window.L8_CONTENT_READY=Promise.resolve(gate).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);if(theme)walk(theme);if(theme&&window.L8_THEME&&Number(window.L8_THEME.number)===n)window.L8_THEME=theme;return window.L8_ALL_THEMES||themes});
})();
