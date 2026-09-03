(function(){
'use strict';
if(window.__SP_L8T4_EXAM_SINGLE_ATTEMPT_20260903)return;
window.__SP_L8T4_EXAM_SINGLE_ATTEMPT_20260903=true;
const S=()=>window.L8S,T=()=>window.L8_THEME,themeNo=()=>Number(T()?.number||4);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=t=>S().load(themeNo(),t.id,t.items.length);
function shuffle(values,seedText){const a=[...(values||[])];let h=2166136261;for(const ch of String(seedText)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}for(let i=a.length-1;i>0;i--){h=(Math.imul(h,1664525)+1013904223)>>>0;const j=h%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function submit(task,item,idx,value,forced=null){
 if(!String(value||'').trim())return;
 const st=load(task);st.firstSeen=Array.isArray(st.firstSeen)?st.firstSeen:[];st.examResults=st.examResults&&typeof st.examResults==='object'?st.examResults:{};
 const seen=st.firstSeen.includes(idx),computed=forced===null?S().equal(value,item.answer):!!forced,ok=Object.prototype.hasOwnProperty.call(st.examResults,idx)?!!st.examResults[idx]:(seen?false:computed);
 if(!seen){st.firstSeen.push(idx);if(ok)st.firstCorrect=(Number(st.firstCorrect)||0)+1}
 st.answers=st.answers||{};st.answers[idx]=value;st.examResults[idx]=ok;
 if(!st.done.includes(idx))st.done.push(idx);
 st.queue=(st.queue||[]).filter(x=>Number(x)!==Number(idx));st.reviewQueue=(st.reviewQueue||[]).filter(x=>Number(x)!==Number(idx));
 st.current=null;if(st.review)delete st.review[idx];if(st.tries)delete st.tries[idx];
 S().save(themeNo(),task.id,st);render(task);
}
function finish(task){
 const st=load(task),score=Math.round((Number(st.firstCorrect)||0)/Math.max(1,st.total)*100),order=Array.isArray(st.examOrder)&&st.examOrder.length?st.examOrder:[...Array(task.items.length).keys()],res=st.examResults||{};
 const rows=order.map((idx,n)=>`<div class="sp-exam-result ${res[idx]===true?'ok':'no'}"><span>Frage ${n+1}</span><strong>${res[idx]===true?'✓ Richtig':'✕ Falsch'}</strong></div>`).join('');
 document.getElementById('app').innerHTML=`<div class="l8-wrap"><section class="l8-card sp-exam-finish"><div class="sp-exam-star">⭐</div><h2>Prüfung abgeschlossen</h2><div class="sp-exam-score">${score}%</div><div class="sp-exam-results">${rows}</div><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></section></div>`;
}
function render(task){
 const root=document.getElementById('app');if(!root)return false;
 let st=load(task);if(st.done.length>=task.items.length){finish(task);return true}
 const idx=S().nextIndex(themeNo(),task.id,task.items.length);if(idx==null){finish(task);return true}
 st=load(task);st.examOrder=Array.isArray(st.examOrder)?st.examOrder:[];if(!st.examOrder.includes(idx)){st.examOrder.push(idx);S().save(themeNo(),task.id,st,false);st=load(task)}
 const pos=st.examOrder.indexOf(idx)+1,item=task.items[idx],pct=Math.round(st.done.length/Math.max(1,task.items.length)*100);
 let answer='';
 if(item.type==='choice'){const opts=shuffle(item.options,`${task.id}|${idx}|${S().pid()}`);answer=`<div class="sp-exam-options">${opts.map(o=>`<button type="button" data-exam-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>`}
 else if(item.type==='free')answer=`<textarea class="l8-input sp-exam-free" id="spExamFree" placeholder="Antwort"></textarea><button class="l8-btn primary" id="spExamFreeNext" type="button">Weiter</button>`;
 else answer=`<div class="sp-exam-input"><input class="l8-input" id="spExamInput" autocomplete="off" placeholder="Antwort"><button class="l8-btn primary" id="spExamNext" type="button">Weiter</button></div>`;
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-exam-head"><div class="sp-exam-kicker">Prüfung</div><h1>⭐ Prüfung</h1><div class="sp-exam-progress"><span>Frage ${pos} von ${task.items.length}</span><strong>${pct}%</strong></div><div class="sp-exam-bar"><span style="width:${pct}%"></span></div></section><section class="l8-card sp-exam-card">${item.context?`<div class="sp-exam-context">${esc(item.context).replace(/\n/g,'<br>')}</div>`:''}${item.image?`<div class="sp-exam-image"><img src="${esc(item.image)}" alt=""></div>`:''}<div class="sp-exam-prompt">${esc(item.prompt)}</div>${answer}</section></div>`;
 root.querySelectorAll('[data-exam-answer]').forEach(b=>b.onclick=()=>submit(task,item,idx,b.dataset.examAnswer));
 const input=document.getElementById('spExamInput');document.getElementById('spExamNext')?.addEventListener('click',()=>submit(task,item,idx,input?.value||''));input?.addEventListener('keydown',e=>{if(e.key==='Enter')submit(task,item,idx,e.target.value)});
 document.getElementById('spExamFreeNext')?.addEventListener('click',()=>{const text=String(document.getElementById('spExamFree')?.value||'').trim(),sent=text.split(/[.!?]+/).map(x=>x.trim()).filter(Boolean);if(sent.length<Number(item.min||3))return;submit(task,item,idx,text,true)});
 return true;
}
function install(){if(!window.L8UI)return false;const raw=window.L8UI.taskPage.bind(window.L8UI);window.L8UI.taskPage=function(){const id=new URLSearchParams(location.search).get('task'),task=(T()?.tasks||[]).find(t=>String(t?.id)===String(id));if(task?.spL8T4ExamFinal)return render(task);return raw()};return true}
const style=document.createElement('style');style.textContent=`.sp-exam-kicker{font-weight:900;color:var(--muted);text-transform:uppercase}.sp-exam-head h1{margin:5px 0}.sp-exam-progress{display:flex;justify-content:space-between;font-weight:850;margin-top:12px}.sp-exam-bar{height:9px;background:#ececf2;border-radius:999px;overflow:hidden;margin-top:6px}.sp-exam-bar span{display:block;height:100%;background:var(--lesson-main,var(--l8-main,#68539b))}.sp-exam-card{margin-top:16px}.sp-exam-context{padding:14px;border-radius:14px;background:var(--lesson-soft,var(--l8-soft,#f3effa));line-height:1.55;margin-bottom:14px}.sp-exam-image{width:min(300px,70vw);aspect-ratio:1;margin:0 auto 15px}.sp-exam-image img{width:100%;height:100%;object-fit:contain}.sp-exam-prompt{font-size:21px;font-weight:900;margin:10px 0 15px}.sp-exam-input{display:grid;grid-template-columns:1fr auto;gap:10px}.sp-exam-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.sp-exam-options button{border:2px solid var(--lesson-line,var(--l8-line,#ddd));background:#fff;border-radius:13px;padding:12px;font:inherit;font-weight:850}.sp-exam-free{min-height:150px;margin-bottom:10px}.sp-exam-finish{text-align:center}.sp-exam-star{font-size:48px}.sp-exam-score{font-size:42px;font-weight:950;margin:10px 0 18px}.sp-exam-results{max-width:620px;margin:0 auto 22px;display:grid;gap:8px}.sp-exam-result{display:flex;justify-content:space-between;padding:11px 14px;border-radius:12px}.sp-exam-result.ok{background:#edf8ef}.sp-exam-result.no{background:#fff0f0}.sp-exam-result.ok strong{color:#24713a}.sp-exam-result.no strong{color:#a12b2b}@media(max-width:640px){.sp-exam-options,.sp-exam-input{grid-template-columns:1fr}}`;document.head.appendChild(style);
window.L8T4ExamSingleAttempt20260903={install,render};
})();