(function(){
'use strict';
if(window.__SP_L8T2_EMAIL_WORDBANK_20260902)return;
window.__SP_L8T2_EMAIL_WORDBANK_20260902=true;
const taskId=String(new URLSearchParams(location.search).get('task')||'');
if(taskId!=='bewerbung-lueckentext')return;
const banks=[
 ['hSer eetgher','leSlet','roV','sAubildgun','tieS','faErrhngu','twAonrt','tiM hnclefriduen ßenrGü'],
 ['hSer ergether','leSlet','roV','ugederta','tieS','aSßp','twAonrt','tiM hnclefriduen ßenrGü'],
 ['hSer eetgher','tieS','roV','faErrhngu','naDk','tiM hnclefriduen ßenrGü']
];
function bankIndex(dialog){
 const text=String(dialog?.textContent||'');
 if(text.includes('restaurant-mitte.de'))return 0;
 if(text.includes('hotel-stadt.de'))return 1;
 if(text.includes('frau.berger@buero.de'))return 2;
 return -1;
}
function install(){
 const dialog=document.querySelector('.l8-email-exercise .l8-dialog');
 if(!dialog)return;
 const i=bankIndex(dialog);if(i<0)return;
 const old=document.querySelector('.sp-l8t2-email-wordbank');if(old)old.remove();
 const box=document.createElement('div');box.className='sp-l8t2-email-wordbank';
 box.innerHTML=`<strong>Wörter:</strong><div>${banks[i].map(w=>`<span>${w}</span>`).join('')}</div>`;
 dialog.parentNode.insertBefore(box,dialog);
}
const root=document.getElementById('app');
if(root)new MutationObserver(()=>install()).observe(root,{childList:true,subtree:true});
[0,80,250,700].forEach(ms=>setTimeout(install,ms));
const style=document.createElement('style');
style.textContent=`.sp-l8t2-email-wordbank{max-width:100%;margin:0 0 12px;padding:12px 14px;border:2px dashed var(--lesson-line,var(--l8-line));border-radius:14px;background:var(--lesson-soft,#eef7fb);display:grid;gap:8px}.sp-l8t2-email-wordbank>strong{color:var(--lesson-main-dark,var(--l8-dark));font-size:15px}.sp-l8t2-email-wordbank>div{display:flex;flex-wrap:wrap;gap:7px}.sp-l8t2-email-wordbank span{display:inline-block;padding:5px 9px;border-radius:999px;background:#fff;border:1px solid var(--lesson-line,var(--l8-line));font-weight:800;letter-spacing:.3px}`;
document.head.appendChild(style);
})();
