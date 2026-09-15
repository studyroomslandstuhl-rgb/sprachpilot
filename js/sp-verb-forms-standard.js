(function(){
'use strict';
if(window.__SP_VERB_FORMS_STANDARD_V1)return;
window.__SP_VERB_FORMS_STANDARD_V1=true;

const lessonMatch=location.pathname.match(/A1-Lektion-(\d+)/i);
const lesson=Number(lessonMatch?.[1]||0);
if(lesson&&lesson<8)return;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const perfectTail=/\s*(?:–|—|-)\s*((?:hat|ist)\s+.+)$/i;
const PERFECT={
 studieren:'hat studiert',arbeiten:'hat gearbeitet',machen:'hat gemacht',sein:'ist gewesen',haben:'hat gehabt',werden:'ist geworden',
 anmelden:'hat angemeldet',ausfüllen:'hat ausgefüllt',unterschreiben:'hat unterschrieben',mitbringen:'hat mitgebracht',abgeben:'hat abgegeben',bezahlen:'hat bezahlt',zeigen:'hat gezeigt',verdienen:'hat verdient',stellen:'hat gestellt',
 fahren:'ist gefahren',gehen:'ist gegangen',kommen:'ist gekommen',suchen:'hat gesucht',finden:'hat gefunden',abbiegen:'ist abgebogen',fliegen:'ist geflogen',bringen:'hat gebracht',nehmen:'hat genommen',bleiben:'ist geblieben',
 verwenden:'hat verwendet',tun:'hat getan',schicken:'hat geschickt',empfangen:'hat empfangen',kühlen:'hat gekühlt',krankschreiben:'hat krankgeschrieben',sprechen:'hat gesprochen',trinken:'hat getrunken',schlafen:'hat geschlafen',
 schreiben:'hat geschrieben',lesen:'hat gelesen',hören:'hat gehört',lernen:'hat gelernt',fragen:'hat gefragt',antworten:'hat geantwortet',helfen:'hat geholfen',geben:'hat gegeben',bekommen:'hat bekommen',brauchen:'hat gebraucht',
 wohnen:'hat gewohnt',leben:'hat gelebt',kaufen:'hat gekauft',verkaufen:'hat verkauft',bestellen:'hat bestellt',essen:'hat gegessen',sehen:'hat gesehen',treffen:'hat getroffen',spielen:'hat gespielt',
 besuchen:'hat besucht',anrufen:'hat angerufen',ankommen:'ist angekommen',aufstehen:'ist aufgestanden',einkaufen:'hat eingekauft',ausruhen:'hat sich ausgeruht',verletzen:'hat verletzt',passieren:'ist passiert',liegen:'hat gelegen'
};
function cleanPresent(value){const raw=String(value||'').trim();return raw.replace(perfectTail,'').trim()}
function explicitPerfect(item){
 for(const key of ['perfectForm','perfektForm','perfekt','perfect','partizipPerfekt']){const v=String(item?.[key]||'').trim();if(v)return v}
 for(const key of ['term','full','word','detail','meaning','info']){const raw=String(item?.[key]||'').trim();if(!raw)continue;const m=raw.match(perfectTail)||raw.match(/Perfekt\s*:\s*((?:hat|ist)\s+[^.;]+)/i);if(m)return String(m[1]||'').trim()}
 return'';
}
function term(item){return cleanPresent(item?.presentForm||item?.praesens||item?.present||item?.term||item?.full||item?.word||'')}
function isVerb(item){const type=norm(item?.type||item?.wordType||item?.category||'');return type==='verb'||type==='verben'||type.includes(' verb')||!!explicitPerfect(item)}
function perfect(item,present){return explicitPerfect(item)||PERFECT[norm(present).replace(/^sich /,'')]||''}
function forms(item){const p=term(item);if(!p||!isVerb(item))return null;return{present:p,perfect:perfect(item,p)}}
function scanObject(root,target,seen=new Set(),depth=0){
 if(root==null||depth>6||typeof root!=='object'||seen.has(root))return null;seen.add(root);
 if(!Array.isArray(root)){
  const f=forms(root);if(f&&norm(f.present)===target)return{item:root,...f};
 }
 for(const v of Object.values(root)){const hit=scanObject(v,target,seen,depth+1);if(hit)return hit}
 return null;
}
function findItem(word){
 const target=norm(cleanPresent(word));if(!target)return null;
 const preferred=['L8_THEME','L8_ALL_THEMES','L9T1','L9T2','L9T3','L9T4','L10T1','L10T2','L10T3','L10T4','L11T1','L11T2','L11T3','L11T4'];
 for(const key of preferred){const hit=scanObject(window[key],target);if(hit)return hit}
 for(const key of Object.keys(window)){if(!/^L(?:8|9|10|11)/.test(key))continue;const hit=scanObject(window[key],target);if(hit)return hit}
 return null;
}
function detail(label,value){return `<div class="l8-card-detail sp-verb-form"><span>${label}</span><strong>${esc(value||'—')}</strong></div>`}
function augmentCard(){
 document.querySelectorAll('.l8-flip-back,.flip-back').forEach(back=>{
  const wordNode=back.querySelector('.l8-flip-word,.flip-word');if(!wordNode)return;
  const hit=findItem(wordNode.textContent);if(!hit)return;
  const info=back.querySelector('.l8-back-info,.flip-back-info')||back;
  if(info.querySelector('.sp-verb-forms'))return;
  const box=document.createElement('div');box.className='sp-verb-forms card-details';box.innerHTML=detail('Präsens',hit.present)+detail('Perfekt',hit.perfect||'—');
  const listen=info.querySelector('#cardListen,#cardListenBtn,.l8-card-listen,.card-listen-btn');info.insertBefore(box,listen||null);
 });
}
function overviewIsVerb(row){
 const group=row.closest('.l8-overview-group');const title=norm(group?.querySelector('.l8-overview-group-head h2')?.textContent||'');if(title.startsWith('verb'))return true;
 const word=row.querySelector('h3,.l8-vocab-word,.full')?.textContent||'';return !!findItem(word);
}
function augmentOverview(){
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  if(row.querySelector('.sp-verb-overview-forms'))return;
  const word=row.querySelector('h3')?.textContent||'';const hit=findItem(word);if(!hit||!overviewIsVerb(row))return;
  const content=row.querySelector('.l8-overview-content')||row;const box=document.createElement('div');box.className='sp-verb-overview-forms';box.innerHTML=`<div class="l8-overview-meta"><b>Präsens:</b> ${esc(hit.present)}</div><div class="l8-overview-meta"><b>Perfekt:</b> ${esc(hit.perfect||'—')}</div>`;content.appendChild(box);
 });
}
function run(){augmentCard();augmentOverview()}
const style=document.createElement('style');style.textContent='.sp-verb-forms{display:grid;gap:7px}.sp-verb-overview-forms{margin-top:7px}.sp-verb-form{display:grid;grid-template-columns:82px minmax(0,1fr);gap:8px}@media(max-width:480px){.sp-verb-form{grid-template-columns:72px minmax(0,1fr)}}';document.head.appendChild(style);
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
[0,80,250,700,1500].forEach(ms=>setTimeout(run,ms));
window.SPVerbFormsStandard={forms,findItem,run,perfectMap:PERFECT};
})();
