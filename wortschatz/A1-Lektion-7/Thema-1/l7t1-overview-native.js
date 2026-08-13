(function(){
'use strict';
if(window.__SP_L7T1_OVERVIEW_NATIVE_2)return;
window.__SP_L7T1_OVERVIEW_NATIVE_2=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const NOUNS=new Set([
 'team','fruhstuck','mathematik','test','schule','arzt','arztin','klavier','ski','tennis',
 'lied','text','ubung','brief','buch','spiel','film','grammatik','hausaufgabe','gitarre',
 'fahrrad','kuchen','freund','handstand','kilometer','kommunikation','madchen','junge',
 'klasse','schwimmbad','eintritt','grundschule','unterricht','franzosisch'
]);
const VERBS=new Set([
 'wecken','los sein','schreiben','konnen','backen','singen','reiten','malen','wollen','mochten',
 'uben','horen','machen','lesen','sehen','spielen','fahren','treffen','gehen','sprechen',
 'fotografieren','jonglieren','losfahren','leidtun','leid tun','fertig sein',
 'gitarre spielen','ski fahren','tennis spielen','klavier spielen'
]);
const ADJ_ADV=new Set([
 'prima','fertig','punktlich','krank','endlich','schade','gut','sehr gut','nicht gut',
 'nicht so gut','gar nicht','ein bisschen'
]);
const PHRASES=new Set([
 'auf keinen fall','auf jeden fall','nach hause'
]);

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss')
  .replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
}
function wordKey(api,item){
 return norm(api.full(item)).replace(/^(der|die|das)\s+/,'');
}

function install(){
 const api=window.L7TranslationStandard;
 if(!api)return false;
 const originalType=api.type.bind(api);

 api.type=item=>{
  const key=wordKey(api,item);
  if(NOUNS.has(key))return'noun';
  if(VERBS.has(key))return'verb';
  if(ADJ_ADV.has(key))return'adjective';
  if(PHRASES.has(key))return'phrase';

  const raw=originalType(item);
  if(raw==='adverb')return'adjective';
  return raw;
 };
 api.labelForType=value=>({
  noun:'Nomen',
  verb:'Verben',
  adjective:'Adjektive & Adverbien',
  adverb:'Adjektive & Adverbien',
  phrase:'Feste Ausdrücke / Redewendungen',
  other:'Weitere Wörter'
 })[value]||'Weitere Wörter';
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
