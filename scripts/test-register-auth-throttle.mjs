import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginHtml=fs.readFileSync(new URL('../login/index.html',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
const registerEntry=fs.readFileSync(new URL('../js/student-register-entry-v2.js',import.meta.url),'utf8');
const registration=fs.readFileSync(new URL('../js/student-registration-v3.js',import.meta.url),'utf8');
const secureAuth=fs.readFileSync(new URL('../js/student-secure-auth.js',import.meta.url),'utf8');
const firebase=fs.readFileSync(new URL('../js/firebase.js',import.meta.url),'utf8');

// Registration UI: normal form, one permanent register button, no dead-end pending-registration UI.
assert.match(html,/registrationBusy=false/,'registration must have an in-flight guard');
assert.match(html,/if\(registrationBusy\)return;/,'parallel registration attempts must be ignored');
assert.match(html,/registrationBusy=true;/,'guard must activate before registration');
assert.match(html,/registrationBusy=false;/,'guard must be released after registration');
assert.match(html,/style\.display='block'/,'register button must always be restored after an attempt');
assert.match(html,/>Registrieren<\/button>/,'primary registration action must exist');
assert.match(html,/>Ich habe schon ein Konto<\/a>/,'existing accounts must still have a direct login route');
assert.doesNotMatch(html,/Es gibt bereits eine offene Registrierung/,'page must not block users with an open-registration message');
assert.doesNotMatch(html,/Bestätigungs-E-Mail erneut senden/,'page must not replace registration with a resend-only button');
assert.doesNotMatch(html,/showPendingVerification/,'page must not hide registration behind pending-verification UI');
assert.match(html,/clearPendingRegistration\(\)/,'a new registration attempt must clear stale local pending state');
assert.match(html,/Bitte warte einige Minuten und klicke danach erneut auf „Registrieren“/,'temporary throttling must return users to the normal register action');
assert.doesNotMatch(html,/Das Firebase-Konto wurde erfolgreich erstellt/,'UI must never claim a successful account before completion');
assert.match(html,/20260825-register8/,'registration page must use the current cache epoch');

// Registration wrapper delegates once.
const marker='export async function registerStudentV2';
const start=registerEntry.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=registerEntry.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a second Firebase credential itself');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform its own password-login fallback');
assert.match(registrationBlock,/registerStudentOnce\(\{\.\.\.payload,email,password\},finishPendingStudentRegistration\)/,'registration wrapper must delegate to the helper');

// Registration helper: one account-creation attempt, safe recovery, and durable pending profile metadata.
assert.equal((registration.match(/await createSecureStudentCredential\s*\(/g)||[]).length,1,'registration helper must perform exactly one credential creation call');
assert.equal((registration.match(/await signInSecureStudent\s*\(/g)||[]).length,1,'existing-account recovery must perform at most one password-login call');
assert.match(registration,/async function validatedExistingSession\(email\)/,'restored Firebase sessions must be validated before reuse');
assert.match(registration,/await reloadFirebaseUser\(current\)/,'restored same-email session must be checked against Firebase');
assert.match(registration,/STALE_AUTH_CODES/,'deleted or expired restored users must be recognized as stale');
assert.match(registration,/user=await reloadFirebaseUser\(user\)/,'new or recovered Firebase credentials must be confirmed before course setup');
assert.match(registration,/SECURE_AUTH_ACCOUNT_CONFIRMATION_FAILED/,'unconfirmed auth objects must never be reported as accounts');
assert.match(registration,/existingFirebaseAccount=true/,'an interrupted real account must be recoverable');
assert.match(registration,/verificationRolledBack:false/,'verification transport failure must not delete an accepted Firebase account');
assert.match(registration,/AUTH_PENDING_PREFIX='SPREG1\|'/,'registration data must have a durable Firebase Auth marker format');
assert.match(registration,/await updateProfile\(user,\{displayName:token\}\)/,'name, language and course metadata must survive outside localStorage until activation');
assert.match(registration,/export function restorePendingStudentRegistration/,'verified login must be able to restore registration metadata from Firebase Auth');

// Login: a verified Firebase account with no Firestore profile must create its TN profile on first login.
assert.match(loginHtml,/id="loginCourse"/,'login page must offer a course code for first-time profile linking');
assert.match(loginHtml,/student-login-v2\.js\?v=20260825-link3/,'login page must load verified profile recovery code');
assert.match(login,/async function createVerifiedProfileFromPending\(user,email,courseRaw='?'?\)/,'login must have a first-login profile creation path');
assert.match(login,/restorePendingStudentRegistration\(user,courseRaw\)/,'first login must restore registration metadata from Firebase Auth when localStorage is missing');
assert.match(login,/await setDoc\(doc\(db,'students',studentId\),st\)/,'verified first login must create the Firestore student profile');
assert.match(login,/await setDoc\(doc\(db,'progress',studentId\)/,'verified first login must create the matching progress document');
assert.match(login,/aliasIds:\[studentId\]/,'new student identity must satisfy canonical Firestore identity rules');
assert.match(login,/clearAuthRegistrationMarker\(user,pending\)/,'temporary Firebase Auth registration metadata must be removed after profile creation');
assert.match(login,/async function recoverPreparedProfile\(user,email,courseRaw\)/,'student login must still have prepared legacy-profile recovery');
assert.match(login,/async function claimLegacyStudentRecord/,'legacy TN profile must still have an explicit secure claim step');
assert.doesNotMatch(login,/sendStudentVerification/,'login attempts must not trigger verification-mail sends');
assert.match(login,/if\(user\.emailVerified!==true\)throw new Error\('EMAIL_NOT_VERIFIED'\)/,'unverified login must stop without sending mail');

// After email verification, Firestore must get a fresh token before profile writes.
assert.match(secureAuth,/getIdToken/,'secure auth must be able to refresh the Firebase ID token');
assert.match(secureAuth,/await getIdToken\(refreshed,true\)/,'verification transition must force-refresh email_verified in the token');
assert.match(secureAuth,/if\(user\.emailVerified===true\)\{try\{await getIdToken\(user,true\)/,'password login of a verified user must also refresh the token before Firestore writes');

// Secure auth still rate-limits mail delivery and performs at most one Firebase fallback request per allowed attempt.
assert.match(secureAuth,/sendVerificationViaSprachPilot/,'student verification must try the SprachPilot mail service first');
assert.match(secureAuth,/function verificationThrottleRemaining\(user\)/,'verification resend must have a local throttle gate');
assert.match(secureAuth,/reason:'throttled-cooldown'/,'active verification throttling must return without another network send');
assert.equal((secureAuth.match(/await sendEmailVerification\(user\);/g)||[]).length,1,'Firebase verification fallback must make exactly one mail request per allowed attempt');
assert.match(secureAuth,/writeRegistrationBlock\(user\.email,'auth\/too-many-requests','verification'\)/,'verification throttle must be recorded separately');
assert.match(secureAuth,/writeRegistrationBlock\(email,'auth\/too-many-requests','credential'\)/,'account-creation throttle must remain credential-stage');

// Firebase module import must not create an anonymous account as a side effect.
assert.match(firebase,/export const authReady=initialAuthState;/,'authReady must only wait for restored auth state');
assert.doesNotMatch(firebase,/export const authReady=ensureAuth\(\);/,'firebase.js must not sign in anonymously on import');

console.log('Registration auth guard passed: verified Firebase accounts create their Firestore TN profile on first login, even when the email link opened in another browser.');
