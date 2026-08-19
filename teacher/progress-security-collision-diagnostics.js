(function(root){
  'use strict';
  if(root.ProgressSecurityCollisionDiagnostics)return;

  function text(value){return String(value==null?'':value).trim()}
  function lower(value){return text(value).toLowerCase()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function studentId(student={},resolver=null){return resolver?.studentIdOf?.(student)||text(student.__docId||student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id)}
  function progressId(progress={},resolver=null){return resolver?.progressIdOf?.(progress)||text(progress.__docId||progress.id)}
  function courseValues(data={}){return uniq([data.courseDocId,data.courseCode,data.kurs,data.kursnummer,data.course])}
  function identityValues(data={}){return uniq([data.canonicalStudentId,data.docId,data.studentId,data.userId])}
  function timestampText(value){
    try{if(value&&typeof value.toDate==='function')return value.toDate().toISOString()}catch(e){}
    if(value&&Number.isFinite(Number(value.seconds)))return new Date(Number(value.seconds)*1000).toISOString();
    return text(value);
  }
  function shortUid(value){const v=text(value);return v?v.length<=10?v:'…'+v.slice(-8):'—'}
  function normalizedWords(value){
    return lower(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(w=>w.length>=3);
  }

  function connectedGroups(items=[]){
    const parent=new Map();
    function add(id){id=text(id);if(id&&!parent.has(id))parent.set(id,id);return id}
    function find(id){id=add(id);if(!id)return'';let p=parent.get(id);while(p!==parent.get(p))p=parent.get(p);let x=id;while(parent.get(x)!==p){const n=parent.get(x);parent.set(x,p);x=n}return p}
    function join(a,b){a=add(a);b=add(b);if(!a||!b)return;const ra=find(a),rb=find(b);if(ra!==rb)parent.set(rb,ra)}
    for(const item of items){
      const ids=uniq([item.studentId,item.otherStudentId,...(Array.isArray(item.candidates)?item.candidates:[])]);
      ids.forEach(add);for(let i=1;i<ids.length;i++)join(ids[0],ids[i]);
    }
    const groups=new Map();
    for(const id of parent.keys()){const r=find(id);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(id)}
    return [...groups.values()].map(ids=>ids.sort());
  }

  function relatedProgress(student,progressDocs=[],resolver=null){
    const id=studentId(student,resolver),aliases=uniq([id,...(Array.isArray(student.aliasIds)?student.aliasIds:[]),...identityValues(student)]);
    const keySet=new Set(aliases),mail=lower(student.email||student.authEmail),courses=new Set(courseValues(student).map(lower));
    const direct=[],emailCourse=[];
    for(const p of progressDocs){
      const pid=progressId(p,resolver),pids=uniq([pid,...identityValues(p),...(Array.isArray(p.aliasIds)?p.aliasIds:[])]);
      if(pids.some(v=>keySet.has(v))){direct.push(pid);continue}
      const pmail=lower(p.email||p.authEmail),pcourses=courseValues(p).map(lower);
      if(mail&&pmail===mail&&pcourses.some(c=>courses.has(c)))emailCourse.push(pid);
    }
    return{direct:uniq(direct),emailCourse:uniq(emailCourse)};
  }

  function summarizeStudent(student={},progressDocs=[],resolver=null,lookupRows=[]){
    const id=studentId(student,resolver),progress=relatedProgress(student,progressDocs,resolver);
    const mappings=lookupRows.filter(row=>text(row.canonicalStudentId||row.studentId)===id).map(row=>text(row.__docId||row.id));
    return{
      id,
      name:uniq([student.vorname,student.nachname]).join(' '),
      email:lower(student.email||student.authEmail)||'—',
      courses:courseValues(student),
      authBound:!!text(student.authUid),
      authUid:shortUid(student.authUid),
      active:student.active!==false,
      canonical:text(student.canonicalStudentId)||'—',
      docIdField:text(student.docId)||'—',
      studentIdField:text(student.studentId)||'—',
      userIdField:text(student.userId)||'—',
      identityVersion:Number(student.identityVersion||0),
      aliases:uniq(Array.isArray(student.aliasIds)?student.aliasIds:[]),
      createdAt:timestampText(student.createdAt),
      updatedAt:timestampText(student.updatedAt||student.identityUpdatedAt),
      progressDirect:progress.direct,
      progressEmailCourse:progress.emailCourse,
      lookupKeys:mappings
    };
  }

  function formatStudent(summary){
    const lines=[];
    lines.push(`Dokument: ${summary.id}`);
    if(summary.name)lines.push(`Name: ${summary.name}`);
    lines.push(`E-Mail: ${summary.email}`);
    lines.push(`Kurs: ${summary.courses.join(', ')||'—'}`);
    lines.push(`Firebase-UID: ${summary.authBound?'GEBUNDEN '+summary.authUid:'NICHT GEBUNDEN'}`);
    lines.push(`Aktiv: ${summary.active?'ja':'nein'} · identityVersion: ${summary.identityVersion}`);
    lines.push(`canonicalStudentId: ${summary.canonical}`);
    lines.push(`docId/studentId/userId: ${summary.docIdField} / ${summary.studentIdField} / ${summary.userIdField}`);
    lines.push(`Aliase: ${summary.aliases.join(', ')||'—'}`);
    lines.push(`Direkte Fortschritts-IDs: ${summary.progressDirect.join(', ')||'—'}`);
    if(summary.progressEmailCourse.length)lines.push(`Weitere Fortschritte über E-Mail+Kurs: ${summary.progressEmailCourse.join(', ')}`);
    lines.push(`Student-Lookups → dieses Dokument: ${summary.lookupKeys.join(', ')||'—'}`);
    if(summary.createdAt||summary.updatedAt)lines.push(`Zeit: erstellt ${summary.createdAt||'—'} · aktualisiert ${summary.updatedAt||'—'}`);
    return lines.join('\n');
  }

  function progressModules(progress={}){
    const names=[];
    for(const key of ['fragen','wortschatz','verben','perfekt','grammatik']){
      const value=progress[key];
      if(value&&typeof value==='object'&&Object.keys(value).length)names.push(key);
    }
    return names;
  }

  function progressPointHints(progress={}){
    return uniq([
      progress.pointsTotal!=null?`pointsTotal=${progress.pointsTotal}`:'',
      progress.lifetimePoints!=null?`lifetimePoints=${progress.lifetimePoints}`:'',
      progress.punkteGesamt!=null?`punkteGesamt=${progress.punkteGesamt}`:'',
      progress.ranking?.points!=null?`ranking=${progress.ranking.points}`:'',
      progress.totals?.points!=null?`totals=${progress.totals.points}`:''
    ]);
  }

  function exactCandidateHints(progress={},students=[],resolver=null){
    const pid=progressId(progress,resolver),mail=lower(progress.email||progress.authEmail),courses=new Set(courseValues(progress).map(lower));
    const identities=new Set(uniq([pid,...identityValues(progress),...(Array.isArray(progress.aliasIds)?progress.aliasIds:[])]));
    const pName=uniq([progress.vorname,progress.nachname,progress.name,progress.displayName]).join(' ');
    const pWords=new Set(normalizedWords(pid+' '+pName));
    const hints=[];
    for(const student of students){
      const sid=studentId(student,resolver);if(!sid)continue;
      const reasons=[];
      const aliases=uniq([sid,...identityValues(student),...(Array.isArray(student.aliasIds)?student.aliasIds:[])]);
      if(aliases.some(value=>identities.has(value)))reasons.push('Identitäts-/Alias-Treffer');
      const smail=lower(student.email||student.authEmail),scourses=courseValues(student).map(lower);
      if(mail&&smail===mail){
        reasons.push('gleiche E-Mail');
        if(courses.size&&scourses.some(c=>courses.has(c)))reasons.push('gleiche E-Mail + Kurs');
      }
      const sName=uniq([student.vorname,student.nachname]).join(' '),sWords=normalizedWords(sid+' '+sName);
      const overlap=sWords.filter(w=>pWords.has(w));
      if(overlap.length>=2)reasons.push('ID-/Namenshinweis: '+uniq(overlap).join(', '));
      if(reasons.length)hints.push({studentId:sid,name:sName,email:smail||'—',courses:courseValues(student),reasons:uniq(reasons)});
    }
    return hints;
  }

  function summarizeProgress(progress={},students=[],resolver=null){
    const id=progressId(progress,resolver);
    return{
      id,
      name:uniq([progress.vorname,progress.nachname,progress.name,progress.displayName]).join(' '),
      email:lower(progress.email||progress.authEmail)||'—',
      courses:courseValues(progress),
      authBound:!!text(progress.authUid),
      authUid:shortUid(progress.authUid),
      canonical:text(progress.canonicalStudentId)||'—',
      docIdField:text(progress.docId)||'—',
      studentIdField:text(progress.studentId)||'—',
      userIdField:text(progress.userId)||'—',
      aliases:uniq(Array.isArray(progress.aliasIds)?progress.aliasIds:[]),
      modules:progressModules(progress),
      points:progressPointHints(progress),
      createdAt:timestampText(progress.createdAt),
      updatedAt:timestampText(progress.updatedAt||progress.identityUpdatedAt||progress.progressAliasUpdatedAt),
      candidates:exactCandidateHints(progress,students,resolver)
    };
  }

  function formatProgress(summary,failure={}){
    const lines=[];
    lines.push(`Fortschritt: ${summary.id}`);
    lines.push(`Problem: ${failure.reason||failure.type||'unbekannt'}`);
    if(summary.name)lines.push(`Name im Fortschritt: ${summary.name}`);
    lines.push(`E-Mail: ${summary.email}`);
    lines.push(`Kurs: ${summary.courses.join(', ')||'—'}`);
    lines.push(`Firebase-UID: ${summary.authBound?'GEBUNDEN '+summary.authUid:'NICHT GEBUNDEN'}`);
    lines.push(`canonicalStudentId: ${summary.canonical}`);
    lines.push(`docId/studentId/userId: ${summary.docIdField} / ${summary.studentIdField} / ${summary.userIdField}`);
    lines.push(`Aliase: ${summary.aliases.join(', ')||'—'}`);
    lines.push(`Module mit Daten: ${summary.modules.join(', ')||'—'}`);
    lines.push(`Punkte-Hinweise: ${summary.points.join(', ')||'—'}`);
    if(summary.createdAt||summary.updatedAt)lines.push(`Zeit: erstellt ${summary.createdAt||'—'} · aktualisiert ${summary.updatedAt||'—'}`);
    if(Array.isArray(failure.candidates)&&failure.candidates.length)lines.push(`Resolver-Kandidaten: ${failure.candidates.join(', ')}`);
    if(summary.candidates.length){
      lines.push('Exakte/strukturelle Schülerhinweise:');
      summary.candidates.slice(0,12).forEach(c=>lines.push(`  - ${c.studentId}${c.name?' ('+c.name+')':''} · ${c.email} · ${c.courses.join(', ')||'—'} · ${c.reasons.join('; ')}`));
    }else{
      lines.push('Exakte/strukturelle Schülerhinweise: keine');
    }
    return lines.join('\n');
  }

  function buildReport(analysis,items=[],lookupRows=[]){
    const resolver=analysis?.resolver||root.ProgressSecurityAliasCore||null;
    const students=analysis?.students||[],progressDocs=analysis?.progress||[];
    const byId=new Map(students.map(s=>[studentId(s,resolver),s]));
    const progressById=new Map(progressDocs.map(p=>[progressId(p,resolver),p]));
    const groups=connectedGroups(items);
    const out=['READ-ONLY KONFLIKTANALYSE','Es wurde nichts gelöscht, zusammengeführt oder umgebunden.',''];

    out.push(`FORTSCHRITTSPROBLEME: ${items.filter(item=>item.progressId).length}`);
    items.filter(item=>item.progressId).forEach((item,index)=>{
      const progress=progressById.get(text(item.progressId));
      out.push(`\nPROBLEM ${index+1}`);
      if(!progress){
        out.push(`Fortschritt: ${item.progressId}\nProblem: ${item.reason||item.type||'unbekannt'}\nDokument wurde in der geladenen Fortschrittsliste nicht gefunden.`);
      }else{
        out.push(formatProgress(summarizeProgress(progress,students,resolver),item));
      }
    });
    out.push('');

    if(groups.length){
      out.push(`SCHÜLER-KONFLIKTGRUPPEN: ${groups.length}`);
      groups.forEach((ids,index)=>{
        out.push(`\nGRUPPE ${index+1}: ${ids.join(' ↔ ')}`);
        for(const id of ids){
          const student=byId.get(id);
          if(!student){out.push(`\nDokument: ${id}\nSchülerdokument nicht gefunden.`);continue}
          out.push('\n'+formatStudent(summarizeStudent(student,progressDocs,resolver,lookupRows)));
        }
      });
      out.push('');
    }

    out.push('Entscheidung: noch KEINE automatische Zuordnung oder Löschung. Orphan-Fortschritte werden nur dann übernommen, wenn die gespeicherten Daten eine eindeutige Identität belegen; ansonsten bleiben sie separat gesichert.');
    return out.join('\n');
  }

  async function lookupRows(){
    try{
      const database=root.Students?.database?.();if(!database)return[];
      const snap=await database.collection('studentLookups').get();
      return snap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
    }catch(e){return[]}
  }

  function renderReport(report){
    if(typeof document==='undefined')return;
    let box=document.getElementById('sp-progress-collision-diagnostics');
    if(!box){
      box=document.createElement('div');box.id='sp-progress-collision-diagnostics';
      box.style.cssText='position:fixed;left:10px;right:10px;top:3vh;z-index:100010;max-height:92vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #b3261e;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;color:#13293d';
      const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style.cssText='position:sticky;top:0;float:right;margin:0 0 8px 12px;padding:8px 12px';close.onclick=()=>box.remove();box.appendChild(close);
      const textBox=document.createElement('div');textBox.id='sp-progress-collision-diagnostics-text';box.appendChild(textBox);
      document.body.appendChild(box);
    }
    const textBox=box.querySelector('#sp-progress-collision-diagnostics-text');if(textBox)textBox.textContent=report;
  }

  async function showForError(error){
    const analysis=error?.analysis||error?.verification?.analysis||null;
    const items=root.ProgressSecurityAliasMigration?.collectErrorItems?.(error)||[];
    if(!analysis||!items.length)return'';
    const report=buildReport(analysis,items,await lookupRows());
    renderReport(report);root.SP_PROGRESS_COLLISION_REPORT=report;return report;
  }

  async function runFullCheck(){
    try{
      const result=await root.ProgressSecurityAliasMigration.runUi();
      await root.StudentSecurityLookup.runUi();
      return result;
    }catch(error){
      try{await showForError(error)}catch(e){console.warn('Konfliktdiagnose fehlgeschlagen',e)}
      try{await root.StudentSecurityLookup?.setReady?.(false,{status:'progress-alias-failed'})}catch(e){}
      throw error;
    }
  }

  async function runCutover(){
    try{
      await root.ProgressSecurityAliasMigration.runUi();
      return await root.StudentSecurityLookup.runCutoverUi();
    }catch(error){
      try{await showForError(error)}catch(e){console.warn('Konfliktdiagnose fehlgeschlagen',e)}
      try{await root.StudentSecurityLookup?.setReady?.(false,{status:'progress-alias-failed'})}catch(e){}
      throw error;
    }
  }

  function install(){
    if(typeof document==='undefined')return;
    if(!root.ProgressSecurityAliasMigration||!root.StudentSecurityLookup){setTimeout(install,100);return}
    const check=document.getElementById('sp-security-lookup-btn');
    if(check&&!check.dataset.readonlyDiagnostics){check.dataset.readonlyDiagnostics='2';check.onclick=()=>runFullCheck().catch(()=>{});}
    const cutover=document.getElementById('sp-security-cutover-btn');
    if(cutover&&!cutover.dataset.readonlyDiagnostics){cutover.dataset.readonlyDiagnostics='2';cutover.onclick=()=>runCutover().catch(()=>{});}
  }

  root.ProgressSecurityCollisionDiagnostics={connectedGroups,relatedProgress,summarizeStudent,formatStudent,summarizeProgress,formatProgress,exactCandidateHints,buildReport,showForError,runFullCheck,runCutover,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,150));
    else setTimeout(install,150);
  }
})(typeof window!=='undefined'?window:globalThis);
