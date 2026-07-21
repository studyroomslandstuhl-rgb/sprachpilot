(function(){
'use strict';
function install(){
 if(typeof RELEASE_CATALOG==='undefined'||!window.ReleaseDraft)return false;
 RELEASE_CATALOG.modules=(RELEASE_CATALOG.modules||[]).filter(function(m){return m&&m.key!=='Verben A1'&&m.key!=='verben-A1'&&m.key!=='Verben Test'&&m.key!=='verben-test'&&m.key!=='Verben'});
 RELEASE_CATALOG.modules.push({key:'Verben',title:'Verben'});
 if(!ReleaseDraft.__verbGroupsPatched){
  ReleaseDraft.__verbGroupsPatched=true;
  var oldNormalize=ReleaseDraft.normalizeBeforeSave;
  ReleaseDraft.normalizeBeforeSave=function(){
   var oldEnabled=this.getAny([
    ['enabledModules','Verben'],['releases','Verben','enabled'],['enabledModules','verben'],['releases','verben','enabled'],
    ['enabledModules','Verben A1'],['releases','Verben A1','enabled'],['enabledModules','verben-A1'],['releases','verben-A1','enabled'],
    ['enabledModules','Verben Test'],['releases','Verben Test','enabled'],['enabledModules','verben-test'],['releases','verben-test','enabled']
   ],false)===true;
   var data=typeof oldNormalize==='function'?oldNormalize.call(this):this.data;
   this.set(['enabledModules','Verben'],oldEnabled);
   this.set(['enabledModules','verben'],oldEnabled);
   this.set(['releases','Verben','enabled'],oldEnabled);
   this.set(['releases','verben','enabled'],oldEnabled);
   ['Verben A1','verben-A1','Verben Test','verben-test'].forEach(function(key){ReleaseDraft.set(['enabledModules',key],false);ReleaseDraft.set(['releases',key,'enabled'],false)});
   return this.data||data;
  };
 }
 window.renderVerbReleaseSection=function(){
  var verbs=[...new Set((window.ALL_VERBS||[]).map(function(x){return x&&x.v}).filter(Boolean))];
  var groups=[];for(var i=0;i<verbs.length;i+=20)groups.push(verbs.slice(i,i+20));
  return '<details class="release-section"><summary>Verben · '+groups.length+' feste Gruppen</summary><div class="debug-box small">Aktiviere oben im Bereich „Module“ das Modul <b>Verben</b>. Dann können die Teilnehmer jede Gruppe selbst auswählen. Die Gruppen 1–12 enthalten je 20 Verben; die letzte Gruppe enthält '+(groups.length?groups[groups.length-1].length:0)+' Verben.</div><div class="release-grid">'+groups.map(function(list,index){return '<div class="check-row"><span><b>Gruppe '+(index+1)+'</b><br><small>'+list.join(', ')+'</small></span></div>'}).join('')+'</div></details>';
 };
 return true;
}
if(!install()){setTimeout(install,50);setTimeout(install,400)}
})();
