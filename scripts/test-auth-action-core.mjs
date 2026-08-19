import {parseActionParams,validAction,passwordPairValid,safeContinueUrl,friendlyError} from '../auth/action/action-core.js';
function ok(v,m){if(!v)throw new Error(m)}
const p=parseActionParams('?mode=resetPassword&oobCode=abcdef123&continueUrl=%2Flogin%2F&lang=de');
ok(p.mode==='resetPassword','mode parse failed');
ok(p.oobCode==='abcdef123','code parse failed');
ok(validAction(p)===true,'valid reset action rejected');
ok(validAction({mode:'evil',oobCode:'abcdef123'})===false,'unknown mode accepted');
ok(passwordPairValid('abcdefgh','abcdefgh')===true,'matching passwords rejected');
ok(passwordPairValid('abcdefgh','abcdefgi')===false,'mismatched passwords accepted');
ok(safeContinueUrl('/login/','https://www.sprachpilot.org')==='https://www.sprachpilot.org/login/','same-origin continue URL failed');
ok(safeContinueUrl('https://evil.example/x','https://www.sprachpilot.org')==='https://www.sprachpilot.org/login/','external continue URL was not blocked');
ok(friendlyError('auth/expired-action-code').includes('abgelaufen'),'expired code message missing');
ok(friendlyError('auth/invalid-action-code').includes('ungültig'),'invalid code message missing');
console.log('Branded auth action core tests passed.');
