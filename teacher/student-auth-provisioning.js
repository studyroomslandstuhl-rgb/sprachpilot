(function(root){
  'use strict';
  if(root.StudentAuthProvisioning)return;
  const core=root.StudentAuthProvisioningCore;
  if(!core){console.error('StudentAuthProvisioningCore fehlt');return}
  const OWNER_EMAILS=new Set(['studyroomslandstuhl@gmail.com','alicekrekoten@gmail.com','alisa.krekoten@gmail.com']);
  const API_BASE='https://identitytoolkit.googleapis.com/v1/';
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function auth(){try{return firebase.auth()}catch(e){return null}}
  function db(){try{return firebase.firestore()}catch(e){return null}}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
  function currentOwner(){
    const user=auth()?.currentUser||null,mail=String(user?.email||'').trim().toLowerCase();
    const passwordProvider=(user?.providerData||[]).some(p=>p?.providerId==='password');
    return user&&!user.isAnonymous&&user.emailVerified===true&&OWNER_EMAILS.has(mail)&&passwordProvider?user:null;
  }
  function apiKey(){return String(root.firebaseConfig?.apiKey||'AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468')}
  async function api(path,body,{locale='de'}={}){
    const response=await fetch(`${API_BASE}${path}?key=${encodeURIComponent(apiKey())}`,{
      method:'POST',headers:{'Content-Type':'application/json','X-Firebase-Locale':locale},body:JSON.stringify(body)
    });
    let data={};try{data=await response.json()}catch(e){}
    if(!response.ok){
      const code=String(data?.error?.message||`HTTP_${response.status}`);
      const error=new Error(code);error.code=code;error.payload=data;throw error;
    }
    return data;
  }
  async function createAccount(email){
    const password=core.strongRandomPassword();
    const result=await api('accounts:signUp',{email,password,returnSecureToken:true});
    // Das zufällige Startkennwort wird absichtlich weder angezeigt noch gespeichert.
    return{uid:String(result.localId||''),idToken:String(result.idToken||''),email:String(result.email||email)};
  }
  async function sendPasswordSetup(email){
    return api('accounts:sendOobCode',{requestType:'PASSWORD_RESET',email:String(email||'').trim().toLowerCase()});
  }
  async function sendVerification(idToken){
    if(!idToken)throw new Error('STUDENT_ID_TOKEN_MISSING');
    return api('accounts:sendOobCode',{requestType:'VERIFY_EMAIL',idToken});
  }
  async function patchStudent(id,patch){
    const database=db();if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
    await database.collection('students').doc(String(id)).set({...patch,authProvisioningVersion:core.VERSION,authProvisioningUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  }
  async function saveStudentEmail(student,value){
    if(!currentOwner())throw new Error('OWNER_REQUIRED');
    const email=core.email(value),id=String(student?.__id||'');
    if(!id)throw new Error('STUDENT_ID_MISSING');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('INVALID_EMAIL');
    const boundEmail=core.email(student?.authEmail);
    if(String(student?.authUid||'').trim()&&boundEmail&&boundEmail!==email)throw new Error('BOUND_STUDENT_EMAIL_CHANGE_REQUIRES_AUTH_UPDATE');
    const patch={email,emailLower:email};
    if(student?.securityLookupExcluded===true){
      patch.securityLookupExcluded=false;
      patch.securityLookupExcludedReason='';
      patch.securityLookupReactivatedAt=firebase.firestore.FieldValue.serverTimestamp();
    }
    if(typeof Students!=='undefined'&&Students?.updateStudent){
      await Students.updateStudent(id,patch);
    }else{
      const database=db();if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
      await database.collection('students').doc(id).set({...patch,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    }
    return email;
  }
  async function markMailPrepared(student,status,extra={}){
    await patchStudent(student.__id,{authProvisioningStatus:status,authProvisioningEmail:core.email(student.email),authSetupMailSentAt:firebase.firestore.FieldValue.serverTimestamp(),...extra});
  }
  async function provisionOne(student,{force=false}={}){
    if(!currentOwner())throw new Error('OWNER_REQUIRED');
    const c=core.classify(student),id=String(student.__id||'');
    if(c.kind==='excluded')return{studentId:id,status:'excluded'};
    if(c.kind==='missing-email')return{studentId:id,status:'missing-email'};
    if(c.kind==='prepared'&&!force)return{studentId:id,status:'already-prepared'};

    if(c.uid){
      await sendPasswordSetup(c.email);
      await markMailPrepared(student,'password-reset-sent-existing-bound');
      return{studentId:id,status:'reset-sent',email:c.email,uid:c.uid};
    }

    try{
      const created=await createAccount(c.email);
      if(!created.uid||!created.idToken)throw new Error('AUTH_CREATE_INCOMPLETE');
      await patchStudent(id,{
        authUid:created.uid,authEmail:c.email,authVersion:2,
        authProvisioningStatus:'account-created',authProvisionedByOwnerUid:currentOwner().uid,
        authProvisionedAt:firebase.firestore.FieldValue.serverTimestamp()
      });
      let verificationSent=false,resetSent=false;
      try{await sendVerification(created.idToken);verificationSent=true}catch(error){console.warn('Bestätigungs-E-Mail fehlgeschlagen',c.email,error)}
      try{await sendPasswordSetup(c.email);resetSent=true}catch(error){console.warn('Passwort-E-Mail fehlgeschlagen',c.email,error);throw error}
      await markMailPrepared({...student,__id:id},verificationSent?'account-created-mails-sent':'account-created-reset-sent',{authUid:created.uid,authEmail:c.email,authVersion:2,authVerificationMailSent:verificationSent,authPasswordMailSent:resetSent});
      return{studentId:id,status:'created',email:c.email,uid:created.uid,verificationSent,resetSent};
    }catch(error){
      if(String(error?.code||error?.message)==='EMAIL_EXISTS'){
        await sendPasswordSetup(c.email);
        await markMailPrepared(student,'existing-auth-account-reset-sent');
        return{studentId:id,status:'existing-account-reset-sent',email:c.email};
      }
      throw error;
    }
  }

  async function loadStudents(){
    const database=db();if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
    const snap=await database.collection('students').get({source:'server'});
    return snap.docs.map(d=>({...(d.data()||{}),__id:d.id}));
  }
  function nameOf(s){return [s.vorname,s.nachname].filter(Boolean).join(' ').trim()||s.name||s.displayName||s.__id}
  function stateLabel(c){
    if(c.kind==='excluded')return'Altprofil ohne Login';
    if(c.kind==='missing-email')return'E-Mail fehlt';
    if(c.kind==='prepared')return'Zugang vorbereitet';
    if(c.kind==='bound-existing')return'Firebase-Konto gebunden';
    return'Noch kein gebundenes Firebase-Konto';
  }
  function ensurePanel(){
    let panel=document.getElementById('sp-student-auth-panel');
    if(panel)return panel;
    panel=document.createElement('div');panel.id='sp-student-auth-panel';
    panel.style.cssText='position:fixed;inset:3vh 3vw;z-index:100100;background:#fff;border:1px solid #cbd8e2;border-radius:16px;box-shadow:0 16px 50px rgba(0,0,0,.28);overflow:auto;padding:18px;color:#17324d;font:14px/1.4 system-ui';
    document.body.appendChild(panel);return panel;
  }
  function renderProgress(text,ok=true){
    const el=document.getElementById('sp-auth-progress');if(!el)return;
    el.style.color=ok?'#246a35':'#9b241d';el.textContent=text;
  }
  async function renderPanel(){
    const panel=ensurePanel();
    if(!currentOwner()){panel.innerHTML='<button id="spAuthClose">Schließen</button><p>Nur der verifizierte Owner kann Schüler-Zugänge verwalten.</p>';panel.querySelector('#spAuthClose').onclick=()=>panel.remove();return}
    panel.innerHTML='<p>Schüler-Zugänge werden geladen …</p>';
    const students=await loadStudents();
    const counts={total:students.length,excluded:0,prepared:0,pending:0,missing:0};
    for(const s of students){const c=core.classify(s);if(c.kind==='excluded')counts.excluded++;else if(c.kind==='prepared')counts.prepared++;else if(c.kind==='missing-email')counts.missing++;else counts.pending++}
    panel.innerHTML=`<div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><h2 style="margin:0">Schüler-Zugänge & Passwörter</h2><div style="color:#64778a">Passwörter werden nicht angezeigt oder gespeichert. Schüler legen ihr Passwort über eine sichere E-Mail selbst fest.</div></div><button id="spAuthClose" type="button">Schließen</button></div>
      <div style="margin:14px 0;padding:12px;background:#f4f8fb;border-radius:10px">Schüler: <b>${counts.total}</b> · vorbereitet: <b>${counts.prepared}</b> · noch vorzubereiten: <b>${counts.pending}</b> · Altprofile ohne Login: <b>${counts.excluded}</b> · ohne E-Mail: <b>${counts.missing}</b></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><button id="spAuthBulk" type="button">Alle fehlenden Zugänge vorbereiten</button><button id="spAuthReload" type="button">Status neu laden</button></div>
      <div id="sp-auth-progress" style="margin:8px 0 14px;white-space:pre-wrap"></div>
      <div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Schüler</th><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">E-Mail</th><th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Status</th><th style="padding:8px;border-bottom:1px solid #ddd">Aktion</th></tr></thead><tbody>${students.map(s=>{const c=core.classify(s),needsEmail=c.kind==='excluded'||c.kind==='missing-email';const emailCell=needsEmail?`<div style="display:flex;gap:6px;align-items:center;min-width:260px"><input class="sp-auth-email-input" data-id="${esc(s.__id)}" type="email" autocomplete="off" placeholder="E-Mail ergänzen" style="min-width:190px"><button class="sp-auth-save-email" data-id="${esc(s.__id)}" type="button">Speichern</button></div>`:esc(c.email||'—');const action=needsEmail?'<span style="color:#64778a">Erst E-Mail speichern</span>':`<button class="sp-auth-one" data-id="${esc(s.__id)}" type="button">${c.kind==='prepared'?'Passwort-Mail erneut senden':'Zugang vorbereiten'}</button>`;return`<tr><td style="padding:8px;border-bottom:1px solid #eee">${esc(nameOf(s))}<div style="font-size:11px;color:#8796a4">${esc(s.__id)}</div></td><td style="padding:8px;border-bottom:1px solid #eee">${emailCell}</td><td style="padding:8px;border-bottom:1px solid #eee">${esc(stateLabel(c))}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${action}</td></tr>`}).join('')}</tbody></table></div>`;
    panel.querySelector('#spAuthClose').onclick=()=>panel.remove();
    panel.querySelector('#spAuthReload').onclick=()=>renderPanel().catch(e=>renderProgress(String(e?.message||e),false));
    panel.querySelectorAll('.sp-auth-save-email').forEach(btn=>btn.onclick=async()=>{
      const student=students.find(s=>s.__id===btn.dataset.id),input=panel.querySelector(`.sp-auth-email-input[data-id="${CSS.escape(btn.dataset.id)}"]`);if(!student||!input)return;
      btn.disabled=true;input.disabled=true;renderProgress(`${nameOf(student)}: E-Mail wird gespeichert …`);
      try{const email=await saveStudentEmail(student,input.value);renderProgress(`${nameOf(student)}: ${email} wurde gespeichert. Der Zugang kann jetzt vorbereitet werden.`,true);setTimeout(()=>renderPanel(),500)}
      catch(e){btn.disabled=false;input.disabled=false;const msg=String(e?.message||e);renderProgress(`${nameOf(student)}: ${msg==='INVALID_EMAIL'?'Bitte eine gültige E-Mail-Adresse eingeben.':msg}`,false)}
    });
    panel.querySelectorAll('.sp-auth-one').forEach(btn=>btn.onclick=async()=>{
      const student=students.find(s=>s.__id===btn.dataset.id);if(!student)return;
      btn.disabled=true;renderProgress(`${nameOf(student)} wird vorbereitet …`);
      try{const r=await provisionOne(student,{force:core.classify(student).kind==='prepared'});renderProgress(`${nameOf(student)}: ${r.status}`,true);setTimeout(()=>renderPanel(),900)}catch(e){btn.disabled=false;renderProgress(`${nameOf(student)}: ${e?.message||e}`,false)}
    });
    panel.querySelector('#spAuthBulk').onclick=async()=>{
      const pending=students.filter(core.shouldBulkProcess);
      if(!pending.length){renderProgress('Es gibt keine fehlenden E-Mail-Zugänge.',true);return}
      if(!confirm(`${pending.length} Schüler-Zugänge jetzt vorbereiten?\n\nFür neue Konten werden Bestätigungs- und Passwort-E-Mails versendet. Bestehende Konten bekommen nur eine Passwort-E-Mail. Es werden keine gemeinsamen Passwörter vergeben.`))return;
      panel.querySelector('#spAuthBulk').disabled=true;
      let ok=0,failed=0,skipped=0;
      for(let i=0;i<pending.length;i++){
        const student=pending[i];renderProgress(`Bearbeite ${i+1}/${pending.length}: ${nameOf(student)}\nErfolgreich: ${ok} · Fehler: ${failed}`);
        try{const r=await provisionOne(student);if(r.status==='excluded'||r.status==='missing-email'||r.status==='already-prepared')skipped++;else ok++}catch(e){failed++;console.error('Schüler-Zugang fehlgeschlagen',student.__id,e);if(String(e?.message||'').includes('TOO_MANY_ATTEMPTS')){renderProgress(`Firebase hat den Versand vorübergehend begrenzt.\nErfolgreich: ${ok} · Fehler: ${failed}\nBitte später mit den verbleibenden Profilen fortsetzen.`,false);break}}
        await sleep(450);
      }
      renderProgress(`Zugangs-Vorbereitung abgeschlossen.\nErfolgreich: ${ok}\nFehler: ${failed}\nÜbersprungen: ${skipped}\nGemeinsame Passwörter: 0`,failed===0);
      setTimeout(()=>renderPanel(),1500);
    };
  }
  function install(){
    if(typeof document==='undefined')return;
    const actions=document.querySelector('.teacher-actions');if(!actions){setTimeout(install,150);return}
    if(document.getElementById('sp-student-auth-btn'))return;
    const btn=document.createElement('button');btn.id='sp-student-auth-btn';btn.type='button';btn.className='secondary';btn.textContent='Schüler-Zugänge / Passwörter';btn.onclick=()=>renderPanel().catch(e=>alert('Zugangsverwaltung konnte nicht geöffnet werden: '+(e?.message||e)));
    const logout=actions.lastElementChild;actions.insertBefore(btn,logout||null);
  }
  root.StudentAuthProvisioning={api,createAccount,sendPasswordSetup,sendVerification,saveStudentEmail,provisionOne,loadStudents,renderPanel,install};
  if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,400));else setTimeout(install,400)}
})(typeof window!=='undefined'?window:globalThis);
