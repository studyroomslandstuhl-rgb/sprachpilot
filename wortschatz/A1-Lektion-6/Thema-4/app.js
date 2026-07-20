const L6T4_CFG={key:'SP_L6_T4_V2',topicId:'wortschatz-a1-lektion-6-thema-4',title:'A1 Lektion 6 · Thema 4'};
const L6T4_META=[
 ['cards','Karteikarten','🗂️','Wörter, Bilder, Bedeutungen und Beispielsätze lernen.'],
 ['image-word','Bild → Wort','🖼️','Aktivitäten auf Bildern erkennen.'],
 ['word-image','Wort → Bild','🔎','Zum Wort das passende Bild wählen.'],
 ['listen-image','Hören → Bild','🔊','Eine Aktivität hören und das Bild finden.'],
 ['article','Artikel wiederholen','der','der, die oder das auswählen.'],
 ['plural','Plural sprechen','🎤','Singular hören und den Plural sprechen oder schreiben.','plural-sprechen.html'],
 ['sound-activity','Geräusch → Aktivität','🎧','Eine gehörte Aktivität erkennen.'],
 ['noun-verb','Nomen und Verb verbinden','↔️','Passende Wörter miteinander verbinden.'],
 ['phrases','Redemittel und Bedeutung','💬','Gesprächsbausteine in Situationen verstehen.'],
 ['nehmen','nehmen in Dialogen','☕','Die richtige Form von nehmen einsetzen.'],
 ['yes-no-doch','ja, nein oder doch?','↩️','Die passende kurze Antwort auswählen.'],
 ['doch-answer','Mit doch antworten','DOCH','Negative Aussagen mit doch korrigieren.'],
 ['dialog-rf','Dialoge: richtig oder falsch','✓✗','Kurze Dialoge genau lesen.'],
 ['dialog-abc','Dialoge: A, B oder C','ABC','Die passende Antwort wählen.'],
 ['gaps','Dialoglücken','▤','Gesprächsbausteine einsetzen.'],
 ['complete-dialog','Dialoge selbst ergänzen','✍️','Passende vollständige Antworten schreiben.'],
 ['speak-dialog','Dialog sprechen oder schreiben','🎙️','Kurze Antworten sprechen oder schreiben.'],
 ['listen-abc','Hören: A, B oder C','🎧','Kurze Hörtexte verstehen.'],
 ['finden','finden: zwei Bedeutungen','🔍','Entdecken und Meinung sagen unterscheiden.'],
 ['questions','Hobbys und Lieblingssachen','❓','Fragen und Antworten zuordnen.'],
 ['singular-plural','Hobby: Singular und Plural','1↔2','Hobby und Hobbys richtig verwenden.'],
 ['profile','Mein Freizeitprofil','👤','Über die eigene Freizeit schreiben.'],
 ['exam','Themenprüfung','★','Alle Inhalte von Thema 4 prüfen.']
];
const L6T4_TASKS=L6T4_META.map(meta=>{
 const task=window.L6T4_DATA?.tasks?.find(item=>item.id===meta[0]);
 const file=meta[4]||`task.html?task=${encodeURIComponent(meta[0])}`;
 const key=meta[4]||`task-${meta[0]}`;
 const total=meta[0]==='plural'?(window.L6T4PluralItems?.length||0):(task?.items?.length||0);
 return {id:meta[0],key,file,title:meta[1],icon:meta[2],description:meta[3],total,exam:meta[0]==='exam'};
});
function l6t4Profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')}catch(e){return null}}
function l6t4PreviewInfo(){const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW')||localStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1')return true;try{return JSON.parse(raw||'null')?.teacherPreview===true}catch(e){return false}}
function l6t4IsPreview(){const activeRole=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return activeRole==='teacher'||l6t4PreviewInfo()}
function l6t4Storage(){return l6t4IsPreview()?sessionStorage:localStorage}
function l6t4TaskKey(file){return (l6t4IsPreview()?'SP_L6_T4_PREVIEW_':L6T4_CFG.key+'_')+file}
function l6t4Simple(value){return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"']/g,'').replace(/\s+/g,' ')}
function l6t4Exact(value,solutions){const normalized=l6t4Simple(value);return (Array.isArray(solutions)?solutions:[solutions]).some(solution=>l6t4Simple(solution)===normalized)}
function l6t4Shuffle(list){const copy=list.slice();for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy}
function l6t4Load(file,total){
 try{
  const value=JSON.parse(l6t4Storage().getItem(l6t4TaskKey(file))||'null');
  if(value&&value.total===total&&Array.isArray(value.done)&&Array.isArray(value.queue))return value
 }catch(e){}
 if(!l6t4IsPreview()&&file==='plural-sprechen.html'){
  try{
   const old=JSON.parse(localStorage.getItem('SP_L6_T4_V1_plural-sprechen.html')||'null');
   if(old&&old.total===total&&Array.isArray(old.done)&&Array.isArray(old.queue)){
    const migrated={...old,firstCorrect:Number(old.firstCorrect||0),firstSeen:Array.isArray(old.firstSeen)?old.firstSeen:[]};
    localStorage.setItem(l6t4TaskKey(file),JSON.stringify(migrated));
    return migrated
   }
  }catch(e){}
 }
 return{total,done:[],queue:l6t4Shuffle([...Array(total).keys()]),current:null,tries:0,hadWrong:false,firstCorrect:0,firstSeen:[]}
}
function l6t4Save(file,state){l6t4Storage().setItem(l6t4TaskKey(file),JSON.stringify(state));l6t4Sync(file,state)}
function l6t4RegisterAttempt(file,total,index,isCorrect){const state=l6t4Load(file,total);state.firstSeen=Array.isArray(state.firstSeen)?state.firstSeen:[];if(!state.firstSeen.includes(index)){state.firstSeen.push(index);if(isCorrect)state.firstCorrect=(state.firstCorrect||0)+1}l6t4Save(file,state)}
function l6t4TaskByKey(file){return L6T4_TASKS.find(task=>task.key===file||task.file===file||task.id===file)}
function l6t4Sync(file,state){
 if(l6t4IsPreview())return;
 try{
  const done=state.done.length,total=state.total,percent=total?Math.round(done/total*100):0,task=l6t4TaskByKey(file);
  if(task?.exam){
   if(percent<100)return;
   const firstPercent=total?Math.round((Number(state.firstCorrect)||0)/total*100):0;
   const run=Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+L6T4_CFG.topicId)||1)||1);
   const marker=`SP_L6_T4_EXAM_SYNCED_${run}_${firstPercent}`;
   if(localStorage.getItem(marker)==='1'||window.__L6T4_EXAM_SYNCING)return;
   const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:L6T4_CFG.topicId,title:L6T4_CFG.title,percent:firstPercent,scorePercent:firstPercent,score:Number(state.firstCorrect)||0,maxScore:total,stars:firstPercent>=100?3:firstPercent>=70?2:firstPercent>=50?1:0};
   const api=window.SPProgress?.recordExamResult;
   if(api){window.__L6T4_EXAM_SYNCING=true;Promise.resolve(api(payload)).then(()=>localStorage.setItem(marker,'1')).finally(()=>{window.__L6T4_EXAM_SYNCING=false})}
   else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordExamResult',payload})}
   return
  }
  const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:L6T4_CFG.topicId,title:L6T4_CFG.title,file:task?.file||file,taskTitle:task?.title||file,percent,done,total,completed:percent>=100};
  const api=window.SPProgress?.recordTaskProgress;
  if(api)api(payload);
  else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload})}
 }catch(e){}
}
function l6t4NextIndex(file,total){const state=l6t4Load(file,total);if(state.current===null||state.current===undefined){if(!state.queue.length&&state.done.length<total)state.queue=l6t4Shuffle([...Array(total).keys()].filter(index=>!state.done.includes(index)));state.current=state.queue.shift();state.tries=0;state.hadWrong=false;l6t4Save(file,state)}return state.current}
function l6t4Wrong(file,total){const state=l6t4Load(file,total);state.tries=(state.tries||0)+1;state.hadWrong=true;l6t4Save(file,state);return state.tries}
function l6t4Right(file,total){const state=l6t4Load(file,total),current=state.current;if(current!==null&&current!==undefined){if(state.hadWrong||state.tries>0){if(!state.done.includes(current)&&!state.queue.includes(current))state.queue.push(current)}else if(!state.done.includes(current))state.done.push(current)}state.current=null;state.tries=0;state.hadWrong=false;l6t4Save(file,state)}
function l6t4MarkFreeRight(file,total){const state=l6t4Load(file,total),current=state.current;if(current!==null&&current!==undefined&&!state.done.includes(current))state.done.push(current);state.current=null;state.tries=0;state.hadWrong=false;l6t4Save(file,state)}
function l6t4Percent(file,total){const state=l6t4Load(file,total);return total?Math.round(state.done.length/total*100):0}
function l6t4Progress(file,total){const state=l6t4Load(file,total),percent=l6t4Percent(file,total);return `<div class="task-progress-row"><span>${state.done.length} fehlerfrei · ${total-state.done.length} übrig</span><strong>${percent}%</strong></div><div class="progress"><div class="bar" style="width:${percent}%"></div></div>`}
function l6t4ExamUnlocked(){return l6t4IsPreview()||L6T4_TASKS.filter(task=>!task.exam).every(task=>l6t4Percent(task.key,task.total)>=100)}
function l6t4Header(title,showReset=false){const header=document.querySelector('.topbar');if(!header)return;const profile=l6t4Profile(),name=`${profile?.vorname||profile?.firstName||''} ${profile?.nachname||profile?.lastName||''}`.trim()||'Schüler/in';const activeRole=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();const dashboard=activeRole==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';header.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${title} · ${L6T4_CFG.title}</div></div></a><div class="account-tools"><span class="account-pill">${name}</span><a class="account-link" href="${dashboard}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="index.html">← Zur Übersicht</a>${showReset?'<button class="btn secondary" type="button" onclick="l6t4Reset()">Fortschritte löschen</button>':''}</nav>`}
function l6t4Reset(){if(l6t4IsPreview()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return}if(!confirm('Fortschritte in Lektion 6 · Thema 4 löschen? Bereits verdiente Punkte bleiben erhalten.'))return;const storage=l6t4Storage(),keys=[];for(let i=0;i<storage.length;i++){const key=storage.key(i);if(String(key).includes('SP_L6_T4'))keys.push(key)}keys.forEach(key=>storage.removeItem(key));try{const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:L6T4_CFG.topicId,title:L6T4_CFG.title};const api=window.SPProgress?.recordThemeReset;if(api)api(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordThemeReset',payload})}}catch(e){}location.href='index.html?reset='+Date.now()}
function l6t4RenderMenu(){const grid=document.getElementById('taskGrid'),circle=document.getElementById('totalCircle'),text=document.getElementById('totalText'),bar=document.getElementById('totalBar');const average=Math.round(L6T4_TASKS.reduce((sum,task)=>sum+l6t4Percent(task.key,task.total),0)/Math.max(1,L6T4_TASKS.length));if(circle)circle.textContent=average+'%';if(bar)bar.style.width=average+'%';if(text)text.textContent=L6T4_TASKS.filter(task=>l6t4Percent(task.key,task.total)>=100).length+' / '+L6T4_TASKS.length+' Aufgaben abgeschlossen';if(!grid)return;grid.innerHTML=`<div class="section-heading"><div><p class="eyebrow">Lektion 6 · Thema 4</p><h2>Freizeit & Alltag</h2></div><span class="task-count">${L6T4_TASKS.length} Aufgaben</span></div><div class="grid">${L6T4_TASKS.map((task,index)=>{const percent=l6t4Percent(task.key,task.total),locked=task.exam&&!l6t4ExamUnlocked(),href=locked?'#':`${task.file}${task.file.includes('?')?'&':'?'}v=l6t4-build1`;return `<a class="module ${locked?'locked':''} ${percent>=100?'done-card':''}" href="${href}" ${locked?'aria-disabled="true" onclick="return false"':''}><div class="module-top"><span class="num">${index+1}</span><span class="status-icon">${percent>=100?'✓':locked?'🔒':''}</span></div><div class="big-icon">${task.icon}</div><h3>${task.title}</h3><p class="small">${task.description}</p><div class="progress"><div class="bar" style="width:${percent}%"></div></div><div class="module-bottom"><span>${locked?'Erst alle Aufgaben abschließen':percent+'%'}</span><strong>${percent>=100?'Fertig':'Starten'}</strong></div></a>`}).join('')}</div>`}
function l6t4Say(text,onError){if(!('speechSynthesis'in window)){onError?.();return}try{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=.84;utterance.onerror=()=>onError?.();speechSynthesis.speak(utterance)}catch(e){onError?.()}}
function l6t4NextTask(taskId){const index=L6T4_TASKS.findIndex(task=>task.id===taskId),next=L6T4_TASKS[index+1];return next?next.file:'index.html'}
function l6t4Complete(area,next='index.html',message='Du hast alle Aufgaben fehlerfrei wiederholt.'){area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><h2>Geschafft!</h2><p>${message}</p><div class="actions"><a class="btn" href="${next}">Weiter →</a><a class="btn secondary" href="index.html">Zur Übersicht</a></div></div>`}