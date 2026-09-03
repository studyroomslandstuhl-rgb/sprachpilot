(function(){
'use strict';
if(window.__SP_L8T4_SENIOR_GENDER_20260903_V1)return;
window.__SP_L8T4_SENIOR_GENDER_20260903_V1=true;

const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ').trim();
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const cardTask=theme=>(theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
const termOf=item=>String(item?.term||item?.word||item?.full||'').trim();
const answersOf=item=>Array.isArray(item?.answer)?item.answer:[item?.answer];
const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};

const SENIOR={
 term:'der Senior',type:'noun',plural:'die Senioren',
 image:CDN+'senior.webp',audio:AUDIO+'senior1.mp3',audioFile:AUDIO+'senior1.mp3',wordAudio:AUDIO+'senior1.mp3',
 translations:{en:'senior man / elderly man',ru:'пожилой мужчина',tr:'yaşlı erkek',uk:'літній чоловік',ar:'رجل مسن',ja:'高齢の男性',ro:'bărbat în vârstă',pl:'starszy mężczyzna',ku:'zilamê pîr'},
 tr:{en:'senior man / elderly man',ru:'пожилой мужчина',tr:'yaşlı erkek',uk:'літній чоловік',ar:'رجل مسن',ja:'高齢の男性',ro:'bărbat în vârstă',pl:'starszy mężczyzna',ku:'zilamê pîr'}
};
const SENIORIN={
 term:'die Seniorin',type:'noun',plural:'die Seniorinnen',
 image:CDN+'seniorin.webp',audio:'',audioFile:'',wordAudio:'',
 translations:{en:'senior woman / elderly woman',ru:'пожилая женщина',tr:'yaşlı kadın',uk:'літня жінка',ar:'امرأة مسنة',ja:'高齢の女性',ro:'femeie în vârstă',pl:'starsza kobieta',ku:'jina pîr'},
 tr:{en:'senior woman / elderly woman',ru:'пожилая женщина',tr:'yaşlı kadın',uk:'літня жінка',ar:'امرأة مسنة',ja:'高齢の女性',ro:'femeie în vârstă',pl:'starsza kobieta',ku:'jina pîr'}
};
const clone=v=>{try{return structuredClone(v)}catch(e){return JSON.parse(JSON.stringify(v))}};

function splitVocab(list){
 if(!Array.isArray(list))return;
 let insertAt=list.findIndex(x=>['die senioren','senioren','der senior','die seniorin'].includes(norm(termOf(x))));
 if(insertAt<0)insertAt=list.length;
 for(let i=list.length-1;i>=0;i--){
  if(['die senioren','senioren','der senior','die seniorin'].includes(norm(termOf(list[i]))))list.splice(i,1);
 }
 list.splice(Math.min(insertAt,list.length),0,clone(SENIOR),clone(SENIORIN));
}
function replaceImageSenior(task){
 if(!Array.isArray(task?.items))return;
 let at=task.items.findIndex(x=>answersOf(x).some(a=>['die senioren','senioren','der senior','die seniorin'].includes(norm(a))));
 if(at<0)at=task.items.length;
 task.items=task.items.filter(x=>!answersOf(x).some(a=>['die senioren','senioren','der senior','die seniorin'].includes(norm(a))));
 const male={image:SENIOR.image,prompt:'Was passt?',options:shuffle(['der Senior','die Seniorin','der Sekretär','die Aushilfe']),answer:['der Senior']};
 const female={image:SENIORIN.image,prompt:'Was passt?',options:shuffle(['die Seniorin','der Senior','die Sekretärin','die Aushilfe']),answer:['die Seniorin']};
 task.items.splice(Math.min(at,task.items.length),0,male,female);
}
function replaceListenSenior(task){
 if(!Array.isArray(task?.items))return;
 let at=task.items.findIndex(x=>answersOf(x).some(a=>['die senioren','senioren','der senior','die seniorin'].includes(norm(a))));
 if(at<0)at=task.items.length;
 task.items=task.items.filter(x=>!answersOf(x).some(a=>['die senioren','senioren','der senior','die seniorin'].includes(norm(a))));
 const male={audioText:'der Senior',audioFile:SENIOR.audioFile,answer:['der Senior'],options:shuffle([
  {term:'der Senior',image:SENIOR.image},{term:'die Seniorin',image:SENIORIN.image},{term:'der Sekretär',image:CDN+'sekretaer.webp'},{term:'die Aushilfe',image:CDN+'aushilfe.webp'}
 ])};
 const female={audioText:'die Seniorin',audioFile:SENIORIN.audioFile,answer:['die Seniorin'],options:shuffle([
  {term:'die Seniorin',image:SENIORIN.image},{term:'der Senior',image:SENIOR.image},{term:'die Sekretärin',image:CDN+'sekretaerin.webp'},{term:'die Aushilfe',image:CDN+'aushilfe.webp'}
 ])};
 task.items.splice(Math.min(at,task.items.length),0,male,female);
}
function cleanOldSeniorOptions(theme){
 for(const task of theme.tasks||[]){
  for(const item of task?.items||[]){
   if(!Array.isArray(item?.options))continue;
   item.options=item.options.map(option=>{
    if(typeof option==='string'&&['die senioren','senioren'].includes(norm(option)))return 'der Senior';
    if(option&&typeof option==='object'&&['die senioren','senioren'].includes(norm(option.term)))return {term:'der Senior',image:SENIOR.image};
    return option;
   });
  }
 }
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const cards=cardTask(theme);
 if(cards?.items)splitVocab(cards.items);
 if(Array.isArray(theme.vocabularyOverviewItems))splitVocab(theme.vocabularyOverviewItems);
 if(Array.isArray(theme.overviewOnlyItems))splitVocab(theme.overviewOnlyItems);
 const imageTask=(theme.tasks||[]).find(t=>String(t?.id||'').includes('bild-wort'));
 const listenTask=(theme.tasks||[]).find(t=>String(t?.id||'').includes('hoeren-bild'));
 replaceImageSenior(imageTask);
 replaceListenSenior(listenTask);
 cleanOldSeniorOptions(theme);
 const source=cards?.items||theme.vocabularyOverviewItems||[];
 theme.acceptedVocabularyTerms=source.map(termOf).filter(Boolean);
 theme.contentRevision=String(theme.contentRevision||'')+'-senior-gender-20260903-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T4_SENIOR_GENDER_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);
 apply(theme);
 return themes;
}).catch(error=>{console.error('L8T4 Senior/Seniorin',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_SENIOR_GENDER_READY;
window.L8T4SeniorGender20260903={apply,version:1,senior:SENIOR,seniorin:SENIORIN};
})();
