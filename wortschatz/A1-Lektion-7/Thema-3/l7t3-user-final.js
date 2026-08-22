(function(){
'use strict';
if(window.__SP_L7T3_USER_FINAL_V1)return;window.__SP_L7T3_USER_FINAL_V1=true;

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const errors=theme.tasks.find(t=>t?.id==='t3-fehler-korrigieren-v2');
 if(errors){
  errors.title='Fehler korrigieren';
  errors.description='1. Klicke das falsche Wort an. 2. Schreibe die richtige Form.';
 }
 const once=theme.tasks.find(t=>t?.id==='t3-schon-einmal-v1');
 if(once){
  once.title='Was hast du schon einmal gemacht?';
  once.description='Bilde die Fragen und antworte.';
 }
 theme.contentRevision='l7t3-user-final-20260822-v1';
 window.L7_THEME=theme;
 return theme;
});

if(document.body?.dataset?.page==='task'){
 const style=document.createElement('style');
 style.id='sp-l7t3-user-final-style';
 style.textContent=`
  .sp-error-sentence{display:block!important;margin:24px 0!important;line-height:1.65!important;font-size:clamp(28px,4.2vw,38px)!important;text-align:left!important}
  .sp-error-sentence button{display:inline!important;border:0!important;background:transparent!important;border-radius:7px!important;padding:3px 4px!important;margin:0!important;font:inherit!important;font-weight:750!important;cursor:pointer!important}
  .sp-error-sentence button:hover,.sp-error-sentence button:focus{background:var(--soft)!important;outline:2px solid var(--line)!important;text-decoration:none!important}
  .sp-error-sentence button.selected{background:#fff0a8!important;outline:3px solid #e0b92f!important;color:inherit!important}
 `;
 document.head.appendChild(style);
 const cleanDuplicate=()=>{
  const id=new URLSearchParams(location.search).get('task');
  if(id!=='t3-fehler-korrigieren-v2')return;
  document.querySelectorAll('.l7-question-card p.small').forEach(p=>{
   const text=String(p.textContent||'').trim();
   if(/^1\.\s*Klicke das falsche Wort/i.test(text)&&/2\.\s*Schreibe die richtige Form/i.test(text))p.remove();
  });
 };
 const root=document.getElementById('app');
 if(root)new MutationObserver(cleanDuplicate).observe(root,{childList:true,subtree:true});
 cleanDuplicate();
}
})();
