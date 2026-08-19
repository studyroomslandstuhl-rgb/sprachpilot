import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {getAuth,verifyPasswordResetCode,confirmPasswordReset,checkActionCode,applyActionCode,validatePassword} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {parseActionParams,validAction,passwordPairValid,safeContinueUrl,friendlyError} from './action-core.js';

const firebaseConfig={
  apiKey:'AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468',
  authDomain:'sprachpilot-12c68.firebaseapp.com',
  projectId:'sprachpilot-12c68',
  storageBucket:'sprachpilot-12c68.firebasestorage.app',
  messagingSenderId:'454992284519',
  appId:'1:454992284519:web:c7a87558cf59e0c0fc7dc2'
};
const auth=getAuth(initializeApp(firebaseConfig));
const params=parseActionParams(location.search);
const $=id=>document.getElementById(id);
const title=$('actionTitle'),lead=$('actionLead'),content=$('actionContent'),status=$('actionStatus');
const loginUrl=safeContinueUrl(params.continueUrl||'/login/',location.origin);
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function setStatus(message,ok=false){status.className=ok?'status ok':'status error';status.textContent=message;status.hidden=false}
function buttonLink(text,href){return `<a class="primary-link" href="${esc(href)}">${esc(text)}</a>`}

async function passwordPolicyMessage(password){
  try{
    const r=await validatePassword(auth,password);
    if(r.isValid)return'';
    const items=[];
    if(r.meetsMinPasswordLength===false)items.push('zu kurz');
    if(r.containsLowercaseLetter===false)items.push('Kleinbuchstabe fehlt');
    if(r.containsUppercaseLetter===false)items.push('Großbuchstabe fehlt');
    if(r.containsNumericCharacter===false)items.push('Zahl fehlt');
    if(r.containsNonAlphanumericCharacter===false)items.push('Sonderzeichen fehlt');
    return items.length?`Das Passwort erfüllt die Anforderungen noch nicht: ${items.join(', ')}.`:'Das Passwort erfüllt die Sicherheitsanforderungen noch nicht.';
  }catch(e){return password.length>=8?'':'Bitte verwende mindestens 8 Zeichen.'}
}

async function renderReset(){
  title.textContent='Neues Passwort festlegen';
  lead.textContent='Wähle ein neues Passwort für dein SprachPilot-Konto.';
  let email='';
  try{email=await verifyPasswordResetCode(auth,params.oobCode)}catch(error){setStatus(friendlyError(error?.code||error?.message));return}
  content.innerHTML=`<div class="account-hint">Konto: <strong>${esc(email)}</strong></div>
    <label for="pw1">Neues Passwort</label><input id="pw1" type="password" autocomplete="new-password" minlength="8" placeholder="Neues Passwort">
    <label for="pw2">Passwort wiederholen</label><input id="pw2" type="password" autocomplete="new-password" minlength="8" placeholder="Passwort wiederholen">
    <button id="savePassword" class="primary" type="button">Passwort speichern</button>`;
  $('savePassword').onclick=async()=>{
    status.hidden=true;
    const a=$('pw1').value,b=$('pw2').value;
    if(!passwordPairValid(a,b)){setStatus('Die beiden Passwörter stimmen nicht überein.');return}
    const policy=await passwordPolicyMessage(a);if(policy){setStatus(policy);return}
    $('savePassword').disabled=true;
    try{
      await confirmPasswordReset(auth,params.oobCode,a);
      content.innerHTML=`<div class="success-mark">✓</div><p>Dein neues Passwort wurde gespeichert.</p>${buttonLink('Jetzt bei SprachPilot einloggen',loginUrl)}`;
      setStatus('Passwort erfolgreich geändert.',true);
    }catch(error){$('savePassword').disabled=false;setStatus(friendlyError(error?.code||error?.message))}
  };
}

async function renderVerify(){
  title.textContent='E-Mail bestätigen';
  lead.textContent='Wir bestätigen deine E-Mail-Adresse für dein SprachPilot-Konto.';
  try{
    await checkActionCode(auth,params.oobCode);
    await applyActionCode(auth,params.oobCode);
    content.innerHTML=`<div class="success-mark">✓</div><p>Deine E-Mail-Adresse ist jetzt bestätigt.</p>${buttonLink('Weiter zu SprachPilot',loginUrl)}`;
    setStatus('E-Mail erfolgreich bestätigt.',true);
  }catch(error){setStatus(friendlyError(error?.code||error?.message))}
}

async function renderRecover(){
  title.textContent='E-Mail-Adresse wiederherstellen';
  lead.textContent='SprachPilot stellt die vorherige E-Mail-Adresse deines Kontos wieder her.';
  try{
    await checkActionCode(auth,params.oobCode);
    await applyActionCode(auth,params.oobCode);
    content.innerHTML=`<div class="success-mark">✓</div><p>Die vorherige E-Mail-Adresse wurde wiederhergestellt.</p>${buttonLink('Zum Login',loginUrl)}`;
    setStatus('E-Mail-Adresse erfolgreich wiederhergestellt.',true);
  }catch(error){setStatus(friendlyError(error?.code||error?.message))}
}

async function start(){
  if(params.lang)auth.languageCode=params.lang;
  if(!validAction(params)){setStatus('Dieser Link ist unvollständig oder ungültig. Bitte fordere eine neue E-Mail an.');return}
  if(params.mode==='resetPassword')return renderReset();
  if(params.mode==='verifyEmail')return renderVerify();
  if(params.mode==='recoverEmail')return renderRecover();
}
start().catch(error=>setStatus(friendlyError(error?.code||error?.message)));
