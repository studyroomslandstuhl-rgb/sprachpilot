(function(){
'use strict';
const THEME=1,LESSON=7,TOPIC_ID='wortschatz-a1-lektion-7-thema-1',KEY_PREFIX='SP_L7T1',AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
let recognition=null,cachedPid='';
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const norm=value=>String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const compact=value=>norm(value).replace(/\s+/g,'');
const shuffle=list=>{const copy=[...(list||[])];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch{return{}}}
function preview(){
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 if(role==='teacher')return true;
 for(const store of[sessionStorage,localStorage]){
  const raw=store.getItem('SP_TEACHER_PREVIEW');
  if(raw==='1')return true;
  try{if(JSON.parse(raw||'null')?.teacherPreview===true)return true}catch{}
 }
 return false
}
function clean(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
function pid(){
 if(cachedPid)return cachedPid;
 const p=profile();
 cachedPid=clean(p.uid||p.userId||p.id||p.email||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'))||'student';
 return cachedPid
}
function store(){return preview()?sessionStorage:localStorage}
function key(id){return`${preview()?KEY_PREFIX+'_PREVIEW':KEY_PREFIX+'_'+pid()}_T${THEME}_${id}`}
function legacyKeys(id){
 const p=profile(),legacy=clean([p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.nachname].filter(Boolean).join('_'))||pid();
 return[
  `SP_L7_${pid()}_T${THEME}_${id}`,
  `SP_L7_${legacy}_T${THEME}_${id}`,
  `SP_L7_student_T${THEME}_${id}`,
  `SP_L7_PREVIEW_${pid()}_T${THEME}_${id}`,
  `SP_L7_PREVIEW_${legacy}_T${THEME}_${id}`
 ]
}
function empty(total){return{total,done:[],queue:shuffle([...Array(total).keys()]),current:null,tries:0,hadWrong:false,firstSeen:[],firstCorrect:0,answers:{}}}
function normalizeState(value,total){
 const base=empty(total),x=value&&typeof value==='object'?value:{};
 return{...base,...x,total,done:Array.isArray(x.done)?x.done.filter(i=>Number.isInteger(i)&&i>=0&&i<total):[],queue:Array.isArray(x.queue)?x.queue.filter(i=>Number.isInteger(i)&&i>=0&&i<total):[],current:Number.isInteger(x.current)&&x.current>=0&&x.current<total?x.current:null,tries:Number(x.tries||0),hadWrong:!!x.hadWrong,firstSeen:Array.isArray(x.firstSeen)?x.firstSeen.filter(i=>Number.isInteger(i)&&i>=0&&i<total):[],firstCorrect:Number(x.firstCorrect||0),answers:x.answers&&typeof x.answers==='object'?x.answers:{}}
}
function parseState(storageKey,storage=store()){try{return JSON.parse(storage.getItem(storageKey)||'null')}catch{return null}}
function completedLegacy(ids){
 return ids.every(id=>{
  for(const candidate of legacyKeys(id)){
   const x=parseState(candidate,localStorage)||parseState(candidate,sessionStorage);
   if(x&&Number(x.total)>0&&Array.isArray(x.done)&&x.done.length>=Number(x.total))return true
  }
  return false
 })
}
function derivedComplete(id){
 if(id==='bedeutung-wort'||id==='hoeren-bild')return completedLegacy(['bild-erklaerung-wort']);
 if(id==='plural')return completedLegacy(['artikel-plural']);
 if(id==='partnerinterview')return completedLegacy(['partnerinterview','eigene-faehigkeiten','eigene-plaene']);
 return false
}
function load(id,total){
 const storage=store(),canonical=key(id);
 let current=parseState(canonical,storage);
 if(current&&Number(current.total)===total)return normalizeState(current,total);
 for(const candidate of legacyKeys(id)){
  const old=parseState(candidate,localStorage)||parseState(candidate,sessionStorage);
  if(!old)continue;
  if(Number(old.total)===total){const migrated=normalizeState(old,total);storage.setItem(canonical,JSON.stringify(migrated));return migrated}
  if(Number(old.total)>0&&Array.isArray(old.done)&&old.done.length>=Number(old.total)){const done=empty(total);done.done=[...Array(total).keys()];done.queue=[];storage.setItem(canonical,JSON.stringify(done));return done}
 }
 if(derivedComplete(id)){const done=empty(total);done.done=[...Array(total).keys()];done.queue=[];storage.setItem(canonical,JSON.stringify(done));return done}
 return empty(total)
}
function task(id){return(window.L7_THEME?.tasks||[]).find(item=>item.id===id)}
function save(id,state,doSync=false){
 const normalized=normalizeState(state,state.total);
 try{store().setItem(key(id),JSON.stringify(normalized))}catch{}
 if(doSync&&!preview())syncTask(id,normalized);
 return normalized
}
function nextIndex(id,total){
 const state=load(id,total);
 if(state.current==null){
  if(!state.queue.length&&state.done.length<total)state.queue=shuffle([...Array(total).keys()].filter(index=>!state.done.includes(index)));
  state.current=state.queue.shift();
  state.tries=0;state.hadWrong=false;
  save(id,state)
 }
 return state.current
}
function attempt(id,total,index,correct){
 const state=load(id,total);
 if(!state.firstSeen.includes(index)){state.firstSeen.push(index);if(correct)state.firstCorrect++}
 save(id,state)
}
function wrong(id,total){
 const state=load(id,total);state.tries++;state.hadWrong=true;save(id,state);return state.tries
}
function right(id,total,{forceDone=false}={}){
 const state=load(id,total),index=state.current;
 if(index!=null){
  if(forceDone){if(!state.done.includes(index))state.done.push(index)}
  else if(state.hadWrong||state.tries>0){if(!state.done.includes(index)&&!state.queue.includes(index))state.queue.push(index)}
  else if(!state.done.includes(index))state.done.push(index)
 }
 state.current=null;state.tries=0;state.hadWrong=false;
 return save(id,state,true)
}
function pct(id,total){return total?Math.round(load(id,total).done.length/total*100):0}
function allDone(){return preview()||(window.L7_THEME?.tasks||[]).filter(item=>!item.exam).every(item=>pct(item.id,item.items.length)>=100)}
function bestExam(){return Number(localStorage.getItem('SP_L7T1_EXAM_BEST')||0)||0}
function setBestExam(percent){if(preview())return bestExam();const best=Math.max(bestExam(),Math.round(percent));localStorage.setItem('SP_L7T1_EXAM_BEST',String(best));return best}
function resetTask(id){store().removeItem(key(id))}
function resetTheme(){
 if(preview()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return}
 if(!confirm('Fortschritte in Lektion 7 · Thema 1 löschen? Bereits verdiente Punkte bleiben erhalten.'))return;
 const p=profile(),legacy=clean([p.email,p.kurs,p.kursnummer,p.courseCode,p.vorname,p.nachname].filter(Boolean).join('_'))||pid();
 const prefixes=[`${KEY_PREFIX}_${pid()}_T${THEME}_`,`${KEY_PREFIX}_PREVIEW_T${THEME}_`,`SP_L7_${pid()}_T${THEME}_`,`SP_L7_${legacy}_T${THEME}_`,`SP_L7_PREVIEW_${pid()}_T${THEME}_`,`SP_L7_PREVIEW_${legacy}_T${THEME}_`],keys=[];
 for(const storage of[localStorage,sessionStorage]){for(let i=0;i<storage.length;i++){const current=String(storage.key(i)||'');if(prefixes.some(prefix=>current.startsWith(prefix))||current.startsWith(`SP_L7_student_T${THEME}_`))keys.push([storage,current])}}
 keys.forEach(([storage,current])=>storage.removeItem(current));
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:LESSON,theme:THEME,topicId:TOPIC_ID,title:'A1 Lektion 7 · Thema 1'};
 if(window.SPProgress?.recordThemeReset)window.SPProgress.recordThemeReset(payload);else(window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordThemeReset',payload});
 location.href='index.html?reset='+Date.now()
}
async function ensureProgress(){if(window.SPProgress?.recordTaskProgress)return window.SPProgress;try{await import('/js/progress.js?v=l7t1-full1')}catch{return null}return window.SPProgress||null}
async function syncTask(id,state){
 const currentTask=task(id);if(!currentTask||preview())return false;
 const percent=state.total?Math.round(state.done.length/state.total*100):0;
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:LESSON,theme:THEME,topicId:TOPIC_ID,title:'A1 Lektion 7 · Thema 1',file:`task.html?task=${encodeURIComponent(id)}`,taskTitle:currentTask.title,percent,done:state.done.length,total:state.total,completed:percent>=100};
 const api=await ensureProgress();
 if(api?.recordTaskProgress)return api.recordTaskProgress(payload);
 (window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordTaskProgress',payload});return false
}
async function recordExam(percent,score=0,maxScore=0){
 if(preview())return false;
 const rounded=Math.max(0,Math.min(100,Math.round(percent))),stars=rounded>=100?3:rounded>=70?2:rounded>=50?1:0,run=Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC_ID)||1)||1),marker=`SP_L7T1_EXAM_SYNCED_${run}_${rounded}`;
 setBestExam(rounded);
 if(localStorage.getItem(marker)==='1')return true;
 const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:LESSON,theme:THEME,topicId:TOPIC_ID,title:'A1 Lektion 7 · Thema 1',percent:rounded,scorePercent:rounded,score:Number(score)||0,maxScore:Number(maxScore)||0,stars};
 const api=await ensureProgress();
 if(api?.recordExamResult){const result=await api.recordExamResult(payload);localStorage.setItem(marker,'1');return result}
 (window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[]).push({method:'recordExamResult',payload});localStorage.setItem(marker,'1');return false
}
function audioSlug(value){return String(value||'').toLowerCase().trim().replace(/^(der|die|das)\s+/,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function computerSpeak(text,slow=false,fail){
 if(!('speechSynthesis'in window)){fail?.();return}
 try{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=slow?.56:.9;utterance.onerror=()=>fail?.();speechSynthesis.speak(utterance)}catch{fail?.()}
}
function sayWord(text,slow=false,fail){
 const slug=audioSlug(text);if(!slug)return computerSpeak(text,slow,fail);
 const audio=new Audio(AUDIO_BASE+encodeURIComponent(slug+'.mp3'));audio.playbackRate=slow?.75:1;let fallback=false;
 const useFallback=()=>{if(fallback)return;fallback=true;computerSpeak(text,slow,fail)};
 audio.onerror=useFallback;const result=audio.play();if(result&&typeof result.catch==='function')result.catch(useFallback)
}
function sayText(text,slow=false,fail){computerSpeak(text,slow,fail)}
function playFile(file,slow=false,fail){
 try{const audio=new Audio('https://sprachpilot.b-cdn.net/'+encodeURIComponent(file));audio.playbackRate=slow?.75:1;audio.onerror=()=>fail?.();const result=audio.play();if(result&&typeof result.catch==='function')result.catch(()=>fail?.());return audio}catch{fail?.();return null}
}
function stopMic(){if(recognition)try{recognition.abort()}catch{}recognition=null}
function mic(item,success,technical){
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!Recognition){technical('Das Mikrofon wird nicht unterstützt. Bitte schreibe.');return}
 stopMic();let got=false,failed=false;
 try{recognition=new Recognition()}catch{technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.');return}
 recognition.lang='de-DE';recognition.interimResults=false;recognition.maxAlternatives=5;
 technical('Ich höre zu …');
 recognition.onresult=event=>{got=true;success(Array.from(event.results[0]||[]).map(entry=>entry.transcript))};
 recognition.onerror=()=>{failed=true;technical('Das Mikrofon ist blockiert oder hat nicht funktioniert. Bitte schreibe.')};
 recognition.onend=()=>{recognition=null;if(!got&&!failed)technical('Ich konnte nichts erkennen. Bitte schreibe.')};
 try{recognition.start()}catch{technical('Das Mikrofon konnte nicht gestartet werden. Bitte schreibe.')}
}
function language(){
 const raw=String(profile().muttersprache||profile().motherLanguage||profile().nativeLanguage||'Englisch').toLowerCase();
 const map=[[/russ/,'Russisch'],[/ukrain|україн/,'Ukrainisch'],[/türk|turk/,'Türkisch'],[/arab/,'Arabisch'],[/rumän|ruman|roman/,'Rumänisch'],[/pol/,'Polnisch'],[/japan/,'Japanisch'],[/engl|english/,'Englisch']];
 return map.find(([pattern])=>pattern.test(raw))?.[1]||'Englisch'
}
function translation(item){
 const requested=language(),dictionary=window.L7T1_TRANSLATIONS||{},word=item?.word||item?.answer||'';
 if(dictionary[requested]?.[word])return{language:requested,text:dictionary[requested][word]};
 if(dictionary.Englisch?.[word])return{language:'Englisch',text:dictionary.Englisch[word]};
 return{language:'Deutsch',text:item?.meaning||word}
}
window.L7T1S={THEME,LESSON,TOPIC_ID,esc,norm,compact,shuffle,profile,preview,pid,key,load,save,nextIndex,attempt,wrong,right,pct,allDone,task,bestExam,setBestExam,resetTask,resetTheme,recordExam,sayWord,sayText,playFile,mic,stopMic,language,translation};
})();
