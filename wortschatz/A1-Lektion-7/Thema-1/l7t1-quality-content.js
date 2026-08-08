(function(){
'use strict';
if(window.__SP_L7T1_QUALITY_CONTENT_2)return;
window.__SP_L7T1_QUALITY_CONTENT_2=true;

function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim()}
function fullWord(item){
 const direct=String(item?.full||item?.word||item?.answer||item?.term||'').trim();
 const article=String(item?.article||'').trim();
 return article&&!/^(der|die|das)\s/i.test(direct)?`${article} ${direct}`.trim():direct;
}
function isNoun(item){return!!item?.article||/^(der|die|das)\s/i.test(fullWord(item))||String(item?.category||item?.type||'').toLowerCase()==='noun'}
function isWrongModalFallback(item){
 const text=norm(`${item?.prompt||''} ${item?.context||''}`);
 const answer=norm(item?.answer||'');
 return answer==='kann'&&(text.includes('schreibe das passende modalverb')||text.includes('welche form passt ich'));
}
function articleItems(theme){
 const cardsTask=(theme.tasks||[]).find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 const cards=Array.isArray(cardsTask?.items)?cardsTask.items:[];
 const nouns=cards.filter(isNoun);
 return nouns.map(item=>{
  const singular=fullWord(item);
  const match=singular.match(/^(der|die|das)\s+(.+)$/i);
  if(!match)return null;
  const noun=match[2];
  const plural=String(item.plural||'kein Plural').trim()||'kein Plural';
  const answer=`${singular} – ${plural}`;
  return{
   kind:'input',
   prompt:`${noun}: Schreibe den Singular und den Plural mit Artikel.`,
   context:'Beispiel: Spiel → das Spiel – die Spiele',
   answer,
   answers:[answer],
   hint:`Beginne mit „${match[1].toLowerCase()} ${noun}“.`
  };
 }).filter(Boolean);
}
function ensureModalVariety(task){
 if(!task||task.id!=='modalverb-waehlen'||!Array.isArray(task.items))return;
 const answers=new Set(task.items.map(item=>norm(item?.answer)).filter(Boolean));
 if(answers.size>=3)return;
 const extra=[
  {kind:'choice',prompt:'Ich ___ gut singen.',answer:'kann',options:['kann','will','möchte','können'],hint:'Fähigkeit: können.'},
  {kind:'choice',prompt:'Du ___ heute Tennis spielen. Das ist dein Plan.',answer:'willst',options:['willst','kannst','möchtest','wollen'],hint:'Plan: wollen.'},
  {kind:'choice',prompt:'Ich ___ gern einen Tee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'Höflicher Wunsch: möchten.'},
  {kind:'choice',prompt:'Wir ___ gut Fahrrad fahren.',answer:'können',options:['können','wollen','möchten','kann'],hint:'Fähigkeit: können.'},
  {kind:'choice',prompt:'Ihr ___ am Wochenende Ski fahren. Das ist euer Plan.',answer:'wollt',options:['wollt','könnt','möchtet','wollen'],hint:'Plan: wollen.'},
  {kind:'choice',prompt:'Frau Klein ___ einen Kaffee.',answer:'möchte',options:['möchte','will','kann','möchten'],hint:'Höflicher Wunsch: möchten.'}
 ];
 task.items=[...task.items,...extra];
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const report={removedWrongFallbacks:[],emptyTasks:[],articleCount:0};
 for(const task of theme.tasks){
  if(!Array.isArray(task.items))task.items=[];
  const modal=/modal|koennen|wollen|verbform/i.test(String(task.id||''));
  if(!modal){
   const before=task.items.length;
   task.items=task.items.filter(item=>!isWrongModalFallback(item));
   if(task.items.length!==before)report.removedWrongFallbacks.push(task.id);
  }
 }
 const article=theme.tasks.find(task=>task.id==='artikel-plural');
 if(article){
  const rebuilt=articleItems(theme);
  if(rebuilt.length){
   article.kind='input';
   article.title='Artikel und Plural';
   article.description='Schreibe Singular und Plural mit Artikel.';
   article.items=rebuilt;
  }
  report.articleCount=article.items.length;
 }
 ensureModalVariety(theme.tasks.find(task=>task.id==='modalverb-waehlen'));
 report.emptyTasks=theme.tasks.filter(task=>!task.exam&&(!Array.isArray(task.items)||!task.items.length)).map(task=>task.id);
 theme.qualityRevision='l7t1-quality-content-2026-08-08-v2';
 window.L7T1QualityReport=report;
 return theme;
});
})();
