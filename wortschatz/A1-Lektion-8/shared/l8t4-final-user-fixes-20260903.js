(function(){
'use strict';
if(window.__SP_L8T4_FINAL_USER_FIXES_20260903_V1)return;
window.__SP_L8T4_FINAL_USER_FIXES_20260903_V1=true;

const STELLENANZEIGE_IMAGE='https://sprachpilot.b-cdn.net/stellenanzeige.webp';
const STELLENANZEIGE_AUDIO='https://sprachpilot.b-cdn.net/audio/stellenanzeige.mp3';
const PRO_TRANSLATIONS={
 en:'per',ru:'за / на',tr:'başına',uk:'за / на',ar:'لكل',ja:'〜につき',ro:'pe / pentru fiecare',pl:'na / za',ku:'ji bo her'
};
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ').trim();
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const cardTask=theme=>(theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
const termOf=item=>String(item?.term||item?.word||item?.full||'').trim();
const answersOf=item=>Array.isArray(item?.answer)?item.answer:[item?.answer];

function makeProItem(){
 return {term:'pro',type:'preposition',image:'',audio:'',audioFile:'',wordAudio:'',translations:{...PRO_TRANSLATIONS},tr:{...PRO_TRANSLATIONS}};
}
function fixVocabList(list){
 if(!Array.isArray(list))return list;
 let hasPro=false;
 for(const item of list){
  if(!item||typeof item!=='object')continue;
  const n=norm(termOf(item));
  if(n==='die stellenanzeige'||n==='stellenanzeige'){
   item.image=STELLENANZEIGE_IMAGE;
   item.audio=STELLENANZEIGE_AUDIO;
   item.audioFile=STELLENANZEIGE_AUDIO;
   item.wordAudio=STELLENANZEIGE_AUDIO;
  }
  if(n==='pro stunde'||n==='pro'){
   item.term='pro';
   if(Object.prototype.hasOwnProperty.call(item,'word'))item.word='pro';
   if(Object.prototype.hasOwnProperty.call(item,'full'))item.full='pro';
   item.type='preposition';
   item.image='';
   item.audio='';
   item.audioFile='';
   item.wordAudio='';
   item.translations={...PRO_TRANSLATIONS};
   item.tr={...PRO_TRANSLATIONS};
   hasPro=true;
  }
 }
 const seenPro=list.filter(x=>norm(termOf(x))==='pro');
 if(seenPro.length>1){
  let keep=false;
  for(let i=list.length-1;i>=0;i--){
   if(norm(termOf(list[i]))!=='pro')continue;
   if(!keep){keep=true;continue}
   list.splice(i,1);
  }
 }
 if(!hasPro){
  const serviceIndex=list.findIndex(x=>norm(termOf(x)).replace(/^(der|die|das)\s+/,'')==='service');
  list.splice(serviceIndex>=0?serviceIndex+1:list.length,0,makeProItem());
 }
 return list;
}
function fixStellenanzeigeTasks(theme){
 for(const task of theme.tasks||[]){
  for(const item of task?.items||[]){
   const answers=answersOf(item).map(norm);
   if(answers.includes('die stellenanzeige')||answers.includes('stellenanzeige')){
    if(Object.prototype.hasOwnProperty.call(item,'image'))item.image=STELLENANZEIGE_IMAGE;
    if(Object.prototype.hasOwnProperty.call(item,'audioFile'))item.audioFile=STELLENANZEIGE_AUDIO;
   }
   if(Array.isArray(item?.options)){
    for(const option of item.options){
     if(option&&typeof option==='object'&&(norm(option.term)==='die stellenanzeige'||norm(option.term)==='stellenanzeige'))option.image=STELLENANZEIGE_IMAGE;
    }
   }
  }
 }
 const imageTask=(theme.tasks||[]).find(t=>String(t?.id||'').includes('bild-wort'));
 if(imageTask?.items){
  const item=imageTask.items.find(x=>answersOf(x).some(a=>['die stellenanzeige','stellenanzeige'].includes(norm(a))));
  if(item)item.image=STELLENANZEIGE_IMAGE;
 }
 const listenTask=(theme.tasks||[]).find(t=>String(t?.id||'').includes('hoeren-bild'));
 if(listenTask?.items){
  const item=listenTask.items.find(x=>answersOf(x).some(a=>['die stellenanzeige','stellenanzeige'].includes(norm(a))));
  if(item)item.audioFile=STELLENANZEIGE_AUDIO;
  for(const row of listenTask.items)for(const option of row?.options||[])if(option&&typeof option==='object'&&['die stellenanzeige','stellenanzeige'].includes(norm(option.term)))option.image=STELLENANZEIGE_IMAGE;
 }
}
function fixMeaningPro(theme){
 const task=(theme.tasks||[]).find(t=>String(t?.id||'')==='l8t4-bedeutung-wort');
 if(!task?.items)return;
 let item=task.items.find(x=>answersOf(x).some(a=>['pro stunde','pro'].includes(norm(a))));
 if(!item){item={prompt:'14 Euro ___ Stunde.',answer:['pro'],hint:'Zum Beispiel: 14 Euro pro Stunde.'};task.items.push(item)}
 item.prompt='14 Euro ___ Stunde.';
 item.answer=['pro'];
 item.hint='Zum Beispiel: 14 Euro pro Stunde.';
}
function fixPhonePro(theme){
 const task=(theme.tasks||[]).find(t=>String(t?.id||'')==='l8t4-telefon-dialoge-v2');
 if(!task?.items)return;
 for(const item of task.items){
  if(!Array.isArray(item?.gaps))continue;
  const proIndexes=[];
  item.gaps.forEach((gap,index)=>{
   const answers=Array.isArray(gap?.answer)?gap.answer:[gap?.answer];
   if(!answers.some(a=>['pro stunde','pro'].includes(norm(a))))return;
   gap.answer=['pro'];
   if(Array.isArray(gap.options)){
    gap.options=gap.options.map(v=>norm(v)==='pro stunde'?'pro':v);
    if(!gap.options.some(v=>norm(v)==='pro'))gap.options.unshift('pro');
   }
   proIndexes.push(index);
  });
  if(Array.isArray(item.lines)&&proIndexes.length){
   item.lines=item.lines.map(row=>{
    let text=String(row?.text||'');
    for(const index of proIndexes){
     const re=new RegExp('\\{\\{'+index+'\\}\\}(?!\\s*Stunde)','g');
     text=text.replace(re,'{{'+index+'}} Stunde');
    }
    return {...row,text};
   });
  }
 }
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=cardTask(theme);
 if(cards?.items)fixVocabList(cards.items);
 if(Array.isArray(theme.vocabularyOverviewItems))fixVocabList(theme.vocabularyOverviewItems);
 if(Array.isArray(theme.overviewOnlyItems))fixVocabList(theme.overviewOnlyItems);
 fixStellenanzeigeTasks(theme);
 fixMeaningPro(theme);
 fixPhonePro(theme);
 const source=cards?.items||theme.vocabularyOverviewItems||[];
 theme.acceptedVocabularyTerms=source.map(termOf).filter(Boolean);
 theme.contentRevision=String(theme.contentRevision||'')+'-l8t4-final-user-fixes-20260903-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T4_FINAL_USER_FIXES_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);
 apply(theme);
 return themes;
}).catch(error=>{console.error('L8T4 finale Nutzerkorrekturen',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_FINAL_USER_FIXES_READY;
window.L8T4FinalUserFixes20260903={apply,version:1,stellenanzeigeImage:STELLENANZEIGE_IMAGE,stellenanzeigeAudio:STELLENANZEIGE_AUDIO};
})();
