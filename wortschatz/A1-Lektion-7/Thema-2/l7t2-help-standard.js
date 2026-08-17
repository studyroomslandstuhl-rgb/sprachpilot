(function(){
'use strict';
if(window.__SP_L7T2_HELP_STANDARD_V2)return;
window.__SP_L7T2_HELP_STANDARD_V2=true;

function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2HelpStandardV2)return false;
 const S=window.L7S,root=document.getElementById('app');
 const raw=window.L7.renderTaskPage.bind(window.L7);
 let busy=false,patchQueued=false;
 const ADVANCED=new Set(['hoeren-partizip','haben','grammatik','saetze','saetze-schreiben','dialoge','text-umschreiben','lesen']);

 function theme(){return Number(document.body.dataset.theme||2)}
 function taskId(){return String(new URLSearchParams(location.search).get('task')||'')}
 function task(){return S.task(taskId())}
 function state(t){const st=S.load(theme(),t.id,t.items.length);st.answers=st.answers||{};return st}
 function index(t){
  const st=state(t);if(Number.isInteger(st.current))return st.current;
  const i=t.items.findIndex((item,pos)=>!st.done.includes(pos));
  if(i<0)return null;
  st.current=i;S.save(theme(),t.id,st,false);return i
 }
 function esc(v){return S.esc(v)}
 function setFeedback(html){const box=document.getElementById('spFeedback');if(!box)return;if(box.innerHTML!==html)box.innerHTML=html}
 function first(){return'<div class="l7-no">Noch nicht richtig.</div>'}
 function hint(text){return`<div class="l7-hint"><strong>Hinweis:</strong> ${esc(text)}</div>`}
 function solution(text,action='Gib die richtige Antwort selbst ein.'){return`<div class="l7-no"><strong>Lösung:</strong> ${text}<br>${action} Die Aufgabe kommt später erneut.</div>`}
 function specificHint(id,item){
  if(id==='hoeren-partizip')return'Achte auf die Bildung des Partizips II.';
  if(id==='grammatik'){
   const q=String(item?.question||'').toLowerCase();
   if(q.includes('hilfsverb'))return'Achte auf die konjugierte Form von „haben“.';
   if(q.includes('partizip'))return'Das Partizip II steht im Perfekt meist am Satzende.';
   if(q.includes('subjekt'))return'Frage: Wer oder was macht etwas?';
   if(q.includes('objekt'))return'Frage: Wen oder was?';
   return'Lies den Satz genau.'
  }
  if(id==='saetze')return'Das Hilfsverb steht auf Position 2, das Partizip II steht am Satzende.';
  if(id==='saetze-schreiben')return'Achte auf Hilfsverb, Partizip II, Großschreibung und Satzzeichen.';
  if(id==='dialoge')return'Achte auf den Zusammenhang im Dialog und auf die passende Partizip-II-Form.';
  if(id==='text-umschreiben')return'Setze jedes Verb ins Perfekt: Hilfsverb auf Position 2, Partizip II am Satzende.';
  if(id==='lesen')return'Lies den Text noch einmal und achte auf Personen, Zeiten und Aktivitäten.';
  return'Lies die Aufgabe noch einmal.'
 }
 function solutionFor(id,t,item){
  if(id==='hoeren-partizip')return esc(item?.answer||'');
  if(id==='grammatik')return esc(item?.answer||'');
  if(id==='saetze')return esc(item?.sentence||'');
  if(id==='saetze-schreiben')return esc(item?.answer||'');
  if(id==='dialoge')return esc(item?.answer||'');
  if(id==='text-umschreiben')return esc(item?.perfect||'');
  if(id==='lesen'){
   const answers=[...(item?.tf||[]).map((x,i)=>`${i+1}. ${x[1]?'Richtig':'Falsch'}`),...(item?.abc||[]).map((x,i)=>`${i+4}. ${x[2]}`)];
   return answers.map(esc).join('<br>')
  }
  return''
 }
 function patchAdvanced(){
  const id=taskId(),t=task();if(!t||!ADVANCED.has(id))return;
  if(id==='haben')return patchHaben(t);
  const st=state(t),i=index(t);if(i==null)return;
  const tries=Number(st.tries||0);if(!tries)return;
  const item=t.items[i];
  if(tries===1)return setFeedback(first());
  if(tries===2)return setFeedback(hint(specificHint(id,item)));
  const action=id==='lesen'?'Wähle alle Antworten selbst aus.':id==='saetze'?'Ordne den Satz selbst.':id==='dialoge'||id==='grammatik'?'Wähle die richtige Antwort selbst aus.':id==='text-umschreiben'?'Schreibe den Text selbst.':'Schreibe die richtige Antwort selbst.';
  setFeedback(solution(solutionFor(id,t,item),action))
 }
 function patchHaben(t){
  const st=state(t),tries=st.answers.habenHelpTries||{};
  const active=Object.keys(tries).filter(k=>!st.done.includes(Number(k))&&Number(tries[k])>0);
  if(!active.length)return;
  const max=Math.max(...active.map(k=>Number(tries[k])||0));
  if(max===1)return setFeedback(first());
  if(max===2)return setFeedback(hint('Achte auf die Formen von „haben“: habe, hast, hat, haben, habt.'));
  const rows=active.filter(k=>Number(tries[k])>=3).map(k=>`${esc(t.items[Number(k)]?.pronoun||'')} → ${esc(t.items[Number(k)]?.form||'')}`);
  setFeedback(solution(rows.join('<br>'),'Schreibe die Formen selbst.'))
 }
 function queuePatch(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(()=>{patchQueued=false;patchAdvanced()})}
 function rerender(delay=0){setTimeout(()=>{busy=false;window.L7.renderTaskPage(theme(),taskId())},delay)}
 function clearKeys(t,keys){const st=state(t);keys.forEach(key=>delete st.answers[key]);S.save(theme(),t.id,st,false)}
 function markWrong(t,i){S.attempt(theme(),t.id,t.items.length,i,false);S.wrong(theme(),t.id,t.items.length);window.L7.renderTaskPage(theme(),t.id)}
 function markRight(t,i,keys=[]){
  const before=state(t),repeat=!!(before.hadWrong||Number(before.tries||0)>0);
  if(keys.length)clearKeys(t,keys);
  S.attempt(theme(),t.id,t.items.length,i,true);S.right(theme(),t.id,t.items.length);
  busy=true;setFeedback(`<div class="l7-ok">Richtig.${repeat?' Die Aufgabe kommt später noch einmal.':''}</div>`);rerender(520)
 }
 function exact(a,b){return String(a||'').replace(/\s+/g,' ').trim()===String(b||'').replace(/\s+/g,' ').trim()}
 function stop(event){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation()}

 function checkListen(event,t){const i=index(t);if(i==null)return;const input=document.getElementById('spListenInput'),v=String(input?.value||'').trim();if(!v)return;stop(event);const item=t.items[i];if(S.norm(v)===S.norm(item.answer))markRight(t,i,[`listen:${i}`]);else markWrong(t,i)}
 function checkGrammar(event,t,button){const i=index(t);if(i==null)return;stop(event);const item=t.items[i];if(S.norm(button.dataset.grammarAnswer)===S.norm(item.answer))markRight(t,i);else markWrong(t,i)}
 function checkOrder(event,t){const i=index(t);if(i==null)return;stop(event);const st=state(t),arr=Array.isArray(st.answers[`order:${i}`])?st.answers[`order:${i}`]:[],value=arr.map(x=>x.token).join(' '),target=String(t.items[i].sentence||'').replace(/[.?!]$/,'');if(value===target)markRight(t,i,[`order:${i}`]);else markWrong(t,i)}
 function checkSentence(event,t){const i=index(t);if(i==null)return;const input=document.getElementById('spSentenceInput'),v=input?.value||'';if(!String(v).trim())return;stop(event);if(exact(v,t.items[i].answer))markRight(t,i,[`write:${i}`]);else markWrong(t,i)}
 function checkDialog(event,t,button){const i=index(t);if(i==null)return;stop(event);if(S.norm(button.dataset.dialogAnswer)===S.norm(t.items[i].answer))markRight(t,i);else markWrong(t,i)}
 function checkRewrite(event,t){const i=index(t);if(i==null)return;const input=document.getElementById('spRewrite'),v=input?.value||'';if(!String(v).trim())return;stop(event);if(exact(v,t.items[i].perfect))markRight(t,i,['rewrite']);else markWrong(t,i)}
 function checkReading(event,t){
  const i=index(t);if(i==null)return;stop(event);const st=state(t),item=t.items[i],keys=[];let q=0,complete=true,correct=true;
  (item.tf||[]).forEach(([,answer])=>{const key=`read:${i}:${q++}`,v=String(st.answers[key]??'');keys.push(key);if(!v)complete=false;if(v!==String(answer))correct=false});
  (item.abc||[]).forEach(([,options,answer])=>{const key=`read:${i}:${q++}`,v=String(st.answers[key]??'');keys.push(key);if(!v)complete=false;if(v!==answer)correct=false});
  if(!complete)return;
  if(correct)markRight(t,i,keys);else markWrong(t,i)
 }
 function checkHaben(event,t){
  stop(event);const st=state(t);st.answers.habenHelpTries=st.answers.habenHelpTries||{};st.answers.habenNeedsCleanRepeat=st.answers.habenNeedsCleanRepeat||{};
  let touched=false,wrong=false,repeatCorrect=false;
  t.items.forEach((item,i)=>{
   if(st.done.includes(i))return;
   const input=document.querySelector(`[data-haben="${i}"]`),v=String(input?.value||'').trim();if(!v)return;touched=true;
   if(S.norm(v)===S.norm(item.form)){
    if(st.answers.habenNeedsCleanRepeat[i]){delete st.answers.habenNeedsCleanRepeat[i];delete st.answers.habenHelpTries[i];delete st.answers[`haben:${i}`];repeatCorrect=true}
    else{st.done.push(i);delete st.answers.habenHelpTries[i];delete st.answers[`haben:${i}`]}
   }else{st.answers.habenHelpTries[i]=Number(st.answers.habenHelpTries[i]||0)+1;st.answers.habenNeedsCleanRepeat[i]=true;wrong=true}
  });
  if(!touched)return;
  st.current=null;S.save(theme(),t.id,st,true);
  if(wrong)return window.L7.renderTaskPage(theme(),t.id);
  busy=true;setFeedback(`<div class="l7-ok">Richtig.${repeatCorrect?' Die korrigierte Form kommt noch einmal.':''}</div>`);rerender(520)
 }

 document.addEventListener('click',event=>{
  if(busy)return;
  const id=taskId(),t=task();if(!t||!ADVANCED.has(id))return;
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  if(id==='hoeren-partizip'&&target.closest('#spListenCheck'))return checkListen(event,t);
  if(id==='haben'&&target.closest('#spHabenCheck'))return checkHaben(event,t);
  if(id==='grammatik'){const b=target.closest('[data-grammar-answer]');if(b)return checkGrammar(event,t,b)}
  if(id==='saetze'&&target.closest('#spOrderCheck'))return checkOrder(event,t);
  if(id==='saetze-schreiben'&&target.closest('#spSentenceCheck'))return checkSentence(event,t);
  if(id==='dialoge'){const b=target.closest('[data-dialog-answer]');if(b)return checkDialog(event,t,b)}
  if(id==='text-umschreiben'&&target.closest('#spRewriteCheck'))return checkRewrite(event,t);
  if(id==='lesen'&&target.closest('#spReadCheck'))return checkReading(event,t)
 },true);

 if(root)new MutationObserver(queuePatch).observe(root,{childList:true,subtree:true,characterData:true});
 window.L7.renderTaskPage=function(th,id){const result=raw(th,id);queuePatch();return result};
 window.L7.__l7t2HelpStandardV2=true;queuePatch();return true
}
window.L7T2HelpStandard={install};
})();
