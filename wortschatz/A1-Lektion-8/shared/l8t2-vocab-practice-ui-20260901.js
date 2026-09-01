(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_PRACTICE_UI_20260901)return;
window.__SP_L8T2_VOCAB_PRACTICE_UI_20260901=true;

const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const originalTaskEmoji=base.taskEmoji;
const S=()=>window.L8S;
const T=()=>window.L8_THEME;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();

function currentTask(){const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))}
function taskNumber(task){const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''}
function previewNote(){return S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function taskHead(task,state){
 const pct=Math.round((state.done?.length||0)/Math.max(1,task.items.length)*100),emoji=originalTaskEmoji?originalTaskEmoji(task):(task.emoji||'✅');
 return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>${esc(emoji)} ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`;
}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function imageSrc(raw){const v=String(raw||'').trim();if(!v)return'';if(/^https?:\/\//i.test(v))return v;return `https://sprachpilot.b-cdn.net/${v.replace(/^\/+/, '')}`}
function hashSeed(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function stableShuffle(values,seedText){const a=[...(values||[])];let seed=hashSeed(seedText)||1;for(let i=a.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function finish(task,root){root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast die Aufgabe zu 100 % abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}

function renderListening(task,root){
 let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);
 if(idx==null||idx<0)return finish(task,root);
 state=S().load(T().number,task.id,task.items.length);
 const item=task.items[idx],options=stableShuffle(item.options||[],`${T().number}|${task.id}|${idx}|${S().pid?.()||''}`);
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead(task,state)}<section class="l8-card l8-exercise l8-vocab-listen"><div class="l8-vocab-listen-top"><button class="l8-btn l8-audio" id="vocabListen" type="button">🔊 Wort anhören</button></div><div class="l8-image-choice-grid">${options.map((o,i)=>`<button class="l8-image-choice" type="button" data-term="${esc(o.term)}" aria-label="Bild ${i+1}"><img src="${esc(imageSrc(o.image))}" alt="" loading="lazy"></button>`).join('')}</div><div id="feedback"></div></section></div>`;
 document.getElementById('vocabListen').onclick=()=>S().say(item.term,item.audioFile||item.audio);
 root.querySelectorAll('.l8-image-choice').forEach(btn=>btn.onclick=()=>{
  const answer=btn.dataset.term||'';
  if(S().equal(answer,item.answer)){
   btn.classList.add('correct');
   const r=S().right(T().number,task.id,task.items.length,idx,answer);
   feedback('good',r.needsReview?'Richtig. Dieses Wort kommt am Ende noch einmal.':'Richtig!');
   setTimeout(()=>renderListening(task,root),550);
  }else{
   btn.classList.add('wrong');
   const r=S().wrong(T().number,task.id,task.items.length,idx,answer);
   feedback(r.tries===1?'bad':'warn',r.tries===1?'Noch nicht richtig. Hör noch einmal.':'Hör das Wort noch einmal und achte auf das Bild.');
  }
 });
}

function languageCode(){
 const p=S()?.profile?.()||{},raw=norm(p.motherLanguageCode||p.muttersprache||p.motherLanguage||'en');
 const map=[['uk',['uk','ua','ukrain']],['ru',['ru','russ']],['tr',['tr','turk']],['ar',['ar','arab']],['ja',['ja','japan']],['ro',['ro','roman','ruman']],['pl',['pl','pol']],['ku',['ku','kurd']],['fa',['fa','pers','farsi']],['fr',['fr','franz']],['es',['es','span']],['it',['it','ital']],['en',['en','english','englisch']]];
 for(const [code,keys] of map)if(keys.some(k=>raw===k||raw.includes(k)))return code;
 return 'en';
}
function meaning(pair){
 const code=languageCode(),bags=[pair?.translations,pair?.tr,pair?.translation,pair?.i18n];
 for(const bag of bags){
  if(typeof bag==='string'&&bag.trim())return bag.trim();
  if(bag&&typeof bag==='object'){
   if(typeof bag[code]==='string'&&bag[code].trim())return bag[code].trim();
   if(typeof bag.en==='string'&&bag.en.trim())return bag.en.trim();
   const first=Object.values(bag).find(v=>typeof v==='string'&&v.trim());if(first)return first.trim();
  }
 }
 return '';
}
function savedMatches(state){
 try{const raw=state?.answers?.[0];if(!raw)return new Set();const a=JSON.parse(raw);return new Set(Array.isArray(a)?a.map(String):[])}catch(e){return new Set()}
}
function saveMatches(task,state,matched){state.answers=state.answers&&typeof state.answers==='object'?state.answers:{};state.answers[0]=JSON.stringify([...matched]);S().save(T().number,task.id,state)}
function renderMemory(task,root){
 let state=S().load(T().number,task.id,task.items.length),idx=S().nextIndex(T().number,task.id,task.items.length);
 if(idx==null||idx<0)return finish(task,root);
 state=S().load(T().number,task.id,task.items.length);
 const item=task.items[idx],pairs=(item.pairs||[]).map((p,i)=>({...p,_id:String(i)})).filter(p=>meaning(p));
 const matched=savedMatches(state);
 const cards=[];
 pairs.forEach(p=>{cards.push({pair:p._id,side:'word',text:p.term});cards.push({pair:p._id,side:'meaning',text:meaning(p)})});
 const board=stableShuffle(cards,`${T().number}|${task.id}|memory|${S().pid?.()||''}`);
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${taskHead(task,state)}<section class="l8-card l8-exercise l8-memory-exercise"><div class="l8-memory-status"><strong>${matched.size} von ${pairs.length} Paaren gefunden</strong></div><div class="l8-memory-grid">${board.map((c,i)=>`<button class="l8-memory-card ${matched.has(c.pair)?'matched revealed':''}" type="button" data-pair="${esc(c.pair)}" data-side="${esc(c.side)}" data-card="${i}" ${matched.has(c.pair)?'disabled':''}><span class="l8-memory-front">?</span><span class="l8-memory-back"><small>${c.side==='word'?'Wort':'Bedeutung'}</small><strong>${esc(c.text)}</strong></span></button>`).join('')}</div><div id="feedback"></div></section></div>`;
 let open=[],locked=false;
 const status=()=>{const el=root.querySelector('.l8-memory-status strong');if(el)el.textContent=`${matched.size} von ${pairs.length} Paaren gefunden`};
 root.querySelectorAll('.l8-memory-card:not(.matched)').forEach(card=>card.onclick=()=>{
  if(locked||card.classList.contains('revealed')||card.classList.contains('matched'))return;
  card.classList.add('revealed');open.push(card);
  if(open.length<2)return;
  locked=true;const [a,b]=open,same=a.dataset.pair===b.dataset.pair&&a.dataset.side!==b.dataset.side;
  if(same){
   matched.add(a.dataset.pair);a.classList.add('matched');b.classList.add('matched');a.disabled=true;b.disabled=true;open=[];locked=false;saveMatches(task,state,matched);status();feedback('good','Paar gefunden!');
   if(matched.size>=pairs.length){setTimeout(()=>{S().right(T().number,task.id,task.items.length,idx,'memory-complete');finish(task,root)},650)}
  }else{
   feedback('warn','Das passt noch nicht zusammen.');
   setTimeout(()=>{a.classList.remove('revealed');b.classList.remove('revealed');open=[];locked=false},800);
  }
 });
}

function patchedTaskPage(){
 const task=currentTask(),root=document.getElementById('app');
 if(!task||!root)return originalTaskPage();
 if(task.kind==='vocab-listen-image')return renderListening(task,root);
 if(task.kind==='vocab-memory')return renderMemory(task,root);
 return originalTaskPage();
}

window.L8UI={...base,taskPage:patchedTaskPage};
const style=document.createElement('style');style.id='sp-l8t2-vocab-practice-ui';style.textContent=`
.l8-vocab-listen{max-width:900px;margin-inline:auto}.l8-vocab-listen-top{display:flex;justify-content:center;margin-bottom:18px}.l8-image-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.l8-image-choice{min-height:190px;border:2px solid var(--lesson-line,var(--l8-line));border-radius:18px;background:#fff;padding:10px;cursor:pointer;transition:.16s transform,.16s border-color}.l8-image-choice img{width:100%;height:180px;object-fit:contain;border-radius:12px}.l8-image-choice:active{transform:scale(.98)}.l8-image-choice.correct{outline:4px solid rgba(39,155,91,.25)}.l8-image-choice.wrong{opacity:.58}.l8-memory-exercise{max-width:1000px;margin-inline:auto}.l8-memory-status{text-align:center;margin-bottom:14px;color:var(--lesson-main-dark,var(--l8-dark))}.l8-memory-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.l8-memory-card{position:relative;min-height:112px;border:2px solid var(--lesson-line,var(--l8-line));border-radius:15px;background:var(--lesson-main,var(--l8-main));color:#fff;padding:10px;cursor:pointer;overflow:hidden}.l8-memory-front,.l8-memory-back{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:9px;box-sizing:border-box}.l8-memory-front{font-size:30px;font-weight:900}.l8-memory-back{opacity:0;background:#fff;color:var(--lesson-text,#20384a);flex-direction:column;gap:5px;text-align:center}.l8-memory-back small{font-size:10px;text-transform:uppercase;font-weight:900;color:var(--lesson-main-dark,var(--l8-dark))}.l8-memory-back strong{font-size:14px;line-height:1.25;overflow-wrap:anywhere}.l8-memory-card.revealed .l8-memory-front{opacity:0}.l8-memory-card.revealed .l8-memory-back{opacity:1}.l8-memory-card.matched{border-color:var(--lesson-main-dark,var(--l8-dark));box-shadow:0 0 0 3px rgba(64,140,188,.12)}@media(max-width:620px){.l8-image-choice-grid{gap:9px}.l8-image-choice{min-height:145px;padding:7px}.l8-image-choice img{height:135px}.l8-memory-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.l8-memory-card{min-height:96px;padding:6px}.l8-memory-back strong{font-size:12px}}
`;
document.head.appendChild(style);
})();