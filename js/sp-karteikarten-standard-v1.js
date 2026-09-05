(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
if(window.__SP_KARTEIKARTEN_STANDARD_V1)return;window.__SP_KARTEIKARTEN_STANDARD_V1=true;

/*
 * SprachPilot Karteikarten-Standard V1
 * Verbindliche visuelle Referenz: A1 Lektion 8 · Thema 1 · ?task=karteikarten
 * Variable Teile: ausschließlich Farbe (CSS-Variablen / data-sp-card-lesson) und Inhalt.
 * Layout, Maße, Buttons, Responsive-Verhalten und DOM-Normalisierung bleiben identisch.
 */
document.body.classList.add('sp-karteikarten-standard','sp-l8t1-card-standard');

const pathMatch=location.pathname.match(/A1-Lektion-(\d+)/i);
if(pathMatch&&!document.documentElement.hasAttribute('data-sp-card-lesson')){
 document.documentElement.setAttribute('data-sp-card-lesson',pathMatch[1]);
}

const CSS=[
 '/wortschatz/A1-Lektion-6/Thema-4/style.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-revision2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-user.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-compact-v2.css?v=l6t4-bunny-audio9',
 '/wortschatz/A1-Lektion-6/Thema-4/l6t4-card-image-standard.css?v=20260730-card300',
 '/css/sp-card-standard-colors.css?v=20260826-l8'
];
CSS.forEach(href=>{if(document.querySelector(`link[href^="${href.split('?')[0]}"]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link)});

const style=document.createElement('style');style.id='sp-karteikarten-standard-v1-style';style.textContent=`
body.sp-karteikarten-standard{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}
body.sp-karteikarten-standard .l8-wrap{width:min(980px,calc(100% - 18px))!important;padding-top:10px!important}
body.sp-karteikarten-standard .l8-task-head{margin-bottom:16px!important}
body.sp-karteikarten-standard .l8-card-stage{padding:22px!important}
body.sp-karteikarten-standard .l8-flip-wrap.flip-wrap{max-width:690px!important;margin:0 auto!important}
body.sp-karteikarten-standard .l8-flip-card.flip-card{width:100%!important;min-height:390px!important}
body.sp-karteikarten-standard .l8-flip-front.flip-front{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:16px!important;text-align:center!important}
body.sp-karteikarten-standard .l8-card-visual.visual{width:300px!important;height:300px!important;max-width:78vw!important;max-height:42vh!important;margin:0 auto!important;padding:0!important;border-radius:22px!important;overflow:hidden!important;background:#fff!important}
body.sp-karteikarten-standard .l8-card-visual.visual img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;margin:0!important}
body.sp-karteikarten-standard .l8-card-translation.card-translation-box{width:min(100%,520px)!important;margin:0 auto!important;padding:10px 12px!important;border:2px solid var(--lesson-line)!important;border-radius:14px!important;background:var(--lesson-soft)!important;display:grid!important;gap:3px!important;text-align:center!important}
body.sp-karteikarten-standard .l8-card-translation.card-translation-box span{font-size:12px!important;font-weight:900!important;text-transform:none!important;color:var(--lesson-main-dark)!important}
body.sp-karteikarten-standard .l8-card-translation.card-translation-box strong{font-size:19px!important;line-height:1.25!important;color:var(--lesson-text)!important}
body.sp-karteikarten-standard .l8-flip-back.flip-back{justify-content:center!important;overflow:hidden!important}
body.sp-karteikarten-standard .l8-flip-back-grid.flip-back-grid{width:100%!important;display:grid!important;grid-template-columns:120px minmax(0,1fr)!important;gap:12px!important;align-items:center!important}
body.sp-karteikarten-standard .l8-back-image.flip-back-image{width:120px!important;height:120px!important;min-width:120px!important;min-height:120px!important;border-radius:16px!important;overflow:hidden!important;background:#fff!important}
body.sp-karteikarten-standard .l8-back-image.flip-back-image>.visual{width:120px!important;height:120px!important;min-width:120px!important;min-height:120px!important;max-width:120px!important;max-height:120px!important;margin:0!important;padding:0!important;border-radius:16px!important;overflow:hidden!important;background:#fff!important}
body.sp-karteikarten-standard .l8-back-image.flip-back-image>.visual img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;margin:0!important}
body.sp-karteikarten-standard .l8-back-info.flip-back-info{min-width:0!important;display:grid!important;gap:7px!important;justify-items:stretch!important}
body.sp-karteikarten-standard .l8-flip-word.flip-word{font-size:25px!important;line-height:1.15!important;margin:0!important;text-align:center!important;overflow-wrap:anywhere!important;color:var(--lesson-main-dark)!important;font-weight:950!important}
body.sp-karteikarten-standard .l8-back-info .back-translation{width:100%!important;margin:0!important;padding:8px 9px!important}
body.sp-karteikarten-standard .card-details{max-width:none!important;display:grid!important;gap:7px!important;margin:0!important}
body.sp-karteikarten-standard .card-details>.l8-card-detail{padding:8px 9px!important;border:1px solid var(--lesson-line)!important;border-radius:12px!important;background:#fff!important;display:grid!important;grid-template-columns:82px minmax(0,1fr)!important;gap:8px!important}
body.sp-karteikarten-standard .card-details>.l8-card-detail span{font-weight:900!important;color:var(--lesson-main-dark)!important}
body.sp-karteikarten-standard .l8-card-listen.card-listen-btn{justify-self:center!important;margin:0!important}
body.sp-karteikarten-standard .l8-card-actions.actions.card-actions{max-width:690px!important;margin:14px auto!important;display:flex!important;gap:10px!important;justify-content:center!important}
body.sp-karteikarten-standard .l8-card-actions.actions.card-actions .btn{flex:1 1 0!important;min-height:48px!important}
body.sp-karteikarten-standard .l8-card-write.l7-answer-box{max-width:690px!important;margin:14px auto!important;text-align:left!important}
body.sp-karteikarten-standard .l8-card-write.l7-answer-box .l8-answer-row{display:flex!important;gap:8px!important}
body.sp-karteikarten-standard .l8-card-write.l7-answer-box input{width:100%!important;padding:13px!important;border:2px solid var(--lesson-line)!important;border-radius:14px!important;font-size:17px!important}
@media(max-width:700px){body.sp-karteikarten-standard .l8-flip-back-grid.flip-back-grid{grid-template-columns:1fr!important;gap:8px!important}body.sp-karteikarten-standard .l8-back-image.flip-back-image{width:100px!important;height:100px!important;min-width:100px!important;min-height:100px!important;margin:0 auto!important}body.sp-karteikarten-standard .l8-back-image.flip-back-image>.visual{width:100px!important;height:100px!important;min-width:100px!important;min-height:100px!important;max-width:100px!important;max-height:100px!important}body.sp-karteikarten-standard .l8-flip-word.flip-word{font-size:23px!important}body.sp-karteikarten-standard .l8-card-actions.actions.card-actions{display:grid!important;grid-template-columns:1fr 1fr!important}body.sp-karteikarten-standard .l8-card-write.l7-answer-box .l8-answer-row{display:grid!important}}
`;
document.head.appendChild(style);

function add(node,...classes){if(node)node.classList.add(...classes)}
function normalizeCard(){
 const card=document.querySelector('.l8-flip-card');if(!card||card.dataset.spCardStandard==='1')return false;card.dataset.spCardStandard='1';card.dataset.spL7Match='1';
 const wrap=card.closest('.l8-flip-wrap');add(wrap,'flip-wrap');add(card,'flip-card');
 const front=card.querySelector('.l8-flip-front');add(front,'flip-face','flip-front');const frontVisual=front?.querySelector('.l8-card-visual');add(frontVisual,'visual');const frontTr=front?.querySelector('.l8-card-translation');add(frontTr,'card-translation-box');
 const back=card.querySelector('.l8-flip-back');add(back,'flip-face','flip-back');const grid=back?.querySelector('.l8-flip-back-grid');add(grid,'flip-back-grid');const imageBox=back?.querySelector('.l8-back-image');add(imageBox,'flip-back-image');if(imageBox&&!imageBox.querySelector(':scope > .visual')){const img=imageBox.querySelector('img');if(img){const visual=document.createElement('div');visual.className='visual small-visual pure-visual';img.replaceWith(visual);visual.appendChild(img)}}
 const info=back?.querySelector('.l8-back-info');add(info,'flip-back-info');add(info?.querySelector('.l8-flip-word'),'flip-word');const tr=info?.querySelector('.l8-card-translation');add(tr,'card-translation-box','back-translation');
 if(info){const details=[...info.querySelectorAll(':scope > .l8-card-detail')];const detailWrap=document.createElement('div');detailWrap.className='card-details';details.forEach(node=>{const label=String(node.querySelector('span')?.textContent||'').trim();if(/^info$/i.test(label))node.remove();else detailWrap.appendChild(node)});const listen=info.querySelector('#cardListen,.l8-card-listen');if(detailWrap.children.length)info.insertBefore(detailWrap,listen||null);if(listen){add(listen,'btn','secondary','card-listen-btn');listen.textContent='🔊 Anhören'}}
 const actions=document.querySelector('.l8-card-actions');add(actions,'actions','card-actions');const mic=document.getElementById('cardMic');if(mic){add(mic,'btn');mic.textContent='🎤 Sprechen'}const write=document.getElementById('cardWrite');if(write){add(write,'btn','secondary');write.textContent='✍️ Schreiben'}const answer=document.getElementById('cardWriteBox');add(answer,'l7-answer-box');
 return true;
}
const root=document.getElementById('app');if(root)new MutationObserver(()=>normalizeCard()).observe(root,{childList:true,subtree:true});[0,40,120,350,900].forEach(ms=>setTimeout(normalizeCard,ms));

window.SPCardTaskStandard={version:1,reference:'A1-Lektion-8/Thema-1?task=karteikarten',normalizeCard};
})();