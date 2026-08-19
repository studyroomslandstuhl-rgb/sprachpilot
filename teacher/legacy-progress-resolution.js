(function(root){
  'use strict';
  if(root.LegacyProgressResolution)return;

  const VERSION=1;
  function core(){return root.LegacyProgressResolutionCore||null}
  function db(){try{return root.Students?.database?.()||firebase.firestore()}catch(e){return null}}
  function stamp(){return firebase.firestore.FieldValue.serverTimestamp()}
  function text(v){return String(v==null?'':v).trim()}
  function authUid(){try{return text(firebase.auth().currentUser?.uid)}catch(e){return''}}

  async function loadState(){
    const database=db(),c=core();
    if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!c)throw new Error('LEGACY_RESOLUTION_CORE_MISSING');
    const [studentsSnap,progressSnap]=await Promise.all([
      database.collection('students').get(),
      database.collection('progress').get()
    ]);
    return{
      database,
      students:studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      progress:progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}))
    };
  }

  async function backup(database,{kind,path,snapshot,reason}){
    const ref=database.collection('diagnostics').doc();
    await ref.set({
      backupType:'legacy-progress-finalization',
      backupVersion:VERSION,
      kind,
      path,
      reason,
      snapshot:snapshot||null,
      createdByUid:authUid(),
      backedUpAt:stamp()
    });
    return ref.id;
  }

  async function backupAutomatic(state,plan){
    const c=core(),seen=new Set(),ids=[];
    async function save(kind,path,row,reason){
      if(!row||seen.has(path))return;
      seen.add(path);
      ids.push(await backup(state.database,{kind,path,snapshot:c.stripInternal(row),reason}));
    }
    for(const item of plan.mappings)await save('progress','progress/'+item.mapping.progressId,item.progress,'safe-mapping');
    for(const item of plan.archives)await save('progress','progress/'+item.id,item.progress,'legacy-unassigned-archive');
    if(plan.vlad.canonical)await save('student','students/'+c.VLAD.canonicalId,plan.vlad.canonical,'vlad-canonical-before-merge');
    if(plan.vlad.duplicate)await save('student','students/'+c.VLAD.duplicateId,plan.vlad.duplicate,'vlad-duplicate-before-merge');
    return ids;
  }

  async function backupManual(state,key,item,choice){
    const c=core();
    if(!item?.progress)return'';
    return backup(state.database,{
      kind:'progress',
      path:'progress/'+item.progressId,
      snapshot:c.stripInternal(item.progress),
      reason:'manual-'+key+'-'+choice
    });
  }

  async function invalidateSecurity(){
    try{await root.ProgressSecurityAliasMigration?.markReady?.(false,{status:'legacy-finalization-running'})}catch(e){}
    try{await root.StudentSecurityLookup?.setReady?.(false,{status:'legacy-finalization-running'})}catch(e){}
  }

  async function applyAutomatic(){
    const state=await loadState(),c=core(),plan=c.buildPlan(state.students,state.progress);
    await invalidateSecurity();
    const backups=await backupAutomatic(state,plan);
    const batch=state.database.batch(),now=stamp(),uid=authUid();

    for(const item of plan.mappings){
      batch.set(state.database.collection('progress').doc(item.mapping.progressId),{
        ...c.mappingPatch(item.mapping.studentId),
        securityResolvedByUid:uid,
        securityResolvedAt:now
      },{merge:true});
    }
    for(const item of plan.archives){
      batch.set(state.database.collection('progress').doc(item.id),{
        ...c.archivePatch('legacy-test-or-unassigned'),
        securityResolvedByUid:uid,
        securityResolvedAt:now
      },{merge:true});
    }
    if(plan.vlad.merged){
      batch.set(state.database.collection('students').doc(c.VLAD.canonicalId),{
        ...plan.vlad.merged,
        legacyResolutionAt:now,
        updatedAt:now
      });
      batch.delete(state.database.collection('students').doc(c.VLAD.duplicateId));
    }
    await batch.commit();
    await verifyAutomatic();
    return{plan,backups};
  }

  async function verifyAutomatic(){
    const state=await loadState(),c=core();
    const byStudent=new Map(state.students.map(s=>[c.studentId(s),s]));
    const byProgress=new Map(state.progress.map(p=>[c.progressId(p),p]));
    for(const mapping of c.SAFE_MAPPINGS){
      const row=byProgress.get(mapping.progressId);if(!row)continue;
      if(text(row.canonicalStudentId)!==mapping.studentId||row.securityArchived===true){
        throw new Error('SAFE_MAPPING_VERIFY_FAILED:'+mapping.progressId);
      }
    }
    for(const id of c.ARCHIVE_IDS){
      const row=byProgress.get(id);if(!row)continue;
      if(row.securityArchived!==true)throw new Error('ARCHIVE_VERIFY_FAILED:'+id);
    }
    const duplicate=byStudent.get(c.VLAD.duplicateId);
    if(duplicate)throw new Error('VLAD_DUPLICATE_STILL_EXISTS');
    const canonical=byStudent.get(c.VLAD.canonicalId);
    if(!canonical)throw new Error('VLAD_CANONICAL_MISSING_AFTER_REPAIR');
    const aliases=new Set(Array.isArray(canonical.aliasIds)?canonical.aliasIds:[]);
    if(!aliases.has(c.VLAD.duplicateId))throw new Error('VLAD_ALIAS_MISSING');
    return true;
  }

  function manualResolved(row,item){
    if(!row)return true;
    if(row.securityArchived===true)return true;
    const canonical=text(row.canonicalStudentId);
    return item.options.some(option=>option.value!=='archive'&&option.value===canonical);
  }

  async function unresolvedManual(){
    const state=await loadState(),c=core();
    const byProgress=new Map(state.progress.map(p=>[c.progressId(p),p]));
    const result=[];
    for(const [key,item] of Object.entries(c.MANUAL)){
      const row=byProgress.get(item.progressId);
      if(row&&!manualResolved(row,item))result.push({key,item,row});
    }
    return result;
  }

  function resultBox(){
    let box=document.getElementById('sp-legacy-progress-resolution-result');
    if(!box){
      box=document.createElement('div');box.id='sp-legacy-progress-resolution-result';
      box.style.cssText='position:fixed;left:10px;right:10px;bottom:10px;z-index:100040;max-height:72vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #2e7d32;box-shadow:0 12px 40px rgba(0,0,0,.28);font:14px/1.45 system-ui;color:#13293d';
      document.body.appendChild(box);
    }
    return box;
  }
  function renderText(message,ok=true){const box=resultBox();box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=message;return box}

  function renderManual(items,automatic){
    const box=resultBox();box.style.borderColor='#9a6700';box.textContent='';
    const title=document.createElement('h3');title.textContent='Noch 2 Identitäten manuell entscheiden';box.appendChild(title);
    const intro=document.createElement('p');intro.textContent='Die eindeutigen Altfortschritte wurden vorbereitet und separat gesichert. Für Shaza und Tetiana wird nichts geraten. Wähle nur eine Person, wenn du sicher bist. „Archivieren“ löscht nichts: Der vollständige Fortschritt bleibt in Firestore erhalten und ist nach dem Sicherheits-Cutover nur für Lehrkräfte zugänglich.';box.appendChild(intro);
    const form=document.createElement('div');
    for(const entry of items){
      const section=document.createElement('fieldset');section.style.cssText='margin:12px 0;padding:12px;border:1px solid #bbb;border-radius:8px';
      const legend=document.createElement('legend');legend.textContent=entry.item.label;section.appendChild(legend);
      const select=document.createElement('select');select.id='sp-legacy-choice-'+entry.key;select.style.cssText='width:100%;padding:9px;margin-top:6px';
      const empty=document.createElement('option');empty.value='';empty.textContent='— Bitte auswählen —';select.appendChild(empty);
      for(const option of entry.item.options){const el=document.createElement('option');el.value=option.value;el.textContent=option.label;select.appendChild(el)}
      section.appendChild(select);form.appendChild(section);
    }
    box.appendChild(form);
    const save=document.createElement('button');save.type='button';save.textContent='Auswahl speichern und Fortschritts-Sicherheit prüfen';save.style.cssText='padding:10px 14px;margin-top:8px';
    save.onclick=()=>saveManual(items,automatic).catch(()=>{});box.appendChild(save);
  }

  async function saveManual(items,automatic){
    const choices={};
    for(const entry of items){
      const select=document.getElementById('sp-legacy-choice-'+entry.key),value=text(select?.value);
      if(!value){renderText('Bitte für Shaza und Tetiana jeweils eine Auswahl treffen. Es wurde noch nichts gespeichert.',false);return}
      choices[entry.key]=value;
    }
    const state=await loadState(),c=core(),byProgress=new Map(state.progress.map(p=>[c.progressId(p),p])),byStudent=new Map(state.students.map(s=>[c.studentId(s),s]));
    const batch=state.database.batch(),now=stamp(),uid=authUid(),backups=[];
    for(const entry of items){
      const choice=choices[entry.key],row=byProgress.get(entry.item.progressId);
      c.validateProgress(row,entry.item.progressId);
      backups.push(await backupManual(state,entry.key,{...entry.item,progress:row},choice));
      let patch;
      if(choice==='archive')patch=c.archivePatch('manual-identity-not-certain');
      else{
        const target=byStudent.get(choice);if(!target)throw new Error('MANUAL_TARGET_MISSING:'+choice);
        patch=c.mappingPatch(choice);
      }
      batch.set(state.database.collection('progress').doc(entry.item.progressId),{
        ...patch,securityResolvedByUid:uid,securityResolvedAt:now
      },{merge:true});
    }
    await batch.commit();
    renderText('Manuelle Entscheidungen gespeichert. Die vollständige Fortschritts-Sicherheitsprüfung läuft …',true);
    try{
      const migration=await root.ProgressSecurityAliasMigration.backfillAndVerify();
      renderText(`Altfortschritte vollständig vorbereitet.\n\nAutomatische Sicherungskopien: ${automatic?.backups?.length||0}\nManuelle Sicherungskopien: ${backups.filter(Boolean).length}\nGelöschte Fortschrittsdokumente: 0\nFortschritts-Sicherheit: BEREIT\nFehler/Kollisionen: 0\n\nJetzt „Schüler-Sicherheit vollständig prüfen“ anklicken.`,true);
      root.SP_LEGACY_PROGRESS_FINALIZATION={ok:true,automatic,choices,migration};
      const button=document.getElementById('sp-legacy-progress-resolution-btn');if(button)button.style.display='none';
    }catch(error){
      renderText(`Die Entscheidungen wurden gespeichert, aber die Fortschritts-Sicherheitsprüfung ist noch nicht vollständig grün.\nFehler: ${error?.message||error}\n\nKein Fortschrittsdokument wurde gelöscht.`,false);
      throw error;
    }
  }

  async function runUi(){
    const ok=root.confirm('Verbleibende historische Fortschritte sicher vorbereiten?\n\nEindeutige Alt-IDs werden vorhandenen Schülern zugeordnet, technische Test-/Altbestände nur archiviert, Vlad wird zu einem Profil zusammengeführt. Kein Fortschrittsdokument wird gelöscht. Shaza und Tetiana werden anschließend manuell entschieden.');
    if(!ok)return;
    const button=document.getElementById('sp-legacy-progress-resolution-btn');if(button)button.disabled=true;
    renderText('Sicherung und konservative Altfortschritts-Bereinigung laufen …',true);
    try{
      const automatic=await applyAutomatic();
      const manual=await unresolvedManual();
      if(manual.length){renderManual(manual,automatic);return automatic}
      const migration=await root.ProgressSecurityAliasMigration.backfillAndVerify();
      renderText(`Altfortschritte vollständig vorbereitet.\nSicherungskopien: ${automatic.backups.length}\nGelöschte Fortschrittsdokumente: 0\nFortschritts-Sicherheit: BEREIT\n\nJetzt „Schüler-Sicherheit vollständig prüfen“ anklicken.`,true);
      root.SP_LEGACY_PROGRESS_FINALIZATION={ok:true,automatic,migration};
      if(button)button.style.display='none';
      return automatic;
    }catch(error){
      renderText(`Altfortschritts-Bereinigung gestoppt.\nFehler: ${error?.message||error}\n\nDer Sicherheits-Cutover bleibt blockiert. Bereits erstellte Sicherungskopien bleiben erhalten.`,false);
      root.SP_LEGACY_PROGRESS_FINALIZATION={ok:false,error};
      throw error;
    }finally{if(button)button.disabled=false}
  }

  async function needsWork(){
    try{
      const state=await loadState(),c=core(),byProgress=new Map(state.progress.map(p=>[c.progressId(p),p])),byStudent=new Map(state.students.map(s=>[c.studentId(s),s]));
      for(const mapping of c.SAFE_MAPPINGS){const row=byProgress.get(mapping.progressId);if(row&&(text(row.canonicalStudentId)!==mapping.studentId||row.securityArchived===true))return true}
      for(const id of c.ARCHIVE_IDS){const row=byProgress.get(id);if(row&&row.securityArchived!==true)return true}
      if(byStudent.has(c.VLAD.duplicateId))return true;
      for(const item of Object.values(c.MANUAL)){const row=byProgress.get(item.progressId);if(row&&!manualResolved(row,item))return true}
      return false;
    }catch(e){return false}
  }

  async function install(){
    if(typeof document==='undefined')return;
    if(!core()||!root.ProgressSecurityAliasMigration){setTimeout(install,150);return}
    const anchor=document.getElementById('sp-security-lookup-btn');if(!anchor){setTimeout(install,150);return}
    if(document.getElementById('sp-legacy-progress-resolution-btn'))return;
    if(!await needsWork())return;
    const button=document.createElement('button');button.id='sp-legacy-progress-resolution-btn';button.type='button';button.className=anchor.className;
    button.textContent='Verbleibende Altfortschritte sicher bereinigen';button.onclick=()=>runUi().catch(()=>{});
    anchor.insertAdjacentElement('afterend',button);
  }

  root.LegacyProgressResolution={loadState,backup,applyAutomatic,verifyAutomatic,unresolvedManual,runUi,needsWork,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,300));
    else setTimeout(install,300);
  }
})(typeof window!=='undefined'?window:globalThis);
