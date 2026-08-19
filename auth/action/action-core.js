export const SUPPORTED_MODES=new Set(['resetPassword','verifyEmail','recoverEmail']);

export function clean(value){return String(value==null?'':value).trim()}
export function parseActionParams(search=''){
  const p=new URLSearchParams(String(search||'').replace(/^\?/,''));
  return{
    mode:clean(p.get('mode')),
    oobCode:clean(p.get('oobCode')),
    continueUrl:clean(p.get('continueUrl')),
    lang:clean(p.get('lang'))||'de'
  };
}
export function validAction(params={}){
  return SUPPORTED_MODES.has(clean(params.mode))&&clean(params.oobCode).length>5;
}
export function passwordPairValid(password,confirm){
  const a=String(password||''),b=String(confirm||'');
  return a.length>0&&a===b;
}
export function safeContinueUrl(value,origin='https://www.sprachpilot.org'){
  try{
    const base=new URL(origin);
    const url=new URL(String(value||''),base);
    return url.origin===base.origin?url.href:new URL('/login/',base).href;
  }catch(e){return new URL('/login/',origin).href}
}
export function friendlyError(code=''){
  const c=String(code||'');
  if(c.includes('expired-action-code'))return'Dieser Link ist abgelaufen. Bitte fordere eine neue E-Mail an.';
  if(c.includes('invalid-action-code'))return'Dieser Link ist ungültig oder wurde bereits verwendet. Bitte fordere eine neue E-Mail an.';
  if(c.includes('user-disabled'))return'Dieses Konto ist deaktiviert. Bitte wende dich an deine Lehrkraft.';
  if(c.includes('user-not-found'))return'Dieses Konto wurde nicht gefunden. Bitte wende dich an deine Lehrkraft.';
  if(c.includes('weak-password'))return'Das Passwort erfüllt die Sicherheitsanforderungen noch nicht.';
  return'Die Aktion konnte nicht abgeschlossen werden. Bitte fordere einen neuen Link an.';
}
