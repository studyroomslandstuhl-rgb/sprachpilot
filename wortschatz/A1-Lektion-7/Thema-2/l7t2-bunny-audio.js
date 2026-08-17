(function(){
'use strict';
if(window.__SP_L7T2_BUNNY_AUDIO_V1)return;
window.__SP_L7T2_BUNNY_AUDIO_V1=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
let active=null,token=0;
function slug(value,sep='_'){return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,sep).replace(new RegExp('^'+sep+'+|'+sep+'+$','g'),'')}
function uniq(a){return[...new Set(a.filter(Boolean))]}
function candidates(value){const raw=String(value||'').trim(),file=raw.split(/[?#]/)[0].split('/').pop()||'',stem=file.replace(/\.mp3$/i,'');const out=[];if(/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw))out.push(raw);if(/\.mp3$/i.test(file))out.push(BASE+encodeURIComponent(file));uniq([stem,slug(stem,'_'),slug(stem,'-'),slug(raw,'_'),slug(raw,'-')]).forEach(x=>out.push(BASE+encodeURIComponent(x)+'.mp3'));return uniq(out)}
function stop(){token++;try{active?.pause()}catch(e){};if(active){try{active.src=''}catch(e){}active=null}}
function play(value,done,fail){stop();const mine=token,urls=candidates(value);let i=0;function next(){if(mine!==token)return;if(i>=urls.length){fail?.();return}const audio=new Audio(urls[i++]);active=audio;let failed=false;const bad=()=>{if(failed||mine!==token)return;failed=true;try{audio.pause();audio.src=''}catch(e){};if(active===audio)active=null;next()};audio.addEventListener('error',bad,{once:true});audio.addEventListener('ended',()=>{if(mine!==token)return;if(active===audio)active=null;done?.()},{once:true});const p=audio.play();if(p&&typeof p.catch==='function')p.catch(bad)}next()}
function install(){if(!window.L7S)return false;window.L7S.say=(text,fail)=>play(text,null,fail);window.L7T2BunnyAudio={play,stop,candidates,base:BASE};return true}
window.L7T2BunnyAudio={play,stop,candidates,base:BASE,install};window.addEventListener('beforeunload',stop);
})();
