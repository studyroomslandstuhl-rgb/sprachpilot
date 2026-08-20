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
const MAIL_DEFAULTS={
  passwordReset:{
    subject:'SprachPilot – Passwort festlegen oder zurücksetzen',
    title:'Passwort festlegen',
    intro:'für dein SprachPilot-Konto wurde ein neues Passwort angefordert.',
    body:'Klicke auf den Button und lege dein persönliches Passwort fest.',
    button:'Passwort festlegen',
    footer:'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.'
  },
  verification:{
    subject:'SprachPilot – E-Mail-Adresse bestätigen',
    title:'E-Mail-Adresse bestätigen',
    intro:'bitte bestätige deine E-Mail-Adresse für dein SprachPilot-Konto.',
    body:'Nach der Bestätigung kannst du deinen sicheren SprachPilot-Zugang verwenden.',
    button:'E-Mail bestätigen',
    footer:'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.'
  },
  setup:{
    subject:'SprachPilot – deinen Zugang einrichten',
    title:'Deinen SprachPilot-Zugang einrichten',
    intro:'dein SprachPilot-Zugang ist vorbereitet.',
    body:'Lege zuerst dein persönliches Passwort fest. Bestätige danach deine E-Mail-Adresse. Anschließend kannst du dich mit E-Mail, Passwort und Kurscode anmelden.',
    button:'1. Persönliches Passwort festlegen',
    secondButton:'2. E-Mail-Adresse bestätigen',
    footer:'Die Links sind nur für dein persönliches SprachPilot-Konto bestimmt. Gib sie nicht weiter.'
  }
};

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
function bounded(value,max,fallback=''){
  const out=text(value);
  return (out||fallback).slice(0,max);
}
function templateFor(type,override={}){
  const defaults=MAIL_DEFAULTS[type];
  if(!defaults)throw new Error('UNKNOWN_MAIL_TEMPLATE');
  return{
    subject:bounded(override.subject,160,defaults.subject),
    title:bounded(override.title,180,defaults.title),
    intro:bounded(override.intro,1200,defaults.intro),
    body:bounded(override.body,2400,defaults.body),
    button:bounded(override.button,120,defaults.button),
    secondButton:bounded(override.secondButton,120,defaults.secondButton||''),
    footer:bounded(override.footer,1200,defaults.footer)
  };
}

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
function paragraph(value){return `<p style="font-size:16px;line-height:24px;margin:0 0 14px">${escapeHtml(value)}</p>`}
function shell({preheader,title,intro,bodyHtml,buttons,footerNote}){
  const buttonHtml=(buttons||[]).map(item=>`<tr><td align="center" style="padding:6px 0"><a href="${escapeHtml(item.url)}" style="display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;font-weight:700;font-size:16px;line-height:20px;padding:13px 22px;border-radius:12px">${escapeHtml(item.label)}</a></td></tr>`).join('');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:0;background:#f3f8fb;font-family:Arial,sans-serif;color:${BRAND.dark}"><div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f8fb;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fff;border:1px solid #d9eef7;border-radius:20px;overflow:hidden"><tr><td align="center" style="padding:26px 24px 14px"><img src="${BRAND.logo}" alt="SprachPilot" width="72" height="72" style="display:block;border:0;max-width:72px"><div style="font-size:28px;font-weight:800;margin-top:8px;color:${BRAND.dark}">SprachPilot</div></td></tr><tr><td style="padding:8px 28px 4px"><h1 style="font-size:24px;line-height:30px;margin:0 0 18px;color:${BRAND.dark}">${escapeHtml(title)}</h1><p style="font-size:16px;line-height:24px;margin:0 0 14px">${intro}</p>${bodyHtml||''}</td></tr><tr><td style="padding:8px 28px 18px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0">${buttonHtml}</table></td></tr><tr><td style="padding:0 28px 24px"><p style="font-size:13px;line-height:20px;color:#5f7180;margin:0">${escapeHtml(footerNote||'Wenn du diese E-Mail nicht erwartet hast, kannst du sie ignorieren.')}</p></td></tr><tr><td style="background:${BRAND.pale};padding:18px 28px;text-align:center;font-size:12px;line-height:18px;color:#5f7180">SprachPilot · <a href="${BRAND.origin}" style="color:#2f7f96">sprachpilot.org</a><br>Diese Nachricht wurde automatisch für dein SprachPilot-Konto erstellt.</td></tr></table></td></tr></table></body></html>`;
}

function buildPasswordResetMail({name='',url,template={}}){
  const t=templateFor('passwordReset',template),hello=greeting(text(name));
  return{
    subject:t.subject,
    text:`${hello}\n\n${t.intro}\n\n${t.body}\n\n${t.button}:\n${url}\n\n${t.footer}\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:t.title,title:t.title,intro:`${escapeHtml(hello)} ${escapeHtml(t.intro)}`,bodyHtml:paragraph(t.body),buttons:[{label:t.button,url}],footerNote:t.footer})
  };
}
function buildVerificationMail({name='',url,template={}}){
  const t=templateFor('verification',template),hello=greeting(text(name));
  return{
    subject:t.subject,
    text:`${hello}\n\n${t.intro}\n\n${t.body}\n\n${t.button}:\n${url}\n\n${t.footer}\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:t.title,title:t.title,intro:`${escapeHtml(hello)} ${escapeHtml(t.intro)}`,bodyHtml:paragraph(t.body),buttons:[{label:t.button,url}],footerNote:t.footer})
  };
}
function buildSetupMail({name='',resetUrl,verifyUrl='',template={}}){
  const t=templateFor('setup',template),hello=greeting(text(name));
  const buttons=[{label:t.button,url:resetUrl}];
  if(verifyUrl)buttons.push({label:t.secondButton||MAIL_DEFAULTS.setup.secondButton,url:verifyUrl});
  const verifyText=verifyUrl?`\n\n${t.secondButton||MAIL_DEFAULTS.setup.secondButton}:\n${verifyUrl}`:'';
  return{
    subject:t.subject,
    text:`${hello}\n\n${t.intro}\n\n${t.body}\n\n${t.button}:\n${resetUrl}${verifyText}\n\n${t.footer}\n\nViele Grüße\nSprachPilot\nsprachpilot.org`,
    html:shell({preheader:t.title,title:t.title,intro:`${escapeHtml(hello)} ${escapeHtml(t.intro)}`,bodyHtml:paragraph(t.body),buttons,footerNote:t.footer})
  };
}
function buildMail(type,data){
  if(type==='password-reset')return buildPasswordResetMail(data);
  if(type==='verification')return buildVerificationMail(data);
  if(type==='setup')return buildSetupMail(data);
  throw new Error('UNKNOWN_MAIL_TYPE');
}

module.exports={BRAND,ACTION_PARAMS,MAIL_DEFAULTS,text,normalizeEmail,validEmail,escapeHtml,displayName,strongRandomPassword,hashKey,templateFor,toCustomActionUrl,buildPasswordResetMail,buildVerificationMail,buildSetupMail,buildMail};
