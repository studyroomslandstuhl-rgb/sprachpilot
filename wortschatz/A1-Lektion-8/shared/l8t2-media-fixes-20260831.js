(function(){
'use strict';
if(window.__SP_L8T2_MEDIA_FIXES_20260831)return;window.__SP_L8T2_MEDIA_FIXES_20260831=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
function apply(item){
 const key=norm(term(item));
 let stem='';
 if(key==='leiter'||key==='der leiter')stem='der_leiter';
 if(key==='zur verfugung stellen'||key==='zur verfugung stehen')stem='zur_verfuegung_stehen';
 if(!stem)return;
 item.image=CDN+stem+'.webp';
 item.audio=AUDIO+stem+'.mp3';
 item.audioFile=AUDIO+stem+'.mp3';
}
window.L8_T2_MEDIA_FIXES_READY=Promise.resolve(window.L8_T2_EXTRA_TRANSLATIONS_READY||window.L8_T2_VOCAB_READY||window.L8_T2_TRANSLATIONS_READY||window.L8_T2_CURRENT_READY||window.L8_CONTENT_READY).then(()=>{
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];
 const cards=(theme?.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
 for(const item of cards?.items||[])apply(item);
 for(const item of theme?.overviewOnlyItems||[])apply(item);
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 return theme;
});
})();
