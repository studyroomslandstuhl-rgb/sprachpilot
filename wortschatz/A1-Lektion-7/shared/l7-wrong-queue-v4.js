(function(){
'use strict';
if(window.__SP_L7_WRONG_QUEUE_V7)return;
window.__SP_L7_WRONG_QUEUE_V7=true;
let installed=false;
function norm(v){return String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/\s+/g,' ')}
function taskItem(S,id,index){const task=S.task?.(id);return{task,item:task?.items?.[index]||null}}
function solutionText(item){
 if(!item)return'';
 const direct=item.answer??item.word??item.form??item.perfect??item.correct??item.solution;
 if(Array.isArray(direct))return direct.join(' / ');
 if(direct)return String(direct);
 if(item.singular&&item.plural)return`${item.singular} · ${item.plural}`;
 if(Array.isArray(item.blanks)&&item.blanks.length)return item.blanks.map((b,i)=>`${i+1}: ${b.answer||''}`).filter(x=>!/: $/.test(x)).join(' · ');
 if(Array.isArray(item.questions)&&item.questions.length)return item.questions.map((q,i)=>q?.answer?`${i+1}: ${q.answer}`:'').filter(Boolean).join(' · ');
 return''
}
function hintText(task,item){
 if(item?.hint)return String(item.hint);
 const text=norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''}`);
 if(text.includes('umschreib')||text.includes('rewrite'))return'Vergleiche Satz für Satz. Prüfe bei jedem Verb: haben oder sein, Partizip II und die Wortstellung im Perfekt.';
 if(text.includes('fehler')||text.includes('error'))return'Finde zuerst selbst das falsche Wort. Prüfe danach nur die richtige Form dieses Wortes.';
 if(text.includes('artikel')||text.includes('plural'))return'Prüfe Artikel, Singular und Plural noch einmal genau.';
 if(text.includes('ordn')||text.includes('order'))return'Prüfe die Wortstellung. Das konjugierte Verb und das Partizip müssen an der richtigen Stelle stehen.';
 if(text.includes('hör')||text.includes('hoer')||text.includes('audio'))return'Höre noch einmal vollständig und prüfe die Information im Zusammenhang.';
 if(text.includes('dialog'))return'Lies den ganzen Dialog noch einmal. Welche Äußerung passt inhaltlich genau an diese Stelle?';
 if(text.includes('les')||text.includes('nachricht')||text.includes('email')||text.includes('e-mail'))return'Lies den Text noch einmal vollständig und suche die Information im Zusammenhang.';
 if(text.includes('partizip'))return'Prüfe die Partizip-II-Form noch einmal.';
 if(text.includes('haben')||text.includes('sein'))return'Prüfe das Subjekt und die passende Form von haben oder sein.';
 return'Prüfe die Aufgabe noch einmal genau und korrigiere deine Antwort.'
}
function feedbackBox(){return document.querySelector('#feedback,#spFeedback,#spL7Feedback,#technical')}
function helpHtml(task,item,count){
 if(count<=1)return'<div class="l7-no"><strong>Noch nicht richtig.</strong><br>Bleib bei dieser Aufgabe und korrigiere deine Antwort.</div>';
 if(count===2)return`<div class="l7-hint"><strong>Hinweis:</strong> ${window.L7S?.esc?.(hintText(task,item))||hintText(task,item)}</div>`;
 const sol=solutionText(item),e=window.L7S?.esc||((x)=>String(x));
 return sol?`<div class="l7-hint"><strong>Lösung:</strong> ${e(sol)}<br>Gib die richtige Lösung jetzt selbst ein. Erst danach geht es weiter.</div>`:`<div class="l7-hint"><strong>Lösungshilfe:</strong> ${e(hintText(task,item))}<br>Korrigiere die Antwort selbst. Erst danach geht es weiter.</div>`
}
function injectHelp(S,theme,id,index,count){
 const run=()=>{
  try{
   const box=feedbackBox();if(!box)return;
   const current=String(box.innerHTML||'');
   if(count===2&&/Hinweis:/i.test(current))return;
   if(count>=3&&/Lösung:/i.test(current)&&!/(später|nächsten Durchgang|erneut)/i.test(current))return;
   const{task,item}=taskItem(S,id,index);box.innerHTML=helpHtml(task,item,count)
  }catch(e){}
 };
 setTimeout(run,20);setTimeout(run,140)
}
function install(){
 const S=window.L7S;if(!S||installed)return !!S;
 const rawIndex=S.index.bind(S);
 S.index=function(theme,id,total){
  const i=rawIndex(theme,id,total);if(i==null)return i;
  const st=S.load(theme,id,total),remembered=Math.max(0,Number(st.wrongTries?.[i]||0));
  if(remembered>0){st.tries=remembered;st.hadWrong=true;S.save(theme,id,st,false)}
  return i
 };
 S.wrong=function(theme,id,total){
  const st=S.load(theme,id,total),i=Number(st.current);if(!Number.isInteger(i)||i<0||i>=total)return 0;
  const previous=Math.max(Number(st.wrongTries?.[i]||0),Number(st.tries||0)),count=previous+1;
  st.wrongTries=st.wrongTries||{};st.wrongTries[i]=count;st.tries=count;st.hadWrong=true;
  st.queue=(Array.isArray(st.queue)?st.queue:[]).filter(x=>Number(x)!==i);
  st.current=i;
  S.save(theme,id,st,true);
  try{window.dispatchEvent(new CustomEvent('SP_L7_WRONG_ANSWER',{detail:{theme:Number(theme),id:String(id),index:i,count}}))}catch(e){}
  injectHelp(S,theme,id,i,count);
  return count
 };
 S.right=function(theme,id,total,free=false){
  const st=S.load(theme,id,total),i=Number(st.current);
  st.done=Array.isArray(st.done)?st.done:[];
  st.queue=Array.isArray(st.queue)?st.queue:[];
  if(Number.isInteger(i)&&i>=0&&i<total){
   if(!st.done.includes(i))st.done.push(i);
   st.queue=st.queue.filter(x=>Number(x)!==i);
   if(st.wrongTries)delete st.wrongTries[i]
  }
  st.current=null;st.tries=0;st.hadWrong=false;
  S.save(theme,id,st,true)
 };
 S.__spNoSkipWrongAnswers=true;S.__spThreeStageHelp=true;
 installed=true;return true
}
window.SPL7WrongQueueV4=window.SPL7WrongQueueV5=window.SPL7WrongQueueV6=window.SPL7WrongQueueV7={install};
if(!install()){let n=0;const timer=setInterval(()=>{if(install()||++n>200)clearInterval(timer)},25)}
})();