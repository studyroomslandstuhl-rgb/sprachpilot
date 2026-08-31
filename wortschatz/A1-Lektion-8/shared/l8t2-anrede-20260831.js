(function(){
'use strict';
if(window.__SP_L8T2_ANREDE_20260831)return;window.__SP_L8T2_ANREDE_20260831=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const ANREDE={
 term:'die Anrede',type:'noun',plural:'die Anreden',
 image:CDN+'anrede.webp',audio:AUDIO+'anrede.mp3',audioFile:AUDIO+'anrede.mp3',
 translations:{en:'form of address / salutation',ru:'обращение',tr:'hitap',uk:'звертання',ar:'صيغة المخاطبة / التحية',ja:'呼びかけ / 敬称',ro:'formulă de adresare',pl:'forma zwrotu / zwrot grzecznościowy',ku:'bangkirin / awayê axaftin'},
 tr:{en:'form of address / salutation',ru:'обращение',tr:'hitap',uk:'звертання',ar:'صيغة المخاطبة / التحية',ja:'呼びかけ / 敬称',ro:'formulă de adresare',pl:'forma zwrotu / zwrot grzecznościowy',ku:'bangkirin / awayê axaftin'}
};
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);if(!theme)return themes;
 const cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));if(!cards)return themes;
 const existing=(cards.items||[]).find(x=>norm(term(x))==='die anrede'||norm(term(x))==='anrede');
 if(existing)Object.assign(existing,ANREDE);else{
  const items=cards.items||(cards.items=[]),grussIndex=items.findIndex(x=>/^(der )?gru(ss|ß)$/i.test(term(x)));
  if(grussIndex>=0)items.splice(grussIndex+1,0,{...ANREDE});else items.push({...ANREDE});
 }
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 return themes;
});
})();
