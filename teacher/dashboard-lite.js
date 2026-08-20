(function(){
'use strict';

const OWNER_EMAILS=new Set(['studyroomslandstuhl@gmail.com','alicekrekoten@gmail.com','alisa.krekoten@gmail.com']);
const VIEW_IDS=new Set(['overview','courses','students','releases','teacher-approval','email-templates']);
const TEMPLATE_TYPES=['passwordReset','verification','setup'];
const DEFAULT_TEMPLATES={
  passwordReset:{
    label:'Passwort zurücksetzen',
    subject:'SprachPilot – Passwort festlegen oder zurücksetzen',
    title:'Passwort festlegen',
    intro:'für dein SprachPilot-Konto wurde ein neues Passwort angefordert.',
    body:'Klicke auf den Button und lege dein persönliches Passwort fest.',
    button:'Passwort festlegen',
    footer:'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.'
  },
  verification:{
    label:'E-Mail bestätigen',
    subject:'SprachPilot – E-Mail-Adresse bestätigen',
    title:'E-Mail-Adresse bestätigen',
    intro:'bitte bestätige deine E-Mail-Adresse für dein SprachPilot-Konto.',
    body:'Nach der Bestätigung kannst du deinen sicheren SprachPilot-Zugang verwenden.',
    button:'E-Mail bestätigen',
    footer:'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.'
  },
  setup:{
    label:'Zugang einrichten',
    subject:'SprachPilot – deinen Zugang einrichten',
    title:'Deinen SprachPilot-Zugang einrichten',
    intro:'dein SprachPilot-Zugang ist vorbereitet.',
    body:'Lege zuerst dein persönliches Passwort fest. Bestätige danach deine E-Mail-Adresse. Anschließend kannst du dich mit E-Mail, Passwort und Kurscode anmelden.',
    button:'1. Persönliches Passwort festlegen',
    secondButton:'2. E-Mail-Adresse bestätigen',
    footer:'Die Links sind nur für dein persönliches SprachPilot-Konto bestimmt. Gib sie nicht weiter.'
  }
};

const state={
  user:null,teacher:null,isOwner:false,view:'overview',courses:[],students:[],loadedAt:0,
  releaseToolsReady:false,releaseToolsPromise:null,releaseCourseId:'',
  teacherRows:null,pendingTeachers:null,mailTemplates:null,templateType:'passwordReset',busy:false
};

const $=id=>document.getElementById(id);
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeId=value=>String(value||'').replace(/[^a-zA-Z0-9_-]/g,'_');
const db=()=>window.db||firebase.firestore();
const auth=()=>window.auth||firebase.auth();
const nowTs=()=>firebase.firestore.FieldValue.serverTimestamp();

function status(message='',kind=''){
  const el=$('spStatus');if(!el)return;
  el.textContent=message;el.className='sp-status'+(kind?' '+kind:'');
}
function setBusy(value,message=''){
  state.busy=!!value;
  const button=$('refreshBtn');if(button)button.disabled=!!value;
  if(message)status(message);
}
function courseCode(course={}){return text(course.courseCode||course.code||course.kurs||course.kursnummer||course.id||course.name)}
function courseName(course={}){return text(course.courseName||course.name||courseCode(course)||'Unbenannter Kurs')}
function courseDocId(course={}){return text(course.__docId||course.docId||course.id||courseCode(course))}
function studentId(student={}){return text(student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id)}
function studentCourse(student={}){return text(student.courseCode||student.kurs||student.kursnummer||student.courseDocId)}
function studentName(student={}){return text([student.vorname||student.firstName,student.nachname||student.lastName].filter(Boolean).join(' '))||text(student.name||student.displayName)||'Teilnehmer/in'}
function isReleased(course={}){
  const direct=[course.enabledModules,course.enabledLessons,course.enabledThemes,course.enabledTasks,course.enabledWords,course.enabledSets];
  return direct.some(obj=>obj&&typeof obj==='object'&&Object.values(obj).some(Boolean))||!!(course.releases&&Object.keys(course.releases).length);
}
function courseMap(){return new Map(state.courses.map(c=>[courseCode(c),c]).filter(([k])=>k))}
function studentsForCourse(code){const wanted=norm(code);return state.students.filter(s=>norm(studentCourse(s))===wanted)}
function isOwnerEmail(email){return OWNER_EMAILS.has(norm(email))}
function ownerOnly(){if(!state.isOwner)throw new Error('OWNER_REQUIRED')}

function clearLegacyTeacherState(){
  try{
    sessionStorage.removeItem('SP_TEACHER_PREVIEW');
    sessionStorage.removeItem('SP_TEACHER_MODE_WAS_ACTIVE');
    sessionStorage.removeItem('SP_PREVIEW_COURSE');
  }catch(e){}
}
function storeTeacherSession(){
  clearLegacyTeacherState();
  const profile={...(state.teacher||{}),uid:state.user?.uid||'',email:state.user?.email||state.teacher?.email||'',role:state.isOwner?'owner':'teacher',owner:state.isOwner};
  try{
    localStorage.setItem('SP_TEACHER_MODE','1');
    localStorage.setItem('SP_LOGIN_ROLE','teacher');
    localStorage.setItem('SP_ACTIVE_ROLE','teacher');
    localStorage.setItem('SP_LOGIN_CONTEXT','teacher');
    localStorage.setItem('SP_USER_ROLE',profile.role);
    localStorage.setItem('SP_TEACHER_EMAIL',profile.email||'');
    localStorage.setItem('SP_TEACHER_ID',profile.uid||'');
    localStorage.setItem('SP_TEACHER_UID',profile.uid||'');
    localStorage.setItem('SP_TEACHER_PROFILE',JSON.stringify(profile));
  }catch(e){}
}
async function logout(){
  try{
    ['SP_TEACHER_MODE','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_LOGIN_CONTEXT','SP_USER_ROLE','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID','SP_TEACHER_PROFILE'].forEach(k=>localStorage.removeItem(k));
    clearLegacyTeacherState();
    await auth().signOut();
  }catch(e){}
  location.href='login.html';
}

async function securityGeneration({createIfMissing=false}={}){
  const ref=db().collection('settings').doc('teacherSecurity');
  const snap=await ref.get();
  if(snap.exists){
    const data=snap.data()||{};
    if(Number(data.teacherSecurityVersion||0)>=2&&text(data.generation))return text(data.generation);
  }
  if(!createIfMissing)return'';
  ownerOnly();
  const generation=globalThis.crypto?.randomUUID?.()||`teacher-v2-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await ref.set({teacherSecurityVersion:2,generation,initializedByUid:state.user.uid,initializedByEmail:norm(state.user.email),initializedAt:nowTs(),updatedAt:nowTs()},{merge:true});
  return generation;
}

async function resolveTeacherAccess(user){
  const email=norm(user?.email);
  if(isOwnerEmail(email)){
    state.isOwner=true;
    const generation=await securityGeneration({createIfMissing:true});
    const ref=db().collection('teachers').doc(user.uid);
    const payload={uid:user.uid,email,emailLower:email,role:'owner',owner:true,active:true,approved:true,status:'approved',securityApprovedV2:true,securityApprovalGeneration:generation,updatedAt:nowTs()};
    await ref.set(payload,{merge:true});
    const snap=await ref.get();
    return{ok:true,data:{id:snap.id,...(snap.data()||payload)}};
  }
  const ref=db().collection('teachers').doc(user.uid),snap=await ref.get();
  if(!snap.exists){
    const pending=await db().collection('teachers_pending').doc(user.uid).get();
    return pending.exists?{ok:false,pending:true,data:pending.data()||{}}:{ok:false,missing:true};
  }
  const data=snap.data()||{};
  if(data.active===false||data.blocked===true||['blocked','disabled','deaktiviert'].includes(norm(data.status)))return{ok:false,blocked:true,data};
  if(data.approved===false||data.pending===true||['pending','waiting','requested','beantragt'].includes(norm(data.status)))return{ok:false,pending:true,data};
  const generation=await securityGeneration();
  if(!generation||data.securityApprovedV2!==true||text(data.securityApprovalGeneration)!==generation)return{ok:false,pending:true,securityPending:true,data};
  return{ok:true,data:{id:snap.id,...data}};
}

function accessFailure(result){
  const app=$('app');if(!app)return;
  const title=result?.blocked?'Lehrerzugang deaktiviert':result?.pending?'Lehrer-Freigabe ausstehend':'Kein Lehrerzugang';
  const body=result?.securityPending?'Dein Konto ist registriert, benötigt aber noch die aktuelle Lehrer-Freigabe durch den Owner.':result?.pending?'Dein Lehrerkonto wartet noch auf die Freigabe durch den Owner.':result?.blocked?'Dieser Lehrerzugang wurde deaktiviert.':'Für dieses Firebase-Konto wurde kein Lehrerzugang gefunden.';
  app.innerHTML=`<section class="sp-card sp-wide"><h2>${esc(title)}</h2><p>${esc(body)}</p><div class="sp-meta"><span>${esc(state.user?.email||'')}</span></div><div class="sp-row-actions" style="margin-top:14px;justify-content:flex-start"><a class="sp-button secondary" href="login.html">Zum Lehrerlogin</a><button class="sp-button" onclick="SPTeacherDashboard.logout()">Abmelden</button></div></section>`;
}

function normalizeCourseDoc(doc){return{id:doc.id,__docId:doc.id,...(doc.data()||{})}}
function normalizeStudentDoc(doc){return{id:doc.id,__docId:doc.id,docId:doc.id,...(doc.data()||{})}}
async function loadTeacherCourses(){
  if(state.isOwner){const snap=await db().collection('courses').get();return snap.docs.map(normalizeCourseDoc)}
  const uid=text(state.user?.uid),email=norm(state.user?.email),map=new Map();
  const jobs=[
    ['teacherUid','==',uid],['ownerUid','==',uid],['createdByUid','==',uid],['teacherEmail','==',email],['teacherUids','array-contains',uid]
  ].filter(([,op,value])=>value).map(async([field,op,value])=>{
    try{const snap=await db().collection('courses').where(field,op,value).get();snap.docs.forEach(doc=>map.set(doc.id,normalizeCourseDoc(doc)))}catch(e){}
  });
  await Promise.all(jobs);
  return [...map.values()];
}
async function loadStudents(){
  const snap=await db().collection('students').get(),all=snap.docs.map(normalizeStudentDoc);
  if(state.isOwner)return all;
  const allowed=new Set(state.courses.map(courseCode).map(norm).filter(Boolean));
  return all.filter(s=>allowed.has(norm(studentCourse(s))));
}
async function loadBaseData({quiet=false}={}){
  if(state.busy)return;
  setBusy(true,quiet?'':'Kurse und Teilnehmende werden aus Firebase geladen …');
  try{
    state.courses=await loadTeacherCourses();
    state.courses.sort((a,b)=>courseName(a).localeCompare(courseName(b),'de'));
    state.students=await loadStudents();
    state.students.sort((a,b)=>studentName(a).localeCompare(studentName(b),'de'));
    state.loadedAt=Date.now();
    window.__SP_COURSES=state.courses;
    window.__SP_COURSES_BY_CODE=Object.fromEntries(state.courses.map(c=>[courseCode(c),c]).filter(([k])=>k));
    window.__SP_STUDENTS_BY_ID=Object.fromEntries(state.students.map(s=>[studentId(s),s]).filter(([k])=>k));
    if(!quiet)status(`Aktuell · ${new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`,'ok');
  }catch(error){
    console.error(error);status('Dashboard-Daten konnten nicht geladen werden: '+text(error?.message||error),'error');throw error;
  }finally{setBusy(false)}
}

function navState(){
  document.querySelectorAll('[data-view]').forEach(button=>button.classList.toggle('active',button.dataset.view===state.view));
  document.querySelectorAll('[data-owner-only]').forEach(el=>el.hidden=!state.isOwner);
  const badge=$('accountBadge');
  if(badge)badge.innerHTML=`<div><strong>${esc(state.user?.email||'')}</strong>${state.isOwner?'<span class="sp-owner-badge">OWNER</span>':''}</div>`;
}
function pageHead(title,subtitle,actions=''){return `<div class="sp-page-head"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>${actions?`<div class="sp-row-actions">${actions}</div>`:''}</div>`}
function participantCount(code){return studentsForCourse(code).length}
function courseRow(course){
  const code=courseCode(course),count=participantCount(code),released=isReleased(course);
  return `<div class="sp-course-row"><div><div class="sp-course-title">${esc(courseName(course))}</div><div class="sp-meta"><span>Kurscode: ${esc(code||'—')}</span><span>${count} Teilnehmende</span><span class="sp-pill ${released?'ok':'warn'}">${released?'Freigaben eingerichtet':'noch keine Freigaben'}</span></div></div><div class="sp-row-actions"><button class="sp-button secondary" onclick="SPTeacherDashboard.openRelease('${esc(courseDocId(course))}')">Freigaben</button></div></div>`;
}

function renderOverview(){
  const released=state.courses.filter(isReleased).length;
  $('app').innerHTML=`${pageHead('Gesamtübersicht','Kurse, Teilnehmende und Freigaben auf einen Blick.')}
  <div class="sp-grid">
    <section class="sp-card sp-stat"><div class="value">${state.courses.length}</div><div class="label">Kurse</div></section>
    <section class="sp-card sp-stat"><div class="value">${state.students.length}</div><div class="label">Teilnehmende</div></section>
    <section class="sp-card sp-stat"><div class="value">${released}</div><div class="label">Kurse mit Freigaben</div></section>
    <section class="sp-card sp-stat"><div class="value">${state.courses.length-released}</div><div class="label">noch einzurichten</div></section>
    <section class="sp-card sp-wide"><h2>Kurse</h2><p>Keine Fortschritts-Vollscans und keine automatische Neuladung. Aktualisierung nur über den Button oben.</p><div class="sp-course-list">${state.courses.length?state.courses.map(courseRow).join(''):'<div class="sp-empty">Noch keine Kurse vorhanden.</div>'}</div></section>
  </div>`;
}

function renderCourses(){
  $('app').innerHTML=`${pageHead('Kurse','Kurse anlegen und verwalten.')}
  <section class="sp-card sp-wide"><div class="sp-toolbar"><input id="newCourseName" placeholder="Kursname oder Kurscode"><button class="sp-button" id="createCourseBtn">Kurs anlegen</button></div></section>
  <section class="sp-card sp-wide" style="margin-top:16px"><div class="sp-course-list">${state.courses.length?state.courses.map(course=>{
    const code=courseCode(course),count=participantCount(code);
    return `<div class="sp-course-row"><div><div class="sp-course-title">${esc(courseName(course))}</div><div class="sp-meta"><span>${esc(code)}</span><span>${count} Teilnehmende</span></div></div><div class="sp-row-actions"><button class="sp-button secondary" onclick="SPTeacherDashboard.openRelease('${esc(courseDocId(course))}')">Freigaben</button><button class="sp-button danger" onclick="SPTeacherDashboard.removeCourse('${esc(courseDocId(course))}')">Löschen</button></div></div>`;
  }).join(''):'<div class="sp-empty">Noch keine Kurse vorhanden.</div>'}</div></section>`;
  $('createCourseBtn')?.addEventListener('click',createCourse);
  $('newCourseName')?.addEventListener('keydown',e=>{if(e.key==='Enter')createCourse()});
}
async function createCourse(){
  const input=$('newCourseName'),name=text(input?.value);if(!name)return status('Bitte einen Kursnamen eingeben.','error');
  const exists=state.courses.some(c=>norm(courseCode(c))===norm(name));if(exists)return status('Dieser Kurscode ist bereits vorhanden.','error');
  setBusy(true,'Kurs wird gespeichert …');
  try{
    const uid=state.user.uid,email=norm(state.user.email),display=state.user.displayName||email;
    const payload={name,courseName:name,courseCode:name,teacherUid:uid,teacherId:uid,ownerUid:uid,teacherEmail:email,ownerEmail:email,teacherUids:[uid],teacherEmails:[email],teachers:[uid,email],assignedTeacherUid:uid,assignedTeacherUids:[uid],assignedTeacherEmails:[email],teacherName:display,enabledModules:{},enabledLessons:{},enabledThemes:{},enabledTasks:{},enabledWords:{},enabledSets:{},releases:{},defaultLocked:true,releaseMode:'locked',createdAt:nowTs(),updatedAt:nowTs()};
    await db().collection('courses').doc(name).set(payload,{merge:true});
    state.courses.push({id:name,__docId:name,...payload});state.courses.sort((a,b)=>courseName(a).localeCompare(courseName(b),'de'));
    window.__SP_COURSES=state.courses;status('Kurs gespeichert.','ok');renderCourses();
  }catch(error){status('Kurs konnte nicht gespeichert werden: '+text(error?.message||error),'error')}finally{setBusy(false)}
}
async function removeCourse(id){
  const course=state.courses.find(c=>courseDocId(c)===id);if(!course)return;
  if(!confirm(`Kurs „${courseName(course)}“ wirklich löschen? Teilnehmende bleiben erhalten.`))return;
  setBusy(true,'Kurs wird gelöscht …');
  try{await db().collection('courses').doc(id).delete();state.courses=state.courses.filter(c=>courseDocId(c)!==id);status('Kurs gelöscht.','ok');renderCourses()}catch(error){status('Kurs konnte nicht gelöscht werden: '+text(error?.message||error),'error')}finally{setBusy(false)}
}

function studentAccessPill(student){
  if(student.authUid&&student.authEmail)return '<span class="sp-pill ok">Firebase-Konto</span>';
  if(student.email)return '<span class="sp-pill warn">E-Mail vorhanden</span>';
  return '<span class="sp-pill bad">E-Mail fehlt</span>';
}
function renderStudents(){
  const options=state.courses.map(c=>`<option value="${esc(courseCode(c))}">${esc(courseName(c))}</option>`).join('');
  $('app').innerHTML=`${pageHead('Teilnehmende','Kontaktdaten und Kurszuordnung. Fortschrittsdaten werden hier bewusst nicht geladen.')}
  <section class="sp-card sp-wide"><div class="sp-filterbar"><input id="studentSearch" type="search" placeholder="Name oder E-Mail suchen"><select id="studentCourseFilter"><option value="">Alle Kurse</option>${options}</select></div><div id="studentTableHost"></div></section>`;
  $('studentSearch')?.addEventListener('input',renderStudentTable);
  $('studentCourseFilter')?.addEventListener('change',renderStudentTable);
  renderStudentTable();
}
function renderStudentTable(){
  const host=$('studentTableHost');if(!host)return;
  const q=norm($('studentSearch')?.value),course=norm($('studentCourseFilter')?.value);
  const rows=state.students.filter(s=>(!course||norm(studentCourse(s))===course)&&(!q||norm(studentName(s)).includes(q)||norm(s.email).includes(q)));
  host.innerHTML=rows.length?`<div class="sp-table-wrap"><table class="sp-table"><thead><tr><th>Teilnehmende</th><th>E-Mail</th><th>Kurs</th><th>Zugang</th><th>Aktion</th></tr></thead><tbody>${rows.map(s=>`<tr><td><strong>${esc(studentName(s))}</strong></td><td>${esc(s.email||'—')}</td><td>${esc(studentCourse(s)||'—')}</td><td>${studentAccessPill(s)}</td><td><div class="sp-row-actions"><button class="sp-button secondary" onclick="SPTeacherDashboard.editStudent('${esc(studentId(s))}')">Bearbeiten</button></div></td></tr>`).join('')}</tbody></table></div>`:'<div class="sp-empty">Keine Teilnehmenden gefunden.</div>';
}
function openModal(html){let back=$('spModalBackdrop');if(back)back.remove();back=document.createElement('div');back.id='spModalBackdrop';back.className='sp-modal-backdrop';back.innerHTML=`<div class="sp-modal" role="dialog" aria-modal="true">${html}</div>`;back.addEventListener('click',e=>{if(e.target===back)back.remove()});document.body.appendChild(back)}
function closeModal(){$('spModalBackdrop')?.remove()}
function editStudent(id){
  const s=state.students.find(x=>studentId(x)===id);if(!s)return;
  const courseOptions=state.courses.map(c=>`<option value="${esc(courseCode(c))}" ${norm(studentCourse(s))===norm(courseCode(c))?'selected':''}>${esc(courseName(c))}</option>`).join('');
  openModal(`<div class="sp-modal-head"><div><h2 style="margin:0">Teilnehmende bearbeiten</h2><div class="sp-meta">${esc(studentName(s))}</div></div><button class="sp-icon-btn" onclick="SPTeacherDashboard.closeModal()">Schließen</button></div><div class="sp-form-grid"><div class="sp-field"><label>Vorname</label><input id="editFirstName" value="${esc(s.vorname||s.firstName||'')}"></div><div class="sp-field"><label>Nachname</label><input id="editLastName" value="${esc(s.nachname||s.lastName||'')}"></div><div class="sp-field wide"><label>E-Mail</label><input id="editEmail" type="email" value="${esc(s.email||'')}"></div><div class="sp-field wide"><label>Kurs</label><select id="editCourse"><option value="">Ohne Kurs</option>${courseOptions}</select></div></div>${s.authUid&&s.authEmail?`<div class="sp-owner-note" style="margin-top:14px">Dieses Konto ist bereits mit Firebase verbunden. Die gebundene E-Mail ${esc(s.authEmail)} kann hier nicht auf eine andere Adresse umgestellt werden.</div>`:''}<div class="sp-row-actions" style="margin-top:18px"><button class="sp-button secondary" onclick="SPTeacherDashboard.closeModal()">Abbrechen</button><button class="sp-button" onclick="SPTeacherDashboard.saveStudent('${esc(id)}')">Speichern</button></div>`);
}
function lookupClean(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function lookupKeys(student={}){
  const email=norm(student.email);if(!email)return[];
  const courses=[student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course].map(text).filter(Boolean);
  return [...new Set(courses.map(course=>`${lookupClean(course)}_${lookupClean(email)}`).filter(x=>x!=='_'))];
}
async function saveStudent(id){
  const index=state.students.findIndex(x=>studentId(x)===id),old=state.students[index];if(index<0||!old)return;
  const email=norm($('editEmail')?.value),course=text($('editCourse')?.value),first=text($('editFirstName')?.value),last=text($('editLastName')?.value);
  if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return status('Bitte eine gültige E-Mail-Adresse eingeben.','error');
  if(old.authUid&&old.authEmail&&email!==norm(old.authEmail))return status('Die E-Mail eines bereits gebundenen Firebase-Kontos kann hier nicht geändert werden.','error');
  const next={...old,vorname:first,nachname:last,email,emailLower:email,kurs:course,kursnummer:course,courseCode:course};
  const oldKeys=lookupKeys(old),newKeys=lookupKeys(next),canonical=studentId(old);
  setBusy(true,'Teilnehmende werden gespeichert …');
  try{
    for(const key of newKeys){
      const snap=await db().collection('studentLookups').doc(key).get();
      if(snap.exists){const mapped=text((snap.data()||{}).canonicalStudentId||(snap.data()||{}).studentId);if(mapped&&mapped!==canonical)throw new Error('Diese E-Mail/Kurs-Kombination gehört bereits zu einem anderen Konto.')}
    }
    const batch=db().batch();
    batch.set(db().collection('students').doc(canonical),{vorname:first,nachname:last,email,emailLower:email,kurs:course,kursnummer:course,courseCode:course,updatedAt:nowTs()},{merge:true});
    for(const key of newKeys)batch.set(db().collection('studentLookups').doc(key),{lookupVersion:1,canonicalStudentId:canonical,studentId:canonical,email,courseKeys:[course].filter(Boolean),active:old.active!==false,updatedAt:nowTs()},{merge:true});
    for(const key of oldKeys.filter(k=>!newKeys.includes(k))){const snap=await db().collection('studentLookups').doc(key).get();if(snap.exists&&text((snap.data()||{}).canonicalStudentId||(snap.data()||{}).studentId)===canonical)batch.delete(db().collection('studentLookups').doc(key))}
    await batch.commit();
    state.students[index]=next;window.__SP_STUDENTS_BY_ID[canonical]=next;closeModal();status('Teilnehmende gespeichert.','ok');renderStudents();
  }catch(error){status('Änderung konnte nicht gespeichert werden: '+text(error?.message||error),'error')}finally{setBusy(false)}
}

function loadScript(src){return new Promise((resolve,reject)=>{if(document.querySelector(`script[data-sp-lazy="${CSS.escape(src)}"]`))return resolve();const s=document.createElement('script');s.src=src;s.dataset.spLazy=src;s.onload=resolve;s.onerror=()=>reject(new Error('Konnte '+src+' nicht laden'));document.head.appendChild(s)})}
async function ensureReleaseTools(){
  if(state.releaseToolsReady)return true;
  if(state.releaseToolsPromise)return state.releaseToolsPromise;
  state.releaseToolsPromise=(async()=>{
    const scripts=['../verben/data.js?v=verb-groups-2','../verben/verb-additions.js?v=requested-verbs-1','course-lock-default.js?v=teacher-lite1','releases.js?v=teacher-lite1','verben-groups-release.js?v=4','verben-release-order.js?v=4','l6t3-release-catalog.js?v=1','irregular-verbs-release.js?v=1','release-course-code-fix.js?v=teacher-lite1','release-parent-rules.js?v=teacher-lite1'];
    for(const src of scripts)await loadScript(src);
    state.releaseToolsReady=typeof window.renderReleaseEditor==='function'||typeof renderReleaseEditor==='function';
    if(!state.releaseToolsReady)throw new Error('Freigabe-Editor konnte nicht initialisiert werden.');
    return true;
  })().catch(error=>{state.releaseToolsPromise=null;throw error});
  return state.releaseToolsPromise;
}
function renderReleases(){
  const options=state.courses.map(c=>`<option value="${esc(courseDocId(c))}" ${state.releaseCourseId===courseDocId(c)?'selected':''}>${esc(courseName(c))}</option>`).join('');
  $('app').innerHTML=`${pageHead('Freigaben','Freigaben werden direkt im jeweiligen Firebase-Kurs gespeichert.')}
  <section class="sp-card sp-wide"><div class="sp-toolbar"><select id="releaseCourseSelect"><option value="">Kurs auswählen</option>${options}</select><button class="sp-button secondary" id="openReleaseBtn">Freigabe öffnen</button></div><div id="releaseHost" class="release-editor">${state.releaseCourseId?'<div class="sp-skeleton" style="margin-top:16px"></div>':'<div class="sp-empty" style="margin-top:16px">Wähle einen Kurs. Der umfangreiche Freigabe-Editor wird erst dann geladen.</div>'}</div></section>`;
  $('releaseCourseSelect')?.addEventListener('change',e=>{state.releaseCourseId=e.target.value;if(!state.releaseCourseId){$('releaseHost').innerHTML='<div class="sp-empty" style="margin-top:16px">Wähle einen Kurs.</div>'}});
  $('openReleaseBtn')?.addEventListener('click',()=>openReleaseCourse($('releaseCourseSelect')?.value));
  if(state.releaseCourseId)setTimeout(()=>openReleaseCourse(state.releaseCourseId),0);
}
async function openReleaseCourse(id){
  if(!id)return status('Bitte zuerst einen Kurs auswählen.','error');
  state.releaseCourseId=id;
  if(state.view!=='releases'){navigate('releases');return}
  const host=$('releaseHost');if(host)host.innerHTML='<div class="sp-skeleton" style="margin-top:16px"></div>';
  status('Freigabe-Editor wird geladen …');
  try{
    await ensureReleaseTools();
    const course=state.courses.find(c=>courseDocId(c)===id);if(!course)throw new Error('Kurs nicht gefunden.');
    const renderer=window.renderReleaseEditor||globalThis.renderReleaseEditor;
    if(host)host.innerHTML=renderer(course);
    const select=$('releaseCourseSelect');if(select)select.value=id;
    status('Freigaben aus Firebase geladen.','ok');
  }catch(error){if(host)host.innerHTML=`<div class="sp-empty">${esc(error?.message||error)}</div>`;status('Freigaben konnten nicht geladen werden.','error')}
}

async function loadTeacherApprovalData(){
  ownerOnly();status('Lehrer-Freigaben werden aus Firebase geladen …');
  const [pending,teachers]=await Promise.all([db().collection('teachers_pending').get(),db().collection('teachers').get()]);
  state.pendingTeachers=pending.docs.map(d=>({id:d.id,...(d.data()||{})}));
  state.teacherRows=teachers.docs.map(d=>({id:d.id,...(d.data()||{})}));
  status('Lehrer-Freigaben aktuell.','ok');
}
function teacherDisplay(row={}){return text([row.firstName||row.vorname,row.lastName||row.nachname].filter(Boolean).join(' '))||text(row.name||row.email)||row.id}
async function renderTeacherApproval(){
  ownerOnly();
  if(!state.pendingTeachers||!state.teacherRows){$('app').innerHTML=`${pageHead('Lehrer-Freigabe','Nur für das Owner-Konto.')}<div class="sp-skeleton"></div>`;await loadTeacherApprovalData()}
  const generation=await securityGeneration({createIfMissing:true});
  const pending=state.pendingTeachers||[],active=(state.teacherRows||[]).filter(t=>!isOwnerEmail(t.email));
  $('app').innerHTML=`${pageHead('Lehrer-Freigabe','Neue Lehrkräfte freigeben oder bestehende Zugänge deaktivieren.')}
  <section class="sp-card sp-wide sp-owner-panel"><div class="sp-owner-note">Sicherheitsgeneration: ${esc(generation)}. Eine Freigabe wird direkt in Firebase unter teachers/{uid} gespeichert.</div><h2>Offene Anfragen</h2>${pending.length?`<div class="sp-table-wrap"><table class="sp-table"><thead><tr><th>Lehrkraft</th><th>E-Mail</th><th>Institution</th><th>Aktion</th></tr></thead><tbody>${pending.map(t=>`<tr><td><strong>${esc(teacherDisplay(t))}</strong><div class="sp-meta">${esc(t.job||'')}</div></td><td>${esc(t.email||'—')}</td><td>${esc(t.school||'—')}</td><td><div class="sp-row-actions"><button class="sp-button success" onclick="SPTeacherDashboard.approveTeacher('${esc(t.id)}')">Freigeben</button><button class="sp-button danger" onclick="SPTeacherDashboard.rejectTeacher('${esc(t.id)}')">Ablehnen</button></div></td></tr>`).join('')}</tbody></table></div>`:'<div class="sp-empty">Keine offenen Lehrer-Anfragen.</div>'}</section>
  <section class="sp-card sp-wide sp-owner-panel" style="margin-top:16px"><h2>Lehrerzugänge</h2>${active.length?`<div class="sp-table-wrap"><table class="sp-table"><thead><tr><th>Lehrkraft</th><th>E-Mail</th><th>Status</th><th>Aktion</th></tr></thead><tbody>${active.map(t=>{const approved=t.active!==false&&t.securityApprovedV2===true&&text(t.securityApprovalGeneration)===generation;return `<tr><td><strong>${esc(teacherDisplay(t))}</strong></td><td>${esc(t.email||'—')}</td><td><span class="sp-pill ${approved?'ok':'warn'}">${approved?'freigegeben':'nicht freigegeben'}</span></td><td><div class="sp-row-actions">${approved?`<button class="sp-button danger" onclick="SPTeacherDashboard.disableTeacher('${esc(t.id)}')">Deaktivieren</button>`:`<button class="sp-button success" onclick="SPTeacherDashboard.approveTeacher('${esc(t.id)}',true)">Freigeben</button>`}</div></td></tr>`}).join('')}</tbody></table></div>`:'<div class="sp-empty">Noch keine weiteren Lehrkräfte vorhanden.</div>'}</section>`;
}
async function approveTeacher(uid,existing=false){
  ownerOnly();setBusy(true,'Lehrerzugang wird freigegeben …');
  try{
    const generation=await securityGeneration({createIfMissing:true});
    let source={};
    if(!existing){const snap=await db().collection('teachers_pending').doc(uid).get();if(!snap.exists)throw new Error('Anfrage nicht mehr vorhanden.');source=snap.data()||{}}
    else{const snap=await db().collection('teachers').doc(uid).get();if(!snap.exists)throw new Error('Lehrerzugang nicht gefunden.');source=snap.data()||{}}
    const email=norm(source.email||source.emailLower);
    const payload={...source,uid,email,emailLower:email,role:'teacher',owner:false,active:true,approved:true,pending:false,status:'approved',securityApprovedV2:true,securityApprovalGeneration:generation,securityApprovedBy:state.user.uid,securityApprovedAt:nowTs(),updatedAt:nowTs()};
    const batch=db().batch();batch.set(db().collection('teachers').doc(uid),payload,{merge:true});if(!existing)batch.delete(db().collection('teachers_pending').doc(uid));await batch.commit();
    state.pendingTeachers=null;state.teacherRows=null;status('Lehrkraft freigegeben.','ok');await renderTeacherApproval();
  }catch(error){status('Lehrer-Freigabe fehlgeschlagen: '+text(error?.message||error),'error')}finally{setBusy(false)}
}
async function rejectTeacher(uid){
  ownerOnly();if(!confirm('Diese Lehrer-Anfrage ablehnen?'))return;
  try{await db().collection('teachers_pending').doc(uid).delete();state.pendingTeachers=null;status('Anfrage entfernt.','ok');await renderTeacherApproval()}catch(error){status('Anfrage konnte nicht entfernt werden: '+text(error?.message||error),'error')}
}
async function disableTeacher(uid){
  ownerOnly();if(uid===state.user.uid)return status('Das Owner-Konto kann hier nicht deaktiviert werden.','error');
  if(!confirm('Diesen Lehrerzugang deaktivieren?'))return;
  try{await db().collection('teachers').doc(uid).set({active:false,approved:false,status:'disabled',securityApprovedV2:false,securityApprovalGeneration:'',securityRevokedBy:state.user.uid,securityRevokedAt:nowTs(),updatedAt:nowTs()},{merge:true});state.teacherRows=null;status('Lehrerzugang deaktiviert.','ok');await renderTeacherApproval()}catch(error){status('Lehrerzugang konnte nicht deaktiviert werden: '+text(error?.message||error),'error')}
}

function mergedTemplates(remote={}){
  const out={};for(const type of TEMPLATE_TYPES)out[type]={...DEFAULT_TEMPLATES[type],...((remote&&remote[type])||{})};return out;
}
async function loadMailTemplates(){
  ownerOnly();const snap=await db().collection('settings').doc('authMailTemplates').get();state.mailTemplates=mergedTemplates(snap.exists?snap.data()||{}:{});return state.mailTemplates;
}
function templateField(type,key,label,{wide=false,textarea=false}={}){
  const value=state.mailTemplates?.[type]?.[key]??'';return `<div class="sp-field ${wide?'wide':''}"><label>${esc(label)}</label>${textarea?`<textarea data-template-field="${esc(key)}">${esc(value)}</textarea>`:`<input data-template-field="${esc(key)}" value="${esc(value)}">`}</div>`;
}
function renderTemplateForm(){
  const host=$('templateEditorHost');if(!host)return;const type=state.templateType,t=state.mailTemplates[type];
  const tabs=TEMPLATE_TYPES.map(k=>`<button class="${k===type?'active':''}" data-template-tab="${k}">${esc(state.mailTemplates[k].label||DEFAULT_TEMPLATES[k].label)}</button>`).join('');
  host.innerHTML=`<div class="sp-template-tabs">${tabs}</div><div class="sp-template-grid">${templateField(type,'subject','Betreff',{wide:true})}${templateField(type,'title','Überschrift',{wide:true})}${templateField(type,'intro','Einleitung',{wide:true,textarea:true})}${templateField(type,'body','Haupttext',{wide:true,textarea:true})}${templateField(type,'button','Button')}${type==='setup'?templateField(type,'secondButton','Zweiter Button'):''}${templateField(type,'footer','Hinweis unten',{wide:true,textarea:true})}</div><div class="sp-row-actions" style="margin-top:16px"><button class="sp-button secondary" id="resetTemplateBtn">Standard wiederherstellen</button><button class="sp-button" id="saveTemplateBtn">In Firebase speichern</button></div><div class="sp-preview"><h3>Vorschau</h3><div id="mailPreview"></div></div>`;
  host.querySelectorAll('[data-template-tab]').forEach(btn=>btn.addEventListener('click',()=>{collectTemplateForm();state.templateType=btn.dataset.templateTab;renderTemplateForm()}));
  host.querySelectorAll('[data-template-field]').forEach(input=>input.addEventListener('input',()=>{collectTemplateForm();renderMailPreview()}));
  $('saveTemplateBtn')?.addEventListener('click',saveMailTemplates);
  $('resetTemplateBtn')?.addEventListener('click',()=>{state.mailTemplates[type]={...DEFAULT_TEMPLATES[type]};renderTemplateForm()});
  renderMailPreview();
}
function collectTemplateForm(){
  const host=$('templateEditorHost');if(!host||!state.mailTemplates)return;
  const type=state.templateType,next={...state.mailTemplates[type]};host.querySelectorAll('[data-template-field]').forEach(input=>next[input.dataset.templateField]=text(input.value));state.mailTemplates[type]=next;
}
function renderMailPreview(){
  const host=$('mailPreview');if(!host)return;const t=state.mailTemplates[state.templateType];
  host.innerHTML=`<div class="sp-preview-box"><div style="font-size:12px;color:#667986;margin-bottom:10px">Betreff: <strong>${esc(t.subject)}</strong></div><h3>${esc(t.title)}</h3><p>Hallo Maria,</p><p>${esc(t.intro)}</p><p>${esc(t.body)}</p><span class="sp-preview-button">${esc(t.button)}</span>${state.templateType==='setup'&&t.secondButton?` <span class="sp-preview-button">${esc(t.secondButton)}</span>`:''}<p style="font-size:12px;margin-top:16px;color:#667986">${esc(t.footer)}</p></div>`;
}
async function renderEmailTemplates(){
  ownerOnly();
  $('app').innerHTML=`${pageHead('E-Mail-Vorlagen','Nur der Owner kann die Texte der SprachPilot-Konto-E-Mails ändern.')}<section class="sp-card sp-wide sp-owner-panel"><div class="sp-owner-note">Die Texte werden in Firebase unter settings/authMailTemplates gespeichert. Die Aktionslinks selbst bleiben geschützt und können hier nicht verändert werden.</div><div id="templateEditorHost"><div class="sp-skeleton"></div></div></section>`;
  if(!state.mailTemplates)await loadMailTemplates();renderTemplateForm();
}
async function saveMailTemplates(){
  ownerOnly();collectTemplateForm();setBusy(true,'E-Mail-Vorlagen werden gespeichert …');
  try{
    const payload={};for(const type of TEMPLATE_TYPES){const src=state.mailTemplates[type]||{};payload[type]={};for(const key of Object.keys(DEFAULT_TEMPLATES[type])){if(key==='label')continue;payload[type][key]=text(src[key]??DEFAULT_TEMPLATES[type][key])}}
    payload.updatedAt=nowTs();payload.updatedByUid=state.user.uid;payload.updatedByEmail=norm(state.user.email);payload.version=1;
    await db().collection('settings').doc('authMailTemplates').set(payload,{merge:true});status('E-Mail-Vorlagen in Firebase gespeichert.','ok');
  }catch(error){status('E-Mail-Vorlagen konnten nicht gespeichert werden: '+text(error?.message||error),'error')}finally{setBusy(false)}
}

function renderCurrent(){
  navState();
  if(state.view==='overview')return renderOverview();
  if(state.view==='courses')return renderCourses();
  if(state.view==='students')return renderStudents();
  if(state.view==='releases')return renderReleases();
  if(state.view==='teacher-approval')return renderTeacherApproval().catch(error=>status(text(error?.message||error),'error'));
  if(state.view==='email-templates')return renderEmailTemplates().catch(error=>status(text(error?.message||error),'error'));
}
function navigate(view){
  if(!VIEW_IDS.has(view))view='overview';
  if((view==='teacher-approval'||view==='email-templates')&&!state.isOwner)view='overview';
  state.view=view;history.replaceState(null,'','#'+view);renderCurrent();window.scrollTo({top:0,behavior:'instant'});
}
async function refreshCurrent(){
  if(state.view==='teacher-approval'){state.pendingTeachers=null;state.teacherRows=null;return renderTeacherApproval()}
  if(state.view==='email-templates'){state.mailTemplates=null;return renderEmailTemplates()}
  await loadBaseData();renderCurrent();
}

// Kleine Kompatibilitätsschicht für den bestehenden, nur bei Bedarf geladenen Freigabe-Editor.
window.TeacherEnv={
  safe:esc,db:()=>db(),auth:()=>auth(),currentUser:()=>state.user,teacherProfile:()=>state.teacher||{},errors:[],note:(message,error)=>console.warn('[SprachPilot LD]',message,error||'')
};
window.Courses={
  database:()=>db(),code:courseCode,docId:courseDocId,displayName:courseName,
  async update(id,data){await db().collection('courses').doc(id).set({...data,updatedAt:nowTs()},{merge:true});const i=state.courses.findIndex(c=>courseDocId(c)===id);if(i>=0)state.courses[i]={...state.courses[i],...data};window.__SP_COURSES=state.courses;status('Freigaben gespeichert.','ok')},
  async create(name){$('newCourseName')&&($('newCourseName').value=name);return createCourse()}
};
window.TeacherApp={
  async render(){renderCurrent();if(state.view==='releases'&&state.releaseCourseId)setTimeout(()=>openReleaseCourse(state.releaseCourseId),0)},
  openReleaseEditor(code){const course=state.courses.find(c=>courseCode(c)===code||courseDocId(c)===code);return openReleaseCourse(course?courseDocId(course):code)}
};

async function init(){
  const app=$('app');if(app)app.innerHTML='<div class="sp-grid"><div class="sp-skeleton sp-wide"></div><div class="sp-skeleton sp-half"></div><div class="sp-skeleton sp-half"></div></div>';
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.view)));
  $('logoutBtn')?.addEventListener('click',logout);$('refreshBtn')?.addEventListener('click',refreshCurrent);
  try{
    status('Firebase-Anmeldung wird geprüft …');
    const user=await (window.spCompatAuthReady||Promise.resolve(auth().currentUser));
    state.user=user||auth().currentUser;
    if(!state.user){location.replace('login.html');return}
    const access=await resolveTeacherAccess(state.user);
    if(!access.ok){accessFailure(access);status('Lehrerzugang nicht freigegeben.','error');return}
    state.teacher=access.data||{};storeTeacherSession();
    state.view=VIEW_IDS.has(location.hash.slice(1))?location.hash.slice(1):'overview';
    if((state.view==='teacher-approval'||state.view==='email-templates')&&!state.isOwner)state.view='overview';
    navState();
    await loadBaseData();renderCurrent();
  }catch(error){console.error(error);status('Lehrerdashboard konnte nicht geladen werden: '+text(error?.message||error),'error');if(app)app.innerHTML=`<section class="sp-card sp-wide"><h2>Dashboard konnte nicht geladen werden</h2><p>${esc(error?.message||error)}</p><div class="sp-row-actions" style="justify-content:flex-start"><a class="sp-button secondary" href="login.html">Zum Lehrerlogin</a></div></section>`}
}

window.SPTeacherDashboard={state,navigate,refresh:refreshCurrent,logout,openRelease:openReleaseCourse,removeCourse,editStudent,saveStudent,closeModal,approveTeacher,rejectTeacher,disableTeacher};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
