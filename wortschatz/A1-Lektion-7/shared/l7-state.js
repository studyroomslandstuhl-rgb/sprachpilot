(function(){
'use strict';
const T=window.L7_THEME;
const CDN='https://sprachpilot.b-cdn.net/';
let rec=null;
let cachedPid='';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function preview(){
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 if(role==='teacher')return true;
 for(const s of[sessionStorage,localStorage]){
  const r=s.getItem('SP_TEACHER_PREVIEW');
  if(r==='1')return true;
  try{if(JSON.parse(r||'null')?.teacherPreview===true)return true}catch(e){}
 }
 return false
}
function clean(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
function legacyPid(){
 const p=profile();
 return[p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'
}
function pid(){
 const store=preview()?sessionStorage:localStorage;
 const cacheKey=preview()?'SP_L7_PREVIEW_PID':'SP_L7_STABLE_PID';
 const p=profile();
 const resolved=clean(p.uid||p.userId||p.id||p.email||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'));
 if(cachedPid&&cachedPid!=='student')return cachedPid;
 const existing=clean(store.getItem(cacheKey));
 if(existing&&existing!=='student'){cachedPid=existing;return cachedPid}
 cachedPid=resolved||existing||'student';
 if(cachedPid!=='student')try{store.setItem(cacheKey,cachedPid)}catch(e){}
 return cachedPid
}
function st(){return preview()?sessionStorage:localStorage}
function k(theme,task){return`${preview()?'SP_L7_PREVIEW':'SP_L7'}_${pid()}_T${theme}_${task}`}
function empty(total){return{total,done:[],queue:shuffle([...Array(total).keys()]),current:null,tries:0,hadWrong:false,firstSeen:[],firstCorrect:0,answers:{}}}
function valid(x,total){return!!(x&&x.total===total&&Array.isArray(x.done)&&Array.isArray(x.queue))}
function normalizeState(x,total){return{...empty(total),...x,total,done:Array.isArray(x?.done)?x.done:[],queue:Array.isArray(x?.queue)?x.queue:[],firstSeen:Array.isArray(x?.firstSeen)?x.firstSeen:[],firstCorrect:Number(x?.firstCorrect||0),answers:x?.answers&&typeof x.answers==='object'?x.answers:{}}}
function scoreState(x){return(x.done?.length||0)*100000+(x.current!=null?1000:0)+(x.firstSeen?.length||0)*10+(x.queue?.length?1:0)}
function candidateKeys(theme,task){
 const storage=st(),suffix=`_T${theme}_${task}`,keys=[k(theme,task)];
 const old=`${preview()?'SP_L7_PREVIEW':'SP_L7'}_${legacyPid()}${suffix}`;
 if(!keys.includes(old))keys.push(old);
 const student=`${preview()?'SP_L7_PREVIEW':'SP_L7'}_student${suffix}`;
 if(!keys.includes(student))keys.push(student);
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(String(key||'').startsWith(preview()?'SP_L7_PREVIEW_':'SP_L7_')&&String(key||'').endsWith(suffix)&&!keys.includes(key))keys.push(key)
 }
 return keys
}
function load(theme,task,total){
 const storage=st(),canonical=k(theme,task);
 let best=null,bestKey='';
 for(const key of candidateKeys(theme,task)){
  try{
   const x=JSON.parse(storage.getItem(key)||'null');
   if(valid(x,total)&&(!best||scoreState(x)>scoreState(best))){best=x;bestKey=key}
  }catch(e){}
 }
 if(best){
  const out=normalizeState(best,total);
  if(bestKey!==canonical){try{storage.setItem(canonical,JSON.stringify(out))}catch(e){}}
  return out
 }
 return empty(total)
}
function task(id){return T.tasks.find(x=>x.id===id)}
function topic(theme){return`wortschatz-a1-lektion-7-thema-${theme}`}
function run(theme){return Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+topic(theme))||1)||1)}
function sync(theme,id,s){
 if(preview())return;
 try{
  const t=task(id),total=s.total,done=s.done.length,pct=total?Math.round(done/total*100):0;
  if(!t)return;
  if(t.exam){
   if(pct<100)return;
   const first=total?Math.round(Number(s.firstCorrect||0)/total*100):0;
   const mark=`SP_L7_EXAM_SYNCED_T${theme}_R${run(theme)}_${first}`;
   if(localStorage.getItem(mark)==='1')return;
   const p={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:7,theme,topicId:topic(theme),title:`A1 Lektion 7 · Thema ${theme}`,percent:first,scorePercent:first,score:Number(s.firstCorrect)||0,maxScore:total,stars:first>=100?3:first>=70?2:first>=50?1:0};
   if(window.SPProgress?.recordExamResult)Promise.resolve(SPProgress.recordExamResult(p)).then(()=>localStorage.setItem(mark,'1'));
   else(window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordExamResult',payload:p});
   return
  }
  const p={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:7,theme,topicId:topic(theme),title:`A1 Lektion 7 · Thema ${theme}`,file:`task.html?task=${id}`,taskTitle:t.title,percent:pct,done,total,completed:pct>=100};
  if(window.SPProgress?.recordTaskProgress)SPProgress.recordTaskProgress(p);
  else(window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordTaskProgress',payload:p})
 }catch(e){console.warn('L7 sync',e)}
}
function save(theme,id,s,doSync=true){
 const normalized=normalizeState(s,s.total);
 try{st().setItem(k(theme,id),JSON.stringify(normalized))}catch(e){console.warn('L7 storage',e)}
 if(doSync)sync(theme,id,normalized)
}
function index(theme,id,total){
 const s=load(theme,id,total);
 if(s.current==null){
  if(!s.queue.length&&s.done.length<total)s.queue=shuffle([...Array(total).keys()].filter(i=>!s.done.includes(i)));
  s.current=s.queue.shift();s.tries=0;s.hadWrong=false;save(theme,id,s)
 }
 return s.current
}
function attempt(theme,id,total,i,ok){const s=load(theme,id,total);if(!s.firstSeen.includes(i)){s.firstSeen.push(i);if(ok)s.firstCorrect++}save(theme,id,s,false)}
function wrong(theme,id,total){const s=load(theme,id,total);s.tries++;s.hadWrong=true;save(theme,id,s);return s.tries}
function right(theme,id,total,free=false){
 const s=load(theme,id,total),i=s.current;
 if(i!=null){
  if(free){if(!s.done.includes(i))s.done.push(i)}
  else if(s.hadWrong||s.tries>0){if(!s.done.includes(i)&&!s.queue.includes(i))s.queue.push(i)}
  else if(!s.done.includes(i))s.done.push(i)
 }
 s.current=null;s.tries=0;s.hadWrong=false;save(theme,id,s)
}
function pct(theme,id,total){return total?Math.round(load(theme,id,total).done.length/total*100):0}
function allDone(theme){return preview()||T.tasks.filter(x=>!x.exam).every(x=>pct(theme,x.id,x.items.length)>=100)}
function image(file,alt='Bild'){return file?`<div class="l7-image"><img src="${CDN+encodeURIComponent(file)}" alt="${esc(alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="l7-image-fallback" hidden><strong>${esc(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`:''}
function say(text,fail){if(!('speechSynthesis' in window)){fail?.();return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;u.onerror=()=>fail?.();speechSynthesis.speak(u)}catch(e){fail?.()}}
function dash(){return String(localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase()==='teacher'?'/teacher/index.html':'/student-dashboard/index.html'}
function header(theme,title,reset=false){const p=profile(),name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(preview()?'Lehrer-Vorschau':'Schüler/in');return`<header class="l7-topbar"><div class="l7-top-main"><a class="l7-brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>SprachPilot</h1><p>Lektion 7 · Thema ${theme} · ${esc(title)}</p></div></a><div class="l7-account"><span>${esc(name)}</span><a href="${dash()}">Dashboard</a><a href="/profile/index.html">Profil</a></div></div><nav><a class="l7-btn secondary" href="../index.html">← Lektion 7</a><a class="l7-btn secondary" href="index.html">Themenübersicht</a>${reset?'<button class="l7-btn danger" id="resetTheme">Fortschritte löschen</button>':''}</nav></header>`}
function reset(theme){
 if(preview()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return}
 if(!confirm(`Fortschritte in Lektion 7 · Thema ${theme} löschen? Bereits verdiente Punkte bleiben erhalten.`))return;
 const suffix=`_T${theme}_`,keys=[];
 for(let i=0;i<localStorage.length;i++){const x=localStorage.key(i);if((String(x).startsWith('SP_L7_')&&String(x).includes(suffix))||String(x).startsWith(`SP_L7_EXAM_SYNCED_T${theme}_`))keys.push(x)}
 keys.forEach(x=>localStorage.removeItem(x));
 const p={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:7,theme,topicId:topic(theme),title:`A1 Lektion 7 · Thema ${theme}`};
 if(window.SPProgress?.recordThemeReset)SPProgress.recordThemeReset(p);else(window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordThemeReset',payload:p});
 location.href='index.html?reset='+Date.now()
}
function mic(item,ok,tech){
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!R){tech('Das Mikrofon wird nicht unterstützt. Bitte schreibe.');return}
 if(rec)try{rec.abort()}catch(e){}
 let got=false,bad=false;
 try{rec=new R()}catch(e){tech('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.');return}
 rec.lang='de-DE';rec.interimResults=false;rec.maxAlternatives=5;tech('Ich höre zu …');
 rec.onresult=e=>{got=true;ok(Array.from(e.results[0]||[]).map(x=>x.transcript))};
 rec.onerror=()=>{bad=true;tech('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe.')};
 rec.onend=()=>{rec=null;if(!got&&!bad)tech('Ich konnte nichts erkennen. Bitte schreibe.')};
 try{rec.start()}catch(e){tech('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.')}
}
window.L7S={T,esc,norm,shuffle,profile,preview,load,save,index,attempt,wrong,right,pct,allDone,image,say,header,reset,mic,task,pid};
})();