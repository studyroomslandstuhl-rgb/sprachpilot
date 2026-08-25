(function(){
'use strict';
if(window.__SP_L7T1_NOUN_PLURAL_HELP_V2)return;
window.__SP_L7T1_NOUN_PLURAL_HELP_V2=true;
if(!window.L7||!window.L7S)return;

const S=window.L7S;
const previousRender=window.L7.renderTaskPage.bind(window.L7);
let current=null;

function esc(value){return S.esc(value)}
function firstValue(...values){for(const value of values){if(value!==undefined&&value!==null&&String(value).trim())return String(value).trim()}return''}
function singularExpected(item){
 let value=firstValue(item?.singularAnswer,item?.singular,item?.full,item?.word,item?.answer,item?.term).split('|')[0].trim();
 const article=String(item?.article||'').trim();
 if(article&&value&&!/^(der|die|das)\s/i.test(value))value=`${article} ${value}`.trim();
 return value;
}
function pluralExpected(item){
 let value=firstValue(item?.pluralAnswer,item?.plural,item?.pluralForm,item?.forms?.plural,item?.pluralWord);
 if(!value)return'';
 if(/^kein plural/i.test(value))return value;
 if(!/^(der|die|das)\s/i.test(value))value=`die ${value}`.trim();
 return value;
}
function draftKey(index,field){return`nounplural:${index}:${field}`}
function draftValue(state,index,field){return String(state.answers?.[draftKey(index,field)]??'')}
function saveDraft(theme,task,total,index,field,value){
 const state=S.load(theme,task.id,total);state.answers=state.answers||{};const key=draftKey(index,field);
 if(String(value||'').trim())state.answers[key]=String(value);else delete state.answers[key];
 S.save(theme,task.id,state,false);
}
function clearDrafts(theme,task,total,index){
 const state=S.load(theme,task.id,total);state.answers=state.answers||{};
 delete state.answers[draftKey(index,'singular')];delete state.answers[draftKey(index,'plural')];
 S.save(theme,task.id,state,false);
}
function progressHtml(theme,task,total){
 const state=S.load(theme,task.id,total),done=state.done.length,percent=Math.round(done/Math.max(1,total)*100);
 return `<div class="l7-progress-row"><span>${done} fehlerfrei · ${total-done} übrig</span><strong>${percent}%</strong></div><div class="l7-progress"><span style="width:${percent}%"></span></div>`;
}
function nounImage(item){
 const label=String(item?.word||item?.singularAnswer||'Nomen').trim();
 const resolved=window.L7T1BunnyImages?.resolveItem?.(item)||item?.image||item?.img||'';
 if(!resolved)return'';
 if(window.L7T1BunnyImages?.imageHtml)return window.L7T1BunnyImages.imageHtml(resolved,label||'Nomen');
 return S.image(resolved,label||'Nomen');
}
function helpHtml(state,item,index){
 const tries=Math.max(0,Number(state.tries)||0);if(!tries)return'';
 if(tries===1)return'<div class="l7-no">Noch nicht richtig. Versuch es noch einmal.</div>';
 const expectedS=singularExpected(item),expectedP=pluralExpected(item),givenS=draftValue(state,index,'singular'),givenP=draftValue(state,index,'plural');
 const sOk=S.norm(givenS)===S.norm(expectedS),pOk=S.norm(givenP)===S.norm(expectedP);
 if(tries===2){
  let tip='Achte auf den richtigen Artikel im Singular und auf die Pluralform.';
  if(sOk&&!pOk)tip='Tipp: Der Singular ist richtig. Prüfe jetzt die Pluralform und den Pluralartikel „die“.';
  else if(!sOk&&pOk)tip='Tipp: Der Plural ist richtig. Prüfe jetzt Artikel und Schreibweise im Singular.';
  return `<div class="l7-hint">${esc(tip)}</div>`;
 }
 return `<div class="l7-hint"><strong>Lösungshilfe:</strong> ${esc(expectedS)} · ${esc(expectedP)}<br>Gib beide Formen jetzt selbst richtig ein.</div>`;
}
function render(theme,id){
 theme=Number(theme);const task=S.task(id);if(!task||id!=='artikel-plural')return previousRender(theme,id);
 const total=Math.max(1,task.items?.length||0);let state=S.load(theme,task.id,total);
 if(state.done.length>=total)return previousRender(theme,id);
 const index=S.index(theme,task.id,total);state=S.load(theme,task.id,total);const item=task.items?.[index]||{};
 const singular=draftValue(state,index,'singular'),plural=draftValue(state,index,'plural');
 current={theme,task,total,index};
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progressHtml(theme,task,total)}<div class="l7-instruction">${esc(task.description||'Schreibe das Nomen mit Artikel und Plural.')}</div><div id="spSpecialTask" class="l7-question-card"><p class="eyebrow">Aufgabe ${state.done.length+1} von ${total}</p>${nounImage(item)}<div class="sp-noun-plural-inputs"><label>Nomen mit Artikel<input id="spNounSingular" autocomplete="off" placeholder="z. B. das Buch" value="${esc(singular)}"></label><label>Plural<input id="spNounPlural" autocomplete="off" placeholder="z. B. die Bücher" value="${esc(plural)}"></label></div><div class="l7-actions"><button type="button" class="l7-btn" id="spCheckNounPlural">Prüfen</button></div><div id="spSpecialFeedback">${helpHtml(state,item,index)}</div></div></section><footer>© SprachPilot</footer></div>`;
 const singularInput=document.getElementById('spNounSingular'),pluralInput=document.getElementById('spNounPlural');
 singularInput?.addEventListener('input',event=>saveDraft(theme,task,total,index,'singular',event.target.value));
 pluralInput?.addEventListener('input',event=>saveDraft(theme,task,total,index,'plural',event.target.value));
 const check=()=>{
  const singularValue=String(singularInput?.value||'').trim(),pluralValue=String(pluralInput?.value||'').trim();
  if(!singularValue||!pluralValue)return;
  saveDraft(theme,task,total,index,'singular',singularValue);saveDraft(theme,task,total,index,'plural',pluralValue);
  const expectedS=singularExpected(item),expectedP=pluralExpected(item);
  const ok=S.norm(singularValue)===S.norm(expectedS)&&S.norm(pluralValue)===S.norm(expectedP);
  S.attempt(theme,task.id,total,index,ok);
  if(ok){
   const before=S.load(theme,task.id,total),repeat=before.hadWrong||before.tries>0;
   clearDrafts(theme,task,total,index);S.right(theme,task.id,total);
   const fb=document.getElementById('spSpecialFeedback');if(fb)fb.innerHTML=`<div class="l7-ok">Richtig.${repeat?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;
   document.querySelectorAll('#spSpecialTask button,#spSpecialTask input').forEach(node=>node.disabled=true);
   return setTimeout(()=>render(theme,id),650);
  }
  S.wrong(theme,task.id,total);render(theme,id);
 };
 document.getElementById('spCheckNounPlural')?.addEventListener('click',check);
 [singularInput,pluralInput].forEach(input=>input?.addEventListener('keydown',event=>{if(event.key==='Enter')check()}));
 window.L7T1BunnyImages?.patchAll?.(root);
}

window.L7.renderTaskPage=function(theme,id){if(id==='artikel-plural')return render(theme,id);return previousRender(theme,id)};
})();
