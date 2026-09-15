import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';
const D=window.L10T2||{},root=document.getElementById('app'),taskId='apotheke-dialoge-hoeren';
const task=(D.tasks||[]).find(t=>t.id===taskId)||{title:'Apotheke – Dialoge',icon:'⚕️',text:'Höre den Dialog. Beantworte die 3 Fragen.'};
const items=D.pharmacyDialogues||[],TOPIC='wortschatz-a1-lektion-10-thema-2';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function owner(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||profile().role||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(role)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function store(){return preview()?sessionStorage:localStorage}
function key(){return`SP_L10_${owner()}_T2_${taskId}`}
function read(){
 const ids=items.map(x=>x.id);
 let s={_run:run(),total:ids.length,done:[],order:[],wrong:{},passed:[],repeat:[]};
 try{const x=JSON.parse(store().getItem(key())||'null');if(x&&Number(x._run||1)===run())Object.assign(s,x)}catch(e){}
 s.done=(s.done||[]).filter(x=>ids.includes(x));
 s.passed=(s.passed||[]).filter(x=>ids.includes(x)&&!s.done.includes(x));
 s.repeat=(s.repeat||[]).filter(x=>ids.includes(x)&&!s.done.includes(x));
 s.order=(s.order||[]).filter(x=>ids.includes(x));
 s.order=s.order.concat(shuffle(ids.filter(x=>!s.order.includes(x))));
 s.total=ids.length;s.wrong=s.wrong||{};
 return s;
}
let state=read();
function pct(){return state.total?Math.round(state.done.length/state.total*100):0}
function save(){state._run=run();try{store().setItem(key(),JSON.stringify(state));sessionStorage.setItem('SP_L10_LAST_TASK_T2',taskId);localStorage.setItem('SP_L10_LAST_TASK_T2',taskId)}catch(e){}if(preview())return;import('/js/progress.js?v=20260831-central6').then(()=>window.SPProgress?.recordTaskProgress?.({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:10,theme:2,topicId:TOPIC,title:'A1 Lektion 10 · Thema 2',file:`task.html?task=${taskId}`,taskKey:taskId,taskTitle:task.title,run:run(),done:state.done.length,total:state.total,percent:pct(),completed:pct()>=100})).catch(()=>{})}
function currentInfo(){
 const normalId=state.order.find(x=>!state.done.includes(x)&&!state.passed.includes(x));
 if(normalId)return{item:items.find(x=>x.id===normalId)||null,isRepeat:false};
 const repeatId=state.repeat.find(x=>!state.done.includes(x));
 if(repeatId)return{item:items.find(x=>x.id===repeatId)||null,isRepeat:true};
 return{item:null,isRepeat:false};
}
function feedback(type,text){const e=document.getElementById('fb');if(e)e.innerHTML=`<div class="l8-feedback ${type}">${text}</div>`}
function shell(body){const header=renderSpHeader({subtitle:'Gesundheit und Apotheke · A1 Lektion 10 · Thema 2',color:{main:'#F4A3A3',dark:'#A86464',soft:'#FDF1F1',line:'#F3C9C9'}});root.innerHTML=`<div class="l10-theme-page">${header}<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Apotheke</span><h1>${esc(task.title)}</h1><p>${esc(task.icon||'⚕️')} ${esc(task.text||'')}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${state.total} Dialogen fertig</span><strong>${pct()}%</strong></div><div class="l8-progress"><div style="width:${pct()}%"></div></div></section>${body}<footer>© SprachPilot</footer></div></div>`;bindSpHeader(root)}
function finish(){save();shell(`<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast alle ${state.total} Apotheken-Dialoge richtig gelöst.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section>`)}
function render(){
 state=read();
 const info=currentInfo(),item=info.item,isRepeat=info.isRepeat;
 if(!item)return finish();
 const selected={};
 const qs=shuffle((item.questions||[]).map((q,i)=>({...q,_i:i})));
 shell(`<section class="l8-card l8-exercise">
   ${isRepeat?'<div class="l8-note"><strong>Wiederholung:</strong> Diesen Dialog hattest du vorher nicht sofort richtig.</div>':''}
   <div style="max-width:720px;margin:0 auto 16px">
     <audio id="dialogPlayer" controls preload="metadata" style="width:100%" src="${esc(item.audio||'')}"></audio>
     <div class="l8-row l8-center-actions" style="margin-top:8px">
       <button type="button" class="l8-btn" id="back10">↶ 10 Sek.</button>
       <button type="button" class="l8-btn" id="stop">■ Stopp</button>
     </div>
   </div>
   <p class="l8-small" style="text-align:center">Du kannst pausieren, zurückgehen und den Dialog noch einmal hören.</p>
   ${qs.map(q=>`<div style="margin-top:18px;padding-top:14px;border-top:1px solid #e0e8ec"><h3>${esc(q.q)}</h3><div class="l8-options">${shuffle(q.options||[]).map(o=>`<button type="button" class="l8-option" data-q="${q._i}" data-a="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`).join('')}
   <div class="l8-row l8-center-actions" style="margin-top:18px"><button class="l8-btn primary" id="check">Prüfen</button></div><div id="fb"></div>
 </section>`);
 const player=document.getElementById('dialogPlayer');
 document.getElementById('stop').onclick=()=>{try{player.pause();player.currentTime=0}catch(e){}};
 document.getElementById('back10').onclick=()=>{try{player.currentTime=Math.max(0,(player.currentTime||0)-10)}catch(e){}};
 document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{selected[b.dataset.q]=b.dataset.a;document.querySelectorAll(`[data-q="${b.dataset.q}"]`).forEach(x=>x.classList.toggle('selected',x===b))});
 let hadWrongThisPass=false;
 document.getElementById('check').onclick=()=>{
   const original=item.questions||[];
   if(original.some((_,i)=>!selected[i]))return feedback('warn','Beantworte zuerst alle drei Fragen.');
   const ok=original.every((q,i)=>norm(selected[i])===norm(q.a));
   if(!ok){
     hadWrongThisPass=true;
     state.wrong[item.id]=(Number(state.wrong[item.id])||0)+1;
     if(!state.repeat.includes(item.id))state.repeat.push(item.id);
     save();
     feedback('bad','Noch nicht richtig. Korrigiere deine Antworten. Erst wenn alle drei richtig sind, geht es weiter.');
     return;
   }
   if(isRepeat){
     if(!state.done.includes(item.id))state.done.push(item.id);
     state.repeat=state.repeat.filter(x=>x!==item.id);
     state.passed=state.passed.filter(x=>x!==item.id);
     delete state.wrong[item.id];
   }else if(hadWrongThisPass || state.repeat.includes(item.id)){
     if(!state.passed.includes(item.id))state.passed.push(item.id);
   }else{
     if(!state.done.includes(item.id))state.done.push(item.id);
     delete state.wrong[item.id];
   }
   save();
   feedback('good',isRepeat?'Richtig! Wiederholung geschafft.':'Richtig!');
   setTimeout(render,650);
 };
}
render();
