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
  }catch(e){console.warn('Neue Verben konnten nicht klassifiziert werden',e)}

  const MODAL_VERBS=['können','müssen','wollen','dürfen','sollen','möchten','mögen'];
  const REFLEXIVE_VERBS=['anmelden','bewerben','erinnern','beschweren','sich anmelden','sich bewerben','sich erinnern','sich beschweren'];
  const SEPARABLE_VERBS=['aufräumen','einkaufen','anrufen','fernsehen','anfangen','aussterben','aufmachen','zumachen','mitgeben','mitnehmen','kennenlernen','einladen','aufstehen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','ausfüllen','anmelden','mitkommen','zurückkommen','abbiegen','vorhaben','aufgeben','zuhören','zusehen','abschreiben','vorlesen'];
  const INSEPARABLE_PREFIX_VERBS=['bezahlen','bekommen','beginnen','besuchen','bestellen','benutzen','beschreiben','berichten','beantragen','begründen','befehlen','begraben','entscheiden','erklären','erzählen','erreichen','erledigen','empfehlen','gefallen','gehören','verstehen','vergessen','verlieren','vergleichen','vermeiden','verbessern','verschlafen','verschieben','vereinbaren','vergeben','verbringen','verbiegen','vermieten','zerstören'];
  const INSEPARABLE_PREFIX_RE=/^(be|emp|ent|er|ge|miss|ver|zer)/;
  const STRONG_A_UMLAUT=['fahren','abfahren','schlafen','verschlafen','gefallen','halten','tragen','waschen','laufen'];
  const STRONG_E_I=['geben','aufgeben','helfen','nehmen','sprechen','treffen','essen','sterben','werfen','werden','vergessen'];
  const STRONG_E_IE=['sehen','zusehen','lesen','vorlesen','empfehlen','stehlen'];
  const STRONG_SPECIAL=['sein','haben','werden','wissen','tun','bleiben','beginnen','anfangen','fernsehen','aussterben','begraben','verbiegen','mitgeben','mitnehmen','vergeben','einladen','biegen','abbiegen','vorhaben','abschreiben'];

  function esc(s){return String(s||'').replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]});}
  function bare(v){return String(v||'').replace(/^sich\s+/i,'');}
  function meta(v){return (window.VERB_META&&window.VERB_META[v])||{level:(window.VERB_LEVELS&&window.VERB_LEVELS[v])||'A1',type:'normal'};}
  function allVerbNames(){return [...new Set((window.ALL_VERBS||[]).map(x=>bare(x.v)).filter(Boolean))].sort(function(a,b){return a.localeCompare(b,'de',{sensitivity:'base'})});}
  function inList(v,list){return list.indexOf(v)>=0 || list.indexOf('sich '+v)>=0}
  function isModal(v){return inList(v,MODAL_VERBS)||((window.SP_MODAL_VERBS||[]).indexOf(v)>=0)||meta(v).modal||meta(v).type==='modal';}
  function isReflexive(v){return inList(v,REFLEXIVE_VERBS)||((window.SP_REFLEXIVE_VERBS||[]).indexOf(v)>=0)||meta(v).reflexive||String(meta(v).type||'').includes('reflexive');}
  function isSeparable(v){return inList(v,SEPARABLE_VERBS)||((window.SP_SEPARABLE_VERBS||[]).indexOf(v)>=0)||meta(v).separable||String(meta(v).type||'').includes('separable');}
  function isInseparablePrefix(v){return !isSeparable(v)&&(inList(v,INSEPARABLE_PREFIX_VERBS)||((window.SP_INSEPARABLE_PREFIX_VERBS||[]).indexOf(v)>=0)||meta(v).inseparablePrefix||String(meta(v).type||'').includes('inseparable')||INSEPARABLE_PREFIX_RE.test(v));}
  function levelOf(v){return meta(v).level||((window.VERB_LEVELS&&window.VERB_LEVELS[v])||'A1');}
  function strongGroup(v){
    if(inList(v,STRONG_A_UMLAUT))return 'a → ä';
    if(inList(v,STRONG_E_I))return 'e → i';
    if(inList(v,STRONG_E_IE))return 'e → ie';
    if(inList(v,STRONG_SPECIAL))return 'spezial';
    if((window.SP_IRREGULAR_VERBS||[]).indexOf(v)>=0||meta(v).irregular||meta(v).strong||(typeof STRONG_IRREGULAR_VERBS!=='undefined'&&STRONG_IRREGULAR_VERBS.has(v)))return 'spezial';
    return '';
  }
  function isStrong(v){return !isModal(v)&&!!strongGroup(v);}
  function sentence(v){return (window.VERB_SENTENCES&&window.VERB_SENTENCES[v])||(typeof window.sentenceForVerb==='function'?window.sentenceForVerb(v):'');}
  function displayVerb(v){return isReflexive(v)&&!/^sich\s+/i.test(v)?'sich '+v:v;}
  function tags(v){
    const out=[levelOf(v)];
    if(isModal(v))out.push('Modalverb');
    else if(isStrong(v))out.push('stark/irregulär · '+strongGroup(v));
    else out.push('schwach');
    if(isReflexive(v))out.push('reflexiv');
    if(isSeparable(v))out.push('trennbar');
    else if(isInseparablePrefix(v))out.push('nicht trennbar · untrennbares Präfix');
    else out.push('nicht trennbar');
    return out;
  }
  function label(v){
    const s=sentence(v);
    return '<div><b>'+esc(displayVerb(v))+'</b> <small>· '+esc(tags(v).join(' · '))+'</small>'+(s?'<div class="small">Satz: '+esc(s)+'</div>':'')+'</div>';
  }
  function checkedCustom(list){return list.length&&list.every(function(v){return ReleaseDraft.getAny(verbReleasePaths(v),false)});}
  function setCustom(list,value){list.forEach(function(v){ReleaseDraft.setVerb(v,value)});}
  function renderCustomGroup(title,list,key,note){
    list=[...new Set(list||[])];
    if(!list.length)return '<details class="release-sub"><summary>'+title+' · 0</summary><div class="empty">Keine Verben in diesem Block.</div></details>';
    window.__verbReleaseGroups=window.__verbReleaseGroups||{};window.__verbReleaseGroups[key]=list;
    return '<details class="release-sub" open><summary>'+title+' · '+list.length+'</summary>'+(note?'<div class="debug-box small">'+note+'</div>':'')+releaseCheck('Alles in diesem Block freigeben',[['bulkVerbGroup',key]],'ReleaseDraft.setVerbGroup("'+key+'",this.checked)',checkedCustom(list))+'<div class="release-grid">'+list.map(function(v){return releaseCheck(label(v),verbReleasePaths(v),'ReleaseDraft.setVerb("'+v+'",this.checked)')}).join('')+'</div></details>';
  }
  function installVerbReleaseUI(){
    if(!window.ReleaseDraft||typeof window.renderVerbReleaseSection!=='function'||window.__verbReleaseGroupsInstalled)return;
    window.__verbReleaseGroupsInstalled=true;
    ReleaseDraft.verbAssessmentEnabled=function(){
      var v=this.getAny([['settings','verben-A1','assessmentEnabled'],['settings','Verben A1','assessmentEnabled'],['verbenA1AssessmentEnabled']],undefined);
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
      var strong=verbs.filter(v=>!isModal(v)&&isStrong(v));
      var weak=verbs.filter(v=>!isModal(v)&&!isStrong(v));
      var html='<details class="release-section" open><summary>Verben A1 · Start und Einschätzung</summary>';
      html+='<div class="debug-box small"><b>Einschätzung aktiv:</b> Schüler sehen Muttersprache und schreiben das deutsche Verb. <br><b>Einschätzung aus:</b> Schüler starten direkt mit den ersten 20 freigegebenen Verben.</div>';
      html+=releaseCheck('Schüler sollen Verben selbst einschätzen',[['settings','verben-A1','assessmentEnabled']],'ReleaseDraft.setVerbAssessment(this.checked)',ReleaseDraft.verbAssessmentEnabled());
      html+='</details>';
      html+='<details class="release-section" open><summary>Verben freigeben · jedes Verb nur einmal</summary><div class="debug-box small">Die Verben stehen nur noch in einer Hauptgruppe. Zusatzinfos stehen direkt am Verb: trennbar, nicht trennbar, reflexiv, untrennbares Präfix und bei starken Verben die Stammwechsel-Gruppe.</div>';
      html+=releaseCheck('Alle Verben freigeben',[['bulkVerbs','all']],'ReleaseDraft.setAllVerbs(this.checked,"all")',ReleaseDraft.allVerbsChecked('all'));
      html+=renderCustomGroup('Modalverben',modal,'modal','Modalverben stehen nur hier.');
      html+=renderCustomGroup('Starke / irreguläre Verben',strong,'strong','Mit Gruppe: a → ä, e → i, e → ie oder spezial.');
      html+=renderCustomGroup('Schwache Verben',weak,'weak','Regelmäßige Verben. Trennbar/reflexiv/nicht trennbar steht als Markierung direkt am Verb.');
      html+='</details>';
      return html;
    };
  }
  installVerbReleaseUI();
  setTimeout(installVerbReleaseUI,50);
  setTimeout(installVerbReleaseUI,500);
})();