(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
if(window.__SP_L8T2_CARD_STANDARD_V1)return;
window.__SP_L8T2_CARD_STANDARD_V1=true;

document.body.classList.add('sp-l8t2-card-standard');
document.documentElement.setAttribute('data-sp-card-lesson','8');

if(!document.querySelector('link[href^="/css/sp-card-standard-colors.css"]')){
 const link=document.createElement('link');
 link.rel='stylesheet';
 link.href='/css/sp-card-standard-colors.css?v=20260902-l8t2';
 document.head.appendChild(link);
}

const style=document.createElement('style');
style.id='sp-l8t2-card-standard-style';
style.textContent=`
body.sp-l8t2-card-standard{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}
body.sp-l8t2-card-standard .l8-wrap{width:min(940px,calc(100% - 20px))!important;max-width:940px!important;padding:10px 0 24px!important}
body.sp-l8t2-card-standard .l8-task-head{max-width:820px!important;margin:0 auto 14px!important}
body.sp-l8t2-card-standard .l8-card-stage{max-width:720px!important;margin:0 auto!important;padding:18px!important}
body.sp-l8t2-card-standard .l8-flip-wrap{width:min(100%,620px)!important;max-width:620px!important;margin:0 auto!important;perspective:1200px!important}
body.sp-l8t2-card-standard .l8-flip-card{position:relative!important;width:100%!important;height:440px!important;min-height:440px!important;transform-style:preserve-3d!important;transition:transform .42s ease!important;cursor:pointer!important}
body.sp-l8t2-card-standard .l8-flip-card.flipped{transform:rotateY(180deg)!important}
body.sp-l8t2-card-standard .l8-flip-face{position:absolute!important;inset:0!important;display:flex!important;box-sizing:border-box!important;padding:18px!important;border:2px solid var(--lesson-line)!important;border-radius:22px!important;background:#fff!important;box-shadow:0 8px 22px rgba(23,98,110,.08)!important;backface-visibility:hidden!important;-webkit-backface-visibility:hidden!important;overflow:auto!important}
body.sp-l8t2-card-standard .l8-flip-front{flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:14px!important;text-align:center!important}
body.sp-l8t2-card-standard .l8-flip-back{transform:rotateY(180deg)!important;align-items:center!important;justify-content:center!important}
body.sp-l8t2-card-standard .l8-card-visual{width:260px!important;height:260px!important;max-width:68vw!important;max-height:31vh!important;margin:0 auto!important;padding:0!important;border:0!important;border-radius:18px!important;overflow:hidden!important;background:#fff!important;display:grid!important;place-items:center!important}
body.sp-l8t2-card-standard .l8-card-visual img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;margin:0!important}
body.sp-l8t2-card-standard .l8-card-blank{border:2px dashed var(--lesson-line)!important;color:var(--lesson-muted)!important;font-weight:800!important}
body.sp-l8t2-card-standard .l8-card-translation{width:min(100%,500px)!important;margin:0 auto!important;padding:9px 12px!important;border:2px solid var(--lesson-line)!important;border-radius:14px!important;background:var(--lesson-soft)!important;display:grid!important;gap:3px!important;text-align:center!important}
body.sp-l8t2-card-standard .l8-card-translation span{font-size:12px!important;font-weight:900!important;color:var(--lesson-main-dark)!important}
body.sp-l8t2-card-standard .l8-card-translation strong{font-size:18px!important;line-height:1.25!important;color:var(--lesson-text)!important}
body.sp-l8t2-card-standard .l8-flip-back-grid{width:100%!important;display:grid!important;grid-template-columns:108px minmax(0,1fr)!important;gap:14px!important;align-items:center!important}
body.sp-l8t2-card-standard .l8-back-image{width:108px!important;height:108px!important;min-width:108px!important;min-height:108px!important;border-radius:15px!important;overflow:hidden!important;background:#fff!important}
body.sp-l8t2-card-standard .l8-back-image img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important}
body.sp-l8t2-card-standard .l8-back-info{min-width:0!important;display:grid!important;gap:7px!important;align-content:center!important}
body.sp-l8t2-card-standard .l8-flip-word{font-size:25px!important;line-height:1.15!important;margin:0!important;text-align:center!important;overflow-wrap:anywhere!important;color:var(--lesson-main-dark)!important;font-weight:950!important}
body.sp-l8t2-card-standard .l8-card-detail{padding:8px 10px!important;border:1px solid var(--lesson-line)!important;border-radius:11px!important;background:#fff!important;display:grid!important;grid-template-columns:75px minmax(0,1fr)!important;gap:8px!important;line-height:1.25!important}
body.sp-l8t2-card-standard .l8-card-detail span{font-weight:900!important;color:var(--lesson-main-dark)!important}
body.sp-l8t2-card-standard .l8-card-listen{justify-self:center!important;margin-top:1px!important}
body.sp-l8t2-card-standard .l8-card-actions{max-width:620px!important;margin:12px auto 0!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
body.sp-l8t2-card-standard .l8-card-actions .l8-btn{width:100%!important;min-height:46px!important}
body.sp-l8t2-card-standard .l8-card-write{max-width:620px!important;margin:10px auto 0!important}
body.sp-l8t2-card-standard .l8-card-write .l8-answer-row{display:grid!important;grid-template-columns:1fr auto!important;gap:8px!important}
@media(max-width:700px){
 body.sp-l8t2-card-standard .l8-wrap{width:min(100% - 14px,940px)!important;padding-top:7px!important}
 body.sp-l8t2-card-standard .l8-card-stage{padding:12px!important}
 body.sp-l8t2-card-standard .l8-flip-card{height:470px!important;min-height:470px!important}
 body.sp-l8t2-card-standard .l8-card-visual{width:215px!important;height:215px!important;max-width:64vw!important;max-height:28vh!important}
 body.sp-l8t2-card-standard .l8-flip-back-grid{grid-template-columns:1fr!important;gap:8px!important}
 body.sp-l8t2-card-standard .l8-back-image{width:88px!important;height:88px!important;min-width:88px!important;min-height:88px!important;margin:0 auto!important}
 body.sp-l8t2-card-standard .l8-flip-word{font-size:22px!important}
 body.sp-l8t2-card-standard .l8-card-detail{grid-template-columns:66px minmax(0,1fr)!important;font-size:14px!important;padding:7px 8px!important}
 body.sp-l8t2-card-standard .l8-card-translation strong{font-size:16px!important}
 body.sp-l8t2-card-standard .l8-card-write .l8-answer-row{grid-template-columns:1fr!important}
 body.sp-l8t2-card-standard .l8-card-write .l8-btn{width:100%!important}
}
@media(max-width:420px){
 body.sp-l8t2-card-standard .l8-flip-card{height:450px!important;min-height:450px!important}
 body.sp-l8t2-card-standard .l8-card-visual{width:190px!important;height:190px!important;max-height:25vh!important}
 body.sp-l8t2-card-standard .l8-card-actions{gap:7px!important}
}
`;
document.head.appendChild(style);
})();
