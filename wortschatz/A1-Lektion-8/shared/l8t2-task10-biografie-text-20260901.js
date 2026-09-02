(function(){
'use strict';
if(window.__SP_L8T2_TASK10_BIOGRAFIE_FORM_20260902)return;
window.__SP_L8T2_TASK10_BIOGRAFIE_FORM_20260902=true;

const FIELDS=[
 ['Name','Elena Markovic'],
 ['Geburtsjahr','1995'],
 ['Geburtsort','Belgrad'],
 ['Wohnort','Köln'],
 ['Deutschland','seit 9 Jahren'],
 ['Ausbildung','Köchin'],
 ['Ausbildung angefangen','vor 6 Jahren'],
 ['Dauer der Ausbildung','3 Jahre'],
 ['Arbeit','Restaurant in Köln · seit 3 Jahren']
];

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>t?.id==='biografie-schreiben');
 if(!task)return theme;
 task.title='Biografie schreiben';
 task.instruction='Schreibe aus den Angaben eine kurze Biografie.';
 task.kind='free';task.icon='✍️';task.emoji='✍️';
 task.items=[{
  type:'free',min:4,
  prompt:'Schreibe einen zusammenhängenden Text. Du darfst die Reihenfolge ändern und mehrere Angaben in einem Satz verbinden.',
  context:FIELDS.map(([label,value])=>`${label}: ${value}`).join('\n'),
  formFields:FIELDS.map(([label,value])=>({label,value}))
 }];
 theme.contentRevision='l8t2-biography-form-write-20260902-v1';
 return theme;
}

const plain=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/\s+/g,' ').trim();
function validate(raw){
 const t=plain(raw),errors=[];
 if(!(t.includes('elena')&&t.includes('markovic')))errors.push('Name: Elena Markovic fehlt.');
 if(!(t.includes('1995')&&t.includes('belgrad')&&/geboren/.test(t)))errors.push('Geburt: Verbinde 1995 und Belgrad mit „geboren“.');
 if(!(t.includes('koln')&&(/wohnt|lebt|wohnort/.test(t))))errors.push('Wohnort: Schreibe, dass Elena in Köln wohnt.');
 if(!(t.includes('deutschland')&&/seit (9|neun) jahren/.test(t)))errors.push('Deutschland: Nutze „seit neun Jahren“ oder „seit 9 Jahren“.');
 if(!(t.includes('ausbildung')&&/koch(in)?/.test(t)))errors.push('Ausbildung: Schreibe „Ausbildung als Köchin“.');
 if(!/vor (6|sechs) jahren/.test(t))errors.push('Beginn der Ausbildung: Nutze „vor sechs Jahren“ oder „vor 6 Jahren“.');
 if(!(t.includes('ausbildung')&&/(3|drei) jahre/.test(t)))errors.push('Dauer der Ausbildung: Die Angabe „drei Jahre“ fehlt.');
 if(!(t.includes('restaurant')&&/seit (3|drei) jahren/.test(t)&&/arbeit/.test(t)))errors.push('Arbeit: Schreibe, dass Elena seit drei Jahren in einem Restaurant arbeitet.');
 const grammar=[];
 if(/seit (9|neun|3|drei) jahr(?:e)?\b/.test(t)&&!/seit (9|neun|3|drei) jahren\b/.test(t))grammar.push('Zeitangabe mit „seit“: richtig ist „seit … Jahren“.');
 if(/vor (6|sechs) jahr(?:e)?\b/.test(t)&&!/vor (6|sechs) jahren\b/.test(t))grammar.push('Zeitangabe mit „vor“: richtig ist „vor … Jahren“.');
 if(/als (eine|die) kochin\b/.test(t))grammar.push('Beruf: Nach „als“ steht hier kein Artikel: „als Köchin“.');
 const sentences=String(raw||'').split(/[.!?]+/).map(x=>x.trim()).filter(Boolean);
 if(sentences.length<4)grammar.push('Text: Schreibe mindestens vier vollständige Sätze.');
 return [...new Set([...grammar,...errors])];
}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderForm(){
 const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
 if(task?.id!=='biografie-schreiben')return;
 const box=document.querySelector('.l8-exercise .l8-context');if(!box||box.dataset.spFormReady==='1')return;
 box.dataset.spFormReady='1';box.classList.add('sp-bio-form');
 box.innerHTML=`<div class="sp-bio-form-title">Informationen</div>${FIELDS.map(([label,value])=>`<div class="sp-bio-form-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}`;
}
function install(){
 if(window.__SP_L8T2_BIOGRAPHY_WRITE_UI_20260902)return;window.__SP_L8T2_BIOGRAPHY_WRITE_UI_20260902=true;
 const root=document.getElementById('app');if(root){new MutationObserver(renderForm).observe(root,{childList:true,subtree:true});renderForm()}
 document.addEventListener('click',event=>{
  const button=event.target?.closest?.('#saveFree');if(!button)return;
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.id!=='biografie-schreiben')return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  const input=document.getElementById('freeText'),text=String(input?.value||'').trim(),box=document.getElementById('feedback');
  const errors=validate(text);
  if(errors.length){if(box)box.innerHTML=`<div class="l8-feedback bad"><strong>Bitte korrigiere:</strong><ul>${errors.map(e=>`<li>${esc(e)}</li>`).join('')}</ul></div>`;return}
  const S=window.L8S,T=window.L8_THEME;if(!S||!T)return;
  S.completeFree(T.number,task.id,task.items.length,0,text);
  if(box)box.innerHTML='<div class="l8-feedback good">Der Text enthält alle Informationen. Die Zeitangaben sind korrekt.</div>';
  button.disabled=true;setTimeout(()=>window.L8UI?.taskPage?.(),650);
 },true);
 if(!document.getElementById('sp-l8t2-biography-form-style')){const style=document.createElement('style');style.id='sp-l8t2-biography-form-style';style.textContent='.sp-bio-form{display:grid!important;gap:0!important;padding:0!important;overflow:hidden}.sp-bio-form-title{font-weight:900;font-size:18px;padding:14px 16px;background:var(--lesson-soft,var(--l8-soft));color:var(--lesson-main-dark,var(--l8-dark))}.sp-bio-form-row{display:grid;grid-template-columns:minmax(130px,.75fr) minmax(0,1.25fr);gap:12px;padding:11px 16px;border-top:1px solid var(--lesson-line,var(--l8-line));align-items:center}.sp-bio-form-row span{font-weight:800;color:var(--lesson-main-dark,var(--l8-dark))}.sp-bio-form-row strong{font-weight:700}.l8-feedback ul{margin:8px 0 0 20px;padding:0}.l8-feedback li+li{margin-top:5px}@media(max-width:620px){.sp-bio-form-row{grid-template-columns:1fr;gap:3px}}';document.head.appendChild(style)}
}

window.L8_T2_TASK10_BIOGRAFIE_TEXT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK10_BIOGRAFIE_TEXT_READY;
window.L8T2BiographyWrite={apply,install,validate};
})();