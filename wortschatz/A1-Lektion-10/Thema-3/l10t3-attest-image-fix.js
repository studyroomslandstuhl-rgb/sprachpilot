(function(){
'use strict';
if(window.__SP_L10T3_ATTEST_IMAGE_FIX_V1)return;
window.__SP_L10T3_ATTEST_IMAGE_FIX_V1=true;
const SRC='https://sprachpilot.b-cdn.net/attest.webp?v=20260915-attestfix2';
function patchData(){
 const D=window.L10T3;
 const item=D?.cards?.find?.(x=>String(x?.id||'')==='attest');
 if(item){item.image=SRC;item.img=SRC;}
}
function setImg(img){
 if(!img)return;
 if(img.getAttribute('src')!==SRC)img.setAttribute('src',SRC);
 img.hidden=false;
 img.style.display='block';
 img.removeAttribute('onerror');
}
function patchOverview(){
 document.querySelectorAll('.l8-overview-word').forEach(row=>{
  const word=String(row.querySelector('h3')?.textContent||'').trim().toLowerCase();
  if(word!=='das attest'&&word!=='attest')return;
  const box=row.querySelector('.l8-overview-image');if(!box)return;
  let img=box.querySelector('img');
  if(!img){img=document.createElement('img');img.alt='das Attest';img.loading='lazy';box.prepend(img)}
  setImg(img);
  box.querySelectorAll('.l8-overview-fallback').forEach(x=>x.hidden=true);
 });
}
function patchTask(){
 const word=String(document.querySelector('.l8-flip-word')?.textContent||'').trim().toLowerCase();
 if(word!=='das attest'&&word!=='attest')return;
 document.querySelectorAll('.l8-card-visual img,.l8-back-image img,.sp-visual img').forEach(setImg);
}
function run(){patchData();patchOverview();patchTask()}
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
[0,50,150,400,1000,2000].forEach(ms=>setTimeout(run,ms));
window.L10T3AttestImageFix={run,src:SRC};
})();
