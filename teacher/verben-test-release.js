(function(){
  if(window.__SP_VERBEN_TEST_RELEASE__)return;
  window.__SP_VERBEN_TEST_RELEASE__=true;

  function installCatalog(){
    if(typeof RELEASE_CATALOG==='undefined'||!RELEASE_CATALOG)return;
    RELEASE_CATALOG.modules=Array.isArray(RELEASE_CATALOG.modules)?RELEASE_CATALOG.modules:[];
    if(!RELEASE_CATALOG.modules.some(function(m){return m&&m.key==='Verben Test'})){
      RELEASE_CATALOG.modules.push({key:'Verben Test',title:'Verben Test'});
    }
  }
  function installDraftAliases(){
    if(typeof ReleaseDraft==='undefined'||!ReleaseDraft||ReleaseDraft.__verbenTestPatched)return;
    ReleaseDraft.__verbenTestPatched=true;
    var oldEnable=ReleaseDraft.enableModule;
    ReleaseDraft.enableModule=function(moduleName){
      if(typeof oldEnable==='function')oldEnable.call(this,moduleName);
      if(moduleName==='Verben Test'){
        this.set(['enabledModules','Verben Test'],true);
        this.set(['enabledModules','verben-test'],true);
        this.set(['releases','Verben Test','enabled'],true);
        this.set(['releases','verben-test','enabled'],true);
      }
    };
    var oldNormalize=ReleaseDraft.normalizeBeforeSave;
    ReleaseDraft.normalizeBeforeSave=function(){
      var data=typeof oldNormalize==='function'?oldNormalize.call(this):this.data;
      var enabled=this.getAny([
        ['enabledModules','Verben Test'],
        ['enabledModules','verben-test'],
        ['releases','Verben Test','enabled'],
        ['releases','verben-test','enabled']
      ],false)===true;
      this.set(['enabledModules','Verben Test'],enabled);
      this.set(['enabledModules','verben-test'],enabled);
      this.set(['releases','Verben Test','enabled'],enabled);
      this.set(['releases','verben-test','enabled'],enabled);
      return this.data||data;
    };
  }
  installCatalog();
  installDraftAliases();
})();
