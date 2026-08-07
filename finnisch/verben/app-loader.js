const SOURCE_URL='./app-standard.js?v=fi-verben-standard12-source';
try{
  const response=await fetch(SOURCE_URL,{cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  let source=await response.text();

  source=source.replace(
    'from "/js/auth.js?v=login-main-4";',
    `from "${location.origin}/js/auth.js?v=login-main-4";`
  );

  // Aufgabe 7 bleibt vollständig entfernt.
  source=source.replace(/,\['read-sentence','▣→🔊','Bild → Hören'\]/,'');

  // Gemeinsame kurze A1-Bedeutungen verwenden.
  source=source.replace(
    "const clue=v=>CLUES[v.de]||'die Handlung auf dem Bild ausführen';",
    "const clue=v=>window.SP_VERB_A1_MEANINGS?.[v.de]||CLUES[v.de]||'die Handlung auf dem Bild';"
  );

  // Alte direkte Links zu entfernten Aufgaben nicht mehr öffnen.
  source=source.replace(
    "function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||'',view:q.get('view')||''}}",
    "function route(){const q=new URLSearchParams(location.search),raw=q.get('task')||'';return{group:Number(q.get('group'))||0,task:TASKS.some(x=>x[0]===raw)?raw:'',view:q.get('view')||''}}"
  );

  // WICHTIG: Eine Gruppe hat in jeder Aufgabe immer alle 20 Verben.
  // Vorher wurden bei Konjugationsaufgaben nur Verben mit manuell hinterlegten Formen
  // herausgefiltert. Deshalb erschienen in manchen Gruppen nur 2 oder 6 Verben.
  source=source.replace(
    "function targets(id,t){const g=GROUPS[id-1];if(!g)return[];return['choose-form','write-form','speak-form','sentence'].includes(t)?g.verbs.filter(v=>forms(v)):g.verbs}",
    "function targets(id,t){const g=GROUPS[id-1];if(!g)return[];return g.verbs}"
  );

  // Für nicht manuell hinterlegte Verben Formen nach finnischem Verbtyp bilden,
  // damit auch die Konjugationsaufgaben mit allen 20 Verben arbeiten können.
  source=source.replace(
    "function forms(v){if(FORMS[v.fi])return FORMS[v.fi];return null}",
    `function genericWordForms(word){
      const w=String(word||'').trim().toLocaleLowerCase('fi-FI');
      if(!w)return null;
      const special={
        'olla':['olen','olet','on','olemme','olette','ovat'],
        'tehdä':['teen','teet','tekee','teemme','teette','tekevät'],
        'nähdä':['näen','näet','näkee','näemme','näette','näkevät'],
        'juoda':['juon','juot','juo','juomme','juotte','juovat'],
        'syödä':['syön','syöt','syö','syömme','syötte','syövät'],
        'käydä':['käyn','käyt','käy','käymme','käytte','käyvät'],
        'tulla':['tulen','tulet','tulee','tulemme','tulette','tulevat'],
        'mennä':['menen','menet','menee','menemme','menette','menevät'],
        'purra':['puren','puret','puree','puremme','purette','purevat'],
        'pestä':['pesen','peset','pesee','pesemme','pesette','pesevät'],
        'juosta':['juoksen','juokset','juoksee','juoksemme','juoksette','juoksevat'],
        'nousta':['nousen','nouset','nousee','nousemme','nousette','nousevat'],
        'kuolla':['kuolen','kuolet','kuolee','kuolemme','kuolette','kuolevat'],
        'voida':['voin','voit','voi','voimme','voitte','voivat'],
        'saada':['saan','saat','saa','saamme','saatte','saavat']
      };
      if(special[w])return special[w];
      const back=/[aou]/.test(w),vat=back?'vat':'vät';
      const t=type(w);
      if(t===2){
        const s=w.slice(0,-2);
        return[s+'n',s+'t',s,s+'mme',s+'tte',s+vat];
      }
      if(t===3){
        let s=w.slice(0,-2);
        if(/ll|nn|rr|st$/.test(s))s=s.slice(0,-1);
        s+='e';
        return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat];
      }
      if(t===4){
        const s=w.slice(0,-2)+(back?'a':'ä');
        return[s+'n',s+'t',s,s+'mme',s+'tte',s+vat];
      }
      if(t===5){
        const s=w.slice(0,-2)+'tse';
        return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat];
      }
      if(t===6){
        const s=w.slice(0,-2)+'ne';
        return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat];
      }
      if(t===1){
        const strong=w.slice(0,-1),last=strong.slice(-1),third=/[aeiouyäö]$/.test(last)?strong+last:strong;
        return[strong+'n',strong+'t',third,strong+'mme',strong+'tte',strong+vat];
      }
      return null;
    }
    function genericForms(value){
      const phrase=String(value||'').trim();
      if(!phrase)return null;
      const parts=phrase.split(/\\s+/),first=parts.shift(),tail=parts.length?' '+parts.join(' '):'';
      const f=genericWordForms(first);
      return f?f.map(x=>x+tail):null;
    }
    function forms(v){return FORMS[v.fi]||genericForms(v.fi)}`
  );

  const blob=new Blob([source],{type:'text/javascript'});
  const url=URL.createObjectURL(blob);
  try {
    await import(url);
  } finally {
    URL.revokeObjectURL(url);
  }
  await import('./sentence-a1-ui.js?v=3');
} catch(error){
  console.error('Finnische Verben konnten nicht geladen werden',error);
  const app=document.querySelector('#app');
  if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
}
