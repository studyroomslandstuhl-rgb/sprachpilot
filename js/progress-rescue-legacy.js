import { db, doc, getDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

const REPORT_KEY='SP_ACCOUNT_PROGRESS_RESCUE_REPORT';
const L3T1_KEY='SP_A1_L3_T1_FULL_UPDATE_V1';
const L3T2_TOTALS={
 'karteikarten.html':11,
 'bild-wort.html':11,
 'wort-bild.html':11,
 'hoeren.html':11,
 'artikel.html':11,
 'drag-drop-artikel.html':11,
 'plural.html':11,
 'plural-drag-drop.html':11,
 'memory.html':11,
 'verpackungen.html':30,
 'preis-hoeren.html':30,
 'preis-schreiben.html':30,
 'preis-sprechen.html':30,
 'frage-und-antwort.html':30,
 'pruefung.html':11
};

function parse(v,f={}){try{return JSON.parse(v||'null')||f}catch(e){return f}}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function norm(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function profile(){return getActiveProfile()||parse(localStorage.getItem('SP_USER_PROFILE'),{})||parse(localStorage.getItem('SP_STUDENT_PROFILE'),{})||{}}
function course(p=profile()){return p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function ids(p=profile()){
 const mail=String(p.email||'').trim().toLowerCase(),fallback=norm((course(p)||'kurs')+'_'+(mail||p.vorname||p.firstName||'student'));
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback]);
}
function topicNumbers(key,topic){
 const text=[key,topic?.topicId,topic?.themeId,topic?.title,topic?.lesson,topic?.lektion,topic?.theme,topic?.thema].filter(Boolean).join(' ');
 const lesson=String(topic?.lesson||topic?.lektion||'').match(/\d+/)?.[0]||(text.match(/lektion[-_\s]*(\d+)/i)?.[1]||'');
 const theme=String(topic?.theme||topic?.thema||'').match(/\d+/)?.[0]||(text.match(/thema[-_\s]*(\d+)/i)?.[1]||'');
 return{lesson,theme};
}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function taskPercent(t={}){return Math.max(clamp(t.percent??t.progress??0),t.completed?100:0)}
function completed(t={}){return !!t.completed||taskPercent(t)>=100}
function taskState(total){return{total,queue:[],done:[...Array(total).keys()],current:null,tries:0,hadWrong:false,completed:true,percent:100}}
function setIfStronger(key,value){
 const raw=JSON.stringify(value),old=parse(localStorage.getItem(key),null);
 const oldDone=Array.isArray(old?.done)?old.done.length:0,newDone=Array.isArray(value?.done)?value.done.length:0;
 if(!old||newDone>oldDone||value?.completed&&!old?.completed){localStorage.setItem(key,raw);return true}
 return false;
}
async function collect(){
 const p=profile(),queue=ids(p).slice(),seen=new Set(),rows=[];
 while(queue.length&&seen.size<60){
  const id=String(queue.shift()||'');if(!id||seen.has(id))continue;seen.add(id);
  try{const s=await getDoc(doc(db,'progress',id));if(!s.exists())continue;const data=s.data()||{};rows.push({id,data});uniq([...(data.aliasIds||[]),data.canonicalStudentId,data.studentId,data.userId,data.docId]).forEach(a=>{if(!seen.has(a))queue.push(a)})}catch(e){}
 }
 const mail=String(p.email||'').trim().toLowerCase();
 if(mail){try{const s=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(30)));for(const d of s.docs){if(!rows.some(r=>r.id===d.id))rows.push({id:d.id,data:d.data()||{}})}}catch(e){}}
 return rows;
}
function rescueL3T1(topic,report){
 const taskEntries=Object.entries(topic.tasks||{}),state=parse(localStorage.getItem(L3T1_KEY),{});state.doneTasks=state.doneTasks&&typeof state.doneTasks==='object'?state.doneTasks:{};
 let changed=false;
 for(const[file,t]of taskEntries){if(completed(t)&&state.doneTasks[file]!==true){state.doneTasks[file]=true;changed=true;report.l3t1.push(file)}}
 const examPct=Math.max(clamp(topic.exam?.bestPercent),clamp(topic.exam?.percent));
 if((topic.exam?.completed||examPct>=100)&&state.doneTasks['pruefung.html']!==true){state.doneTasks['pruefung.html']=true;changed=true;report.l3t1.push('pruefung.html')}
 if(changed)localStorage.setItem(L3T1_KEY,JSON.stringify(state));
 return changed;
}
function rescueL3T2(topic,report){
 let changed=false;
 for(const[file,t]of Object.entries(topic.tasks||{})){
  if(!completed(t))continue;
  const total=L3T2_TOTALS[file];if(!total)continue;
  if(setIfStronger('SP_TASK_STATE_'+file,taskState(total))){changed=true;report.l3t2.push(file)}
 }
 const examPct=Math.max(clamp(topic.exam?.bestPercent),clamp(topic.exam?.percent));
 if((topic.exam?.completed||examPct>=100)&&setIfStronger('SP_TASK_STATE_pruefung.html',taskState(L3T2_TOTALS['pruefung.html']))){changed=true;report.l3t2.push('pruefung.html')}
 return changed;
}
export async function rescueLegacyProgress(){
 const rows=await collect();const report={at:new Date().toISOString(),docs:rows.map(r=>r.id),l3t1:[],l3t2:[],changed:false};
 for(const row of rows){
  for(const[key,topic]of Object.entries(row.data?.wortschatz||{})){
   if(!topic||typeof topic!=='object')continue;
   const nums=topicNumbers(key,topic);
   if(nums.lesson==='3'&&nums.theme==='1')report.changed=rescueL3T1(topic,report)||report.changed;
   if(nums.lesson==='3'&&nums.theme==='2')report.changed=rescueL3T2(topic,report)||report.changed;
  }
 }
 report.l3t1=uniq(report.l3t1);report.l3t2=uniq(report.l3t2);
 try{localStorage.setItem(REPORT_KEY,JSON.stringify(report))}catch(e){}
 try{window.SP_PROGRESS_RESCUE_REPORT=report;window.dispatchEvent(new CustomEvent('SP_PROGRESS_RESCUE_DONE',{detail:report}))}catch(e){}
 return report;
}
