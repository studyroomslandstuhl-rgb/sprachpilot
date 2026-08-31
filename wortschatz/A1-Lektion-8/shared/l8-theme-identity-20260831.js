(function(){
'use strict';
if(window.__SP_L8_THEME_IDENTITY_20260831)return;window.__SP_L8_THEME_IDENTITY_20260831=true;
const resolve=()=>Number(document.body?.dataset?.theme||location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0);
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const n=resolve(),all=window.L8_ALL_THEMES||themes||{},theme=all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);
 if(theme&&n){theme.number=n;if(!theme.title)theme.title=`Thema ${n}`;window.L8_THEME=theme}
 return themes;
});
})();