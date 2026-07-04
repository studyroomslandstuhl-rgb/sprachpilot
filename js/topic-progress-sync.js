import { recordTaskProgress, recordExamResult, touch } from "/js/progress.js";
import { getActiveProfile, getActiveRole } from "/js/auth.js";

const TOPICS=[
 {key:"SP_L4_T1_V2",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"1",topicId:"wortschatz-a1-lektion-4-thema-1",title:"A1 Lektion 4 · Thema 1",href:"/wortschatz/A1-Lektion-4/Thema-1/",files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","wo-ist.html","ist-hier.html","pruefung.html"]},
 {key:"SP_L4_T2_FINAL_V3",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"2",topicId:"wortschatz-a1-lektion-4-thema-2",title:"A1 Lektion 4 · Thema 2",href:"/wortschatz/A1-Lektion-4/Thema-2/",files:["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","kategorien.html","dialoge.html","pruefung.html"]},
 {key:"SP_L4_T3_V2",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"3",topicId:"wortschatz-a1-lektion-4-thema-3",title:"A1 Lektion 4 · Thema 3",href:"/wortschatz/A1-Lektion-4/Thema-3/",files:["karteikarten.html","hoeren.html","farben.html","memory.html","gegenteile.html","kein.html","reaktionen.html","gefallen.html","saetze-bauen.html","schreiben.html","pruefung.html"]},
 {key:"SP_L5_T1_V1",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"5",theme:"1",topicId:"wortschatz-a1-lektion-5-thema-1",title:"A1 Lektion 5 · Thema 1",href:"/wortschatz/A1-Lektion-5/Thema-1/",files:["karteikarten.html","bild-wort.html","wort-bild.html","hoeren-schreiben.html","trennbare-verben.html","trennbare-verben-im-satz.html","marias-tag.html","was-machst-du-gern.html","ja-nein-fragen.html","verb-passt.html","pruefung.html"]},
 {key:"SP_L5_T2_V1",module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"5",theme:"2",topicId:"wortschatz-a1-lektion-5-thema-2",title:"A1 Lektion 5 · Thema 2",href:"/wortschatz/A1-Lektion-5/Thema-2/",files:["karteikarten.html","artikel.html","plural.html","sehen-schreiben.html","hoeren-schreiben.html","sprechen.html","formell-informell.html","frage-antwort.html","schon-erst.html","pruefung.html"]}
];
const TASK_TITLES={"karteikarten.html":"Karteikarten","hoeren.html":"Hören","artikel-klick.html":"Artikel klicken","artikel.html":"Artikel zuordnen","plural.html":"Plural","bild-wort.html":"Bild → Wort","wort-bild.html":"Wort → Bild","kategorien.html":"Kategorien","dialoge.html":"Dialoge","wo-ist.html":"Wo ist?","ist-hier.html":"Ist hier?","farben.html":"Farben","memory.html":"Memory","gegenteile.html":"Gegenteile","kein.html":"nicht / kein","reaktionen.html":"Reaktionen","gefallen.html":"Gefallen","saetze-bauen.html":"Sätze bauen","schreiben.html":"Schreiben","sehen-schreiben.html":"Sehen → Schreiben","hoeren-schreiben.html":"Hören → Schreiben","sprechen.html":"Sprechen","formell-informell.html":"Formell ↔ informell","frage-antwort.html":"Frage / Antwort","schon-erst.html":"schon / erst","bild-wort.html":"Bild → Wort","trennbare-verben.html":"Trennbare Verben","trennbare-verben-im-satz.html":"Sätze bauen","marias-tag.html":"Marias Tag","was-machst-du-gern.html":"Was machst du gern?","ja-nein-fragen.html":"Ja-/Nein-Fragen","verb-passt.html":"Mini-Situationen","pruefung.html":"Prüfung"};
let timer=null;
const pending=new Set();
function isStudent(){const r=String(getActiveRole()||localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const p=getActiveProfile()||{};return r==="student"&&!p.teacherPreview&&!p.isTeacher}
function cleanPercent(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function read(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
function topicForKey(storageKey){return TOPICS.find(t=>String(storageKey||"").startsWith(t.key+"_"))}
function fileFromStorageKey(t,storageKey){return String(storageKey||"").slice((t.key+"_").length)}
function stateProgress(st){
  if(!st||typeof st!=="object")return null;
  const total=Number(st.total||0)||0;
  const done=Array.isArray(st.done)?st.done.length:Number(st.done||0)||0;
  const queue=Array.isArray(st.queue)?st.queue.length:0;
  const started=!!(st.current!==null&&st.current!==undefined)||done>0||queue>0||Number(st.tries||0)>0||st.hadWrong===true;
  const percent=total?cleanPercent(done/total*100):cleanPercent(st.percent||0);
  return {total,done,percent,started,completed:!!st.completed||percent>=100,tries:Number(st.tries||0)||0,hadWrong:!!st.hadWrong};
}
function payload(t,file,st){
  const p=stateProgress(st)||{total:0,done:0,percent:0,started:false,completed:false};
  return {...t,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace(/\.html$/,""),total:p.total,done:p.done,percent:p.percent,completed:p.completed,tries:p.tries,countAttempt:false,started:p.started,href:t.href,lastPage:location.pathname};
}
async function syncTask(t,file){
  if(!isStudent())return;
  const st=read(t.key+"_"+file);
  if(!st)return;
  if(file==="pruefung.html"){
    const p=stateProgress(st);
    if(p&&p.percent>0){await recordExamResult({...t,file,percent:p.percent,scorePercent:p.percent,stars:p.percent>=100?3:p.percent>=70?2:p.percent>=50?1:0});}
  }
  await recordTaskProgress(payload(t,file,st));
}
async function syncTopic(t){
  if(!isStudent())return;
  for(const file of t.files){await syncTask(t,file)}
}
function schedule(t,file){
  if(!t)return;
  pending.add(t.key+"|"+(file||""));
  clearTimeout(timer);
  timer=setTimeout(flush,700);
}
async function flush(){
  const items=[...pending];pending.clear();
  for(const item of items){
    const [key,file]=item.split("|");
    const t=TOPICS.find(x=>x.key===key);
    if(!t)continue;
    try{file?await syncTask(t,file):await syncTopic(t)}catch(e){console.warn("Topic progress sync failed",t.title,file,e)}
  }
}
function currentTopic(){const p=location.pathname;return TOPICS.find(t=>p.startsWith(t.href))||null}
function patchStorage(){
  if(window.__SP_TOPIC_PROGRESS_SYNC_PATCHED)return;
  window.__SP_TOPIC_PROGRESS_SYNC_PATCHED=true;
  const native=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=native.apply(this,arguments);
    try{const t=topicForKey(key);if(t)schedule(t,fileFromStorageKey(t,key));}catch(e){}
    return out;
  };
}
function syncExistingLocal(){
  TOPICS.forEach(t=>{
    const has=t.files.some(file=>!!localStorage.getItem(t.key+"_"+file));
    if(has)schedule(t,"");
  });
}
function touchCurrent(){
  const t=currentTopic();
  if(!t||!isStudent())return;
  try{touch({action:"topic-open",...t,lastPage:location.pathname})}catch(e){}
}
function boot(){patchStorage();touchCurrent();syncExistingLocal();const t=currentTopic();if(t)setTimeout(()=>schedule(t,""),1200)}
boot();
window.addEventListener("online",()=>syncExistingLocal());
window.addEventListener("pagehide",()=>{try{flush()}catch(e){}});
window.addEventListener("sprachpilot-progress",e=>{const t=currentTopic();if(t&&e.detail?.file)schedule(t,e.detail.file)});
window.SPTopicProgressSync={syncExistingLocal,flush,topics:TOPICS};
