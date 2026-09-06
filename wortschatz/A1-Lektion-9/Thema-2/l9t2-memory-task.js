(function(){
'use strict';
const D=window.L9T2,root=document.getElementById('app');
const taskId=String(new URLSearchParams(location.search).get('task')||'');
if(!D||!root||taskId!=='memory')return;
const words=D.visualWords||[];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{const b=[...(a||[])];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
const store=preview()?sessionStorage:localStorage,key=`SP_L9_${pid()}_T2_memory`;
const valid=words.map(x=>'mem-'+x.id);
function read(){let s={done:[],memoryOrder:[]};try{s={...s,...JSON.parse(store.getItem(key)||'{}')}}catch(e){}s.done=[...new Set((s.done||[]).filter(x=>valid.includes(x)))];s.memoryOrder=(s.memoryOrder||[]).filter(id=>words.some(w=>w.id===id));if(s.memoryOrder.length!==words.length)s.memoryOrder=shuffle(words.map(x=>x.id));write(s,false);return s}
function write(s,emit=true){try{store.setItem(key,JSON.stringify(s));if(emit)window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{lesson:9,theme:2,task:'memory',state:s}}))}catch(e){}}
function label(w){return String(w?.full||w?.word||'')}
function groups(order){return[order.slice(0,8),order.slice(8,16),order.slice(16,22)]}
function currentGroupInfo(s){const gs=groups(s.memoryOrder);const index=gs.findIndex(g=>g.some(id=>!s.done.includes('mem-'+id)));return index<0?null:{index,group:gs[index]}}
function progress(s){return s.done.length}
function head(s){const p=Math.round(progress(s)/Math.max(1,words.length)*100);return`<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe 4</span><h1>Memory</h1><p>🧠 Finde Wort und Bild.</p></div><div class="l8-progress-row"><span>${progress(s)} von ${words.length} Wörtern fertig</span><strong>${p}%</strong></div><div class="l8-progress"><div style="width:${p}%"></div></div></section>`}
function finish(s){root.innerHTML=`<div class="l8-wrap">${preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Teilnehmerfortschritt wird nicht gespeichert.</div>':''}${head(s)}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast alle 22 Wörter im Memory bearbeitet.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="index.html">Zur Übersicht</a><a class="l8-btn primary" href="task.html?task=dialog-luecken">Weiter</a></div></section></div>`}
function visual(w){return w?.emoji?`<span class="l9t2-memory-emoji" role="img" aria-label="${esc(label(w))}">${esc(w.emoji)}</span>`:`<img src="${esc(w?.image||'')}" alt="" onerror="this.remove()">`}
function draw(){const s=read(),info=currentGroupInfo(s);if(!info)return finish(s);const group=info.group,pendingIds=group.filter(id=>!s.done.includes('mem-'+id));const roundWords=pendingIds.map(id=>words.find(w=>w.id===id)).filter(Boolean);const cards=shuffle(roundWords.flatMap(w=>[{k:w.id,t:'img',w},{k:w.id,t:'word',w}]));let open=[],matched=new Set(),locked=false;const roundNo=info.index+1;root.innerHTML=`<div class="l8-wrap">${preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Teilnehmerfortschritt wird nicht gespeichert.</div>':''}${head(s)}<section class="l8-card l8-exercise"><div class="l9t2-review-note">Runde ${roundNo} von 3 · Finde immer ein Bild oder Emoji und das passende Wort.</div><div class="l9t2-memory">${cards.map((c,i)=>`<button class="l9t2-memory-card" data-i="${i}" type="button"><span>?</span></button>`).join('')}</div><div id="feedback"></div></section><footer>© SprachPilot</footer></div>`;
 const btns=[...document.querySelectorAll('[data-i]')];
 function reveal(i,on){const b=btns[i],c=cards[i];if(!b)return;if(on){b.classList.add('open');b.innerHTML=c.t==='img'?visual(c.w):`<span class="l9t2-memory-word">${esc(label(c.w))}</span>`}else{b.classList.remove('open');b.innerHTML='<span>?</span>'}}
 btns.forEach((b,i)=>b.onclick=()=>{if(locked||matched.has(i)||open.includes(i))return;reveal(i,true);open.push(i);if(open.length<2)return;const[a,bx]=open;if(cards[a].k===cards[bx].k&&cards[a].t!==cards[bx].t){matched.add(a);matched.add(bx);btns[a].classList.add('matched');btns[bx].classList.add('matched');const st=read();const item='mem-'+cards[a].k;if(!st.done.includes(item))st.done.push(item);write(st);open=[];if(st.done.length>=words.length){setTimeout(()=>finish(st),500);return}if(matched.size===cards.length)setTimeout(draw,550)}else{locked=true;setTimeout(()=>{reveal(a,false);reveal(bx,false);open=[];locked=false},650)}});
 const style=document.createElement('style');style.textContent='.l9t2-memory-emoji{font-size:clamp(34px,11vw,72px);line-height:1}';document.head.appendChild(style);
 setTimeout(()=>window.SPTaskAutoScroll?.schedule?.(0,'auto'),20);
}
draw();
})();
