(function(){
'use strict';
if(window.__SP_FI_FIRST_PERSON_UI_V1)return;
window.__SP_FI_FIRST_PERSON_UI_V1=true;

const KNOWN_FIRST=Object.freeze({
 'rakastaa':'rakastan','ostaa':'ostan','ymmärtää':'ymmärrän','tarvita':'tarvitsen',
 'kuulla':'kuulen','oppia':'opin','asua':'asun','tuoda':'tuon','olla':'olen',
 'kirjoittaa':'kirjoitan','valokuvata':'valokuvaan','soittaa':'soitan','kokata':'kokkaan',
 'elää':'elän','tulla':'tulen','mennä':'menen','uida':'uin','etsiä':'etsin',
 'tilata':'tilaan','tehdä':'teen','nähdä':'näen'
});

function norm(value){return String(value||'').trim().toLocaleLowerCase('fi-FI').normalize('NFC')}
function firstPerson(verb){
 if(!verb)return'';
 const de=norm(verb.de),fi=norm(verb.fi);
 // tavata ist ein echtes Bedeutungs-/Konjugationspaar:
 // treffen -> tapaan, buchstabieren -> tavaan.
 if(fi==='tavata'&&de==='treffen')return'tapaan';
 if(fi==='tavata'&&de==='buchstabieren')return'tavaan';
 if(KNOWN_FIRST[fi])return KNOWN_FIRST[fi];
 try{
  const forms=window.SP_FI_ALL_FORMS?.(verb.fi);
  if(Array.isArray(forms)&&forms[0])return forms[0];
 }catch(e){}
 return verb.fi||'';
}

window.SP_FI_FIRST_PERSON=function(value){
 if(value&&typeof value==='object')return firstPerson(value);
 const fi=norm(value),verb=(window.SP_FI_VERBS||[]).find(v=>norm(v.fi)===fi);
 return firstPerson(verb||{fi:value,de:''});
};

function allVerbs(){return Array.isArray(window.SP_FI_VERBS)?window.SP_FI_VERBS:[]}
function routeGroup(){return Math.max(0,Number(new URLSearchParams(location.search).get('group'))||0)}
function routeList(){const all=allVerbs(),group=routeGroup();return group?all.slice((group-1)*20,group*20):all}
function chooseAmbiguous(fi,text=''){
 const candidates=allVerbs().filter(v=>norm(v.fi)===norm(fi));
 if(candidates.length<=1)return candidates[0]||null;
 const lower=String(text||'').toLocaleLowerCase('de-DE');
 if(norm(fi)==='tavata'){
  if(/buchstab|buchstabe/.test(lower))return candidates.find(v=>norm(v.de)==='buchstabieren')||candidates[0];
  if(/treff|zusammenkomm|person/.test(lower))return candidates.find(v=>norm(v.de)==='treffen')||candidates[0];
 }
 return candidates[0];
}
function formLine(verb){
 if(!verb)return null;
 const row=document.createElement('div');
 row.className='fi-infinitive-first-person';
 row.innerHTML='<span><small>Infinitiv</small><b>'+escapeHtml(verb.fi)+'</b></span><span><small>minä</small><b>'+escapeHtml(firstPerson(verb))+'</b></span>';
 return row;
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function decorateOverview(){
 const cards=[...document.querySelectorAll('#app .overview-verb-card')];
 if(!cards.length)return;
 const list=routeList();
 cards.forEach((card,index)=>{
  if(card.querySelector('.fi-infinitive-first-person'))return;
  const heading=card.querySelector('.overview-verb-text h3, h3');
  const fi=String(heading?.textContent||'').trim();
  let verb=list[index];
  if(!verb||norm(verb.fi)!==norm(fi))verb=chooseAmbiguous(fi,card.textContent||'');
  const row=formLine(verb);if(!row)return;
  if(heading)heading.insertAdjacentElement('afterend',row);else card.appendChild(row);
 });
}

function decorateFlashcard(){
 const back=document.querySelector('#app .flip-back');
 if(!back||back.querySelector('.fi-infinitive-first-person'))return;
 const word=back.querySelector('.flip-word');
 if(!word)return;
 const fi=String(word.textContent||'').trim();
 const clue=document.querySelector('#app .card-translation')?.textContent||document.querySelector('#app .question-card')?.textContent||'';
 const verb=chooseAmbiguous(fi,clue);
 const row=formLine(verb);if(!row)return;
 word.insertAdjacentElement('afterend',row);
}

function decorate(){decorateOverview();decorateFlashcard()}

const style=document.createElement('style');
style.textContent=`
.fi-infinitive-first-person{display:flex;flex-wrap:wrap;gap:8px 14px;margin:7px 0 9px;font-size:14px;line-height:1.25}
.fi-infinitive-first-person>span{display:inline-flex;align-items:baseline;gap:5px;padding:5px 8px;border-radius:10px;background:rgba(71,171,198,.10)}
.fi-infinitive-first-person small{font-size:11px;font-weight:700;opacity:.7;text-transform:none}
.fi-infinitive-first-person b{font-size:15px}
.flip-back .fi-infinitive-first-person{justify-content:center;margin:10px auto;max-width:100%}
`;
document.head.appendChild(style);

const observer=new MutationObserver(()=>queueMicrotask(decorate));
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',decorate);
window.addEventListener('popstate',()=>setTimeout(decorate,0));
setTimeout(decorate,0);setTimeout(decorate,500);setTimeout(decorate,1500);
})();
