(function(){
'use strict';
if(window.__SP_L7T3_HELP_STANDARD_V3)return;window.__SP_L7T3_HELP_STANDARD_V3=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t3HelpV3)return false;
 const S=window.L7S,root=document.getElementById('app');let queued=false,busy=false;
 const advancedKinds=new Set(['listen-participle','grammar-parts','sentence-order','sentence-write','rewrite-text','reading-sets']);
 const theme=()=>Number(document.body.dataset.theme||3),id=()=>String(new URLSearchParams(location.search).get('task')||''),task=()=>S.task(id());
 function st(t){const x=S.load(theme(),t.id,t.items.length);x.answers=x.answers||{};return x}
 function idx(t){const x=st(t);if(Number.isInteger(x.current))return x.current;const i=t.items.findIndex((_,n)=>!x.done.includes(n));if(i<0)return null;x.current=i;S.save(theme(),t.id,x,false);return i}
 function esc(v){return S.esc(v)}
 function feedback(html){const box=document.getElementById('spFeedback');if(box&&box.innerHTML!==html)box.innerHTML=html}
 function hintFor(t,item){if(t.kind==='listen-participle')return'Achte auf die Partizip-II-Form.';if(t.kind==='grammar-parts')return String(item.question||'').toLowerCase().includes('hilfsverb')?'Achte auf die konjugierte Form von sein oder haben.':'Lies Satz und Frage genau.';if(t.kind==='sentence-order')return'Das Hilfsverb steht auf Position 2. Das Partizip II steht am Satzende.';if(t.kind==='sentence-write')return'Achte auf Hilfsverb, Partizip II und die Wortstellung.';if(t.kind==='rewrite-text')return'Vergleiche Satz für Satz. Prüfe jedes Verb: sein oder haben + Partizip II und die Wortstellung im Perfekt.';if(t.kind==='reading-sets')return'Lies den Text noch einmal und vergleiche jede Aussage mit dem Inhalt.';return'Lies die Aufgabe noch einmal.'}
 function solutionFor(t,item){if(t.kind==='sentence-order')return item.sentence||'';if(t.kind==='rewrite-text')return item.perfect||'';if(t.kind==='reading-sets'){return[...(item.tf||[]).map((x,i)=>`${i+1}. ${x[1]?'Richtig':'Falsch'}`),...(item.abc||[]).map((x,i)=>`${i+4}. ${x[2]}`)].join('<br>')}return item.answer||''}
 function patch(){const t=task();if(!t||!advancedKinds.has(t.kind))return;const i=idx(t);if(i==null)return;const x=st(t),tries=Number(x.tries||0);if(!tries)return;const item=t.items[i];if(tries===1)return feedback('<div class="l7-no"><strong>Noch nicht richtig.</strong><br>Korrigiere deine Antwort. Erst wenn sie richtig ist, geht es weiter.</div>');if(tries===2)return feedback(`<div class="l7-hint"><strong>Hinweis:</strong> ${esc(hintFor(t,item))}</div>`);const action=t.kind==='reading-sets'?'Wähle die Antworten selbst aus.':t.kind==='sentence-order'?'Ordne den Satz selbst.':t.kind==='grammar-parts'?'Wähle die richtige Antwort selbst aus.':t.kind==='rewrite-text'?'Schreibe den richtigen Text selbst.':'Gib die Lösung selbst ein.';feedback(`<div class="l7-hint"><strong>Lösung:</strong> ${t.kind==='reading-sets'?solutionFor(t,item):esc(solutionFor(t,item))}<br>${action} Erst danach geht es weiter.</div>`)}
 function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patch()})}
 function stop(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()}
 function wrong(t,i){S.attempt(theme(),t.id,t.items.length,i,false);S.wrong(theme(),t.id,t.items.length);window.L7.renderTaskPage(theme(),t.id)}
 function right(t,i,keys=[]){const x=st(t);keys.forEach(k=>delete x.answers[k]);S.save(theme(),t.id,x,false);S.attempt(theme(),t.id,t.items.length,i,true);S.right(theme(),t.id,t.items.length);busy=true;feedback('<div class="l7-ok">Richtig.</div>');setTimeout(()=>{busy=false;window.L7.renderTaskPage(theme(),t.id)},500)}
 const exact=(a,b)=>S.norm(a)===S.norm(b);
 document.addEventListener('click',e=>{if(busy)return;const t=task();if(!t||!advancedKinds.has(t.kind))return;const i=idx(t);if(i==null)return;const target=e.target instanceof Element?e.target:null;if(!target)return,item=t.items[i];
  if(t.kind==='listen-participle'&&target.closest('#spListenCheck')){const v=String(document.getElementById('spListenInput')?.value||'').trim();if(!v)return;stop(e);return S.norm(v)===S.norm(item.answer)?right(t,i,[`listen:${i}`]):wrong(t,i)}
  if(t.kind==='grammar-parts'){const b=target.closest('[data-grammar-answer]');if(b){stop(e);return S.norm(b.dataset.grammarAnswer)===S.norm(item.answer)?right(t,i):wrong(t,i)}}
  if(t.kind==='sentence-order'&&target.closest('#spOrderCheck')){stop(e);const x=st(t),arr=Array.isArray(x.answers[`order:${i}`])?x.answers[`order:${i}`]:[],v=arr.map(y=>y.token).join(' '),accepted=[item.sentence,...(item.acceptedSentences||[])].filter(Boolean);return arr.length===(item.tokens||[]).length&&accepted.some(sentence=>exact(v,sentence))?right(t,i,[`order:${i}`]):wrong(t,i)}
  if(t.kind==='sentence-write'&&target.closest('#spSentenceCheck')){const v=document.getElementById('spSentenceInput')?.value||'';if(!String(v).trim())return;stop(e);return [item.answer,...(item.answers||[]),...(item.acceptedSentences||[])].filter(Boolean).some(a=>exact(v,a))?right(t,i,[`write:${i}`]):wrong(t,i)}
  if(t.kind==='rewrite-text'&&target.closest('#spRewriteCheck')){const v=document.getElementById('spRewrite')?.value||'';if(!String(v).trim())return;stop(e);return exact(v,item.perfect)?right(t,i,['rewrite']):wrong(t,i)}
  if(t.kind==='reading-sets'&&target.closest('#spReadCheck')){stop(e);const x=st(t),keys=[];let q=0,complete=true,ok=true;(item.tf||[]).forEach(([,answer])=>{const key=`read:${i}:${q++}`,v=String(x.answers[key]??'');keys.push(key);if(!v)complete=false;if(v!==String(answer))ok=false});(item.abc||[]).forEach(([,opts,answer])=>{const key=`read:${i}:${q++}`,v=String(x.answers[key]??'');keys.push(key);if(!v)complete=false;if(!exact(v,answer))ok=false});if(!complete)return;return ok?right(t,i,keys):wrong(t,i)}
 },true);
 if(root)new MutationObserver(queue).observe(root,{childList:true,subtree:true,characterData:true});const raw=window.L7.renderTaskPage.bind(window.L7);window.L7.renderTaskPage=function(th,taskId){const r=raw(th,taskId);queue();return r};window.L7.__l7t3HelpV3=true;queue();return true
}
window.L7T3HelpStandard={install};
})();