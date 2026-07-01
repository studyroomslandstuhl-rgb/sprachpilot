(function(){
  try{
    if(window.ALL_VERBS){
      const existing=new Set(window.ALL_VERBS.map(x=>x.v));
      [
        {v:'vergeben',img:'vergeben',level:'A2'},
        {v:'verbringen',img:'verbringen',level:'A2'},
        {v:'kennenlernen',img:'kennenlernen',level:'A1',type:'separable'},
        {v:'bleiben',img:'bleiben',level:'A1'},
        {v:'einladen',img:'einladen',level:'A1',type:'separable'}
      ].forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
    }
    if(typeof STRONG_IRREGULAR_VERBS!=='undefined'){
      ['anfangen','beginnen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen','vergeben','bleiben','einladen','biegen','abbiegen','können','müssen','wollen','dürfen','sollen','möchten','mögen','vorhaben','aufgeben','zusehen','abschreiben','vorlesen','verschlafen'].forEach(v=>STRONG_IRREGULAR_VERBS.add(v));
    }
  }catch(e){console.warn('Neue Verben konnten nicht klassifiziert werden',e)}

  const MODAL_VERBS=['können','müssen','wollen','dürfen','sollen','möchten','mögen'];
  const REFLEXIVE_VERBS=['anmelden','sich anmelden','sich bewerben','sich erinnern','sich beschweren'];
  const SEPARABLE_VERBS=['aufräumen','einkaufen','anrufen','fernsehen','anfangen','aussterben','aufmachen','zumachen','mitgeben','mitnehmen','kennenlernen','einladen','aufstehen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','ausfüllen','anmelden','mitkommen','zurückkommen','abbiegen','vorhaben','aufgeben','zuhören','zusehen','abschreiben','vorlesen'];
  const INSEPARABLE_PREFIX_VERBS=['bezahlen','bekommen','beginnen','besuchen','bestellen','benutzen','beschreiben','berichten','beantragen','begründen','befehlen','begraben','entscheiden','erklären','erzählen','erreichen','erledigen','empfehlen','gefallen','gehören','verstehen','vergessen','verlieren','vergleichen','vermeiden','verbessern','verschlafen','verschieben','vereinbaren','vergeben','verbringen','verbiegen','vermieten','zerstören'];
  const IRREGULAR_EXTRA=['sein','haben','werden','wissen','tun','bleiben','beginnen','anfangen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen','vergeben','einladen','biegen','abbiegen','vorhaben','aufgeben','zusehen','abschreiben','vorlesen','verschlafen'];
  const INSEPARABLE_PREFIX_RE=/^(be|emp|ent|er|ge|miss|ver|zer)/;

  function meta(v){return (window.VERB_META&&window.VERB_META[v])||{level:(window.VERB_LEVELS&&window.VERB_LEVELS[v])||'A1',type:'normal'};}
  function allVerbNames(){return (window.ALL_VERBS||[]).map(x=>x.v).filter(Boolean).sort(function(a,b){return a.localeCompare(b,'de',{sensitivity:'base'})});}
  function inList(v,list){return list.indexOf(v)>=0}
  function isModal(v){return inList(v,MODAL_VERBS)||((window.SP_MODAL_VERBS||[]).indexOf(v)>=0)||meta(v).modal||meta(v).type==='modal';}
  function isReflexive(v){return inList(v,REFLEXIVE_VERBS)||((window.SP_REFLEXIVE_VERBS||[]).indexOf(v)>=0)||meta(v).reflexive||String(meta(v).type||'').includes('reflexive');}
  function isSeparable(v){return inList(v,SEPARABLE_VERBS)||((window.SP_SEPARABLE_VERBS||[]).indexOf(v)>=0)||meta(v).separable||String(meta(v).type||'').includes('separable');}
  function isInseparablePrefix(v){return !isSeparable(v)&&(inList(v,INSEPARABLE_PREFIX_VERBS)||((window.SP_INSEPARABLE_PREFIX_VERBS||[]).indexOf(v)>=0)||meta(v).inseparablePrefix||String(meta(v).type||'').includes('inseparable')||INSEPARABLE_PREFIX_RE.test(v));}
  function isIrregular(v){return inList(v,IRREGULAR_EXTRA)||((window.SP_IRREGULAR_VERBS||[]).indexOf(v)>=0)||(typeof STRONG_IRREGULAR_VERBS!=='undefined'&&STRONG_IRREGULAR_VERBS.has(v))||meta(v).irregular||meta(v).strong;}
  function levelOf(v){return meta(v).level||((window.VERB_LEVELS&&window.VERB_LEVELS[v])||'A1');}
  function typeTags(v){
    const tags=[levelOf(v)];
    if(isModal(v))tags.push('Modalverb');
    if(isReflexive(v))tags.push('reflexiv');
    if(isSeparable(v))tags.push('trennbar');
    else if(isInseparablePrefix(v))tags.push('untrennbares Präfix');
    else tags.push('nicht trennbar');
    if(isIrregular(v)&&!isModal(v))tags.push('stark/irregulär');
    return tags;
  }
  function label(v){return '<b>'+v+'</b> <small>· '+typeTags(v).join(' · ')+'</small>';}
  function checkedCustom(list){return list.length&&list.every(function(v){return ReleaseDraft.getAny(verbReleasePaths(v),false)});}
  function setCustom(list,value){list.forEach(function(v){ReleaseDraft.setVerb(v,value)});}
  function renderCustomGroup(title,list,key,note){
    list=list||[];
    if(!list.length)return '<details class="release-sub"><summary>'+title+' · 0</summary><div class="empty">Keine Verben in diesem Block.</div></details>';
    window.__verbReleaseGroups=window.__verbReleaseGroups||{};window.__verbReleaseGroups[key]=list;
    return '<details class="release-sub"><summary>'+title+' · '+list.length+'</summary>'+(note?'<div class="debug-box small">'+note+'</div>':'')+releaseCheck('Alles in diesem Block freigeben',[['bulkVerbGroup',key]],'ReleaseDraft.setVerbGroup("'+key+'",this.checked)',checkedCustom(list))+'<div class="release-grid">'+list.map(function(v){return releaseCheck(label(v),verbReleasePaths(v),'ReleaseDraft.setVerb("'+v+'",this.checked)')}).join('')+'</div></details>';
  }
  function installVerbReleaseUI(){
    if(!window.ReleaseDraft||typeof window.renderVerbReleaseSection!=='function'||window.__verbReleaseGroupsInstalled)return;
    window.__verbReleaseGroupsInstalled=true;
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
    ReleaseDraft.setVerbGroup=function(key,value){setCustom((window.__verbReleaseGroups&&window.__verbReleaseGroups[key])||[],value);if(value)this.enableModule('Verben A1')};
    ReleaseDraft.allVerbGroupChecked=function(key){return checkedCustom((window.__verbReleaseGroups&&window.__verbReleaseGroups[key])||[])};
    window.renderVerbReleaseSection=function(){
      var verbs=allVerbNames();
      var modal=verbs.filter(isModal);
      var reflexive=verbs.filter(isReflexive);
      var separable=verbs.filter(isSeparable);
      var inseparable=verbs.filter(isInseparablePrefix);
      var irregular=verbs.filter(function(v){return !isModal(v)&&isIrregular(v)});
      var normal=verbs.filter(function(v){return !isModal(v)&&!isReflexive(v)&&!isSeparable(v)&&!isInseparablePrefix(v)&&!isIrregular(v)});
      var a1=verbs.filter(function(v){return levelOf(v)==='A1'});
      var a2=verbs.filter(function(v){return levelOf(v)==='A2'});
      var b1=verbs.filter(function(v){return levelOf(v)==='B1'});
      var html='<details class="release-section" open><summary>Verben A1 · Start und Einschätzung</summary>';
      html+='<div class="debug-box small"><b>Einschätzung aktiv:</b> Schüler sehen Muttersprache und schreiben das deutsche Verb. <br><b>Einschätzung aus:</b> Schüler starten direkt mit den ersten 20 freigegebenen Verben.</div>';
      html+=releaseCheck('Schüler sollen Verben selbst einschätzen',[['settings','verben-A1','assessmentEnabled']],'ReleaseDraft.setVerbAssessment(this.checked)',ReleaseDraft.verbAssessmentEnabled());
      html+='</details>';
      html+='<details class="release-section" open><summary>Verben A1 · nach Verbart freigeben</summary><div class="debug-box small">Ein Verb kann in mehreren Kontrollblöcken stehen, z. B. <b>anfangen</b> = trennbar + irregulär. Das Häkchen bleibt immer dasselbe Verb.</div>';
      html+=releaseCheck('Alle Verben freigeben',[['bulkVerbs','all']],'ReleaseDraft.setAllVerbs(this.checked,"all")',ReleaseDraft.allVerbsChecked('all'));
      html+=renderCustomGroup('Modalverben',modal,'modal','Eigener Block für können, müssen, wollen, dürfen, sollen, möchten, mögen.');
      html+=renderCustomGroup('Reflexivverben',reflexive,'reflexive','Reflexive Verben werden separat angezeigt.');
      html+=renderCustomGroup('Trennbare Verben',separable,'separable','Diese Verben trennen sich im Satz: Ich stehe ... auf.');
      html+=renderCustomGroup('Untrennbare Präfixverben',inseparable,'inseparable','Verben mit be-, emp-, ent-, er-, ge-, miss-, ver-, zer-. Sie bekommen keine zweite Präfix-Lücke.');
      html+=renderCustomGroup('Starke / irreguläre Verben',irregular,'irregular','Eigene Kategorie für unregelmäßige und starke Verben.');
      html+=renderCustomGroup('Normale nicht trennbare Verben',normal,'normal','Regelmäßige Verben ohne trennbares oder untrennbares Präfix.');
      html+='</details>';
      html+='<details class="release-section"><summary>Verben A1 · nach Niveau prüfen</summary><div class="debug-box small">Diese Blöcke sind zur Kontrolle der Niveau-Markierung. Die Freigabe ist dieselbe wie oben.</div>';
      html+=renderCustomGroup('A1-Verben',a1,'levelA1');
      html+=renderCustomGroup('A2-Verben',a2,'levelA2');
      html+=renderCustomGroup('B1-Verben',b1,'levelB1');
      html+='</details>';
      return html;
    };
  }
  installVerbReleaseUI();
  setTimeout(installVerbReleaseUI,50);
  setTimeout(installVerbReleaseUI,500);
})();