(function(){
'use strict';
if(window.__SP_L8_FINAL_CONTENT_ADJUSTMENTS_20260831)return;
window.__SP_L8_FINAL_CONTENT_ADJUSTMENTS_20260831=true;

const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/i,'').replace(/\s+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const themeOf=(all,n)=>all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null);
const cardsOf=theme=>(theme?.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
const translations=(en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it)=>({en,ru,tr,uk,ar,ja,ro,pl,ku,fa,fr,es,it});
const input=(prompt,answer,context='',hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint});

function applyT2(theme){
 if(!theme)return;
 const cards=cardsOf(theme);if(!cards)return;
 for(const item of cards.items||[]){
  if(norm(term(item))!=='spater')continue;
  item.image=CDN+'spaet.webp';
 }
 theme.vocabularyOverviewItems=cards.items;
}

function applyT3(theme){
 if(!theme)return;
 const cards=cardsOf(theme);if(!cards)return;
 cards.items=Array.isArray(cards.items)?cards.items:[];
 const experience=cards.items.find(x=>norm(term(x))==='erfahrung');
 if(experience)experience.image=CDN+'erfahrung.webp';
 let colleague=cards.items.find(x=>norm(term(x))==='kollegin');
 if(!colleague){
  const colleagueTranslations=translations('female colleague','коллега / сотрудница','kadın iş arkadaşı','колега / співробітниця','زميلة','女性の同僚','colegă','koleżanka z pracy','hevalkara jin','همکار زن','collègue','compañera de trabajo','collega');
  colleague={term:'die Kollegin',type:'noun',plural:'die Kolleginnen',image:CDN+'kollegin.webp',audio:AUDIO+'kollegin.mp3',audioFile:AUDIO+'kollegin.mp3',translations:{...colleagueTranslations},tr:{...colleagueTranslations}};
  const maleIndex=cards.items.findIndex(x=>norm(term(x))==='kollege');
  if(maleIndex>=0)cards.items.splice(maleIndex+1,0,colleague);else cards.items.push(colleague);
 }
 cards.icon='🃏';cards.emoji='🃏';
 theme.vocabularyOverviewItems=cards.items;
}

const WEEKDAY_ADVERBS=new Set(['montags','dienstags','mittwochs','donnerstags','freitags','samstags','sonntags']);
const REMOVE_T4=new Set(['dreimal',...WEEKDAY_ADVERBS,'pro stunde']);

function frequencyTask(){
 return {
  id:'haeufigkeit-mal-schreiben',title:'Wie oft? – selbst mit -mal bilden',kind:'input',icon:'✍️',emoji:'✍️',
  instruction:'Schreibe die Sätze neu und bilde einmal, zweimal, dreimal, viermal usw. selbst.',
  intro:'So geht es: Zahl + „-mal“ sagt, wie oft etwas passiert. ein → einmal, zwei → zweimal, drei → dreimal, vier → viermal, fünf → fünfmal. Beispiel: „Ich arbeite drei Tage pro Woche.“ → „Ich arbeite dreimal pro Woche.“',
  items:[
   input('Schreibe neu: Ich arbeite einen Tag pro Woche.','Ich arbeite einmal pro Woche.','','Nutze einmal.'),
   input('Schreibe neu: Ich arbeite zwei Tage pro Woche.','Ich arbeite zweimal pro Woche.','','Nutze zweimal.'),
   input('Schreibe neu: Ich arbeite drei Tage pro Woche.','Ich arbeite dreimal pro Woche.','','Nutze dreimal.'),
   input('Schreibe neu: Ich arbeite vier Tage pro Woche.','Ich arbeite viermal pro Woche.','','Nutze viermal.'),
   input('Schreibe neu: Ich arbeite fünf Tage pro Woche.','Ich arbeite fünfmal pro Woche.','','Nutze fünfmal.'),
   input('Schreibe neu: Ich arbeite sechs Tage pro Woche.','Ich arbeite sechsmal pro Woche.','','Nutze sechsmal.')
  ]
 };
}

function weekdayTask(){
 return {
  id:'wochentage-regelmaessig-schreiben',title:'Jeden Montag → montags',kind:'input',icon:'📅',emoji:'📅',
  instruction:'Schreibe regelmäßige Wochentage als kurze Zeitangabe mit -s.',
  intro:'So geht es: „jeden Montag“ bedeutet regelmäßig. Das kann man kürzer mit „montags“ sagen: „Ich arbeite jeden Montag.“ → „Ich arbeite montags.“ Genauso: dienstags, mittwochs, donnerstags, freitags, samstags, sonntags. Wichtig: „am Montag“ meint normalerweise einen konkreten Montag; „montags“ bedeutet regelmäßig.',
  items:[
   input('Schreibe neu: Ich arbeite jeden Montag.','Ich arbeite montags.','','jeden Montag → montags'),
   input('Schreibe neu: Ich habe jeden Dienstag frei.','Ich habe dienstags frei.','','jeden Dienstag → dienstags'),
   input('Schreibe neu: Wir haben jeden Mittwoch Teamtreffen.','Wir haben mittwochs Teamtreffen.','','jeden Mittwoch → mittwochs'),
   input('Schreibe neu: Sie arbeitet jeden Donnerstag tagsüber.','Sie arbeitet donnerstags tagsüber.','','jeden Donnerstag → donnerstags'),
   input('Schreibe neu: Er arbeitet jeden Freitag im Service.','Er arbeitet freitags im Service.','','jeden Freitag → freitags'),
   input('Schreibe neu: Ich arbeite jeden Samstag.','Ich arbeite samstags.','','jeden Samstag → samstags'),
   input('Schreibe neu: Das Café sucht jeden Sonntag eine Aushilfe.','Das Café sucht sonntags eine Aushilfe.','','jeden Sonntag → sonntags')
  ]
 };
}

function applyT4(theme){
 if(!theme)return;
 const cards=cardsOf(theme);
 if(cards){
  const old=Array.isArray(cards.items)?cards.items:[];
  const proBase=old.find(x=>norm(term(x))==='pro stunde')||old.find(x=>norm(term(x))==='pro')||{};
  cards.items=old.filter(item=>!REMOVE_T4.has(norm(term(item))));
  if(!cards.items.some(x=>norm(term(x))==='pro')){
   const proTranslations=translations('per / for each','на / за каждую единицу','başına','на / за кожну одиницю','لكل','～あたり','pe / pentru fiecare','na / za','ji bo her','به ازای','par','por','per');
   cards.items.push({...proBase,term:'pro',type:'preposition',detail:'Präposition · Bedeutung: je / für jede Einheit',example:'15 Euro pro Stunde · dreimal pro Woche',image:'',audio:'',audioFile:'',wordAudio:'',translations:{...proTranslations},tr:{...proTranslations}});
  }
  for(const item of cards.items){
   const n=norm(term(item));
   if(n==='senior'){
    item.audio=AUDIO+'senior1.mp3';item.audioFile=AUDIO+'senior1.mp3';item.wordAudio=AUDIO+'senior1.mp3';
   }
   if(n==='tagsuber'){
    item.audio=AUDIO+'tagsueber1.mp3';item.audioFile=AUDIO+'tagsueber1.mp3';item.wordAudio=AUDIO+'tagsueber1.mp3';
   }
  }
  cards.icon='🃏';cards.emoji='🃏';
  theme.vocabularyOverviewItems=cards.items;
 }
 theme.tasks=Array.isArray(theme.tasks)?theme.tasks:[];
 const regularIndex=theme.tasks.findIndex(t=>t?.id==='regelmaessige-zeiten');
 if(regularIndex>=0)theme.tasks.splice(regularIndex,1);
 for(const id of ['haeufigkeit-mal-schreiben','wochentage-regelmaessig-schreiben']){
  const i=theme.tasks.findIndex(t=>t?.id===id);if(i>=0)theme.tasks.splice(i,1);
 }
 let insertAt=regularIndex>=0?regularIndex:theme.tasks.findIndex(t=>t?.id==='fuer-seit-vor');
 if(insertAt<1){const exam=theme.tasks.findIndex(t=>t?.exam);insertAt=exam>=0?exam:Math.max(1,theme.tasks.length)}
 theme.tasks.splice(insertAt,0,frequencyTask(),weekdayTask());
 for(const key of ['overviewOnlyItems','vocabularyOverviewItems']){
  if(!Array.isArray(theme[key]))continue;
  theme[key]=theme[key].filter(item=>!REMOVE_T4.has(norm(term(item))));
  if(key==='vocabularyOverviewItems'&&cards)theme[key]=cards.items;
 }
}

window.L8_FINAL_CONTENT_ADJUSTMENTS_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 applyT2(themeOf(all,2));
 applyT3(themeOf(all,3));
 applyT4(themeOf(all,4));
 const n=Number(document.body?.dataset?.theme||0);if(n&&themeOf(all,n))window.L8_THEME=themeOf(all,n);
 return themes;
});
window.L8_CONTENT_READY=window.L8_FINAL_CONTENT_ADJUSTMENTS_READY;
})();
