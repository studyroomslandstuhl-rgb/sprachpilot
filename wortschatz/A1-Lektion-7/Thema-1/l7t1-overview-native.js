(function(){
'use strict';
if(window.__SP_L7T1_OVERVIEW_NATIVE_1)return;
window.__SP_L7T1_OVERVIEW_NATIVE_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

function install(){
 const api=window.L7TranslationStandard;
 if(!api)return false;
 api.grid=item=>{
  const selected=api.native(item);
  const label=selected?.label||'Muttersprache';
  const text=selected?.text||'—';
  return `<div class="sp-translation-grid sp-translation-native-only"><div><b>${api.escape(label)}:</b> <span>${api.escape(text)}</span></div></div>`;
 };
 return true;
}
if(!install()){
 let tries=0;
 const timer=setInterval(()=>{
  if(install()||++tries>80)clearInterval(timer);
 },25);
}
})();
