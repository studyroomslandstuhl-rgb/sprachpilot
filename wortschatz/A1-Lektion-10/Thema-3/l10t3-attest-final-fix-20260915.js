(function(){
'use strict';
if(window.__SP_L10T3_ATTEST_FINAL_FIX_20260915)return;
window.__SP_L10T3_ATTEST_FINAL_FIX_20260915=true;
const IMG='https://sprachpilot.b-cdn.net/attest.webp?v=20260915-attest-final1';
const D=window.L10T3;
function card(id){return D?.cards?.find?.(x=>String(x?.id||'')===id)}
function applyData(){
 const attest=card('attest'),arzt=card('arztbescheinigung');
 if(attest){attest.image=IMG;attest.img=IMG;attest.imageUrl=IMG;attest.imageURL=IMG;}
 if(arzt&&attest?.translations){arzt.translations={...attest.translations};}
 if(attest&&arzt?.translations&&!attest.translations){attest.translations={...arzt.translations};}
 if(attest&&arzt){
  const tr=attest.translations||arzt.translations;
  if(tr){attest.translations={...tr};arzt.translations={...tr};}
  attest.synonym='die Arztbescheinigung';
  arzt.synonym='das Attest';
 }
}
function forceImg(img){
 if(!img)return;
 img.hidden=false;
 img.style.display='block';
 if(img.getAttribute('src')!==IMG)img.setAttribute('src',IMG);
 img.removeAttribute('onerror');
}
function patchOverview(){
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const word=String(row.querySelector('h3')?.textContent||'').trim().toLowerCase();
  if(word!=='das attest'&&word!=='attest')return;
  let box=row.querySelector('.l8-overview-image');if(!box)return;
  let img=box.querySelector('img');
  if(!img){img=document.createElement('img');box.prepend(img)}
  forceImg(img);
  const fallback=box.querySelector('.l8-overview-fallback');if(fallback)fallback.hidden=true;
 });
}
function patchCards(){
 const backWord=String(document.querySelector('.l8-flip-back .l8-flip-word,.flip-back .flip-word')?.textContent||'').trim().toLowerCase();
 if(backWord!=='das attest'&&backWord!=='attest')return;
 document.querySelectorAll('.l8-flip-front .l8-card-visual img,.l8-flip-back img,.flip-front img,.flip-back img').forEach(forceImg);
 document.querySelectorAll('.sp-fallback').forEach(x=>x.style.display='none');
}
function run(){applyData();patchOverview();patchCards()}
run();
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
[0,50,150,400,900,1800].forEach(ms=>setTimeout(run,ms));
})();
