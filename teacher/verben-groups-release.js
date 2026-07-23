(function(){
'use strict';
const SEP=new Set(['aufräumen','einkaufen','anrufen','fernsehen','anfangen','aussterben','aufmachen','zumachen','mitgeben','mitnehmen','aufstehen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','ausfüllen','anmelden','mitkommen','zurückkommen','abbiegen','abholen','ausleihen','vorhaben','aufgeben','zuhören','zusehen','abschreiben','vorlesen','ausfallen','aufbacken','austauschen','ablenken','absagen','abraten','vorschlagen','aussuchen','sich vorstellen','losfahren','dabeihaben','leidtun','kennenlernen','einladen','hinweisen','auffallen','einfallen','hinzufügen']);
const REF=new Set(['anmelden','sich verändern','sich benehmen','sich vorstellen','sich kämmen','sich rasieren','sich schminken','sich bewegen','sich konzentrieren','sich kümmern','sich interessieren','sich erinnern','sich anziehen','sich ausziehen','sich umziehen','sich duschen','sich freuen','sich ärgern','sich beschweren','sich überlegen']);
const MOD=new Set(['können','müssen','wollen','dürfen','sollen','möchten','mögen']);
const IRR=new Set(['sein','haben','werden','tun','wissen','kommen','gehen','bringen','denken','gewinnen','springen','verlieren','beißen','gießen','reißen','genießen','singen','schließen','rennen','finden','schneiden','streiten','essen','sprechen','fahren','schlafen','sehen','lesen','rufen','schreien','schieben','ziehen','empfehlen','geben','befehlen','helfen','braten','waschen','nehmen','stehlen','tragen','brechen','laufen','vergessen','messen','fressen','graben','schlagen','sterben','treffen','werfen','fangen','blasen','fallen','saufen','halten','laden','lassen','wachsen','werben','raten','stechen','gefallen','bleiben','einladen','aufgeben','zusehen','abschreiben','vorlesen','verschlafen','anfangen','versprechen','lügen','sich benehmen','ausfallen','aufbacken','abraten','beraten','vorschlagen','losfahren','dabeihaben','leidtun','bieten','bitten','nennen','sitzen','treiben','binden','brennen','erschrecken','fliehen','fließen','frieren','gelingen','gelten','geschehen','gleichen','heben','klingen','leiden','leihen','meiden','reiben','scheiden','scheinen','schießen','schmeißen','treten','verzeihen','weisen','hinweisen','auffallen','einfallen','wiegen','zwingen','spazieren gehen']);
const INSEP=/^(be|emp|ent|er|ge|miss|ver|zer)/;
function paths(v){return[['enabledWords',v],['enabledWords','verben/'+v],['enabledWords','Verben/'+v],['enabledWords','verben-A1/'+v],['enabledWords','Verben A1/'+v],['releases','verben','words',v],['releases','Verben','words',v],['releases','verben-A1','words',v],['releases','Verben A1','words',v]]}
function verbs(){return[...new Set((window.ALL_VERBS||[]).map(x=>x&&x.v).filter(Boolean))]}
function prefix(v){const bare=String(v).replace(/^sich\s+/,'');return SEP.has(v)||INSEP.test(bare)}
function categories(){
 const all=verbs(),used=new Set(),take=fn=>all.filter(v=>!used.has(v)&&fn(v)).map(v=>(used.add(v),v));
 return[
  ['Trennbare / nicht trennbare Verben',take(prefix)],
  ['Reflexive Verben',take(v=>REF.has(v)||v.startsWith('sich '))],
  ['Modalverben',take(v=>MOD.has(v))],
  ['Starke / unregelmäßige Verben',take(v=>IRR.has(v))],
  ['Regelmäßige Verben',take(()=>true)]
 ]
}
function install(){
 if(typeof RELEASE_CATALOG==='undefined'||!window.ReleaseDraft||typeof releaseCheck!=='function')return false;
 RELEASE_CATALOG.modules=(RELEASE_CATALOG.modules||[]).filter(m=>m&&!['Verben A1','verben-A1','Verben Test','verben-test','Verben','verben'].includes(m.key));
 RELEASE_CATALOG.modules.push({key:'Verben',title:'Verben'});
 ReleaseDraft.verbPaths=paths;
 ReleaseDraft.setVerb=function(v,value){this.setMany(paths(v),!!value);if(value)this.enableModule('Verben')};
 ReleaseDraft.verbChecked=function(v){return this.getAny(paths(v),false)===true};
 ReleaseDraft.setVerbList=function(list,value){(list||[]).forEach(v=>this.setVerb(v,value));if(value)this.enableModule('Verben')};
 ReleaseDraft.allVerbListChecked=function(list){return!!list.length&&list.every(v=>this.verbChecked(v))};
 ReleaseDraft.setAllVerbs=function(value){this.setVerbList(verbs(),value)};
 ReleaseDraft.allVerbsChecked=function(){return this.allVerbListChecked(verbs())};
 if(!ReleaseDraft.__verbGroupsV2){
  ReleaseDraft.__verbGroupsV2=true;
  const oldNormalize=ReleaseDraft.normalizeBeforeSave;
  ReleaseDraft.normalizeBeforeSave=function(){
   const data=typeof oldNormalize==='function'?oldNormalize.call(this):this.data;
   const enabled=this.getAny([['enabledModules','Verben'],['releases','Verben','enabled'],['enabledModules','verben'],['releases','verben','enabled']],false)===true;
   this.setMany([['enabledModules','Verben'],['enabledModules','verben'],['releases','Verben','enabled'],['releases','verben','enabled']],enabled);
   ['Verben A1','verben-A1','Verben Test','verben-test'].forEach(k=>{this.set(['enabledModules',k],false);this.set(['releases',k,'enabled'],false)});
   verbs().forEach(v=>this.setVerb(v,this.getAny(paths(v),false)===true));
   return this.data||data
  }
 }
 window.__verbReleaseLists={};
 window.renderVerbReleaseSection=function(){
  const cats=categories();
  let html='<details class="release-section" open><summary>Verben auswählen</summary>';
  html+='<div class="toolbar"><button type="button" onclick="ReleaseDraft.setAllVerbs(true);TeacherApp.render()">Alle auswählen</button><button type="button" class="secondary" onclick="ReleaseDraft.setAllVerbs(false);TeacherApp.render()">Auswahl löschen</button></div>';
  cats.forEach((item,i)=>{const title=item[0],list=item[1],key='verbcat'+i;window.__verbReleaseLists[key]=list;html+='<details class="release-sub"><summary>'+title+' · '+list.length+'</summary>'+releaseCheck('Alle auswählen',[['bulkVerbCategory',key]],'ReleaseDraft.setVerbList(window.__verbReleaseLists["'+key+'"],this.checked)',ReleaseDraft.allVerbListChecked(list))+'<div class="release-grid">'+list.map(v=>releaseCheck(v,paths(v),'ReleaseDraft.setVerb('+JSON.stringify(v)+',this.checked)',ReleaseDraft.verbChecked(v))).join('')+'</div></details>'});
  return html+'</details>'
 };
 return true
}
if(!install()){setTimeout(install,50);setTimeout(install,400)}
})();