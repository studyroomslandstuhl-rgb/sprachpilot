(function(){
'use strict';
const D=window.L9T3,root=document.getElementById('app');
const taskId=String(new URLSearchParams(location.search).get('task')||'');
if(!D||!root||taskId!=='pruefung'||!Array.isArray(D.exam))return;
const TOPIC='wortschatz-a1-lektion-9-thema-3';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{const b=[...(a||[])];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function store(){return preview()?sessionStorage:localStorage}
const key=()=>`SP_L9_${pid()}_T3_pruefung`;
const ids=()=>D.exam.map(x=>x.id);
function practiceIds(t){
 const arr=a=>(a||[]).map(x=>x&&x.id).filter(Boolean);
 switch(t.kind){
  case'cards':case'word-image':case'audio-write':case'meaning-choice':return arr(D.cards);
  case'article-word':case'plural-write':return arr(D.nouns||[]);
  case'conjugation-table':return arr(D.forms);
  case'gap-two':return arr(D.gaps);
  case'build-sentence':return arr(D.builders);
  case'modal-choice':return arr(D.modalItems);
  case'dialog-modal':return D.dialogModal&&D.dialogModal.id?[D.dialogModal.id]:[];
  case'reading-rules':return (D.readings||[]).flatMap(r=>arr(r.questions));
  default:return[];
 }
}
function read(){let s={done:[],wrong:{},order:[],firstSeen:[],firstCorrect:[],answers:{}};try{s={...s,...JSON.parse(store().getItem(key())||'{}')}}catch(e){}const valid=ids();s.done=[...new Set((s.done||[]).filter(x=>valid.includes(x)))];s.wrong=s.wrong||{};s.firstSeen=(s.firstSeen||[]).filter(x=>valid.includes(x));s.firstCorrect=(s.firstCorrect||[]).filter(x=>valid.includes(x));s.answers=s.answers||{};s.order=Array.isArray(s.order)?s.order.filter(x=>valid.includes(x)):[];const missing=valid.filter(x=>!s.order.includes(x));if(missing.length||s.order.length!==valid.length){s.order=[...s.order,...shuffle(missing)];write(s)}return s}
function write(s){try{store().setItem(key(),JSON.stringify(s));window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{lesson:9,theme:3,task:'pruefung',state:s}}))}catch(e){}}
function practiceComplete(){if(preview())return true;return(D.tasks||[]).filter(t=>!t.exam).every(t=>{const valid=practiceIds(t);if(!valid.length)return false;let s={done:[],review:{}};try{s={...s,...JSON.parse(localStorage.getItem(`SP_L9_${pid()}_T3_${t.id}`)||'{}')}}catch(e){}const done=new Set((s.done||[]).filter(x=>valid.includes(x)));const pending=Object.keys(s.review||{}).some(id=>s.review[id]&&valid.includes(id));return done.size===valid.length&&!pending})}
function current(){const s=read(),id=s.order.find(x=>!s.done.includes(x));return(D.exam||[]).find(x=>x.id===id)||null}
function accepted(item,value){return[item.answer,...(item.answers||[])].filter(Boolean).some(a=>norm(a)===norm(value))}
function attempt(item,ok){const s=read();if(!s.firstSeen.includes(item.id)){s.firstSeen.push(item.id);if(ok)s.firstCorrect.push(item.id)}write(s)}
function wrong(item){const s=read();s.wrong[item.id]=(Number(s.wrong[item.id])||0)+1;write(s);return s.wrong[item.id]}
function done(item){const s=read();if(!s.done.includes(item.id))s.done.push(item.id);delete s.wrong[item.id];delete s.answers[item.id];write(s)}
function help(item,n){if(n===1)return'<div class="l8-feedback bad">Noch nicht richtig. Versuche es noch einmal.</div>';if(n===2)return`<div class="l8-feedback warn"><strong>Hinweis:</strong> ${esc(item.hint||'Lies die Aufgabe noch einmal genau.')}</div>`;const solution=item.kind==='pair'?`${item.answer1} / ${item.answer2}`:item.answer;return`<div class="l8-feedback warn"><strong>Lösung:</strong> ${esc(solution)}<br>Gib oder wähle die richtige Antwort anschließend selbst.</div>`}
function runInfo(){const api=window.SPProgress;const run=Number(api?.currentRun?.(TOPIC)||localStorage.getItem(`SP_SCORE_RUN_${TOPIC}`)||1)||1;return{run,max:run===1?100:run===2?200:300}}
function previewNote(){return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Teilnehmerfortschritt und Punkte werden nicht gespeichert.</div>':''}
function head(){const s=read(),n=ids().length,p=Math.round(s.done.length/Math.max(1,n)*100);return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Prüfung</span><h1>Prüfung</h1><p>⭐ Teste dein Wissen.</p></div><div class="l8-progress-row"><span>${s.done.length} von ${n} fertig</span><strong>${p}%</strong></div><div class="l8-progress"><div style="width:${p}%"></div></div></section>`}
function image(src,alt='Bild'){return`<div class="l9t3-exam-main-image"><img src="${esc(src||'')}" alt="${esc(alt)}" loading="eager" decoding="async" onerror="this.parentElement.style.display='none'"></div>`}
function ensureStyle(){if(document.getElementById('l9t3-exam-style'))return;const s=document.createElement('style');s.id='l9t3-exam-style';s.textContent=`
.l9t3-exam-center{text-align:center}.l9t3-exam-main-image{width:min(280px,72vw);height:min(280px,72vw);margin:12px auto 18px;border:2px solid var(--lesson-line);border-radius:20px;background:#fff;overflow:hidden;display:grid;place-items:center}.l9t3-exam-main-image img{width:100%;height:100%;object-fit:contain}.l9t3-exam-options{display:grid;gap:10px;max-width:720px;margin:16px auto}.l9t3-exam-input{max-width:720px;margin:16px auto}.l9t3-exam-input .l8-answer-row{display:flex;gap:8px}.l9t3-exam-input input{flex:1}.l9t3-exam-pair{font-size:20px;font-weight:800;line-height:2;max-width:900px;margin:10px auto}.l9t3-exam-pair input{width:145px;display:inline-block}.l9t3-exam-question-no{font-weight:900;color:var(--lesson-main-dark);margin-bottom:8px}.l9t3-exam-prompt{font-size:21px;font-weight:850;line-height:1.45;margin:10px auto;max-width:760px}@media(max-width:620px){.l9t3-exam-input .l8-answer-row{display:grid}.l9t3-exam-pair input{width:120px}}
`;document.head.appendChild(s)}
function feedback(html){const b=document.getElementById('feedback');if(b)b.innerHTML=html}
function advance(){setTimeout(()=>{renderQuestion();window.SPTaskAutoScroll?.schedule?.(0,'auto')},350)}
function answer(item,value){if(!String(value||'').trim())return;const ok=accepted(item,value);attempt(item,ok);if(ok){done(item);feedback('<div class="l8-feedback good">Richtig!</div>');advance()}else feedback(help(item,wrong(item)))}
function answerPair(item,a,b){if(!String(a||'').trim()||!String(b||'').trim())return;const ok=norm(a)===norm(item.answer1)&&norm(b)===norm(item.answer2);attempt(item,ok);if(ok){done(item);feedback('<div class="l8-feedback good">Richtig!</div>');advance()}else feedback(help(item,wrong(item)))}
function renderQuestion(){const item=current();if(!item)return finish();const s=read(),tries=s.wrong[item.id]||0,no=s.done.length+1;let body='';
 if(item.kind==='image-input')body=`${image(item.image,'Wortbild')}<div class="l9t3-exam-input"><div class="l8-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Wort mit Artikel"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div></div>`;
 else if(item.kind==='choice')body=`<div class="l9t3-exam-options">${shuffle(item.options).map(o=>`<button class="l8-option" data-answer="${esc(o)}" type="button">${esc(o)}</button>`).join('')}</div>`;
 else if(item.kind==='pair')body=`${image(item.image,'Verbbild')}<div class="l9t3-exam-pair">${esc(item.left)} <input class="l8-input" id="answer1" autocomplete="off"> ${esc(item.middle)} <input class="l8-input" id="answer2" autocomplete="off">.</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="checkPair" type="button">Prüfen</button></div>`;
 else body=`<div class="l9t3-exam-input"><div class="l8-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Antwort"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div></div>`;
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${head()}<section class="l8-card l8-exercise"><div class="l9t3-exam-center"><div class="l9t3-exam-question-no">Frage ${no} von ${D.exam.length}</div><div class="l9t3-exam-prompt">${esc(item.prompt)}</div>${body}<div id="feedback">${tries?help(item,tries):''}</div></div></section><footer>© SprachPilot</footer></div>`;
 document.querySelectorAll('[data-answer]').forEach(b=>b.addEventListener('click',()=>answer(item,b.dataset.answer)));
 const input=document.getElementById('answer'),check=document.getElementById('check');if(check)check.onclick=()=>answer(item,input?.value||'');if(input){input.focus();input.onkeydown=e=>{if(e.key==='Enter')answer(item,input.value)}}
 const pair=document.getElementById('checkPair');if(pair)pair.onclick=()=>answerPair(item,document.getElementById('answer1')?.value||'',document.getElementById('answer2')?.value||'');
}
async function finish(){const s=read(),percent=Math.round((s.firstCorrect?.length||0)/Math.max(1,D.exam.length)*100),stars=percent>=100?3:percent>=70?2:percent>=50?1:0,{run,max}=runInfo(),earned=Math.round(max*percent/100);if(!preview()){const bestKey=`SP_L9T3_EXAM_BEST_${pid()}_${run}`,old=Number(localStorage.getItem(bestKey)||0);localStorage.setItem(bestKey,String(Math.max(old,percent)));try{await import('/js/progress.js?v=20260831-central6');await window.SPProgress?.recordExamResult?.({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:3,topicId:TOPIC,title:'A1 Lektion 9 · Thema 3',file:'task.html?task=pruefung',run,score:earned,maxScore:max,percent,scorePercent:percent,stars})}catch(e){console.warn('L9T3 exam result',e)}}root.innerHTML=`<div class="l8-wrap">${previewNote()}${head()}<section class="l8-card l8-finish"><div class="l8-finish-icon">⭐</div><h2>Prüfung abgeschlossen</h2><p><strong>${percent}%</strong> · ${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</p><div class="l8-score-total">${earned} / ${max} Punkte</div><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Übersicht</a></div></section><footer>© SprachPilot</footer></div>`}
ensureStyle();
if(!practiceComplete()){location.href='index.html';return}
renderQuestion();
window.SPTaskAutoScroll?.schedule?.(0,'auto');
})();