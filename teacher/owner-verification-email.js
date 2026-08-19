(function(root){
  'use strict';
  if(root.OwnerVerificationEmail)return;

  function text(value){return String(value==null?'':value).trim()}
  function lower(value){return text(value).toLowerCase()}

  function currentOwnerUser(){
    try{return firebase.auth().currentUser||null}catch(e){return null}
  }

  async function send(){
    const user=currentOwnerUser();
    if(!user)throw new Error('OWNER_FIREBASE_USER_MISSING');
    const email=lower(user.email);
    const allowed=root.OwnerAuthReadiness?.OWNER_EMAILS;
    if(!(allowed instanceof Set)||!allowed.has(email))throw new Error('OWNER_EMAIL_NOT_ALLOWED');
    if(user.isAnonymous===true)throw new Error('OWNER_ANONYMOUS_NOT_ALLOWED');
    const providers=(user.providerData||[]).map(x=>text(x?.providerId)).filter(Boolean);
    if(!providers.includes('password'))throw new Error('OWNER_PASSWORD_PROVIDER_MISSING');

    await user.reload();
    if(user.emailVerified===true)return{alreadyVerified:true,email};

    await user.sendEmailVerification();
    return{sent:true,email};
  }

  function render(message,ok=true){
    let box=document.getElementById('sp-owner-verification-email-result');
    if(!box){
      box=document.createElement('div');box.id='sp-owner-verification-email-result';
      box.style.cssText='position:fixed;left:10px;right:10px;top:5vh;z-index:100090;max-height:78vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #2e7d32;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:14px/1.45 system-ui;color:#13293d';
      const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style.cssText='float:right;margin:0 0 8px 12px;padding:8px 12px';close.onclick=()=>box.remove();box.appendChild(close);
      const textBox=document.createElement('div');textBox.id='sp-owner-verification-email-text';box.appendChild(textBox);document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';
    const textBox=box.querySelector('#sp-owner-verification-email-text');if(textBox)textBox.textContent=message;
  }

  async function runUi(){
    render('Bestätigungs-E-Mail wird über Firebase Authentication gesendet …',true);
    try{
      const result=await send();
      if(result.alreadyVerified){
        render('Die E-Mail-Adresse ist inzwischen bereits bestätigt.\n\nBitte jetzt „Owner-Konto prüfen“ erneut ausführen.',true);
        return result;
      }
      render(`Bestätigungs-E-Mail wurde an ${result.email} gesendet.\n\n1. Öffne die E-Mail von Firebase.\n2. Klicke auf den Bestätigungslink.\n3. Danach im Lehrer-Dashboard neu einloggen.\n4. „Owner-Konto prüfen“ erneut ausführen.\n\nNoch keine strikten Firestore-Regeln veröffentlichen und noch keinen Sicherheits-Cutover starten.`,true);
      return result;
    }catch(error){
      const code=text(error?.code||error?.message||error);
      render('Bestätigungs-E-Mail konnte nicht gesendet werden.\nFehler: '+code+'\n\nEs wurden keine Firestore-Daten oder Regeln verändert.',false);
      throw error;
    }
  }

  function install(){
    if(typeof document==='undefined')return;
    if(!root.OwnerAuthReadiness){setTimeout(install,120);return}
    if(document.getElementById('sp-owner-verification-email-btn'))return;
    const ownerBtn=document.getElementById('sp-owner-auth-readiness-btn');
    if(!ownerBtn){setTimeout(install,120);return}
    const btn=document.createElement('button');
    btn.id='sp-owner-verification-email-btn';btn.type='button';btn.className='secondary';btn.textContent='Bestätigungs-E-Mail senden';
    btn.onclick=()=>runUi().catch(()=>{});
    ownerBtn.insertAdjacentElement('afterend',btn);
  }

  root.OwnerVerificationEmail={currentOwnerUser,send,runUi,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,420));
    else setTimeout(install,420);
  }
})(typeof window!=='undefined'?window:globalThis);
