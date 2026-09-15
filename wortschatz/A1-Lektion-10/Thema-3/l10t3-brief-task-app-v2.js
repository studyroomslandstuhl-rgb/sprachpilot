import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';
const D=window.L10T3||{},root=document.getElementById('app');
const taskId=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
const task=(D.tasks||[]).find(t=>t.id===taskId)||{title:'Briefteile',text:'Bearbeite die Aufgabe.'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const key='SP_L10T3_BRIEF_'+taskId;
function source(){
 if(taskId==='brief-beschriften'){
  const names=(D.letterLabelParts||[]).map(x=>x.part);
  return (D.letterLabelParts||[]).map(x=>({id:x.id,q:x.marker,part:x.part,article:x.article,options:[x.part,...shuffle(names.filter(n=>n!==x.part)).slice(0,3)]}));
 }
 if(taskId==='briefteile'){
  const rows=(D.letterParts||[]),all=rows.map(x=>x.a);
  return rows.map((x,i)=>({id:'bp'+i,q:x.q,a:x.a,options:[x.a,...shuffle(all.filter(a=>a!==x.a)).slice(0,2)]}));
 }
 return (D.letterQuestions||[]).map(x=>({id:x.id,q:x.q,a:x.a}));
}
const items=source();
let st={done:[],order:shuffle(items.map(x=>x.id)),wrong:{}};
try{const old=JSON.parse(localStorage.getItem(key)||'null');if(old)Object.assign(st,old)}catch{}
st.order=st.order.filter(x=>items.some(i=>i.id===x));for(const i of items)if(!st.order.includes(i.id))st.order.push(i.id);
function save(){localStorage.setItem(key,JSON.stringify(st))}
function cur(){const id=st.order.find(x=>!st.done.includes(x));return items.find(x=>x.id===id)||null}
function shell(body){const h=renderSpHeader({subtitle:'Arzt, Arbeit und Krankmeldung · A1 Lektion 10 · Thema 3'});root.innerHTML=`<div class="l10-theme-page">${h}<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${(D.tasks||[]).findIndex(t=>t.id===taskId)+1}</span><h1>${esc(task.title)}</h1><p>${esc(task.text||'')}</p></div><div class="l8-progress-row"><span>${st.done.length} von ${items.length} fertig</span><strong>${items.length?Math.round(st.done.length/items.length*100):0}%</strong></div></section>${body}</div></div>`;bindSpHeader(root)}
function feedback(type,text){const e=document.getElementById('fb');if(e)e.innerHTML=`<div class="l8-feedback ${type}">${text}</div>`}
function right(item,next){if(!st.done.includes(item.id))st.done.push(item.id);save();feedback('good','Richtig!');setTimeout(next,400)}
function wrong(item,solution){st.wrong[item.id]=(st.wrong[item.id]||0)+1;save();feedback('bad',st.wrong[item.id]>=3?`Lösung: <strong>${esc(solution)}</strong>`:'Noch nicht richtig. Versuch es noch einmal.')}
function finish(){save();shell('<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></section>')}
function draw13(){
 const parts=(D.letterLabelParts||[]);
 if(!parts.length)return finish();
 const names=parts.map(x=>x.part);
 const letter=parts.map(x=>{
   const opts=shuffle([x.part,...shuffle(names.filter(n=>n!==x.part)).slice(0,3)]);
   return `<div class="sp-letter-gap" data-id="${esc(x.id)}" style="margin:0 0 16px;padding:12px;border:1px solid #e0e8ec;border-radius:12px"><div class="sp-source" style="margin-bottom:10px">${esc(x.marker)}</div><div class="l8-options">${opts.map(o=>`<button type="button" class="l8-option" data-part="${esc(x.id)}" data-value="${esc(o)}">${esc(o)}</button>`).join('')}</div><div class="l8-answer-row" style="margin-top:10px"><input class="l8-input" data-article="${esc(x.id)}" placeholder="Artikel"></div></div>`;
 }).join('');
 shell(`<section class="l8-card l8-exercise"><div class="l8-note"><strong>Brief:</strong> Wähle bei jeder Lücke den richtigen Briefteil und schreibe den Artikel.</div><div class="sp-letter-full" style="max-width:760px;margin:0 auto">${letter}</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="check">Brief prüfen</button></div><div id="fb"></div></section>`);
 const chosen={};
 document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{chosen[b.dataset.part]=b.dataset.value;document.querySelectorAll(`[data-part="${b.dataset.part}"]`).forEach(x=>x.classList.toggle('selected',x===b))});
 document.getElementById('check').onclick=()=>{
   let all=true;const missing=[];
   parts.forEach(x=>{const article=document.querySelector(`[data-article="${x.id}"]`);const okPart=norm(chosen[x.id]||'')===norm(x.part);const okArticle=norm(article?.value||'')===norm(x.article);const box=document.querySelector(`[data-id="${x.id}"]`);box?.classList.toggle('sp-answer-ok',okPart&&okArticle);box?.classList.toggle('sp-answer-bad',!(okPart&&okArticle));if(!(okPart&&okArticle)){all=false;missing.push(x.article+' '+x.part)}});
   if(all){st.done=parts.map(x=>x.id);save();feedback('good','Der ganze Brief ist richtig!');setTimeout(finish,450)}else{const n=(st.wrong.all||0)+1;st.wrong.all=n;save();feedback('bad',n>=3?`Lösungen: <strong>${esc(missing.join(' · '))}</strong>`:'Noch nicht alles richtig. Prüfe die markierten Lücken.')}
 };
}
function draw14(){const item=cur();if(!item)return finish();const opts=shuffle(item.options);shell(`<section class="l8-card l8-exercise"><div class="sp-source">${esc(item.q)}</div><div class="l8-options">${opts.map((o,i)=>`<button type="button" class="l8-option" data-a="${esc(o)}">${String.fromCharCode(65+i)} · ${esc(o)}</button>`).join('')}</div><div id="fb"></div></section>`);document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(norm(b.dataset.a)===norm(item.a))right(item,draw14);else wrong(item,item.a)})}
function draw15(){const item=cur();if(!item)return finish();shell(`<section class="l8-card l8-exercise"><div class="sp-source">${esc(item.q)}</div><div class="l8-answer-row"><input class="l8-input" id="ans" placeholder="Antwort mit Artikel schreiben"><button class="l8-btn primary" id="check">Prüfen</button></div><div id="fb"></div></section>`);document.getElementById('check').onclick=()=>{const v=document.getElementById('ans').value;if(norm(v)===norm(item.a))right(item,draw15);else wrong(item,item.a)}}
if(taskId==='brief-beschriften')draw13();else if(taskId==='briefteile')draw14();else draw15();