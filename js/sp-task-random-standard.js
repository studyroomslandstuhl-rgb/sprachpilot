(function(){
'use strict';
if(window.SPTaskRandomStandard)return;
const path=String(location.pathname||'').match(/\/wortschatz\/A\d-Lektion-(\d+)\/Thema-(\d+)\//i);
if(!path)return;
const lesson=Number(path[1]),theme=Number(path[2]);
const taskId=String(new URLSearchParams(location.search).get('task')||'').trim();
const shuffledArrays=new WeakSet();
const shuffledOptionObjects=new WeakSet();
const renderedContainers=new WeakMap();

function fisherYates(list){
 if(!Array.isArray(list)||list.length<2||shuffledArrays.has(list))return list;
 for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}
 shuffledArrays.add(list);return list;
}
function stableItems(list){return Array.isArray(list)&&list.length>1&&list.every(x=>x==null||typeof x!=='object'||String(x.id??x.key??x.uid??'').trim())}
function shuffleOptions(item){
 if(!item||typeof item!=='object'||shuffledOptionObjects.has(item))return;
 const keys=['options','choices','alternatives','o'];
 for(const key of keys){
  const list=item[key];if(!Array.isArray(list)||list.length<2)continue;
  const oldCorrectIndex=Number.isInteger(Number(item.correctIndex))?Number(item.correctIndex):null;
  const oldAnswerIndex=Number.isInteger(Number(item.answerIndex))?Number(item.answerIndex):null;
  const correctValue=oldCorrectIndex!=null?list[oldCorrectIndex]:undefined;
  const answerValue=oldAnswerIndex!=null?list[oldAnswerIndex]:undefined;
  fisherYates(list);
  if(oldCorrectIndex!=null&&correctValue!==undefined)item.correctIndex=list.indexOf(correctValue);
  if(oldAnswerIndex!=null&&answerValue!==undefined)item.answerIndex=list.indexOf(answerValue);
 }
 shuffledOptionObjects.add(item);
}
function shuffleItemList(list){
 if(!Array.isArray(list))return false;
 list.forEach(item=>{
  shuffleOptions(item);
  if(item&&typeof item==='object')for(const key of ['items','questions','exercises','aufgaben'])if(stableItems(item[key]))shuffleItemList(item[key]);
 });
 if(stableItems(list))fisherYates(list);
 return true;
}
function dataObjects(){
 const out=[];const push=x=>{if(x&&typeof x==='object'&&!out.includes(x))out.push(x)};
 push(window[`L${lesson}T${theme}`]);push(window[`L${lesson}_T${theme}`]);push(window[`L${lesson}_THEME`]);push(window.SP_THEME);push(window.SP_CURRENT_THEME);push(window.THEME);
 const all=window[`L${lesson}_THEMES`]||window[`L${lesson}_ALL_THEMES`];if(all){push(all[theme]);push(all[String(theme)]);push(all[theme-1])}
 try{for(const key of Object.keys(window)){if(new RegExp(`^L${lesson}.*T${theme}`,'i').test(key)){let v;try{v=window[key]}catch(e){};push(v)}}}catch(e){}
 return out;
}
function taskOf(D){return Array.isArray(D?.tasks)?D.tasks.find(t=>String(t?.id||'')===taskId):null}
function collectionFor(D,t){
 if(!D||!t)return null;
 for(const key of ['items','questions','exercises','aufgaben'])if(Array.isArray(t[key]))return t[key];
 const map={cards:'cards',listen:'listen',defs:'defs',speak:'speak',forms:'forms',gaps:'gaps',modals:'modals',sequences:'sequences',exam:'exam'};
 const key=map[String(t.kind||t.type||'').toLowerCase()];
 if(key&&Array.isArray(D[key]))return D[key];
 if(Array.isArray(D[taskId]))return D[taskId];
 if((t.exam===true||/pruefung|prüfung|exam/i.test(`${t.id||''} ${t.title||''}`))&&Array.isArray(D.exam))return D.exam;
 return null;
}
function randomizeData(){
 if(!taskId)return false;let changed=false;
 for(const D of dataObjects()){
  const t=taskOf(D);if(!t)continue;
  const list=collectionFor(D,t);if(list){shuffleItemList(list);changed=true}
 }
 return changed;
}
function textKey(node){return String(node?.dataset?.value||node?.dataset?.answer||node?.value||node?.textContent||'').trim()}
function randomizeRenderedOptions(){
 const selectors=['.l8-options','.l7-options','.options','[data-options]','.answer-options','.choice-options','.image-options'];
 document.querySelectorAll(selectors.join(',')).forEach(box=>{
  const children=[...box.children].filter(n=>n.matches?.('button,label,.l8-option,.l7-option,[data-value],[data-answer],.option,.choice'));
  if(children.length<2)return;
  const signature=children.map(textKey).sort().join('\u241f');if(renderedContainers.get(box)===signature)return;
  const order=[...children];for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]]}
  order.forEach(n=>box.appendChild(n));renderedContainers.set(box,signature);
 });
}
function run(){randomizeData();randomizeRenderedOptions()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
[0,40,120,300,700,1400].forEach(ms=>setTimeout(run,ms));
try{let timer=null;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(randomizeRenderedOptions,35)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.SPTaskRandomStandard={version:'1.0',shuffle:fisherYates,randomizeData,randomizeRenderedOptions,lesson,theme,taskId};
})();
