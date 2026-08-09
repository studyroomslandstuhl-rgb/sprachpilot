(function(){
'use strict';
const GROUP_SIZE=20;
function allVerbs(){return[...new Set((window.ALL_VERBS||[]).map(x=>x&&x.v).filter(Boolean))]}
function paths(v){return[['enabledWords',v],['enabledWords','verben/'+v],['enabledWords','Verben/'+v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben','words',v],['releases','Verben','words',v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]]}
function uniq(list){const seen=new Set(),out=[];(list||[]).forEach(v=>{v=String(v||'').trim();if(v&&!seen.has(v)){seen.add(v);out.push(v)}});return out}
function readOrder(data){
 const candidates=[data?.verbReleaseOrder,data?.releases?.Verben?.wordOrder,data?.releases?.verben?.wordOrder,data?.releases?.['Verben A1']?.wordOrder,data?.releases?.['verben-A1']?.wordOrder]
  .filter(Array.isArray).map(uniq).filter(list=>list.length);
 if(!candidates.length)return[];
 const votes=new Map();
 for(const list of candidates){const key=list.join('\u0001'),entry=votes.get(key)||{list,count:0};entry.count++;votes.set(key,entry)}
 return [...votes.values()].sort((a,b)=>b.count-a.count||b.list.length-a.list.length)[0].list.slice()
}
function writeOrder(draft,order){
 order=uniq(order);
 draft.data=draft.data||{};
 draft.data.verbReleaseOrder=order.slice();
 draft.set(['releases','Verben','wordOrder'],order.slice());
 draft.set(['releases','verben','wordOrder'],order.slice());
 draft.set(['releases','Verben A1','wordOrder'],order.slice());
 draft.set(['releases','verben-A1','wordOrder'],order.slice());
 return order
}
function enabled(draft,v){return draft.getAny(paths(v),false)===true}
function normalizeOrder(draft,seed){
 const all=allVerbs(),allowed=new Set(all),enabledSet=new Set(all.filter(v=>enabled(draft,v)));
 let order=uniq((seed&&seed.length?seed:readOrder(draft.data))).filter(v=>allowed.has(v)&&enabledSet.has(v));
 const seen=new Set(order);
 all.forEach(v=>{if(enabledSet.has(v)&&!seen.has(v)){seen.add(v);order.push(v)}});
 return writeOrder(draft,order)
}
function install(){
 const draft=window.ReleaseDraft;if(!draft||draft.__verbReleaseOrderV4)return false;
 draft.__verbReleaseOrderV4=true;
 const oldOpen=draft.open;
 draft.open=function(course){
  const saved=readOrder(course||{});
  const result=oldOpen.apply(this,arguments);
  normalizeOrder(this,saved);
  return result
 };
 const oldSetVerb=draft.setVerb;
 draft.setVerb=function(v,value){
  const result=oldSetVerb.call(this,v,value);
  let order=readOrder(this.data);
  if(value){if(!order.includes(v))order.push(v)}else order=order.filter(x=>x!==v);
  writeOrder(this,order);
  return result
 };
 const oldNormalize=draft.normalizeBeforeSave;
 draft.normalizeBeforeSave=function(){
  const result=typeof oldNormalize==='function'?oldNormalize.call(this):this.data;
  normalizeOrder(this);
  return this.data||result
 };
 const oldRender=window.renderVerbReleaseSection;
 if(typeof oldRender==='function')window.renderVerbReleaseSection=function(){
  const order=normalizeOrder(draft),groups=Math.ceil(order.length/GROUP_SIZE),last=order.length?((order.length-1)%GROUP_SIZE)+1:0;
  const status='<div class="debug-box small"><strong>Maximal 20 Verben pro Gruppe.</strong> '+order.length+' freigegeben · '+groups+' Gruppe'+(groups===1?'':'n')+(groups?(' · letzte Gruppe: '+last+' Verb'+(last===1?'':'en')):'')+'. Neu freigeschaltete Verben werden immer hinten angefügt. Abweichende alte Reihenfolge-Felder werden beim Speichern vereinheitlicht.</div>';
  return status+oldRender.apply(this,arguments)
 };
 window.SPVerbReleaseOrder={normalize:()=>normalizeOrder(draft),read:()=>readOrder(draft.data),groupSize:GROUP_SIZE};
 return true
}
if(!install()){setTimeout(install,60);setTimeout(install,500)}
})();
