'use strict';
const assert=require('node:assert/strict');
const core=require('../auth-mail-core');

assert.equal(core.normalizeEmail(' Test@Example.COM '),'test@example.com');
assert.equal(core.validEmail('test@example.com'),true);
assert.equal(core.validEmail('not-an-email'),false);

const firebaseLink='https://sprachpilot-12c68.firebaseapp.com/__/auth/action?mode=resetPassword&oobCode=ABC123&apiKey=KEY123&continueUrl=https%3A%2F%2Fwww.sprachpilot.org%2Flogin%2F&lang=de';
const custom=core.toCustomActionUrl(firebaseLink);
const u=new URL(custom);
assert.equal(u.origin,'https://www.sprachpilot.org');
assert.equal(u.pathname,'/auth/action/');
assert.equal(u.searchParams.get('mode'),'resetPassword');
assert.equal(u.searchParams.get('oobCode'),'ABC123');
assert.equal(u.searchParams.get('apiKey'),'KEY123');
assert.equal(u.searchParams.get('continueUrl'),'https://www.sprachpilot.org/login/');
assert.equal(u.searchParams.get('lang'),'de');

const nested='https://example.page.link/?link='+encodeURIComponent(firebaseLink);
assert.equal(new URL(core.toCustomActionUrl(nested)).searchParams.get('oobCode'),'ABC123');
assert.throws(()=>core.toCustomActionUrl('https://example.com/no-code'),/INVALID_FIREBASE_ACTION_LINK/);

const pw1=core.strongRandomPassword(),pw2=core.strongRandomPassword();
assert.ok(pw1.length>=32);
assert.notEqual(pw1,pw2);
assert.match(pw1,/[A-Z]/);
assert.match(pw1,/[a-z]/);
assert.match(pw1,/[0-9]/);
assert.match(pw1,/!/);
assert.notEqual(pw1,'123');

const reset=core.buildPasswordResetMail({name:'Anna & Bob',url:custom});
assert.match(reset.subject,/Passwort/);
assert.match(reset.text,/sprachpilot\.org/);
assert.match(reset.html,/SprachPilot/);
assert.match(reset.html,/Passwort festlegen/);
assert.ok(!reset.html.includes('Anna & Bob'));
assert.ok(reset.html.includes('Anna &amp; Bob'));

const customReset=core.buildPasswordResetMail({
  name:'Anna',url:custom,
  template:{subject:'Mein Betreff',title:'Neuer Titel',intro:'Neue Einleitung',body:'Eigener <Text>',button:'Jetzt ändern',footer:'Eigener Hinweis'}
});
assert.equal(customReset.subject,'Mein Betreff');
assert.match(customReset.text,/Neue Einleitung/);
assert.match(customReset.text,/Jetzt ändern/);
assert.match(customReset.html,/Neuer Titel/);
assert.match(customReset.html,/Eigener &lt;Text&gt;/);
assert.ok(!customReset.html.includes('Eigener <Text>'));

const bounded=core.templateFor('passwordReset',{subject:'x'.repeat(500)});
assert.equal(bounded.subject.length,160);
assert.throws(()=>core.templateFor('unknown',{}),/UNKNOWN_MAIL_TEMPLATE/);

const verifyUrl=custom.replace('resetPassword','verifyEmail');
const verify=core.buildVerificationMail({name:'Anna',url:verifyUrl,template:{button:'Adresse prüfen'}});
assert.match(verify.subject,/E-Mail-Adresse bestätigen/);
assert.match(verify.html,/Adresse prüfen/);

const setup=core.buildSetupMail({name:'Anna',resetUrl:custom,verifyUrl,template:{button:'Passwort setzen',secondButton:'E-Mail freigeben'}});
assert.match(setup.subject,/Zugang/);
assert.match(setup.html,/Passwort setzen/);
assert.match(setup.html,/E-Mail freigeben/);
assert.ok(setup.text.includes(custom));
assert.ok(setup.text.includes(verifyUrl));

console.log('Custom auth mail core tests passed.');
