(function(){
'use strict';
const taskId=String(new URLSearchParams(location.search).get('task')||'');
if(taskId!=='imperativ-tabelle')return;
const D=window.L9T2;if(!D)return;
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function store(){return preview()?sessionStorage:localStorage}
function state(){try{return JSON.parse(store().getItem(`SP_L9_${pid()}_T2_imperativ-tabelle`)||'{}')}catch(e){return{}}}
function accepted(row,field,value){const all=[row[field],...(row[field+'Answers']||[])];return all.some(x=>norm(x)===norm(value))}
function fieldName(field){return field==='sie'?'Sie':field}
function specificHint(row,field){
 if(row.id==='t06'){
  if(field==='du')return 'Nur die du-Form ist falsch. Beginne mit „Bezahl …“ oder „Bezahle …“. Danach kommt „an der Kasse“.';
  if(field==='ihr')return 'Nur die ihr-Form ist falsch. Die Verbform lautet „Bezahlt …“.';
  return 'Nur die Sie-Form ist falsch. Bei Sie steht: „Bezahlen Sie …“.';
 }
 if(field==='du')return 'Prüfe nur die du-Form. Das Pronomen „du“ steht im Imperativ nicht im Satz.';
 if(field==='ihr')return 'Prüfe nur die ihr-Form. Nimm die ihr-Verbform ohne das Pronomen „ihr“.';
 return 'Prüfe nur die Sie-Form. Bei Sie steht das Verb vor „Sie“.';
}
function addStatus(row,field,input,tries){
 const fb=document.getElementById(`fb-${row.id}-${field}`);if(!fb||!input)return;
 const ok=accepted(row,field,input.value||'');
 input.setAttribute('aria-invalid',ok?'false':'true');
 if(ok){fb.innerHTML='<span class="l8-feedback good">✓ Richtig</span>';return true}
 let text='';
 if(tries<=1)text=`✗ ${fieldName(field)}: Hier ist noch ein Fehler. Prüfe nur dieses Feld.`;
 else if(tries===2)text=specificHint(row,field);
 else text=`Richtig ist: ${row[field]}`;
 fb.innerHTML=`<span class="l8-feedback ${tries>=2?'warn':'bad'}">${text}</span>`;
 return false;
}
function persistentNote(){
 let note=document.getElementById('spTask8PersistentHelp');
 if(!note){note=document.createElement('div');note.id='spTask8PersistentHelp';note.className='l9t2-review-note';note.textContent='Die Hinweise bleiben sichtbar. Korrigiere nur die markierten Felder und prüfe die Tabelle danach erneut.';document.getElementById('checkTable')?.closest('.l8-row')?.insertAdjacentElement('afterend',note)}
}
function patch(){
 const btn=document.getElementById('checkTable');
 if(!btn||btn.dataset.spPersistentHelp==='1'||typeof btn.onclick!=='function')return;
 const original=btn.onclick;
 btn.dataset.spPersistentHelp='1';
 btn.onclick=function(ev){
  const activeInputs=[...document.querySelectorAll('input[data-row][data-field]:not(:disabled)')];
  const rowIds=[...new Set(activeInputs.map(x=>x.dataset.row))];
  const rows=rowIds.map(id=>(D.imperativeTable||[]).find(r=>r.id===id)).filter(Boolean);
  const allCorrectBefore=rows.length>0&&rows.every(r=>['du','ihr','sie'].every(f=>{const inp=document.querySelector(`input[data-row="${r.id}"][data-field="${f}"]:not(:disabled)`);return !inp||accepted(r,f,inp.value||'')}));
  const realSetTimeout=window.setTimeout;
  window.setTimeout=function(fn,delay,...args){if(Number(delay)===550)return 0;return realSetTimeout.call(window,fn,delay,...args)};
  try{original.call(btn,ev)}finally{window.setTimeout=realSetTimeout}
  const st=state();
  rows.forEach(r=>{const tries=Number(st.wrong?.[r.id]||0);['du','ihr','sie'].forEach(f=>{const inp=document.querySelector(`input[data-row="${r.id}"][data-field="${f}"]`);if(inp)addStatus(r,f,inp,tries)})});
  if(!allCorrectBefore){persistentNote();return}
  realSetTimeout(()=>location.reload(),1200);
 };
}
const observer=new MutationObserver(patch);observer.observe(document.documentElement,{childList:true,subtree:true});
patch();
setTimeout(patch,100);setTimeout(patch,400);setTimeout(patch,900);
})();
