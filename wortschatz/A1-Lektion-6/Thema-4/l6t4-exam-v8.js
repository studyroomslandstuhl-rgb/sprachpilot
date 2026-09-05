(function(){
'use strict';
const TOPIC='wortschatz-a1-lektion-6-thema-4';
const STATE_KEY='SP_L6_T4_EXAM_STANDALONE_V9';
const LEGACY_KEY='SP_L6_T4_V2_task-exam';
const RELEASE='SP_L6_T4_EXAM_STANDALONE_RELEASE_V9';
const questions=[
 {q:'Was bedeutet „besonders“?',a:'speziell',o:['speziell','nie','langweilig','zusammen'],t:'Wortbedeutung'},
 {q:'Welcher Artikel ist richtig: ___ Hobby?',a:'das',o:['der','die','das','kein Artikel'],t:'Artikel'},
 {q:'Wie lautet der Plural von „der Beruf“?',a:'die Berufe',o:['die Berufe','die Berufen','der Berufe','die Beruf'],t:'Plural'},
 {q:'Was bedeutet „dabeihaben“?',a:'etwas bei sich haben',o:['etwas bei sich haben','etwas vergessen','etwas suchen','etwas kaufen'],t:'Wortbedeutung'},
 {q:'Ich ___ einen Tee.',a:'nehme',o:['nehme','nimmt','nimmst','nehmt'],t:'Verb „nehmen“'},
 {q:'Was ___ du?',a:'nimmst',o:['nimmst','nehme','nimmt','nehmen'],t:'Verb „nehmen“'},
 {q:'Welche Verbindung ist richtig?',a:'Gitarre spielen',o:['Gitarre spielen','Gitarre fahren','Gitarre treffen','Gitarre hören'],t:'Nomen und Verb'},
 {q:'„Kein einziges Mal“ bedeutet:',a:'nie',o:['nie','oft','manchmal','immer'],t:'Häufigkeit'},
 {q:'Welche Reaktion passt?',a:'Oh, wie dumm!',o:['Oh, wie dumm!','Na klar.','Ich weiß es nicht.','Stimmt.'],t:'Passend reagieren',d:'Anna: Der Bus ist schon weg.'},
 {q:'Spielst du nicht gern Tennis?',a:'Doch, sehr gern.',o:['Doch, sehr gern.','Nein, sehr gern.','Vielleicht nächste Woche.','Ich weiß es nicht.'],t:'Ja, Nein oder Doch'},
 {q:'Was bedeutet „Ich glaube …“?',a:'Ich denke …',o:['Ich denke …','Ich weiß es sicher.','Ich frage …','Ich vergesse …'],t:'Redemittel'},
 {q:'Welche Bedeutung hat „finden“?',a:'eine Meinung sagen',o:['eine Meinung sagen','suchen oder entdecken','etwas verlieren','etwas kaufen'],t:'Bedeutung von „finden“',d:'Mara: Ich finde den Film toll.'},
 {q:'Welche Antwort ist grammatisch richtig?',a:'Mein Hobby ist Schwimmen.',o:['Mein Hobby ist Schwimmen.','Meine Hobbys ist Schwimmen.','Ich bin Schwimmen.','Mein Beruf ist Schwimmen.'],t:'Hobby'},
 {q:'Meine Hobbys ___ Lesen und Wandern.',a:'sind',o:['sind','ist','bin','seid'],t:'Singular und Plural'},
 {q:'Welche Antwort passt?',a:'Ich weiß es nicht.',o:['Ich weiß es nicht.','Na klar.','Oh, wie dumm!','Auf jeden Fall.'],t:'Passend reagieren',d:'Tim: Wann beginnt der Film?'}
];

/* Eine Datenquelle: dieselben Fragen speisen Teilnehmerprüfung und Lehreransicht. */
window.SP_EXAM_REGISTRY=window.SP_EXAM_REGISTRY&&typeof window.SP_EXAM_REGISTRY==='object'?window.SP_EXAM_REGISTRY:{};
window.SP_EXAM_REGISTRY['6-4:exam']={
 lesson:6,theme:4,id:'exam',exam:true,title:'Prüfung',instruction:'Löse die 15 Aufgaben.',
 page:'pruefung-ohne-audio.html',testHref:'pruefung-ohne-audio.html',
 items:questions.map(item=>({type:'choice',label:item.t||'',context:item.d||'',prompt:item.q,options:[...(item.o||[])],answer:item.a}))
};
setTimeout(()=>window.SPTeacherExamReader?.run?.(),0);

const app=document.getElementById('app');
const shuffle=list=>{const copy=[...(list||[])];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
function strictExamUnlocked(){
 const tasks=(window.L6T4_TASKS||[]).filter(task=>!task.exam&&task.id!=='exam');
 if(!tasks.length||typeof window.l6t4Percent!=='function')return false;
 return tasks.every(task=>Number(task.total)>0&&window.l6t4Percent(task.key,task.total)>=100);
}
if(!app)return;
if(new URLSearchParams(location.search).get('teacherExamRead')==='1'){
 app.innerHTML='<div style="padding:24px;font-weight:800">Lehreransicht wird geladen …</div>';
 setTimeout(()=>window.SPTeacherExamReader?.run?.(),0);
 return;
}
if(!strictExamUnlocked()){
 app.innerHTML='<div class="result"><div class="star" style="font-size:58px">🔒</div><h2>Prüfung gesperrt</h2><p>Schließe zuerst alle Lernaufgaben dieses Themas mit 100 % ab.</p><a class="back" href="index.html">Zur Themenübersicht</a></div>';
 return;
}
let state={index:0,correct:0,selected:'',checked:false,answers:[],orders:{}};
try{
 if(localStorage.getItem(RELEASE)!=='1'){
  [localStorage,sessionStorage].forEach(storage=>{const keys=[];for(let i=0;i<storage.length;i++){const key=String(storage.key(i)||'');if(/SP_L6_T4/i.test(key)&&/task-exam$/i.test(key))keys.push(key)}keys.forEach(key=>storage.removeItem(key))});
  localStorage.removeItem(STATE_KEY);
  localStorage.setItem(RELEASE,'1');
 }
 const saved=JSON.parse(localStorage.getItem(STATE_KEY)||'null');
 if(saved&&Number.isInteger(saved.index)&&saved.index>=0)state={...state,...saved,orders:saved.orders&&typeof saved.orders==='object'?saved.orders:{}};
}catch(e){}
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const run=Math.min(3,Math.max(1,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
function save(){
 try{
  localStorage.setItem(STATE_KEY,JSON.stringify(state));
  const finished=Math.min(state.index,questions.length);
  localStorage.setItem(LEGACY_KEY,JSON.stringify({total:15,done:[...Array(finished).keys()],queue:[],current:null,tries:0,hadWrong:false,firstCorrect:state.correct,firstSeen:[...Array(finished).keys()]}));
 }catch(e){}
}
function optionsFor(index,item){
 const key=String(index);
 const existing=Array.isArray(state.orders?.[key])?state.orders[key]:null;
 const valid=existing&&existing.length===item.o.length&&existing.every(option=>item.o.includes(option));
 if(valid)return existing;
 state.orders=state.orders&&typeof state.orders==='object'?state.orders:{};
 state.orders[key]=shuffle(item.o);
 save();
 return state.orders[key];
}
function render(){
 if(state.index>=questions.length)return finish();
 const item=questions[state.index],options=optionsFor(state.index,item),percent=Math.round(state.index/questions.length*100);
 app.innerHTML=`<div class="attempt">Versuch ${run} von 3</div><div class="title"><span class="star">⭐</span><h1>Prüfung</h1></div><div class="progress-row"><span>${state.index+1} von ${questions.length}</span><strong>${percent} %</strong></div><div class="progress"><div class="bar" style="width:${percent}%"></div></div><section class="question-card"><div class="type">${esc(item.t)}</div>${item.d?`<div class="dialog">${esc(item.d)}</div>`:''}<h2 class="question">${esc(item.q)}</h2><div class="options">${options.map((option,index)=>{const selected=state.selected===option?' selected':'',result=state.checked?(option===item.a?' correct':state.selected===option?' wrong':''):'';return`<button class="option${selected}${result}" data-value="${esc(option)}" ${state.checked?'disabled':''}><span class="letter">${String.fromCharCode(65+index)}</span><span>${esc(option)}</span></button>`}).join('')}</div><div id="feedback" class="feedback ${state.checked?(state.selected===item.a?'ok':'bad'):''}">${state.checked?(state.selected===item.a?'Richtig.':`Nicht richtig. Lösung: ${esc(item.a)}`):''}</div><div class="actions"><button class="btn" id="action" ${!state.selected?'disabled':''}>${state.checked?'Weiter':'Kontrollieren'}</button></div></section>`;
 app.querySelectorAll('.option').forEach(button=>button.addEventListener('click',()=>{if(state.checked)return;state.selected=button.dataset.value;save();render()}));
 document.getElementById('action').onclick=()=>{
  if(!state.selected)return;
  if(!state.checked){state.checked=true;if(state.selected===item.a)state.correct++;state.answers.push({index:state.index,value:state.selected,correct:state.selected===item.a});save();render();return}
  state.index++;state.selected='';state.checked=false;save();render();
 };
}
function finish(){
 save();
 const percent=Math.round(state.correct/questions.length*100);
 try{
  localStorage.setItem(LEGACY_KEY,JSON.stringify({total:15,done:[...Array(15).keys()],queue:[],current:null,tries:0,hadWrong:false,firstCorrect:state.correct,firstSeen:[...Array(15).keys()]}));
  const marker=`SP_L6_T4_EXAM_SYNCED_${run}_${percent}`;
  if(localStorage.getItem(marker)!=='1'){
   const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:4,topicId:TOPIC,title:'A1 Lektion 6 · Thema 4',percent,scorePercent:percent,score:state.correct,maxScore:15,stars:percent>=100?3:percent>=70?2:percent>=50?1:0};
   if(window.SPProgress?.recordExamResult)Promise.resolve(window.SPProgress.recordExamResult(payload)).then(()=>localStorage.setItem(marker,'1'));
   else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordExamResult',payload})}
  }
 }catch(e){}
 app.innerHTML=`<div class="result"><div class="star" style="font-size:58px">⭐</div><h2>Prüfung abgeschlossen</h2><div class="score">${percent} %</div><p>${state.correct} von 15 Antworten waren beim ersten Versuch richtig.</p><a class="back" href="index.html">Zur Themenübersicht</a></div>`;
}
render();
})();