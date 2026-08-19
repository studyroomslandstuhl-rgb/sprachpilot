import '/js/progress.js?v=local-standard-recovery1';

const PATTERNS=[
  [/^SP_L4_T1_V2_(.+)$/i,4,1],
  [/^SP_L4_T2_FINAL_V3_(.+)$/i,4,2],
  [/^SP_L4_T3_V2_(.+)$/i,4,3],
  [/^SP_L5_T1_V1_(.+)$/i,5,1],
  [/^SP_L5_T2_V1_(.+)$/i,5,2],
  [/^SP_L5_T3_V2_(.+)$/i,5,3],
  [/^SP_L6_T1_V1_(?:BOOK_|EXTRA_)(.+)$/i,6,1],
  [/^SP_L6_T2_V1_(.+)$/i,6,2],
  [/^SP_L6_T3_V1_(.+)$/i,6,3],
  [/^SP_L6_T4_V2_(.+)$/i,6,4]
];
function parse(v,f=null){try{return JSON.parse(v||'null')??f}catch(e){return f}}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function statePercent(st={}){
 if(!st||typeof st!=='object')return 0;
 if(st.completed===true||st.finished===true)return 100;
 const direct=clamp(st.percent??st.progress??st.progressPercent??0);if(direct)return direct;
 const total=Number(st.total||0),done=Array.isArray(st.done)?st.done.length:Number(st.done||st.completedCount||0);
 return total>0?clamp(done/total*100):0;
}
function stateDone(st={}){return Array.isArray(st.done)?st.done.length:Number(st.done||st.completedCount||0)}
function stateTotal(st={}){return Math.max(1,Number(st.total)||stateDone(st)||1)}
function normalizeFile(file,lesson,theme){
 let f=String(file||'').trim();if(!f)return'';
 if(lesson===6&&theme===4&&/^task-[^/]+$/i.test(f)){const id=f.replace(/^task-/i,'');return`task.html?task=${id}`}
 return f
}
function safeTask(file){return !!file&&!/(?:^|\/)(?:pruefung|prüfung|exam)(?:\.|-|_|$)/i.test(file)&&!/^(?:index|statistik|uebersicht|übersicht)\.html/i.test(file)}
function stronger(a,b){return statePercent(a)>=statePercent(b)?a:b}
function collect(){
 const map=new Map();
 for(let i=0;i<localStorage.length;i++){
  const key=String(localStorage.key(i)||'');
  for(const [re,lesson,theme] of PATTERNS){
   const m=key.match(re);if(!m)continue;
   const state=parse(localStorage.getItem(key),null);if(!state||typeof state!=='object')break;
   const file=normalizeFile(m[1],lesson,theme);if(!safeTask(file))break;
   const id=`${lesson}|${theme}|${file}`,old=map.get(id);map.set(id,{lesson,theme,file,state:old?stronger(old.state,state):state,keys:[...(old?.keys||[]),key]});break;
  }
 }
 const l3=parse(localStorage.getItem('SP_A1_L3_T1_FULL_UPDATE_V1'),null);
 if(l3&&typeof l3==='object'&&l3.doneTasks&&typeof l3.doneTasks==='object'){
  for(const [file,done] of Object.entries(l3.doneTasks)){if(done!==true||!safeTask(file))continue;map.set(`3|1|${file}`,{lesson:3,theme:1,file,state:{total:1,done:[0],completed:true,percent:100},keys:['SP_A1_L3_T1_FULL_UPDATE_V1']})}
 }
 return [...map.values()].filter(x=>statePercent(x.state)>0)
}
function topicId(lesson,theme){return`wortschatz-a1-lektion-${lesson}-thema-${theme}`}
async function recover(){
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();if(['teacher','lehrer','admin','owner'].includes(role))return{ok:false,reason:'teacher'};
 try{if(window.SP_PROGRESS_ALIAS_READY)await window.SP_PROGRESS_ALIAS_READY}catch(e){}
 const api=window.SPProgress;if(!api?.recordTaskProgress)return{ok:false,reason:'progress-api-missing'};
 const entries=collect();let synced=0,completed=0;
 for(const entry of entries){
  const pct=statePercent(entry.state),total=stateTotal(entry.state),done=stateDone(entry.state);
  try{
   const result=await api.recordTaskProgress({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:entry.lesson,theme:entry.theme,topicId:topicId(entry.lesson,entry.theme),title:`A1 Lektion ${entry.lesson} · Thema ${entry.theme}`,file:entry.file,taskKey:entry.file,taskTitle:entry.file.replace(/\.html.*$/i,'').replace(/-/g,' '),percent:pct,completed:pct>=100,total,done});
   if(result){synced++;if(pct>=100)completed++}
  }catch(e){console.warn('Lokaler Aufgabenstand konnte nicht zurückgeschrieben werden',entry.file,e)}
 }
 const report={ok:true,checked:entries.length,synced,completed,at:new Date().toISOString()};
 try{localStorage.setItem('SP_LOCAL_STANDARD_POINTS_RECOVERY_REPORT',JSON.stringify(report));window.dispatchEvent(new CustomEvent('SP_POINT_DELTA_APPLIED',{detail:{type:'local-standard-recovery',...report}}))}catch(e){}
 return report
}
window.SP_LOCAL_STANDARD_POINTS_RECOVERY={recover};
setTimeout(recover,900);
window.addEventListener('online',()=>setTimeout(recover,250));
