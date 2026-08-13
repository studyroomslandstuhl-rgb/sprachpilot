(function(){
'use strict';
if(window.__SP_L7T1_SMS_MODAL_UI_2)return;
window.__SP_L7T1_SMS_MODAL_UI_2=true;
if(!window.L7||!window.L7S)return;

const S=window.L7S;
const originalRender=window.L7.renderTaskPage;

function esc(value){return S.esc(value)}
function answerKey(index,field){return`sms:${index}:${field}`}
function stateFor(theme,task,total){return S.load(theme,task.id,total)}
function getAnswer(state,index,field){return String(state.answers?.[answerKey(index,field)]||'')}
function saveAnswer(theme,task,total,index,field,value){const state=stateFor(theme,task,total);state.answers=state.answers||{};const key=answerKey(index,field);if(value)state.answers[key]=value;else delete state.answers[key];S.save(theme,task.id,state,false)}
function clearAnswers(theme,task,total,index){const state=stateFor(theme,task,total);state.answers=state.answers||{};delete state.answers[answerKey(index,'rf')];delete state.answers[answerKey(index,'abc')];S.save(theme,task.id,state,false)}
function progressHtml(theme,task,total){const state=stateFor(theme,task,total);const percent=Math.round(state.done.length/Math.max(1,total)*100);return `<div class="l7-progress-row"><span>${state.done.length} fehlerfrei · ${total-state.done.length} übrig</span><strong>${percent}%</strong></div><div class="l7-progress"><span style="width:${percent}%"></span></div>`}
function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(item=>item.id===task.id)+1]||null}
function finish(theme,task){const root=document.getElementById('app'),next=nextTask(task);root.innerHTML=`<div class="l7-page"><section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
function messagesHtml(messages){return `<div class="sp-sms-phone"><div class="sp-sms-screen">${(messages||[]).map(([speaker,text,side])=>`<div class="sp-sms-row ${side==='right'?'right':'left'}"><div class="sp-sms-name">${esc(speaker)}</div><div class="sp-sms-bubble">${esc(text)}</div></div>`).join('')}</div></div>`}
function rfHtml(item,selected){return `<section class="sp-sms-question"><div class="sp-sms-question-type">Richtig oder falsch?</div><h2>${esc(item.trueFalsePrompt)}</h2><div class="sp-sms-options two">${(item.trueFalseOptions||['Richtig','Falsch']).map(option=>`<button type="button" class="${selected===option?'selected':''}" data-sms-rf="${esc(option)}">${esc(option)}</button>`).join('')}</div></section>`}
function abcHtml(item,selected){const options=S.shuffle([...(item.abcOptions||[])]);return `<section class="sp-sms-question"><div class="sp-sms-question-type">A, B oder C?</div><h2>${esc(item.abcPrompt)}</h2><div class="sp-sms-options abc">${options.map((option,index)=>`<button type="button" class="${selected===option?'selected':''}" data-sms-abc="${esc(option)}"><span class="sp-sms-letter">${String.fromCharCode(65+index)}</span><span>${esc(option)}</span></button>`).join('')}</div></section>`}
function renderSms(theme,id){
 theme=Number(theme);const task=S.task(id);if(!task)return originalRender(theme,id);
 const total=Math.max(1,task.items?.length||0);let state=stateFor(theme,task,total);if(state.done.length>=total)return finish(theme,task);
 const index=S.index(theme,task.id,total);state=stateFor(theme,task,total);const item=task.items?.[index]||{};
 const selectedRf=getAnswer(state,index,'rf'),selectedAbc=getAnswer(state,index,'abc'),wrong=state.tries?'<div class="l7-no">Noch nicht richtig.</div>':'';
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page"><section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description)}</div><div id="spSmsTask" class="l7-question-card sp-sms-task">${messagesHtml(item.messages)}${rfHtml(item,selectedRf)}${abcHtml(item,selectedAbc)}<div class="l7-actions"><button type="button" class="l7-btn" id="spCheckSms">Kontrollieren</button></div><div id="spSmsFeedback">${wrong}</div></div></section><footer>© SprachPilot</footer></div>`;
 document.querySelectorAll('[data-sms-rf]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.smsRf||'';saveAnswer(theme,task,total,index,'rf',value);document.querySelectorAll('[data-sms-rf]').forEach(node=>node.classList.toggle('selected',node===button))}));
 document.querySelectorAll('[data-sms-abc]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.smsAbc||'';saveAnswer(theme,task,total,index,'abc',value);document.querySelectorAll('[data-sms-abc]').forEach(node=>node.classList.toggle('selected',node===button))}));
 document.getElementById('spCheckSms')?.addEventListener('click',()=>{const now=stateFor(theme,task,total),rf=getAnswer(now,index,'rf'),abc=getAnswer(now,index,'abc');if(!rf||!abc)return;const ok=S.norm(rf)===S.norm(item.trueFalseAnswer)&&S.norm(abc)===S.norm(item.abcAnswer);S.attempt(theme,task.id,total,index,ok);if(!ok){S.wrong(theme,task.id,total);return renderSms(theme,id)}clearAnswers(theme,task,total,index);S.right(theme,task.id,total);const feedback=document.getElementById('spSmsFeedback');if(feedback)feedback.innerHTML='<div class="l7-ok">Richtig.</div>';document.querySelectorAll('#spSmsTask button').forEach(node=>node.disabled=true);setTimeout(()=>renderSms(theme,id),650)});
 window.L7T1L6Layout?.run?.();
}

function examRun(theme){return Math.min(3,Math.max(1,Number(localStorage.getItem(`SP_SCORE_RUN_wortschatz-a1-lektion-7-thema-${theme}`)||1)||1))}
function examKey(theme){return`SP_L7_T${theme}_STANDARD_EXAM_V1_R${examRun(theme)}`}
function emptyExam(){return{index:0,correct:0,selected:'',checked:false,orders:{}}}
function loadExam(theme,total){try{const state=JSON.parse(localStorage.getItem(examKey(theme))||'null');if(state&&Number.isInteger(state.index)&&state.total===total)return{...emptyExam(),...state}}catch(e){}return{...emptyExam(),total}}
function saveExam(theme,state){try{localStorage.setItem(examKey(theme),JSON.stringify(state))}catch(e){}}
function examOptions(state,index,item){const key=String(index),saved=state.orders?.[key];if(Array.isArray(saved)&&saved.length===item.options.length&&saved.every(option=>item.options.includes(option)))return saved;state.orders=state.orders||{};state.orders[key]=S.shuffle([...(item.options||[])]);return state.orders[key]}
function finishExam(theme,task,state){
 const total=task.items.length,percent=Math.round(state.correct/Math.max(1,total)*100);
 const canonical={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false,firstSeen:[...Array(total).keys()],firstCorrect:state.correct,answers:{}};
 S.save(theme,task.id,canonical,true);
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page"><section class="l7-card l7-finish sp-exam-result"><div class="sp-exam-star">⭐</div><h2>Prüfung abgeschlossen</h2><div class="sp-exam-score">${percent}%</div><p>${state.correct} von ${total} Antworten waren richtig.</p><a class="l7-btn" href="index.html#task-${esc(task.id)}">Zur Themenübersicht</a></section><footer>© SprachPilot</footer></div>`;
}
function renderExam(theme,id){
 theme=Number(theme);const task=S.task(id);if(!task||!task.exam)return originalRender(theme,id);
 const root=document.getElementById('app');
 if(!S.allDone(theme)){root.innerHTML=`<div class="l7-page"><section class="l7-card l7-finish"><div>🔒</div><h2>Prüfung gesperrt</h2><p>Schließe zuerst alle Lernaufgaben mit 100% ab.</p><a class="l7-btn" href="index.html#task-${esc(task.id)}">Zur Themenübersicht</a></section></div>`;return}
 const total=task.items?.length||0;let state=loadExam(theme,total);if(state.index>=total)return finishExam(theme,task,state);
 const item=task.items[state.index],options=examOptions(state,state.index,item),percent=Math.round(state.index/Math.max(1,total)*100);saveExam(theme,state);
 root.innerHTML=`<div class="l7-page"><section class="l7-card sp-standard-exam"><div class="sp-exam-top"><div><span>Versuch ${examRun(theme)} von 3</span><h1>Prüfung</h1></div><div class="sp-exam-count">${state.index+1} / ${total}</div></div><div class="l7-progress"><span style="width:${percent}%"></span></div><div class="l7-question-card sp-exam-question"><div class="sp-exam-type">${esc(item.examType||'Aufgabe')}</div><h2>${esc(item.prompt)}</h2><div class="sp-exam-options">${options.map((option,index)=>{const selected=state.selected===option?' selected':'',result=state.checked?(S.norm(option)===S.norm(item.answer)?' correct':state.selected===option?' wrong':''):'';return `<button type="button" class="sp-exam-option${selected}${result}" data-exam-option="${esc(option)}" ${state.checked?'disabled':''}><span>${String.fromCharCode(65+index)}</span><b>${esc(option)}</b></button>`}).join('')}</div><div class="sp-exam-feedback ${state.checked?(S.norm(state.selected)===S.norm(item.answer)?'ok':'bad'):''}">${state.checked?(S.norm(state.selected)===S.norm(item.answer)?'Richtig.':`Nicht richtig. Lösung: ${esc(item.answer)}`):''}</div><div class="l7-actions"><button type="button" class="l7-btn" id="spExamAction" ${!state.selected?'disabled':''}>${state.checked?'Weiter':'Kontrollieren'}</button></div></div></section><footer>© SprachPilot</footer></div>`;
 document.querySelectorAll('[data-exam-option]').forEach(button=>button.addEventListener('click',()=>{if(state.checked)return;state.selected=button.dataset.examOption||'';saveExam(theme,state);renderExam(theme,id)}));
 document.getElementById('spExamAction')?.addEventListener('click',()=>{if(!state.selected)return;if(!state.checked){state.checked=true;if(S.norm(state.selected)===S.norm(item.answer))state.correct++;saveExam(theme,state);return renderExam(theme,id)}state.index++;state.selected='';state.checked=false;saveExam(theme,state);renderExam(theme,id)});
 window.L7T1L6Layout?.run?.();
}

const style=document.createElement('style');
style.id='sp-l7t1-sms-modal-style';
style.textContent=`
.sp-sms-task{gap:22px}.sp-sms-phone{width:min(560px,100%);margin:0 auto;border:2px solid var(--line);border-radius:28px;background:#fff;padding:12px;box-shadow:0 10px 30px rgba(40,30,65,.08)}.sp-sms-screen{background:var(--soft);border-radius:20px;padding:18px;display:grid;gap:12px}.sp-sms-row{display:flex;flex-direction:column;align-items:flex-start;max-width:82%}.sp-sms-row.right{justify-self:end;align-items:flex-end}.sp-sms-name{font-size:12px;font-weight:900;color:var(--muted);margin:0 8px 4px}.sp-sms-bubble{padding:11px 14px;border-radius:18px 18px 18px 5px;background:#fff;border:1px solid var(--line);color:var(--dark);font-size:17px;line-height:1.4}.sp-sms-row.right .sp-sms-bubble{border-radius:18px 18px 5px 18px;background:#ede6f7}.sp-sms-question{width:min(820px,100%);margin:0 auto;padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff}.sp-sms-question-type,.sp-exam-type{font-size:13px;font-weight:950;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin-bottom:7px}.sp-sms-question h2{margin:0 0 14px;color:var(--dark);font-size:clamp(18px,2.4vw,23px);line-height:1.35}.sp-sms-options,.sp-exam-options{display:grid;gap:10px}.sp-sms-options.two{grid-template-columns:repeat(2,minmax(0,1fr))}.sp-sms-options button,.sp-exam-option{width:100%;border:2px solid var(--line);border-radius:14px;background:#fff;color:var(--dark);padding:12px 14px;font:inherit;font-weight:850;text-align:left;cursor:pointer}.sp-sms-options.two button{text-align:center}.sp-sms-options button.selected,.sp-exam-option.selected{border-color:var(--dark);background:#ede6f7}.sp-sms-options.abc button,.sp-exam-option{display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center}.sp-sms-letter,.sp-exam-option>span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--soft);font-weight:950}.sp-standard-exam{max-width:920px;margin:auto}.sp-exam-top{display:flex;justify-content:space-between;gap:16px;align-items:end;margin-bottom:14px}.sp-exam-top span{font-weight:850;color:var(--muted)}.sp-exam-top h1{margin:4px 0 0;color:var(--dark)}.sp-exam-count{font-size:20px;font-weight:950;color:var(--dark)}.sp-exam-question{margin-top:18px;min-height:480px}.sp-exam-option.correct{border-color:#2d8a55;background:#effcf4}.sp-exam-option.wrong{border-color:#c44747;background:#fff2f2}.sp-exam-feedback{min-height:46px;margin-top:14px;padding:12px 14px;border-radius:12px;font-weight:850}.sp-exam-feedback.ok{background:#effcf4}.sp-exam-feedback.bad{background:#fff2f2}.sp-exam-result{text-align:center}.sp-exam-star{font-size:58px}.sp-exam-score{font-size:48px;font-weight:950;color:var(--dark);margin:10px 0}@media(max-width:620px){.sp-sms-phone{padding:8px;border-radius:22px}.sp-sms-screen{padding:13px}.sp-sms-row{max-width:90%}.sp-sms-bubble{font-size:16px}.sp-sms-question{padding:14px}.sp-sms-options.two{grid-template-columns:1fr}.sp-exam-top{align-items:flex-start}.sp-exam-question{min-height:auto}.sp-exam-option{grid-template-columns:30px 1fr}}
`;
document.head.appendChild(style);

window.L7.renderTaskPage=function(theme,id){const task=S.task(id);if(id==='sms-modalverben')return renderSms(theme,id);if(task?.exam)return renderExam(theme,id);return originalRender(theme,id)};
})();