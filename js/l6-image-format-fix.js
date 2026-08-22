(function(){
'use strict';
if(window.__SP_L6_IMAGE_FORMAT_FIX_V2)return;
const path=String(location.pathname||'');
if(!/\/wortschatz\/A1-Lektion-6\/Thema-(?:2|3|4)\//i.test(path))return;
window.__SP_L6_IMAGE_FORMAT_FIX_V2=true;
function install(){
 if(document.getElementById('sp-l6-image-format-fix-v2'))return;
 const style=document.createElement('style');
 style.id='sp-l6-image-format-fix-v2';
 style.textContent=`
/* L6T2–T4: Bilder immer vollständig, quadratisch und proportional anzeigen. */
.task-img-box{
  width:min(320px,100%)!important;
  height:auto!important;
  min-height:0!important;
  aspect-ratio:1/1!important;
  margin:16px auto!important;
  display:grid!important;
  place-items:center!important;
  overflow:hidden!important;
  background:#fff!important;
}
.task-img-box>img{
  width:100%!important;
  height:100%!important;
  max-width:100%!important;
  max-height:100%!important;
  object-fit:contain!important;
  object-position:center!important;
  display:block!important;
}
.question-card>.visual:not(.small-visual),
.plural-card>.visual:not(.small-visual){
  width:min(320px,100%)!important;
  height:auto!important;
  min-height:0!important;
  aspect-ratio:1/1!important;
  margin:14px auto 18px!important;
  display:grid!important;
  place-items:center!important;
  overflow:hidden!important;
  background:#fff!important;
}
.question-card>.visual:not(.small-visual)>img,
.plural-card>.visual:not(.small-visual)>img{
  width:100%!important;
  height:100%!important;
  max-width:100%!important;
  max-height:100%!important;
  object-fit:contain!important;
  object-position:center!important;
  display:block!important;
}
.flip-front>.task-img-box{
  width:var(--sp-card-image-size,min(300px,calc(100vw - 72px)))!important;
  max-width:100%!important;
  margin:0 auto!important;
}
.flip-back-image .task-img-box{
  width:100%!important;
  height:100%!important;
  max-width:100%!important;
  max-height:100%!important;
  aspect-ratio:1/1!important;
  margin:0!important;
  padding:0!important;
  border:0!important;
  border-radius:inherit!important;
}
.flip-back-image .task-img-box>img{
  width:100%!important;
  height:100%!important;
  object-fit:contain!important;
  object-position:center!important;
}
@media(max-width:640px){
  .task-img-box,
  .question-card>.visual:not(.small-visual),
  .plural-card>.visual:not(.small-visual){width:min(285px,100%)!important}
  .flip-back-image .task-img-box{width:100%!important}
}
`;
 document.head.appendChild(style);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
