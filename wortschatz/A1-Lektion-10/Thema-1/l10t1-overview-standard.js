import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T1||{tasks:[]};
const root=document.getElementById('app');
const TOPIC='wortschatz-a1-lektion-10-thema-1';
const practice=(D.tasks||[]).filter(t=>!t.exam);
const exam=(D.tasks||[]).find(t=>t.exam);

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function preview(){try{return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase())||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}}
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function localPct(t){
 if(preview())return 0;
 try{
  const s=JSON.parse(localStorage.getItem(`SP_L10_T1_${t.id}`)||'null');
  if(!s)return 0;
  const active=run();
  if(Number(s._run||1)!==active)return 0;
  const total=Math.max(0,Number(s.total||34));
  const done=Array.isArray(s.done)?s.done.length:Math.max(0,Number(s.done||0));
  if(t.exam&&Number.isFinite(Number(s.percent)))return Math.max(0,Math.min(100,Number(s.percent)||0));
  return total?Math.min(100,Math.round(done/total*100)):0;
 }catch(e){return 0}
}
function taskFile(t){return`task.html?task=${t.id}`}
function taskEmoji(t){return t.icon||'✅'}
function teacherNote(){return preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Fortschritte und Punkte der Teilnehmer werden hier nicht verändert.</div>':''}
function scorePanel(){const r=run(),points=Number(localStorage.getItem('SP_POINTS_TOTAL')||0)||0;if(preview())return'<div class="l8-score-panel"><div class="l8-score-label">Punkte</div><div class="l8-score-total">Vorschau</div><div class="l8-small">Keine Teilnehmerpunkte</div></div>';return`<div class="l8-score-panel"><div class="l8-score-label">${r===1?'Versuch 1 von 3':`Wiederholung ${r} von 3`}</div><div class="l8-score-total">${points} Punkte</div><div class="l8-small">Fortschritt wird automatisch gespeichert.</div></div>`}

const progress=Object.fromEntries((D.tasks||[]).map(t=>[t.id,localPct(t)]));
if(!preview()){
 try{
  const mod=await import('/js/progress.js?v=20260831-central6');
  const cloud=await mod.loadCurrentStudentProgress();
  const topic=cloud?.wortschatz?.[TOPIC];
  if(topic){
   const active=run();
   for(const t of practice){
    const rec=topic.tasks?.[t.id]||topic.tasks?.[taskFile(t)];
    if(!rec)continue;
    const recRun=Number(rec.run||topic.currentRun||topic.current?.run||active)||active;
    if(recRun===active)progress[t.id]=Math.max(progress[t.id]||0,Math.max(0,Math.min(100,Number(rec.percent||0))));
   }
   if(exam){const er=topic.exam||{};const erRun=Number(er.run||topic.currentRun||active)||active;if(erRun===active)progress[exam.id]=Math.max(progress[exam.id]||0,Math.max(0,Math.min(100,Number(er.percent||er.bestPercent||0))))}
  }
 }catch(e){console.warn('L10T1 overview progress',e)}
}

const completed=practice.filter(t=>(progress[t.id]||0)>=100).length;
const avg=Math.round(practice.reduce((sum,t)=>sum+(progress[t.id]||0),0)/Math.max(1,practice.length));
const examOpen=preview()||completed===practice.length;

const header=renderSpHeader({subtitle:'Körper und Körperteile · A1 Lektion 10 · Thema 1',color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'}});
const vocabTop=`<a href="uebersicht.html" class="l8-card l10-vocab-standard"><div class="emoji">📚</div><div class="l10-vocab-standard__copy"><strong>Wortschatzübersicht</strong><span>Alle 34 Wörter mit Bild, Artikel, Plural, Übersetzung und Hörfunktion.</span></div><div class="l10-vocab-standard__action">Öffnen →</div></a>`;
root.innerHTML=`<div class="l10-theme-page">${header}<div class="l8-wrap">${teacherNote()}${vocabTop}<section class="l8-card l8-progress-card"><div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${completed} / ${practice.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><p class="l8-small l8-theme-subtitle">Körper und Körperteile</p><div class="l8-tags"><span class="l8-tag">Körper</span><span class="l8-tag">Körperteile</span><span class="l8-tag">Artikel</span><span class="l8-tag">Plural</span></div></div><div class="l8-score-slot">${scorePanel()}</div></section><section class="l8-grid">${(D.tasks||[]).map((t,i)=>{const p=Math.round(progress[t.id]||0),locked=t.exam&&!examOpen;if(locked)return`<div class="l8-card l8-task-card locked" aria-disabled="true"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(taskEmoji(t))}</div><p>${esc(t.text||'')}</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>`;return`<a class="l8-card l8-task-card ${p>=100?'done':''}" href="${taskFile(t)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(taskEmoji(t))}</div><p>${esc(t.text||'')}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${t.exam&&preview()?'Prüfung ansehen':p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</section><footer>© SprachPilot</footer></div></div>`;
bindSpHeader(root);
