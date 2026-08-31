(function(){
'use strict';
const T=window.L7_THEME;
const CDN='https://sprachpilot.b-cdn.net/';
let rec=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function role(){return String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_USER_ROLE')||'').toLowerCase()}
function readJson(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}}
function profile(){
 const r=role();
 if(['teacher','lehrer','admin','owner','superadmin'].includes(r))return readJson('SP_TEACHER_PROFILE')||{};
 return readJson('SP_USER_PROFILE')||readJson('SP_STUDENT_PROFILE')||{}
}
function preview(){
 if(['teacher','lehrer','admin','owner','superadmin'].includes(role()))return true;
 for(const s of[sessionStorage,localStorage]){
  const r=s.getItem('SP_TEACHER_PREVIEW');if(r==='1')return true;
  try{if(JSON.parse(r||'null')?.teacherPreview===true)return true}catch(e){}
 }
 return false
}
function clean(v){return String(v||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
function legacyPid(){const p=profile();return[p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.firstName,p.nachname,p.lastName].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||(preview()?'teacher':'student')}
function pid(){
 const cacheKey=preview()?'SP_L7_PREVIEW_PID':'SP_L7_STABLE_PID',p=profile();
 // Für echte Schüler ist die kanonische Schüler-ID die stabile Geräte-ID. Alte uid-/E-Mail-
 // Varianten bleiben über candidateKeys/identityMatch lesbar, werden aber nicht mehr als neue
 // Wahrheit weitergeschrieben.
 const resolved=clean(preview()?(
   p.uid||p.authUid||p.userId||p.id||p.email
 ):(
   p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email
 )||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'));
 const fallback=clean(localStorage.getItem(cacheKey));
 const value=resolved||fallback||(preview()?'teacher':'student');
 if(value&&value!=='student'&&value!=='teacher')try{localStorage.setItem(cacheKey,value)}catch(e){}
 return value
}
function st(){return localStorage}
function k(theme,task){return`${preview()?'SP_L7_PREVIEW':'SP_L7'}_${pid()}_T${theme}_${task}`}
function empty(total){return{total,done:[],queue:shuffle([...Array(total).keys()]),current:null,tries:0,hadWrong:false,wrongTries:{},firstSeen:[],firstCorrect:0,answers:{}}}
function valid(x){return!!(x&&typeof x==='object'&&Array.isArray(x.done)&&Array.isArray(x.queue))}
function ids(values,total){return [...new Set((Array.isArray(values)?values:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<total))]}
function normalizeState(x,total){
 const base=empty(total),done=ids(x?.done,total),current=Number(x?.current),currentValid=Number.isInteger(current)&&current>=0&&current<total&&!done.includes(current)?current:null;
 const queue=ids(x?.queue,total).filter(i=>!done.includes(i)&&i!==currentValid);
 const wrongTries={};for(const [key,value] of Object.entries(x?.wrongTries&&typeof x.wrongTries==='object'?x.wrongTries:{})){const i=Number(key);if(Number.isInteger(i)&&i>=0&&i<total&&Number(value)>0)wrongTries[i]=Number(value)}
 return{...base,...x,total,done,queue,current:currentValid,tries:Math.max(0,Number(x?.tries||0)),hadWrong:x?.hadWrong===true,wrongTries,firstSeen:ids(x?.firstSeen,total),firstCorrect:Math.max(0,Number(x?.firstCorrect||0)),answers:x?.answers&&typeof x.answers==='object'?x.answers:{}}
}
function scoreState(x){return(x.done?.length||0)*100000+(x.current!=null?1000:0)+(x.firstSeen?.length||0)*10+(x.queue?.length?1:0)}
function identityMatch(key){const text=String(key||''),id=pid();if(preview())return text.includes(`_${id}_`);const p=profile(),strong=[p.canonicalStudentId,p.docId,p.studentId,p.userId,p.authUid,p.uid,p.id,p.email,localStorage.getItem('SP_L7_STABLE_PID')].map(clean).filter(Boolean);if(strong.length)return strong.some(x=>text.includes(x));const fallback=[p.kurs,p.kursnummer,p.courseCode,p.vorname,p.firstName,p.nachname,p.lastName].map(clean).filter(Boolean);return fallback.length>=2&&fallback.filter(x=>text.includes(x)).length>=2}
function candidateKeys(theme,task,storage){
 const suffix=`_T${theme}_${task}`,keys=[k(theme,task)],old=`${preview()?'SP_L7_PREVIEW':'SP_L7'}_${legacyPid()}${suffix}`;
 if(!keys.includes(old))keys.push(old);
 if(!preview()&&pid()==='student'){const student=`SP_L7_student${suffix}`;if(!keys.includes(student))keys.push(student)}
 for(let i=0;i<storage.length;i++){const key=storage.key(i),text=String(key||'');if(text.startsWith(preview()?'SP_L7_PREVIEW_':'SP_L7_')&&text.endsWith(suffix)&&identityMatch(text)&&!keys.includes(key))keys.push(key)}
 return keys
}
function load(theme,task,total){
 const canonical=k(theme,task),stores=preview()?[localStorage,sessionStorage]:[localStorage];let best=null,bestKey='',bestStore=null;
 for(const storage of stores){for(const key of candidateKeys(theme,task,storage)){try{const x=JSON.parse(storage.getItem(key)||'null');if(valid(x)&&(!best||scoreState(x)>scoreState(best))){best=x;bestKey=key;bestStore=storage}}catch(e){}}}
 if(best){const out=normalizeState(best,total);if(bestKey!==canonical||bestStore!==localStorage||Number(best.total)!==Number(total)){try{localStorage.setItem(canonical,JSON.stringify(out))}catch(e){}}return out}
 return empty(total)
}
function task(id){return T.tasks.find(x=>x.id===id)}
function topic(theme){return`wortschatz-a1-lektion-7-thema-${theme}`}
function run(theme){try{return Number(window.L7ThemeScore?.summary?.(theme)?.currentRun)||Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+topic(theme))||1)||1)}catch(e){return Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+topic(theme))||1)||1)}}
function sync(theme,id,s){if(preview())return;try{const copy=JSON.parse(JSON.stringify(s));if(window.L7ThemeScore?.recordState){window.L7ThemeScore.recordState(theme,id,copy);return}window.SP_L7_LOCAL_SCORE_QUEUE=window.SP_L7_LOCAL_SCORE_QUEUE||[];window.SP_L7_LOCAL_SCORE_QUEUE.push({theme:Number(theme),id:String(id),state:copy})}catch(e){console.warn('L7 lokaler Themenstand',e)}}
function save(theme,id,s,doSync=true){const normalized=normalizeState(s,Number(s.total)||0);try{st().setItem(k(theme,id),JSON.stringify(normalized))}catch(e){console.warn('L7 storage',e)}if(doSync)sync(theme,id,normalized)}
function index(theme,id,total){
 const s=load(theme,id,total);if(s.done.length>=total)return null;
 if(s.current==null){while(s.queue.length&&s.done.includes(s.queue[0]))s.queue.shift();if(!s.queue.length&&s.done.length<total)s.queue=shuffle([...Array(total).keys()].filter(i=>!s.done.includes(i)));while(s.queue.length&&s.done.includes(s.queue[0]))s.queue.shift();if(!s.queue.length)return null;s.current=s.queue.shift();s.tries=Math.max(0,Number(s.wrongTries?.[s.current]||0));s.hadWrong=s.tries>0;save(theme,id,s,false)}
 return s.current
}
function attempt(theme,id,total,i,ok){const s=load(theme,id,total);if(!s.firstSeen.includes(i)){s.firstSeen.push(i);if(ok)s.firstCorrect++}save(theme,id,s,false)}
function wrong(theme,id,total){const s=load(theme,id,total),i=Number(s.current);if(!Number.isInteger(i))return 0;const count=Math.max(Number(s.wrongTries?.[i]||0),Number(s.tries||0))+1;s.wrongTries=s.wrongTries||{};s.wrongTries[i]=count;s.tries=count;s.hadWrong=true;s.queue=(s.queue||[]).filter(x=>Number(x)!==i);s.current=i;save(theme,id,s);return count}
function repeatRequired(s,i){return !!(s.hadWrong||Number(s.tries||0)>0||Number(s.wrongTries?.[i]||0)>0||s.answers?.cardRepeat?.[i])}
function right(theme,id,total,free=false){
 const s=load(theme,id,total),i=Number(s.current);s.answers=s.answers||{};s.queue=ids(s.queue,total).filter(x=>x!==i&&!s.done.includes(x));
 if(Number.isInteger(i)&&i>=0&&i<total){if(repeatRequired(s,i)){s.done=s.done.filter(x=>Number(x)!==i);s.queue.push(i)}else if(!s.done.includes(i))s.done.push(i);if(s.wrongTries)delete s.wrongTries[i];if(s.answers.cardRepeat)delete s.answers.cardRepeat[i]}
 s.current=null;s.tries=0;s.hadWrong=false;save(theme,id,s)
}
function markRepeat(theme,id,total,index,reason='repeat'){const s=load(theme,id,total),i=Number(index);if(!Number.isInteger(i)||i<0||i>=total)return false;s.answers=s.answers||{};s.answers.cardRepeat=s.answers.cardRepeat||{};s.answers.cardRepeat[i]=String(reason||'repeat');save(theme,id,s,false);return true}
function pct(theme,id,total){return total?Math.round(load(theme,id,total).done.length/total*100):0}
function allDone(theme){return preview()||T.tasks.filter(x=>!x.exam).every(x=>pct(theme,x.id,x.items.length)>=100)}
function image(file,alt='Bild'){if(!file)return'';const src=/^https?:\/\//i.test(String(file))?String(file):CDN+encodeURIComponent(file);return`<div class="l7-image"><img src="${src}" alt="${esc(alt)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="l7-image-fallback" hidden><strong>${esc(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`}
function say(text,fail){if(!('speechSynthesis' in window)){fail?.();return}try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;u.onerror=()=>fail?.();speechSynthesis.speak(u)}catch(e){fail?.()}}
function dash(){return ['teacher','lehrer','admin','owner','superadmin'].includes(role())?'/teacher/index.html':'/student-dashboard/index.html'}
function header(theme,title,reset=false){const p=profile(),name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(preview()?'Lehrer-Vorschau':'Schüler/in');return`<header class="l7-topbar"><div class="l7-top-main"><a class="l7-brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>SprachPilot</h1><p>Lektion 7 · Thema ${theme} · ${esc(title)}</p></div></a><div class="l7-account"><span>${esc(name)}</span><a href="${dash()}">Dashboard</a><a href="/profile/index.html">Profil</a></div></div><nav><a class="l7-btn secondary" href="../index.html">← Lektion 7</a><a class="l7-btn secondary" href="index.html">Themenübersicht</a>${reset?'<button class="l7-btn danger" id="resetTheme">Fortschritte löschen</button>':''}</nav></header>`}
function reset(theme){if(preview()){alert('In der Lehrer-Vorschau werden keine Teilnehmerpunkte verändert.');return}if(window.L7ThemeScore?.resetPractice)return window.L7ThemeScore.resetPractice(theme);if(!confirm(`Fortschritte in Lektion 7 · Thema ${theme} löschen? Bereits verdiente Punkte bleiben erhalten.`))return;const prefixes=[`SP_L7_${pid()}_T${theme}_`,`SP_L7_${legacyPid()}_T${theme}_`];if(pid()==='student')prefixes.push(`SP_L7_student_T${theme}_`);const keys=[];for(let i=0;i<localStorage.length;i++){const x=String(localStorage.key(i)||'');if(prefixes.some(prefix=>x.startsWith(prefix)))keys.push(x)}keys.forEach(x=>localStorage.removeItem(x));location.href='index.html?reset='+Date.now()}
function mic(item,ok,tech){const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){tech('Das Mikrofon wird nicht unterstützt. Bitte schreibe.');return}if(rec)try{rec.abort()}catch(e){}let got=false,bad=false;try{rec=new R()}catch(e){tech('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.');return}rec.lang='de-DE';rec.interimResults=false;rec.maxAlternatives=5;tech('Ich höre zu …');rec.onresult=e=>{got=true;ok(Array.from(e.results[0]||[]).map(x=>x.transcript))};rec.onerror=()=>{bad=true;tech('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe.')};rec.onend=()=>{rec=null;if(!got&&!bad)tech('Ich konnte nichts erkennen. Bitte schreibe.')};try{rec.start()}catch(e){tech('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.')}}
window.L7S={T,esc,norm,shuffle,profile,preview,load,save,index,attempt,wrong,right,markRepeat,pct,allDone,image,say,header,reset,mic,task,pid,run};
})();