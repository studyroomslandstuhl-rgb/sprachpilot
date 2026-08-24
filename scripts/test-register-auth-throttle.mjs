import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginHtml=fs.readFileSync(new URL('../login/index.html',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
const registerEntry=fs.readFileSync(new URL('../js/student-register-entry-v2.js',import.meta.url),'utf8');
const registration=fs.readFileSync(new URL('../js/student-registration-v3.js',import.meta.url),'utf8');
const secureAuth=fs.readFileSync(new URL('../js/student-secure-auth.js',import.meta.url),'utf8');
const firebase=fs.readFileSync(new URL('../js/firebase.js',import.meta.url),'utf8');

// UI: one click at a time, fresh client, and no false successful-account claim.
assert.match(html,/registrationBusy=false/,'registration must have an in-flight guard');
assert.match(html,/if\(registrationBusy\)return;/,'parallel registration attempts must be ignored');
assert.match(html,/registrationBusy=true;/,'guard must activate before registration');
assert.match(html,/registrationBusy=false;/,'guard must be released after registration');
assert.match(html,/student-register-entry-v2\.js\?v=20260824-register6/,'registration page must load the current cache-busted entry');
assert.match(html,/student-secure-auth\.js\?v=20260824-register5/,'registration page must load the current auth helper');
assert.doesNotMatch(html,/Das Firebase-Konto wurde erfolgreich erstellt/,'UI must not claim a successful account when verification transport failed');
assert.match(html,/unvollständige Konto wurde automatisch wieder entfernt/,'rolled-back partial registrations must be explained accurately');
assert.match(html,/Firebase blockiert momentan die Erstellung neuer Konten/,'credential throttling must be identified separately');
assert.match(html,/>Registrieren<\/button>/,'primary registration action must exist');
assert.match(html,/>Ich habe schon ein Konto<\/a>/,'existing accounts must still have a direct login route');

// Registration wrapper delegates exactly once.
const marker='export async function registerStudentV2';
const start=registerEntry.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=registerEntry.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a second Firebase credential itself');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform its own password-login fallback');
assert.match(registrationBlock,/registerStudentOnce\(\{\.\.\.payload,email,password\},finishPendingStudentRegistration\)/,'registration wrapper must delegate to the helper');
assert.match(registerEntry,/student-registration-v3\.js\?v=20260824-register6/,'wrapper must load the repaired registration helper');

// Registration helper: one create attempt, stale restored sessions are verified first,
// and an account is confirmed against Firebase before the UI can call it real.
assert.doesNotMatch(registration,/ensureCourseLookupAuth/,'registration must not create an anonymous auth preflight');
assert.equal((registration.match(/await createSecureStudentCredential\s*\(/g)||[]).length,1,'registration helper must perform exactly one credential creation call');
assert.equal((registration.match(/await signInSecureStudent\s*\(/g)||[]).length,1,'existing-account recovery must perform at most one password-login call');
assert.match(registration,/async function validatedExistingSession\(email\)/,'restored Firebase sessions must be validated before reuse');
assert.match(registration,/await reloadFirebaseUser\(current\)/,'a restored same-email session must be checked against Firebase');
assert.match(registration,/STALE_AUTH_CODES/,'deleted or expired restored users must be recognized as stale');
assert.match(registration,/await secureStudentSignOut\(\)/,'a stale restored Firebase session must be removed before signup');
assert.match(registration,/user=await reloadFirebaseUser\(user\)/,'new or recovered Firebase credentials must be confirmed before course setup');
assert.match(registration,/SECURE_AUTH_ACCOUNT_CONFIRMATION_FAILED/,'unconfirmed auth objects must never be reported as accounts');
assert.match(registration,/user=await createSecureStudentCredential\(pending\.email,password\);[\s\S]*?courseLoaded=await loadAllowedCourse\(pending\.kurs\);/,'a secure password user must exist before Firestore course lookup begins');
assert.match(registration,/isVerificationThrottle/,'registration helper must distinguish verification-mail throttling');
assert.match(registration,/verificationRolledBack:rolledBack/,'verification mail failure must report whether a just-created account was rolled back');
assert.match(registration,/const rolledBack=await rollbackCredential\(user,createdThisAttempt\)/,'a just-created account must be removed when its verification mail cannot be sent');
assert.match(registration,/clearPending\(\);clearRegistrationAuthFailure\(pending\.email\)/,'successful rollback must clear pending registration state');
assert.match(registration,/await rollbackCredential\(user,createdThisAttempt\)/,'invalid course codes must roll back accounts created by that attempt');
assert.match(registration,/deleteUser\(user\)/,'rollback must delete only the just-created Firebase account');
assert.match(registration,/existingFirebaseAccount=true/,'interrupted real accounts must still be recognized and continued');

// Existing Firebase account with an unbound TN profile: login must be able to claim the prepared legacy profile.
assert.match(loginHtml,/id="loginCourse"/,'login page must offer a course code for first-time profile linking');
assert.match(loginHtml,/student-login-v2\.js\?v=20260824-link2/,'login page must cache-bust the current profile-linking client');
assert.match(loginHtml,/loginStudentWithEmailPassword\(email,password,course\)/,'login page must pass the recovery course code to the login client');
assert.match(loginHtml,/STUDENT_COURSE_REQUIRED_FOR_LINK/,'login page must explain when a course code is required');
assert.match(login,/async function recoverPreparedProfile\(user,email,courseRaw\)/,'student login must have a prepared-profile recovery path');
assert.match(login,/getDocFromServer\(doc\(db,'studentLookups',lookupId\)\)/,'recovery must read the teacher-prepared participant lookup directly');
assert.match(login,/getDocFromServer\(doc\(db,'students',canonical\)\)/,'recovery must resolve the authoritative TN document');
assert.match(login,/async function claimLegacyStudentRecord/,'legacy TN profile must have an explicit secure claim step');
assert.match(login,/authUid:String\(user\.uid\)/,'claim must bind the signed-in Firebase UID to the TN profile');
assert.match(login,/authEmail:mail/,'claim must bind the verified login e-mail');
assert.match(login,/return claimLegacyStudentRecord\(studentSnap\.id\|\|canonical,student,user,mail\)/,'prepared lookup recovery must actually claim the resolved profile');
assert.match(login,/throw new Error\('STUDENT_COURSE_REQUIRED_FOR_LINK'\)/,'unbound accounts without a course code must not silently fail as profile-not-found');

// Login must never send another verification email automatically.
assert.doesNotMatch(login,/sendStudentVerification/,'login attempts must not trigger verification-mail sends');
assert.match(login,/if\(user\.emailVerified!==true\)throw new Error\('EMAIL_NOT_VERIFIED'\)/,'unverified login must stop without sending mail');
assert.doesNotMatch(loginHtml,/Wir haben dir eine neue Bestätigungs-E-Mail geschickt/,'login UI must not claim it sent another verification email');
assert.match(loginHtml,/Die Anmeldung verschickt absichtlich keine weiteren Bestätigungs-E-Mails/,'login UI must explain the single-mail registration flow');

// Secure auth: custom mail is preferred, verification throttling cannot poison future signup.
assert.match(secureAuth,/sendVerificationViaSprachPilot/,'student verification must try the SprachPilot mail service first');
assert.match(secureAuth,/httpsCallable\(functions,'requestVerificationEmail'\)/,'student client must target the server-side verification mail function');
assert.match(secureAuth,/writeRegistrationBlock\(email,code,stage='credential'\)/,'registration block must record its Firebase stage');
assert.match(secureAuth,/if\(block\.stage==='verification'\)return null;/,'verification-mail throttling must never block credential creation');
assert.match(secureAuth,/writeRegistrationBlock\(user\.email,'auth\/too-many-requests','verification'\)/,'verification throttle must be recorded as verification-stage only');
assert.match(secureAuth,/writeRegistrationBlock\(email,'auth\/too-many-requests','credential'\)/,'account-creation throttle must remain credential-stage');
assert.match(secureAuth,/REGISTER_BLOCK_KEY/,'failed credential attempts must still have a session-level guard');
assert.match(secureAuth,/spNoSecondCredentialAttempt=true/,'non-retry credential errors must still be marked explicitly');
assert.match(secureAuth,/export function clearRegistrationAuthFailure/,'registration recovery must have an explicit block-clear API');

// Firebase startup: importing the shared module must not itself create an anonymous account.
assert.match(firebase,/export const authReady=initialAuthState;/,'authReady must only wait for restored auth state');
assert.doesNotMatch(firebase,/export const authReady=ensureAuth\(\);/,'firebase.js must not sign in anonymously as an import side effect');
assert.match(firebase,/async function waitAuthRequired\(\)[\s\S]*?await ensureAuth\(\)/,'Firestore access may request auth for normal application reads after a user exists');

console.log('Registration auth guard passed: one verification mail per signup, stale sessions rejected, and failed verification sends roll back newly created accounts.');
