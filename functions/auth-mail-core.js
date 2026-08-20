'use strict';

const crypto=require('node:crypto');

const BRAND={
  name:'SprachPilot',
  origin:'https://www.sprachpilot.org',
  actionPath:'/auth/action/',
  logo:'https://www.sprachpilot.org/assets/logo/sprachpilot-logo.png',
  primary:'#47ABC6',
  dark:'#123047',
  pale:'#EFFAFF'
};
const ACTION_PARAMS=['mode','oobCode','apiKey','continueUrl','lang','tenantId'];

function text(value){return String(value==null?'':value).trim()}
function normalizeEmail(value){return text(value).toLowerCase()}
function validEmail(value){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value))}
function escapeHtml(value){return String(value==null?'':value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function displayName(row={}){
  return text([row.vorname||row.firstName||row.name,row.nachname||row.lastName].filter(Boolean).join(' '))||text(row.displayName)||'';
}
function strongRandomPassword(){
  return `${crypto.randomBytes(24).toString('base64url')}Aa7!`;
}
function hashKey(value){return crypto.createHash('sha256').update(String(value||'')).digest('hex')}

function findActionUrl(input){
  let current=new URL(String(input||''));
  for(let i=0;i<3;i++){
    if(current.searchParams.get('mode')&&current.searchParams.get('oobCode'))return current;
    const nested=current.searchParams.get('link');
    if(!nested)break;
    current=new URL(nested);
  }
  return current;
}
function toCustomActionUrl(firebaseLink,{origin=BRAND.origin,actionPath=BRAND.actionPath}={}){
  const source=findActionUrl(firebaseLink);
  if(!source.searchParams.get('mode')||!source.searchParams.get('oobCode'))throw new Error('INVALID_FIREBASE_ACTION_LINK');
  const target=new URL(actionPath,origin);
  for(const key of ACTION_PARAMS){
    const value=source.searchParams.get(key);
    if(value)target.searchParams.set(key,value);
  }
  if(!target.searchParams.get('apiKey'))throw new Error('FIREBASE_ACTION_API_KEY_MISSING');
  return target.toString();
}

function greeting(name){return name?`Hallo ${name},`:'Hallo,'}
function shell({preheader,title,intro,bodyHtml,buttons,footerNote}){
  const buttonHtml=(buttons||[]).map(item=>`<tr><td align="center" style="padding:6px 0"><a href="${escapeHtml(item.url)}" style="display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;font-weight:700;font-size:16px;line-height:20px;padding:13px 22px;border-radius:12px">${escapeHtml(item.label)}</a></td></tr>`).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:0;background:#f3f8fb;font-family:Arial,sans-serif;color:${BRAND.dark}"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f8fb;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fff;border:1px solid #d9eef7;border-radius:20px;overflow:hidden"><tr><td align="center" style="padding:26px 24px 14px"><img src="${BRAND.logo}" alt="SprachPilot" width="72" height="72" style="display:block;border:0;max-width:72px"><div style="font-size:28px;font-weight:800;margin-top:8px;color:${BRAND.dark}">SprachPilot</div></td></tr><tr><td style="padding:8px 28px 4px"><h1 style="font-size:24px;line-height:30px;margin:0 0 18px;color:${BRAND.dark}">${escapeHtml(title)}</h1><p style="font-size:16px;line-height:24px;margin:0 0 14px">${intro}</p>${bodyHtml||''}</td></tr><tr><td style="padding:8px 28px 18px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${buttonHtml}</table></td></tr><tr><td style="padding:0 28px 24px"><p style="font-size:13px;line-height:20px;color:#5f7180;margin:0">${footerNote||'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.'}</p></td></tr><tr><td style="background:${BRAND.pale};padding:18px 28px;text-align:center;font-size:12px;line-height:18px;color:#5f7180">SprachPilot · <a href="${BRAND.origin}" style="color:#2f7f96">sprachpilot.org</a><br>Diese Nachricht wurde automatisch für dein SprachPilot-Konto erstellt.</td></tr></table></td></tr></table></body></html>`;
}

function buildPasswordResetMail({name='',url}){
  const safeName=escapeHtml(text(name));
  return{
    subject:'SprachPilot – Passwort festlegen oder zurücksetzen',
    text:`${greeting(text(name))}\n\nfür dein SprachPilot-Konto wurde ein neues Passwort angefordert.\n\nÖffne diesen Link und lege dein persönliches Passwort fest:\n${url}\n\nWenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:'Lege dein persönliches SprachPilot-Passwort fest.',title:'Passwort festlegen',intro:`${greeting(safeName)} für dein SprachPilot-Konto wurde ein neues Passwort angefordert.`,bodyHtml:'<p style="font-size:16px;line-height:24px;margin:0 0 14px">Klicke auf den Button und lege dein persönliches Passwort fest.</p>',buttons:[{label:'Passwort festlegen',url}]})
  };
}
function buildVerificationMail({name='',url}){
  const safeName=escapeHtml(text(name));
  return{
    subject:'SprachPilot – E-Mail-Adresse bestätigen',
    text:`${greeting(text(name))}\n\nbitte bestätige deine E-Mail-Adresse für dein SprachPilot-Konto.\n\nE-Mail bestätigen:\n${url}\n\nWenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:'Bestätige deine E-Mail-Adresse für SprachPilot.',title:'E-Mail-Adresse bestätigen',intro:`${greeting(safeName)} bitte bestätige deine E-Mail-Adresse für dein SprachPilot-Konto.`,bodyHtml:'<p style="font-size:16px;line-height:24px;margin:0 0 14px">Nach der Bestätigung kannst du deinen sicheren SprachPilot-Zugang verwenden.</p>',buttons:[{label:'E-Mail bestätigen',url}]})
  };
}
function buildSetupMail({name='',resetUrl,verifyUrl=''}){
  const buttons=[{label:'1. Persönliches Passwort festlegen',url:resetUrl}];
  if(verifyUrl)buttons.push({label:'2. E-Mail-Adresse bestätigen',url:verifyUrl});
  const safeName=escapeHtml(text(name));
  const verifyText=verifyUrl?`\nDanach bestätige deine E-Mail-Adresse:\n${verifyUrl}\n`:'';
  return{
    subject:'SprachPilot – deinen Zugang einrichten',
    text:`${greeting(text(name))}\n\ndein SprachPilot-Zugang ist vorbereitet.\n\nLege zuerst dein persönliches Passwort fest:\n${resetUrl}\n${verifyText}\nDanach kannst du dich mit E-Mail, Passwort und Kurscode anmelden.\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:'Richte deinen sicheren SprachPilot-Zugang ein.',title:'Deinen SprachPilot-Zugang einrichten',intro:`${greeting(safeName)} dein SprachPilot-Zugang ist vorbereitet.`,bodyHtml:`<p style="font-size:16px;line-height:24px;margin:0 0 14px">Lege zuerst dein persönliches Passwort fest.${verifyUrl?' Bestätige danach deine E-Mail-Adresse.':''} Anschließend kannst du dich mit E-Mail, Passwort und Kurscode anmelden.</p>`,buttons,footerNote:'Die Links sind nur für dein persönliches SprachPilot-Konto bestimmt. Gib sie nicht weiter.'})
  };
}
function buildMail(type,data){
  if(type==='password-reset')return buildPasswordResetMail(data);
  if(type==='verification')return buildVerificationMail(data);
  if(type==='setup')return buildSetupMail(data);
  throw new Error('UNKNOWN_MAIL_TYPE');
}

module.exports={BRAND,ACTION_PARAMS,text,normalizeEmail,validEmail,escapeHtml,displayName,strongRandomPassword,hashKey,toCustomActionUrl,buildPasswordResetMail,buildVerificationMail,buildSetupMail,buildMail};
