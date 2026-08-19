(function(root){
  'use strict';
  if(root.OwnerAuthReadiness)return;

  const OWNER_EMAILS=new Set([
    'studyroomslandstuhl@gmail.com',
    'alicekrekoten@gmail.com',
    'alisa.krekoten@gmail.com'
  ]);

  function text(value){return String(value==null?'':value).trim()}
  function lower(value){return text(value).toLowerCase()}
  function yesNo(value){return value===true?'JA':'NEIN'}

  function evaluate(snapshot={}){
    const email=lower(snapshot.email),provider=lower(snapshot.signInProvider);
    const checks={
      userPresent:snapshot.userPresent===true,
      ownerEmail:OWNER_EMAILS.has(email),
      notAnonymous:snapshot.isAnonymous!==true,
      userEmailVerified:snapshot.userEmailVerified===true,
      tokenEmailVerified:snapshot.tokenEmailVerified===true,
      passwordProvider:provider==='password',
      reloadOk:snapshot.reloadOk===true,
      tokenRefreshOk:snapshot.tokenRefreshOk===true
    };
    return{...snapshot,email,signInProvider:provider,checks,ready:Object.values(checks).every(Boolean)};
  }

  async function inspect(){
    let auth=null,user=null,reloadOk=false,tokenRefreshOk=false,tokenResult=null,reloadError='',tokenError='';
    try{auth=firebase.auth();user=auth.currentUser||null}catch(error){return evaluate({userPresent:false,reloadError:text(error?.code||error?.message||error)})}
    if(!user)return evaluate({userPresent:false});

    try{
      await user.reload();
      reloadOk=true;
      user=auth.currentUser||user;
    }catch(error){reloadError=text(error?.code||error?.message||error)}

    try{
      tokenResult=await user.getIdTokenResult(true);
      tokenRefreshOk=true;
    }catch(error){tokenError=text(error?.code||error?.message||error)}

    const providers=(user.providerData||[]).map(item=>text(item?.providerId)).filter(Boolean);
    const claimVerified=tokenResult?.claims?.email_verified===true;
    const tokenProvider=text(tokenResult?.signInProvider||tokenResult?.claims?.firebase?.sign_in_provider);

    return evaluate({
      userPresent:true,
      email:lower(user.email),
      uid:text(user.uid),
      isAnonymous:user.isAnonymous===true,
      userEmailVerified:user.emailVerified===true,
      tokenEmailVerified:claimVerified,
      signInProvider:tokenProvider,
      linkedProviders:providers,
      reloadOk,
      tokenRefreshOk,
      reloadError,
      tokenError
    });
  }

  function resultText(result){
    if(!result?.userPresent){
      return 'OWNER-KONTO NICHT BEREIT\n\nEs ist aktuell kein Firebase-Benutzer im Lehrer-Dashboard angemeldet.\nNoch keine strikten Firestore-Regeln veröffentlichen.';
    }
    const lines=[
      result.ready?'OWNER-KONTO BEREIT':'OWNER-KONTO NICHT BEREIT',
      '',
      `E-Mail: ${result.email||'—'}`,
      `Owner-Allowlist: ${yesNo(result.checks.ownerEmail)}`,
      `E-Mail bestätigt (Firebase User): ${yesNo(result.checks.userEmailVerified)}`,
      `E-Mail bestätigt (ID-Token): ${yesNo(result.checks.tokenEmailVerified)}`,
      `Login-Provider im ID-Token: ${result.signInProvider||'—'}`,
      `Password-Provider: ${yesNo(result.checks.passwordProvider)}`,
      `Anonymes Konto: ${result.isAnonymous===true?'JA':'NEIN'}`,
      `Firebase User neu geladen: ${yesNo(result.reloadOk)}`,
      `Erzwungener Token-Refresh: ${yesNo(result.tokenRefreshOk)}`,
      `Verknüpfte Provider: ${result.linkedProviders?.length?result.linkedProviders.join(', '):'—'}`
    ];
    if(result.reloadError)lines.push(`Reload-Fehler: ${result.reloadError}`);
    if(result.tokenError)lines.push(`Token-Fehler: ${result.tokenError}`);
    lines.push('',result.ready
      ?'Ergebnis: Dieses Owner-Konto erfüllt die Auth-Anforderungen der strikten Firestore-Regeln.'
      :'Ergebnis: Mindestens eine Auth-Anforderung ist noch nicht erfüllt. Noch keine strikten Firestore-Regeln veröffentlichen.');
    return lines.join('\n');
  }

  function render(message,ok=true){
    let box=document.getElementById('sp-owner-auth-readiness-result');
    if(!box){
      box=document.createElement('div');box.id='sp-owner-auth-readiness-result';
      box.style.cssText='position:fixed;left:10px;right:10px;top:5vh;z-index:100080;max-height:78vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #2e7d32;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:14px/1.45 system-ui;color:#13293d';
      const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style.cssText='float:right;margin:0 0 8px 12px;padding:8px 12px';close.onclick=()=>box.remove();box.appendChild(close);
      const textBox=document.createElement('div');textBox.id='sp-owner-auth-readiness-text';box.appendChild(textBox);document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';
    const textBox=box.querySelector('#sp-owner-auth-readiness-text');if(textBox)textBox.textContent=message;
  }

  async function runUi(){
    render('Owner-Firebase-Konto wird read-only geprüft …',true);
    const result=await inspect();
    render(resultText(result),result.ready===true);
    root.SP_OWNER_AUTH_READINESS=result;
    return result;
  }

  function install(){
    if(typeof document==='undefined')return;
    const actions=document.querySelector('.teacher-actions');
    if(!actions){setTimeout(install,120);return}
    if(document.getElementById('sp-owner-auth-readiness-btn'))return;
    const cutover=document.getElementById('sp-security-cutover-btn');
    const btn=document.createElement('button');
    btn.id='sp-owner-auth-readiness-btn';btn.type='button';btn.className='secondary';btn.textContent='Owner-Konto prüfen';btn.onclick=()=>runUi().catch(error=>render('Owner-Konto-Prüfung fehlgeschlagen: '+text(error?.message||error),false));
    if(cutover)cutover.insertAdjacentElement('beforebegin',btn);else actions.insertBefore(btn,actions.lastElementChild||null);
  }

  root.OwnerAuthReadiness={OWNER_EMAILS,text,lower,evaluate,inspect,resultText,runUi,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,350));
    else setTimeout(install,350);
  }
})(typeof window!=='undefined'?window:globalThis);
