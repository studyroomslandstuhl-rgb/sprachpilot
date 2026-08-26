(function(){
  if(typeof RELEASE_CATALOG==='undefined'||!RELEASE_CATALOG||!Array.isArray(RELEASE_CATALOG.modules))return;

  function ensureModule(key,title){
    var exists=RELEASE_CATALOG.modules.some(function(module){return module&&module.key===key;});
    if(!exists)RELEASE_CATALOG.modules.push({key:key,title:title});
  }

  ensureModule('Irreguläre Verben','Irreguläre Verben');
  ensureModule('Dativverben','Dativverben');

  if(typeof ReleaseDraft==='undefined'||typeof renderReleaseEditor!=='function'||typeof releaseCheck!=='function')return;

  var DATIV_LEVELS=[
    {key:'A1',count:11,title:'A1 · Grundlagen'},
    {key:'A2',count:15,title:'A2 · Alltag'},
    {key:'B1',count:12,title:'B1 · Erweiterung'},
    {key:'B2',count:6,title:'B2 · Fortgeschritten'},
    {key:'C1',count:3,title:'C1 · Sicher anwenden'}
  ];

  function dativLevelPaths(level){
    return [
      ['enabledSets','dativverben/'+level],
      ['enabledSets','Dativverben/'+level],
      ['releases','dativverben','levels',level,'enabled'],
      ['releases','Dativverben','levels',level,'enabled']
    ];
  }

  ReleaseDraft.enableDativModule=function(){
    this.setMany([
      ['enabledModules','Dativverben'],
      ['releases','Dativverben','enabled'],
      ['releases','dativverben','enabled']
    ],true);
    // Der bestehende Dativbereich nutzt aktuell noch die Verben-Grundfreigabe als Basisschutz.
    // Deshalb wird sie beim Freigeben eines Dativ-Niveaus automatisch mit aktiviert.
    this.enableModule('Verben A1');
  };

  ReleaseDraft.setDativLevel=function(level,value){
    this.setMany(dativLevelPaths(level),value);
    if(value)this.enableDativModule();
  };

  ReleaseDraft.setAllDativLevels=function(value){
    var self=this;
    DATIV_LEVELS.forEach(function(item){self.setDativLevel(item.key,value);});
  };

  ReleaseDraft.allDativLevelsChecked=function(){
    return DATIV_LEVELS.every(function(item){
      return ReleaseDraft.getAny(dativLevelPaths(item.key),false);
    });
  };

  var baseNormalize=ReleaseDraft.normalizeBeforeSave;
  ReleaseDraft.normalizeBeforeSave=function(){
    var result=baseNormalize.call(this);
    var self=this;
    DATIV_LEVELS.forEach(function(item){
      self.setDativLevel(item.key,self.getAny(dativLevelPaths(item.key),false));
    });
    return result;
  };

  var baseRenderReleaseEditor=renderReleaseEditor;
  renderReleaseEditor=function(course){
    var html=baseRenderReleaseEditor(course);
    html+='<details class="release-section" open><summary>Dativverben · Niveaustufen freigeben</summary>';
    html+='<div class="debug-box small">Freigabe nach GER-Niveau. Ein Häkchen schaltet alle Dativverben dieser Niveaustufe für den Kurs frei.</div>';
    html+=releaseCheck('Alle Niveaustufen freigeben',[['bulkDativLevels','all']],'ReleaseDraft.setAllDativLevels(this.checked)',ReleaseDraft.allDativLevelsChecked());
    html+='<div class="release-grid">';
    DATIV_LEVELS.forEach(function(item){
      html+=releaseCheck(item.title+' · '+item.count+' Verben',dativLevelPaths(item.key),'ReleaseDraft.setDativLevel("'+item.key+'",this.checked)');
    });
    html+='</div></details>';
    return html;
  };
  window.renderReleaseEditor=renderReleaseEditor;
})();
