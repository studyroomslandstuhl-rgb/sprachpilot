(function(root){
  'use strict';
  if(root.LegacyLookupResolution)return;

  const VERSION=1;
  const TARGET_IDS=[
    'a-1_nelia_roiko_1995-04-30',
    'b1-74698_oudai_sadik_1998-07-22',
    'b174698_anicuta_baciu',
    'b174698_lidiia_akbarova',
    'glk-68_emmad_abo-hjazi_1982-01-02',
    'glk-68_mohammad-taleb_barkumi_1989-01-18',
    'glk-68_mohammed_mohammed',
    'kurs-student'
  ];
  const LIDIIA_OLD='b174698_lidiia_akbarova';
  const LIDIIA_TARGET='b174698_akbarovalidiia-gmail-com';

  function text(v){return String(v==null?'':v).trim()}
  function lower(v){return text(v).toLowerCase()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function emailOf(student={}){return lower(student.email)}
  function nameOf(student={}){return text(student.name||student.displayName)||[student.vorname,student.nachname].map(text).filter(Boolean).join(' ')}
  function normName(student={}){return lower(nameOf(student)).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
  function courseValues(student={}){return uniq([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course]).map(lower)}
  function sameCourse(a={},b={}){const aa=new Set(courseValues(a));return courseValues(b).some(v=>aa.has(v))}
  function studentId(student={}){return text(student.__docId||student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id)}
  function progressId(row={}){return text(row.__docId||row.id)}
  function stripInternal(data={}){const out={};for(const[k,v]of Object.entries(data||{})){if(!k.startsWith('__'))out[k]=v}return out}
  function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower(value))}
  function safelyExcluded(student={}){return root.StudentSecurityLookupExclusions?.safelyExcluded?.(student)===true}
  function identityIds(student={}){
    return uniq([
      studentId(student),student.canonicalStudentId,student.docId,student.studentId,student.userId,student.id,
      ...(Array.isArray(student.aliasIds)?student.aliasIds:[])
    ]);
  }
  function rowBelongsToStudent(row={},student={}){
    const ids=new Set(identityIds(student));
    return ids.has(progressId(row)) || [row.canonicalStudentId,row.studentId,row.userId,row.docId].some(v=>ids.has(text(v)));
  }
  function emailHints(student={},progressRows=[],lookupRows=[]){
    const ids=new Set(identityIds(student)),hints=[];
    for(const row of progressRows){
      if(!rowBelongsToStudent(row,student))continue;
      for(const value of [row.email,row.authEmail,row.loginEmail,row.studentEmail])if(validEmail(value))hints.push(lower(value));
    }
    for(const row of lookupRows){
      const mapped=text(row.canonicalStudentId||row.studentId);
      if(ids.has(mapped)&&validEmail(row.email))hints.push(lower(row.email));
    }
    return uniq(hints);
  }
  function exactNameCandidates(student={},students=[]){
    const n=normName(student),id=studentId(student);if(!n)return[];
    return students.filter(other=>studentId(other)!==id&&normName(other)===n&&validEmail(other.email));
  }
  function unresolvedStudent(student={}){
    return TARGET_IDS.includes(studentId(student)) && !emailOf(student) && !text(student.authUid) && !safelyExcluded(student);
  }
  function memberProgressIds(student={},progressRows=[]){
    const ids=new Set(identityIds(student));
    const mail=emailOf(student),courses=new Set(courseValues(student));
    for(const row of progressRows){
      const rowCourse=lower(row.courseCode||row.kurs||row.kursnummer||row.courseDocId||row.course);
      const sameMail=mail&&lower(row.email||row.authEmail)===mail;
      if(rowBelongsToStudent(row,student)||(sameMail&&(!rowCourse||courses.has(rowCourse))))ids.add(progressId(row));
    }
    return uniq([...ids].filter(id=>progressRows.some(row=>progressId(row)===id)));
  }
  function buildLidiiaGroup(students=[],progressRows=[]){
    const byId=new Map(students.map(s=>[studentId(s),s]));
    const oldStudent=byId.get(LIDIIA_OLD),target=byId.get(LIDIIA_TARGET);
    if(!oldStudent)return{alreadyResolved:true};
    if(!target)throw new Error('LIDIIA_TARGET_PROFILE_MISSING');
    if(normName(oldStudent)!==normName(target)||!sameCourse(oldStudent,target)||!validEmail(target.email))throw new Error('LIDIIA_IDENTITY_PRECHECK_FAILED');
    const targetRows=memberProgressIds(target,progressRows),oldRows=memberProgressIds(oldStudent,progressRows);
    if(!oldRows.length)throw new Error('LIDIIA_OLD_PROGRESS_MISSING');
    const overlap=oldRows.filter(id=>targetRows.includes(id));
    if(overlap.length)throw new Error('LIDIIA_PROGRESS_SET_OVERLAP:'+overlap.join(','));
    return{
      key:'lidiia-akbarova-b174698-late-duplicate',name:'Lidiia Akbarova',canonicalId:LIDIIA_TARGET,
      duplicateStudentIds:[LIDIIA_OLD],
      profiles:[
        {profileId:LIDIIA_TARGET,memberProgressIds:targetRows.length?targetRows:[LIDIIA_TARGET],allowMissing:true},
        {profileId:LIDIIA_OLD,memberProgressIds:oldRows}
      ]
    };
  }

  function database(){try{return firebase.firestore()}catch(e){return null}}
  function stamp(){return firebase.firestore.FieldValue.serverTimestamp()}
  function authUid(){try{return text(firebase.auth().currentUser?.uid)}catch(e){return''}}

  async function loadState(){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    const [studentsSnap,progressSnap,lookupsSnap]=await Promise.all([
      db.collection('students').get(),db.collection('progress').get(),db.collection('studentLookups').get()
    ]);
    return{
      db,
      students:studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      progress:progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      lookups:lookupsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}))
    };
  }
  async function backupStudent(db,student,reason){
    const id=studentId(student);if(!id)return'';
    const ref=db.collection('diagnostics').doc();
    await ref.set({
      backupType:'legacy-student-lookup-resolution',backupVersion:VERSION,
      kind:'student',path:'students/'+id,reason,
      snapshot:stripInternal(student),createdByUid:authUid(),backedUpAt:stamp()
    });
    return ref.id;
  }
  function lookupMappedId(row={}){return text(row.canonicalStudentId||row.studentId)}
  async function validateEmailAssignment(state,student,email){
    const mail=lower(email);if(!validEmail(mail))throw new Error('INVALID_EMAIL:'+studentId(student));
    if(!courseValues(student).length)throw new Error('COURSE_REQUIRED_FOR_EMAIL:'+studentId(student));
    for(const other of state.students){
      if(studentId(other)===studentId(student)||emailOf(other)!==mail)continue;
      if(sameCourse(student,other))throw new Error('EMAIL_COURSE_ALREADY_USED:'+studentId(other));
    }
    const keys=root.StudentSecurityLookup?.keysFor?.({...student,email:mail})||[];
    for(const key of keys){
      const existing=state.lookups.find(row=>text(row.__docId)===key);
      const mapped=lookupMappedId(existing||{});
      if(existing&&mapped&&mapped!==studentId(student))throw new Error('LOOKUP_ALREADY_USED:'+key+':'+mapped);
    }
    return mail;
  }
  async function setStudentEmail(state,student,email){
    const mail=await validateEmailAssignment(state,student,email);
    await backupStudent(state.db,student,'manual-email-resolution');
    await state.db.collection('students').doc(studentId(student)).set({
      email:mail,
      securityLookupExcluded:false,
      securityLookupExcludedReason:'',
      securityLookupEmailResolvedVersion:VERSION,
      securityLookupEmailResolvedByUid:authUid(),
      securityLookupEmailResolvedAt:stamp(),
      updatedAt:stamp()
    },{merge:true});
    return mail;
  }
  async function excludeLegacyStudent(state,student){
    if(emailOf(student)||text(student.authUid))throw new Error('LEGACY_EXCLUSION_NOT_SAFE:'+studentId(student));
    await backupStudent(state.db,student,'legacy-no-email-kept-without-login');
    await state.db.collection('students').doc(studentId(student)).set({
      securityLookupExcluded:true,
      securityLookupExcludedVersion:VERSION,
      securityLookupExcludedReason:'legacy-no-email',
      securityLookupExcludedByUid:authUid(),
      securityLookupExcludedAt:stamp(),
      updatedAt:stamp()
    },{merge:true});
    return true;
  }
  async function mergeLidiia(){
    if(!root.OneTimeDuplicateIncident?.loadState||!root.OneTimeDuplicateIncident?.applyGroup)throw new Error('ONE_TIME_DUPLICATE_INCIDENT_MISSING');
    const incidentState=await root.OneTimeDuplicateIncident.loadState();
    const group=buildLidiiaGroup(incidentState.students,incidentState.progress);
    if(group.alreadyResolved)return{alreadyDone:true,name:'Lidiia Akbarova'};
    try{await root.ProgressSecurityAliasMigration?.markReady?.(false,{status:'late-lidiia-duplicate-merge'})}catch(e){}
    return root.OneTimeDuplicateIncident.applyGroup(incidentState,group);
  }

  function resultBox(){
    let box=document.getElementById('sp-legacy-lookup-resolution-result');
    if(!box){
      box=document.createElement('div');box.id='sp-legacy-lookup-resolution-result';
      box.style.cssText='position:fixed;inset:4vh 4vw;z-index:100090;background:#fff;border:3px solid #9a6700;border-radius:14px;box-shadow:0 16px 50px rgba(0,0,0,.3);padding:18px;overflow:auto;font:14px/1.45 system-ui;color:#13293d';
      document.body.appendChild(box);
    }
    return box;
  }
  function renderText(message,ok=true){const box=resultBox();box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=message;return box}
  function option(select,value,label){const el=document.createElement('option');el.value=value;el.textContent=label;select.appendChild(el)}

  function renderPanel(state,items){
    const box=resultBox();box.style.borderColor='#9a6700';box.textContent='';
    const top=document.createElement('div');top.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:12px';
    const h=document.createElement('h2');h.textContent='Fehlende E-Mails / Altprofile sicher auflösen';top.appendChild(h);
    const close=document.createElement('button');close.textContent='Schließen';close.onclick=()=>box.remove();top.appendChild(close);box.appendChild(top);
    const intro=document.createElement('p');intro.textContent='Nichts wird geraten. Für jedes Profil entweder eine echte E-Mail festlegen oder „Altprofil ohne Login erhalten“ wählen. Diese Altprofile und ihre Fortschritte bleiben im Lehrer-Dashboard vollständig erhalten. Lidiias eindeutiges Doppelprofil kann einmalig zusammengeführt werden; dabei werden die Punkte beider Profile genau einmal addiert.';box.appendChild(intro);

    for(const student of items){
      const id=studentId(student),fieldset=document.createElement('fieldset');fieldset.style.cssText='margin:14px 0;padding:12px;border:1px solid #bbb;border-radius:9px';
      const legend=document.createElement('legend');legend.textContent=(nameOf(student)||'Ohne Name')+' · '+id;fieldset.appendChild(legend);
      const meta=document.createElement('div');
      const hints=emailHints(student,state.progress,state.lookups),candidates=exactNameCandidates(student,state.students);
      meta.textContent=`Kurs: ${courseValues(student).join(', ')||'—'} · Firebase-UID: ${text(student.authUid)?'GEBUNDEN':'nicht gebunden'}${hints.length?' · E-Mail-Hinweis aus Daten: '+hints.join(', '):''}`;fieldset.appendChild(meta);
      if(candidates.length){
        const c=document.createElement('div');c.style.cssText='margin-top:6px';c.textContent='Exakt gleichnamige Profile mit E-Mail: '+candidates.map(x=>`${studentId(x)} · ${emailOf(x)} · ${courseValues(x).join('/')}`).join(' | ');fieldset.appendChild(c);
      }
      if(id==='glk-68_mohammed_mohammed'){
        const warning=document.createElement('div');warning.style.cssText='margin-top:6px;font-weight:600';warning.textContent='Mohammed Almomni wird NICHT automatisch zugeordnet: der Nachname stimmt nicht eindeutig überein.';fieldset.appendChild(warning);
      }
      const select=document.createElement('select');select.id='sp-legacy-lookup-choice-'+id;select.style.cssText='width:100%;padding:9px;margin-top:9px';
      option(select,'','— Bitte auswählen —');
      if(id===LIDIIA_OLD){
        option(select,'merge-lidiia','Doppelprofil mit akbarovalidiia@gmail.com zusammenführen; Punkte einmalig addieren');
      }else if(id==='kurs-student'){
        option(select,'exclude','Technisches Altprofil ohne Login erhalten');
      }else{
        const exact=candidates.length===1?candidates[0]:null;
        if(exact&&id==='a-1_nelia_roiko_1995-04-30')option(select,'candidate:'+emailOf(exact),'E-Mail '+emailOf(exact)+' übernehmen; A-1-Profil separat behalten');
        option(select,'manual-email','Eine echte E-Mail manuell eintragen');
        option(select,'exclude','Altprofil ohne Login erhalten');
      }
      fieldset.appendChild(select);
      if(id!==LIDIIA_OLD&&id!=='kurs-student'){
        const input=document.createElement('input');input.type='email';input.id='sp-legacy-lookup-email-'+id;input.placeholder='E-Mail nur bei „manuell eintragen“';input.style.cssText='width:100%;box-sizing:border-box;padding:9px;margin-top:7px';fieldset.appendChild(input);
      }
      box.appendChild(fieldset);
    }
    const save=document.createElement('button');save.type='button';save.textContent='Entscheidungen sicher speichern und erneut prüfen';save.style.cssText='padding:11px 15px;margin-top:8px';save.onclick=()=>saveChoices(items).catch(()=>{});box.appendChild(save);
  }

  async function saveChoices(items){
    const choices=[];
    for(const student of items){
      const id=studentId(student),choice=text(document.getElementById('sp-legacy-lookup-choice-'+id)?.value);
      if(!choice){renderText('Bitte für jedes angezeigte Profil eine Entscheidung treffen. Es wurde noch nichts verändert.',false);return}
      let email='';
      if(choice==='manual-email')email=lower(document.getElementById('sp-legacy-lookup-email-'+id)?.value);
      if(choice.startsWith('candidate:'))email=lower(choice.slice('candidate:'.length));
      if((choice==='manual-email'||choice.startsWith('candidate:'))&&!validEmail(email)){renderText('Ungültige oder fehlende E-Mail bei '+id+'. Es wurde noch nichts verändert.',false);return}
      choices.push({studentId:id,choice,email});
    }
    const yes=root.confirm('Diese Entscheidungen jetzt speichern?\n\nE-Mail-Zuordnungen werden vorher auf Kurs-/Lookup-Kollisionen geprüft. Altprofile ohne Login bleiben vollständig erhalten. Lidiias Doppelprofil wird nur bei entsprechender Auswahl einmalig zusammengeführt; alte Fortschrittsdokumente werden dabei archiviert, nicht gelöscht.');
    if(!yes)return;
    renderText('Entscheidungen werden geprüft und gesichert …',true);
    try{
      let state=await loadState();
      const byId=()=>new Map(state.students.map(s=>[studentId(s),s]));
      const results=[];
      for(const entry of choices){
        if(entry.choice==='merge-lidiia'){
          const result=await mergeLidiia();results.push({id:entry.studentId,action:'merged',result});
          state=await loadState();continue;
        }
        const student=byId().get(entry.studentId);if(!student)continue;
        if(entry.choice==='exclude'){
          await excludeLegacyStudent(state,student);results.push({id:entry.studentId,action:'excluded'});
        }else{
          const mail=await setStudentEmail(state,student,entry.email);results.push({id:entry.studentId,action:'email',email:mail});
        }
        state=await loadState();
      }
      renderText('Entscheidungen gespeichert. Fortschritts- und Lookup-Sicherheit werden erneut vollständig geprüft …',true);
      const progress=await root.ProgressSecurityAliasMigration.backfillAndVerify();
      const lookup=await root.StudentSecurityLookup.runUi();
      renderText(`Legacy-Profile sicher aufgelöst.\n\nBearbeitete Entscheidungen: ${results.length}\nGelöschte Fortschrittsdokumente: 0\nFortschritts-Sicherheit: BEREIT\nLookup-Sicherheit: ${lookup?.verification?.ok?'BEREIT':'NICHT BEREIT'}\nAltprofile ohne Login bleiben vollständig erhalten.\n\nNoch keinen Sicherheits-Cutover starten, bis das Owner-Firebase-Konto geprüft wurde.`,true);
      root.SP_LEGACY_LOOKUP_RESOLUTION={ok:true,results,progress,lookup};
      const button=document.getElementById('sp-legacy-lookup-resolution-btn');if(button)button.style.display='none';
      return root.SP_LEGACY_LOOKUP_RESOLUTION;
    }catch(error){
      console.error('Legacy-Lookup-Auflösung fehlgeschlagen',error);
      renderText(`Auflösung gestoppt.\nFehler: ${error?.message||error}\n\nKein Fortschrittsdokument wurde gelöscht. Bereits sicher gespeicherte Einzelentscheidungen bleiben erhalten; der Sicherheits-Cutover bleibt blockiert.`,false);
      root.SP_LEGACY_LOOKUP_RESOLUTION={ok:false,error};
      throw error;
    }
  }

  async function currentItems(){
    const state=await loadState();
    return{state,items:state.students.filter(unresolvedStudent)};
  }
  async function runUi(){
    try{
      const {state,items}=await currentItems();
      if(!items.length){renderText('Keine unresolved Legacy-Profile ohne E-Mail mehr vorhanden.',true);return}
      renderPanel(state,items);
    }catch(error){renderText('Legacy-Profilprüfung fehlgeschlagen: '+(error?.message||error),false)}
  }
  async function install(){
    if(typeof document==='undefined')return;
    if(!root.StudentSecurityLookup||!root.StudentSecurityLookupExclusions||!root.OneTimeDuplicateIncident||!root.ProgressSecurityAliasMigration){setTimeout(install,150);return}
    const anchor=document.getElementById('sp-security-lookup-btn');if(!anchor){setTimeout(install,150);return}
    if(document.getElementById('sp-legacy-lookup-resolution-btn'))return;
    try{
      const {items}=await currentItems();if(!items.length)return;
      const button=document.createElement('button');button.id='sp-legacy-lookup-resolution-btn';button.type='button';button.className=anchor.className;
      button.textContent='Fehlende E-Mails / Altprofile sicher auflösen';button.onclick=()=>runUi();anchor.insertAdjacentElement('afterend',button);
    }catch(e){}
  }

  root.LegacyLookupResolution={
    VERSION,TARGET_IDS,LIDIIA_OLD,LIDIIA_TARGET,text,lower,uniq,emailOf,nameOf,normName,courseValues,sameCourse,studentId,progressId,validEmail,
    identityIds,rowBelongsToStudent,emailHints,exactNameCandidates,unresolvedStudent,memberProgressIds,buildLidiiaGroup,
    loadState,validateEmailAssignment,setStudentEmail,excludeLegacyStudent,mergeLidiia,currentItems,runUi,install
  };
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,500));
    else setTimeout(install,500);
  }
})(typeof window!=='undefined'?window:globalThis);
