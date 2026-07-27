(function(){
'use strict';
const S=window.L7S,theme=1,id='hoeren-erkennen',root=document.getElementById('app');
if(!S||!root)return;
const task=S.task(id);
if(!task){root.innerHTML='<section class="l7-card"><h2>Aufgabe nicht gefunden</h2></section>';return}
const CDN='https://sprachpilot.b-cdn.net/';
const choiceIndexes=task.items.map((item,index)=>item.phase==='choice'?index:-1).filter(index=>index>=0);
const produceIndexes=task.items.map((item,index)=>item.phase==='produce'?index:-1).filter(index=>index>=0);
let selected='',writeOpen=false;
const esc=S.esc;
function accepted(item){return[item.answer,...(item.answers||[])].filter(Boolean)}
function normalize(){
 const state=S.load(theme,id,task.items.length),choiceComplete=choiceIndexes.every(index=>state.done.includes(index)),allowed=choiceComplete?produceIndexes:choiceIndexes;
 if(state.current!=null&&!allowed.includes(state.current)){state.current=null;state.tries=0;state.hadWrong=false}
 const validQueue=state.queue.length&&state.queue.every(index=>allowed.includes(index)&&!state.done.includes(index));
 if(!validQueue)state.queue=S.shuffle(allowed.filter(index=>!state.done.includes(index)));
 S.save(theme,id,state,false);return state
}
function phaseInfo(state){const choiceDone=choiceIndexes.filter(index=>state.done.includes(index)).length;return choiceDone>=choiceIndexes.length?{number:2,text:'Höre dieselben Geräusche noch einmal. Sprich oder schreibe die Aktivität.'}:{number:1,text:'Höre das Geräusch und wähle die passende Aktivität.'}}
function help(item,tries){if(tries===1)return'<div class="l7-no">Noch nicht richtig. Höre noch einmal.</div>';if(tries===2)return'<div class="l7-hint">Achte auf das typische Geräusch der Aktivität.</div>';if(tries>=3)return`<div class="l7-no"><strong>Lösung:</strong> ${esc(item.answer)}<br>Die Aufgabe kommt später erneut.</div>`;return''}
function audio(item){return`<div class="sound-audio"><audio controls preload="metadata" src="${CDN+encodeURIComponent(item.audioFile)}"></audio><p class="small">Du kannst das Geräusch mehrmals hören.</p></div>`}
function progress(state){const percent=Math.round(state.done.length/task.items.length*100);return`<div class="l7-progress-row"><span>${state.done.length} fehlerfrei · ${task.items.length-state.done.length} übrig</span><strong>${percent}%</strong></div><div class="l7-progress"><span style="width:${percent}%"></span></div>`}
function render(){
 normalize();const state=S.load(theme,id,task.items.length);
 if(state.done.length>=task.items.length)return finish();
 const index=S.index(theme,id,task.items.length),item=task.items[index],phase=phaseInfo(state);selected='';writeOpen=false;
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}${S.preview()?'<div class="l7-preview">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}<section class="l7-card">${progress(state)}<div class="l7-instruction">${esc(phase.text)}</div><div class="phase-box"><b>Phase ${phase.number} von 2</b></div><div class="l7-question-card">${audio(item)}<h2>${esc(item.prompt)}</h2>${phase.number===1?choiceBody(item):produceBody()}<div id="feedback">${help(item,state.tries||0)}</div><div id="technical"></div></div></section><footer>© SprachPilot</footer></div>`;
 bind(item,phase.number)
}
function choiceBody(item){return`<div class="l7-options">${S.shuffle(item.options||[]).map(option=>`<button type="button" data-choice="${esc(option)}">${esc(option)}</button>`).join('')}</div><div class="l7-actions"><button class="l7-btn" type="button" data-action="check-choice">Kontrollieren</button></div>`}
function produceBody(){return`<div class="l7-actions"><button class="l7-btn" type="button" data-action="mic">🎤 Sprechen</button><button class="l7-btn secondary" type="button" data-action="write">✍️ Schreiben</button></div><div id="writeBox" class="l7-answer-box" hidden><label for="answerInput">Aktivität schreiben</label><div><input id="answerInput" autocomplete="off"><button class="l7-btn" type="button" data-action="check-input">Kontrollieren</button></div></div>`}
function bind(item,phase){
 root.onclick=event=>{const button=event.target.closest('button');if(!button)return;if(button.dataset.choice!==undefined){selected=button.dataset.choice;root.querySelectorAll('[data-choice]').forEach(option=>option.classList.toggle('selected',option===button));return}const action=button.dataset.action;if(action==='check-choice')return check(item,selected);if(action==='write'){writeOpen=true;const box=document.getElementById('writeBox');if(box)box.hidden=false;document.getElementById('answerInput')?.focus();return}if(action==='check-input')return check(item,document.getElementById('answerInput')?.value||'');if(action==='mic')return S.mic(item,alternatives=>{const exact=alternatives.find(value=>accepted(item).some(answer=>S.norm(answer)===S.norm(value)));check(item,exact||alternatives[0]||'')},technical)};
 document.getElementById('answerInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')check(item,event.target.value)})
}
function technical(message){const target=document.getElementById('technical');if(target)target.innerHTML=`<div class="l7-hint">${esc(message)}</div>`}
function check(item,value){
 if(!String(value||'').trim())return;const state=S.load(theme,id,task.items.length),index=state.current,correct=accepted(item).some(answer=>S.norm(answer)===S.norm(value));
 S.attempt(theme,id,task.items.length,index,correct);
 if(correct){S.right(theme,id,task.items.length);root.querySelectorAll('button,input,audio').forEach(element=>element.disabled=true);document.getElementById('feedback').innerHTML='<div class="l7-ok">Richtig.</div>';setTimeout(render,550);return}
 S.wrong(theme,id,task.items.length);render()
}
function finish(){root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Geräusche erkannt und die Aktivitäten selbst genannt.</p><div class="l7-actions"><a class="l7-btn" href="index.html#task-${id}">Zur Themenübersicht</a></div></section></div>`}
render();
})();
