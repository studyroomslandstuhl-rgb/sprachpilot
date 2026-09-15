import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';
const D=window.L11T1||{tasks:[],cards:[]};
const root=document.getElementById('app');
const practice=D.tasks.filter(t=>!t.exam),exam=D.tasks.find(t=>t.exam);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=id=>'SP_L11_T1_'+id;
function pct(id){try{return Number(localStorage.getItem(key(id))||0)||0}catch(e){return 0}}
function teacher(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].includes(r)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function card(t,i,open){const p=teacher()?0:pct(t.id),locked=t.exam&&!open&&!teacher();if(locked)return `<div class="l11-card l11-task locked"><div>${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.cardText)}</p><div class="start">Prüfung gesperrt</div></div>`;const href=t.id==='uebersicht'?'uebersicht.html':`task.html?task=${encodeURIComponent(t.id)}`;return `<a class="l11-card l11-task" href="${href}"><div>${i+1}. ${esc(t.title)}</div><div class="emoji">${esc(t.icon)}</div><p>${esc(t.cardText)}</p><div class="l11-progress"><div style="width:${p}%"></div></div><div class="l11-small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}
const done=practice.filter(t=>t.id==='uebersicht'||pct(t.id)>=100).length;
const open=practice.every(t=>t.id==='uebersicht'||pct(t.id)>=100);
const avg=Math.round(practice.reduce((s,t)=>s+(t.id==='uebersicht'?100:pct(t.id)),0)/Math.max(1,practice.length));
const header=renderSpHeader({subtitle:'Orte in der Stadt und Orientierung · A1 Lektion 11 · Thema 1',color:{main:'#F6D78B',dark:'#A88633',soft:'#FDF8EC',line:'#F3E2B7'}});
root.innerHTML=`${header}<div class="l11-wrap"><section class="l11-card"><h2>Dein Fortschritt</h2><div class="l11-progress"><div style="width:${avg}%"></div></div><p class="l11-small">${done} / ${practice.length} Bereiche abgeschlossen</p><div class="l11-tags"><span class="l11-tag">${D.cards.length} Wörter</span><span class="l11-tag">Orte</span><span class="l11-tag">Wegbeschreibung</span></div></section><section class="l11-grid">${practice.map((t,i)=>card(t,i,open)).join('')}</section>${exam?`<section class="l11-grid">${card(exam,practice.length,open)}</section>`:''}</div>`;
bindSpHeader(root);
document.querySelectorAll('.sp-header__nav-link').forEach(a=>{if(String(a.textContent||'').trim()==='Übersicht')a.href='uebersicht.html'});