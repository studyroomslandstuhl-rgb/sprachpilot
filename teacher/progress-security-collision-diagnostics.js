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

  function buildReport(analysis,items=[],lookupRows=[]){
    const resolver=analysis?.resolver||root.ProgressSecurityAliasCore||null;
    const students=analysis?.students||[],progressDocs=analysis?.progress||[];
    const byId=new Map(students.map(s=>[studentId(s,resolver),s]));
    const groups=connectedGroups(items);
    const out=['READ-ONLY KONFLIKTANALYSE','Es wurde nichts gelöscht, zusammengeführt oder umgebunden.',''];
    groups.forEach((ids,index)=>{
      out.push(`GRUPPE ${index+1}: ${ids.join(' ↔ ')}`);
      for(const id of ids){
        const student=byId.get(id);
        if(!student){out.push(`\nDokument: ${id}\nSchülerdokument nicht gefunden.`);continue}
        out.push('\n'+formatStudent(summarizeStudent(student,progressDocs,resolver,lookupRows)));
      }
      out.push('');
    });
    out.push('Entscheidung: noch KEINE automatische Zusammenführung. Ein gebundenes Firebase-Konto, eindeutige Lookups und vorhandene Fortschritts-IDs werden zuerst gemeinsam bewertet.');
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
      box.style.cssText='position:fixed;left:10px;right:10px;top:5vh;z-index:100010;max-height:86vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #b3261e;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;color:#13293d';
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
    if(check&&!check.dataset.readonlyDiagnostics){check.dataset.readonlyDiagnostics='1';check.onclick=()=>runFullCheck().catch(()=>{});}
    const cutover=document.getElementById('sp-security-cutover-btn');
    if(cutover&&!cutover.dataset.readonlyDiagnostics){cutover.dataset.readonlyDiagnostics='1';cutover.onclick=()=>runCutover().catch(()=>{});}
  }

  root.ProgressSecurityCollisionDiagnostics={connectedGroups,relatedProgress,summarizeStudent,formatStudent,buildReport,showForError,runFullCheck,runCutover,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,150));
    else setTimeout(install,150);
  }
})(typeof window!=='undefined'?window:globalThis);
