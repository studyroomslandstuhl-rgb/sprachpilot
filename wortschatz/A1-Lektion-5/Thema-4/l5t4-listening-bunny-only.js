(function(){
'use strict';
if(window.__SP_L5T4_BUNNY_LISTENING_ONLY_V1)return;window.__SP_L5T4_BUNNY_LISTENING_ONLY_V1=true;
const CDN='https://sprachpilot.b-cdn.net/audio/';
function bunnySource(value){const raw=String(value||'').split(/[?#]/)[0],name=raw.split('/').filter(Boolean).pop();return name?CDN+encodeURIComponent(name):''}
function patch(audio){if(!audio||audio.dataset.spL5t4BunnyOnly==='1')return;const source=audio.querySelector('source[src]'),raw=source?.getAttribute('src')||audio.getAttribute('src')||'';if(!raw)return;if(/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw)){audio.dataset.spL5t4BunnyOnly='1';return}const src=bunnySource(raw);if(!src)return;audio.dataset.spL5t4BunnyOnly='1';audio.pause?.();audio.removeAttribute('src');source?.remove();audio.src=src;audio.preload='metadata';audio.load?.()}
function run(root=document){root.querySelectorAll?.('audio').forEach(patch)}
run();const observer=new MutationObserver(()=>run());observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',()=>run());
})();