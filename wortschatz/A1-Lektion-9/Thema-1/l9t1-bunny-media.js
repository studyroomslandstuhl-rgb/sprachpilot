(function(){
'use strict';
const D=window.L9T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
function clean(value){return String(value||'').trim().replace(/^\/+/, '')}
function image(value,id=''){
 const raw=clean(value);if(/^https?:\/\//i.test(raw))return raw;
 let file=raw||String(id||'').trim();if(!file)return'';
 if(!/\.[a-z0-9]+$/i.test(file))file+='.webp';
 return CDN+file;
}
function audio(value,id=''){
 const raw=clean(value);if(/^https?:\/\//i.test(raw))return raw;
 let file=raw||String(id||'').trim();if(!file)return'';
 file=file.replace(/^audio\//i,'');if(!/\.[a-z0-9]+$/i.test(file))file+='.mp3';
 return AUDIO+file;
}
(D.cards||[]).forEach(x=>{x.image=image(x.image,x.id);x.audio=audio(x.audio,x.id)});
(D.listen||[]).forEach(x=>{x.audio=audio(x.audio,x.id)});
(D.speak||[]).forEach(x=>{x.image=image(x.image,x.id)});
(D.gaps||[]).forEach(x=>{x.image=image(x.image,x.id)});
(D.sequences||[]).forEach(group=>{group.audio=audio(group.audio,`l9t1_anleitung_${group.id}`);(group.steps||[]).forEach(step=>{step.image=image(step.image,step.id)})});
(D.writing||[]).forEach(group=>(group.steps||[]).forEach(step=>{step.image=image(step.image,step.id)}));
window.L9T1Bunny={CDN,AUDIO,image,audio};
})();