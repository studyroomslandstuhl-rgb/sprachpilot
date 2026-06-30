(function(){
  try{
    if(window.ALL_VERBS){
      const existing=new Set(window.ALL_VERBS.map(x=>x.v));
      [
        {v:'vergeben',img:'vergeben',level:'A2'},
        {v:'verbringen',img:'verbringen',level:'A2'},
        {v:'kennenlernen',img:'kennenlernen',level:'A1'},
        {v:'bleiben',img:'bleiben',level:'A1'},
        {v:'einladen',img:'einladen',level:'A1'}
      ].forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
    }
    if(typeof STRONG_IRREGULAR_VERBS!=='undefined'){
      ['anfangen','beginnen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen','vergeben','bleiben','einladen'].forEach(v=>STRONG_IRREGULAR_VERBS.add(v));
    }
  }catch(e){console.warn('Neue Verben konnten nicht klassifiziert werden',e)}
  function installAssessmentOption(){
    if(!window.ReleaseDraft||typeof window.renderVerbReleaseSection!=='function'||window.__verbAssessmentOptionInstalled)return;
    window.__verbAssessmentOptionInstalled=true;
    ReleaseDraft.verbAssessmentEnabled=function(){
      var v=this.getAny([
        ['settings','verben-A1','assessmentEnabled'],
        ['settings','Verben A1','assessmentEnabled'],
        ['verbenA1AssessmentEnabled']
      ],undefined);
      return v===undefined?true:v===true;
    };
    ReleaseDraft.setVerbAssessment=function(value){
      this.set(['settings','verben-A1','assessmentEnabled'],!!value);
      this.set(['settings','Verben A1','assessmentEnabled'],!!value);
      this.set(['verbenA1AssessmentEnabled'],!!value);
      this.enableModule('Verben A1');
    };
    var oldRenderVerbReleaseSection=window.renderVerbReleaseSection;
    window.renderVerbReleaseSection=function(){
      var html='<details class="release-section" open><summary>Verben A1 · Start und Einschätzung</summary>';
      html+='<div class="debug-box small"><b>Einschätzung aktiv:</b> Schüler sehen Muttersprache und schreiben das deutsche Verb. <br><b>Einschätzung aus:</b> Schüler starten direkt mit den ersten 20 freigegebenen Verben.</div>';
      html+=releaseCheck('Schüler sollen Verben selbst einschätzen',[['settings','verben-A1','assessmentEnabled']],'ReleaseDraft.setVerbAssessment(this.checked)',ReleaseDraft.verbAssessmentEnabled());
      html+='</details>';
      return html+oldRenderVerbReleaseSection();
    };
  }
  installAssessmentOption();
  setTimeout(installAssessmentOption,50);
  setTimeout(installAssessmentOption,500);
})();
