import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L11T1||{cards:[],tasks:[]};
const M=window.L11T1SourceMode;
const root=document.getElementById('app');
const task=D.tasks.find(t=>t.id==='memory')||{id:'memory',title:'Memory: Bild und Wort',icon:'🧠',cardText:'Finde die passenden Paare aus Bild und Wort.'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const activeCards=()=>M?.activeCards?.()||D.cards||[];
const progressKey='SP_L11_T1_memory';

function frame(){
 const idx=Math.max(0,(D.tasks||[]).findIndex(t=>t.id==='memory'));
 root.innerHTML=`<div class="l10-theme-page">${renderSpHeader({subtitle:`${task.title} · A1 Lektion 11 · Thema 1`,color:{main:'#F6D78B',dark:'#A88633',soft:'#FDF8EC',line:'#F3E2B7'}})}<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${idx+1}</span><h1>${esc(task.title)}</h1><p>${esc(task.icon||'🧠')} ${esc(task.cardText||'Finde die passenden Paare aus Bild und Wort.')}</p></div><div class="l8-progress-row"><span>Aufgabe</span><strong>0%</strong></div><div class="l8-progress"><div style="width:0%"></div></div></section><div id="exercise"></div></div></div>`;
 bindSpHeader(root);
 document.querySelectorAll('.sp-header__nav-link').forEach(a=>{if(String(a.textContent||'').trim()==='Übersicht')a.href='uebersicht.html'});
}
function setProgress(done,total){const p=Math.round(done/Math.max(1,total)*100),strong=document.querySelector('.l8-progress-row strong'),bar=document.querySelector('.l8-progress>div');if(strong)strong.textContent=p+'%';if(bar)bar.style.width=p+'%'}
async function markDone(total){
 try{localStorage.setItem(progressKey,'100');localStorage.setItem(progressKey+'_book','100');localStorage.setItem(progressKey+'_all','100');localStorage.setItem('SP_L11_LAST_TASK_T1','memory');sessionStorage.setItem('SP_L11_LAST_TASK_T1','memory')}catch(e){}
 try{
  await import('/js/progress.js?v=20260831-central6');
  const api=window.SPProgress;
  const run=Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_wortschatz-a1-lektion-11-thema-1')||1)||1));
  await api?.recordTaskProgress?.({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:11,theme:1,topic:'wortschatz-a1-lektion-11-thema-1',topicId:'wortschatz-a1-lektion-11-thema-1',title:'A1 Lektion 11 · Thema 1',file:'task.html?task=memory',taskKey:'memory',taskTitle:task.title,run,done:total,total,percent:100,completed:true});
 }catch(e){console.warn('L11T1 memory progress sync',e)}
}
function finish(total){setProgress(total,total);markDone(total);document.querySelector('#exercise').innerHTML=`<section class="l8-card l8-card-stage"><h2>Gut gemacht!</h2><p>Du hast alle ${total} Paare gefunden.</p><div class="l11-controls"><a class="l11-btn primary" href="index.html">Zur Themenübersicht</a><button class="l11-btn" type="button" id="memoryAgain">Noch einmal</button></div></section>`;document.querySelector('#memoryAgain').onclick=()=>location.reload()}

const pool=activeCards().filter(w=>w?.image&&!['erste','zweite','dritte','vierte','in_der_naehe','flugzeug'].includes(String(w.id||'').toLowerCase()));
const pairs=shuffle(pool).slice(0,Math.min(8,pool.length));
const deck=shuffle(pairs.flatMap(w=>[{key:w.id,type:'image',w},{key:w.id,type:'word',w}]));
let first=null,lock=false,matched=new Set(),moves=0;

function render(){
 if(matched.size>=pairs.length)return finish(pairs.length);
 setProgress(matched.size,pairs.length);
 document.querySelector('#exercise').innerHTML=`<section class="l8-card l10-memory-wrap"><div class="l11-memory-head"><strong>${matched.size} / ${pairs.length} Paare</strong><span>${moves} Versuche</span></div><div class="l10-memory-grid">${deck.map((c,i)=>`<button class="l10-memory-card ${matched.has(c.key)?'matched':''}" data-memory="${i}" ${matched.has(c.key)?'disabled':''}><span class="memory-cover">?</span><span class="memory-content" hidden>${c.type==='image'?`<img src="${esc(c.w.image)}" alt="">`:`<b>${esc(c.w.full)}</b>`}</span></button>`).join('')}</div></section>`;
 document.querySelectorAll('[data-memory]').forEach(btn=>btn.onclick=()=>{if(lock||btn.classList.contains('open'))return;const idx=Number(btn.dataset.memory),card=deck[idx];btn.classList.add('open');btn.querySelector('.memory-cover').hidden=true;btn.querySelector('.memory-content').hidden=false;if(first===null){first={idx,card,btn};return}moves++;if(first.card.key===card.key&&first.card.type!==card.type){matched.add(card.key);first=null;if(matched.size===pairs.length)setTimeout(()=>finish(pairs.length),450);else setTimeout(render,350)}else{lock=true;setTimeout(()=>{first=null;lock=false;render()},850)}});
}

frame();
render();
