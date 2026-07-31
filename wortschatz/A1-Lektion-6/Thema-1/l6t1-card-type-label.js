(function(){
'use strict';
if(window.__SP_L6T1_CARD_TYPE_LABEL_1)return;
window.__SP_L6T1_CARD_TYPE_LABEL_1=true;

const FILE='karteikarten.html';
let scheduled=false;

const style=document.createElement('style');
style.id='l6t1-card-type-label-style';
style.textContent=`
.card-translation-box>span:first-child{
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  flex-wrap:wrap!important;
  gap:7px!important;
}
.l6t1-card-type-badge{
  display:inline-flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:3px 9px!important;
  border:1px solid var(--lesson-line,#f3c2cc)!important;
  border-radius:999px!important;
  background:var(--lesson-soft,#fff0f4)!important;
  color:var(--lesson-main-dark,#8a3a4f)!important;
  font-size:12px!important;
  font-weight:900!important;
  line-height:1.2!important;
  white-space:nowrap!important;
}
`;
document.head.appendChild(style);

function currentItem(){
  try{
    if(typeof cardItems!=='function'||typeof loadTask!=='function')return null;
    const list=cardItems();
    const state=loadTask(FILE,list.length);
    const index=Number(state?.current);
    if(!Number.isInteger(index)||index<0||index>=list.length)return null;
    return list[index];
  }catch(error){
    return null;
  }
}

function apply(){
  scheduled=false;
  const item=currentItem();
  if(!item)return;
  const type=item.mode==='sentence'?'Satz':'Nomen';
  document.querySelectorAll('#area .card-translation-box>span:first-child').forEach(label=>{
    let badge=label.querySelector('.l6t1-card-type-badge');
    if(!badge){
      badge=document.createElement('b');
      badge.className='l6t1-card-type-badge';
      label.appendChild(badge);
    }
    badge.textContent=type;
    label.setAttribute('aria-label',`${String(label.childNodes[0]?.textContent||'Übersetzung').trim()}, ${type}`);
  });
}

function schedule(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(apply);
}

const area=document.getElementById('area');
if(area)new MutationObserver(schedule).observe(area,{childList:true,subtree:true});
[0,80,250,700].forEach(delay=>setTimeout(schedule,delay));
})();
