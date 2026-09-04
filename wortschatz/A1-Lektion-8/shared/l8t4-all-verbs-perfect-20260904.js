(function(){
'use strict';
if(window.__SP_L8T4_ALL_VERBS_PERFECT_20260904_V1)return;
window.__SP_L8T4_ALL_VERBS_PERFECT_20260904_V1=true;

const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ').trim();
const termOf=item=>String(item?.term||item?.full||item?.word||'').trim();
const themeOf=(all,n)=>all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);
const cardsOf=theme=>(theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id||'')==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
const perfectTail=/\s*(?:–|—|-)\s*((?:hat|ist)\s+.+)$/i;

const PERFECT=new Map([
 ['arbeiten','hat gearbeitet'],
 ['studieren','hat studiert'],
 ['zeigen','hat gezeigt'],
 ['heiraten','hat geheiratet'],
 ['anfangen','hat angefangen'],
 ['beginnen','hat begonnen'],
 ['enden','hat geendet'],
 ['dauern','hat gedauert'],
 ['schicken','hat geschickt'],
 ['senden','hat gesendet'],
 ['bekommen','hat bekommen'],
 ['suchen','hat gesucht'],
 ['verdienen','hat verdient'],
 ['machen','hat gemacht'],
 ['sammeln','hat gesammelt'],
 ['finden','hat gefunden'],
 ['wohnen','hat gewohnt'],
 ['leben','hat gelebt'],
 ['kommen','ist gekommen'],
 ['sich bewerben','hat sich beworben'],
 ['spaß haben','hat Spaß gehabt'],
 ['zur verfügung stehen','hat zur Verfügung gestanden'],
 ['zur verfügung stellen','hat zur Verfügung gestellt'],
 ['sein','ist gewesen'],
 ['haben','hat gehabt']
].map(([a,b])=>[norm(a),b]));

function infinitiveFrom(raw){
 const value=String(raw||'').trim().replace(perfectTail,'').trim();
 const n=norm(value);
 if(n==='war')return'sein';
 if(n==='hatte')return'haben';
 return value;
}
function perfectFrom(item,raw,infinitive){
 const saved=String(item?.perfectForm||'').trim();
 if(saved)return saved;
 const m=String(raw||'').match(perfectTail);
 if(m&&m[1])return String(m[1]).trim();
 return PERFECT.get(norm(infinitive))||'';
}
function isVerbCandidate(item,raw,infinitive){
 const type=norm(item?.type||item?.wordType||item?.category||'');
 if(type==='verb'||type==='verben'||type.includes('verb'))return true;
 if(perfectTail.test(String(raw||'')))return true;
 return PERFECT.has(norm(infinitive));
}
function collectVerbs(all){
 const out=[],seen=new Set();
 for(let n=1;n<=4;n++){
  const cards=cardsOf(themeOf(all,n));
  for(const item of cards?.items||[]){
   const raw=termOf(item);if(!raw)continue;
   const infinitive=infinitiveFrom(raw);if(!infinitive||!isVerbCandidate(item,raw,infinitive))continue;
   const perfect=perfectFrom(item,raw,infinitive);if(!perfect)continue;
   const key=norm(infinitive);if(!key||seen.has(key))continue;
   seen.add(key);out.push({infinitive,perfect,theme:n});
  }
 }
 return out;
}
function buildTask(all){
 const verbs=collectVerbs(all);
 return {
  id:'l8t4-perfekt-alle-verben',
  title:'Perfekt – alle Verben aus Lektion 8',
  kind:'input',icon:'🔤',emoji:'🔤',
  instruction:'Schreibe zu jedem Infinitiv die vollständige Perfektform.',
  intro:'Beispiel: bekommen → hat bekommen. Schreibe immer hat/ist + Partizip II.',
  items:verbs.map(v=>({
   type:'input',
   prompt:v.infinitive,
   answer:[v.perfect],
   hint:'Schreibe die vollständige Perfektform mit hat oder ist.',
   infinitive:v.infinitive,
   perfectForm:v.perfect,
   sourceTheme:v.theme
  }))
 };
}
function apply(theme,all){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=buildTask(all);
 if(!task.items.length)return theme;
 theme.tasks=theme.tasks.filter(t=>String(t?.id||'')!==task.id);
 let examIndex=theme.tasks.findIndex(t=>t?.exam||String(t?.id||'')==='pruefung');
 if(examIndex<0){theme.tasks.push(task);return theme}
 if(examIndex>0)theme.tasks.splice(examIndex-1,1,task);
 else theme.tasks.splice(examIndex,0,task);
 theme.contentRevision=String(theme.contentRevision||'')+'-all-l8-verbs-perfect-20260904-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T4_ALL_VERBS_PERFECT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 apply(themeOf(all,4),all);
 return themes;
}).catch(error=>{
 console.error('L8T4 Perfekt aller L8-Verben',error);
 return window.L8_ALL_THEMES||{};
});
window.L8_CONTENT_READY=window.L8_T4_ALL_VERBS_PERFECT_READY;
window.L8T4AllVerbsPerfect20260904={apply,buildTask,collectVerbs,version:1};
})();
