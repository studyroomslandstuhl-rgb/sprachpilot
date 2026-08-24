import fs from 'node:fs';

const index=fs.readFileSync(new URL('../teacher/index.html',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../teacher/dashboard-lite.js',import.meta.url),'utf8');
const accountAdmin=fs.readFileSync(new URL('../teacher/dashboard-account-admin.js',import.meta.url),'utf8');
const passwordReset=fs.readFileSync(new URL('../teacher/dashboard-password-reset.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../teacher/dashboard-lite.css',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../teacher/login.html',import.meta.url),'utf8');
const teacherAuth=fs.readFileSync(new URL('../teacher/js/auth.js',import.meta.url),'utf8');
const rules=fs.readFileSync(new URL('../firestore.rules',import.meta.url),'utf8');

function ok(value,message){if(!value)throw new Error(message)}

const scripts=[...index.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]);
ok(scripts.length<=14,`teacher dashboard startup script budget exceeded: ${scripts.length}`);
ok(scripts.some(src=>src.startsWith('dashboard-lite.js?')),'teacher dashboard must load the lightweight dashboard core');
ok(scripts.some(src=>src.startsWith('dashboard-account-admin.js?')),'owner Firebase account editor must load');
ok(scripts.some(src=>src.startsWith('dashboard-student-delete.js?')),'student deletion controls must load');
ok(scripts.some(src=>src.startsWith('dashboard-password-reset.js?')),'teacher password reset mail module must be loaded');
ok(!scripts.some(src=>src.includes('firebase-functions-compat')),'Firebase Functions SDK must stay lazy and not slow dashboard startup');
ok(!index.includes('live-progress-refresh.js'),'live refresh must not be loaded on the teacher dashboard');
ok(!index.includes('analytics.js'),'progress analytics must not load during dashboard startup');
ok(!index.includes('students.js'),'legacy students bundle must not load during dashboard startup');
ok(!index.includes('releases.js'),'large release editor must be lazy-loaded');
ok(!index.includes('dashboard-stable-start.js'),'legacy competing dashboard bootstrap must not load');

ok(!dashboard.includes('setInterval('),'teacher dashboard must not poll or rerender on an interval');
ok(!dashboard.includes('visibilitychange'),'teacher dashboard must not rerender on visibility changes');
ok(!dashboard.includes("addEventListener('scroll'"),'teacher dashboard must not rerender on scroll');
ok(!dashboard.includes("collection('progress')"),'overview must not fetch the full progress collection');
ok(dashboard.includes("querySelectorAll('[data-owner-only]')"),'dashboard must toggle the owner-only controls defined in the HTML navigation');
ok(dashboard.includes('teachers_pending'),'owner must be able to review pending teachers through Firebase');
ok(dashboard.includes('authMailTemplates'),'owner mail templates must be stored in Firebase');
ok(dashboard.includes('ensureReleaseTools'),'release editor must be loaded lazily');
ok(dashboard.includes('releases.js?v=teacher-lite1'),'existing release editor should only load on demand');

ok(index.includes('class="sp-mobile-nav"'),'mobile bottom navigation missing');
ok(index.includes('data-view="overview"')&&index.includes('data-view="releases"'),'mobile navigation must expose core views');
ok(index.includes('data-view="teacher-approval"')&&index.includes('data-view="email-templates"'),'owner tools must remain reachable on mobile');
ok(css.includes('@media(max-width:760px)'),'mobile layout breakpoint missing');
ok(css.includes('.sp-mobile-nav{display:grid'),'mobile bottom navigation must become visible on phones');
ok(css.includes('.sp-stat{grid-column:span 6!important'),'mobile statistics should render as a compact 2x2 grid');

ok(accountAdmin.includes("httpsCallable('updateStudentAccount')"),'bound student email changes should prefer the server-side Firebase account function when available');
ok(accountAdmin.includes('firebase-functions-compat.js'),'Functions SDK must be loaded lazily only when needed');
ok(accountAdmin.includes('api.state.isOwner'),'bound Firebase account editing must be owner-only in the dashboard');
ok(accountAdmin.includes('const SDK_TIMEOUT_MS=8000'),'Functions SDK loading must have a hard timeout');
ok(accountAdmin.includes('const CALL_TIMEOUT_MS=12000'),'student account saving must have a hard timeout');
ok(accountAdmin.includes("'sp/functions-call-timeout'"),'call timeout must produce a dedicated user-visible error');
ok(accountAdmin.includes('withTimeout('),'Firebase loading and saving must never wait indefinitely');
ok(accountAdmin.includes("button.disabled=false;button.textContent='In Firebase speichern'"),'save button must recover after Firebase failure or timeout');
ok(accountAdmin.includes("const firebase=window.firebase"),'dashboard Functions client must use the loaded Firebase global safely');
ok(accountAdmin.includes('app.functions(REGION)'),'dashboard must select Functions region through the Firebase App instance');
ok(!accountAdmin.includes("firebase.functions(REGION)"),'dashboard must not pass a region string to firebase.functions-compat()');
ok(accountAdmin.includes("id=\"spFirebaseSaveStatus\""),'Firebase save result must be visible inside the edit dialog');
ok(accountAdmin.includes("button.addEventListener('click'"),'Firebase save button must have a direct click listener');
ok(!accountAdmin.includes("id=\"saveFirebaseStudentBtn\" onclick="),'Firebase save button must not depend on inline onclick');

ok(accountAdmin.includes('migrateBoundAccountLocally'),'missing Cloud Function must have a safe owner-only fallback');
ok(accountAdmin.includes('createUserWithEmailAndPassword'),'fallback must create the replacement Firebase Auth credential in a secondary app');
ok(accountAdmin.includes('sendEmailVerification'),'replacement login must receive a verification email');
ok(accountAdmin.includes('sendPasswordResetEmail'),'replacement login must receive a password setup/reset email');
ok(accountAdmin.includes("collection('progress')"),'fallback must rebind existing progress documents instead of dropping progress');
ok(accountAdmin.includes("collection('studentRankings')"),'fallback must preserve ranking points by rebinding ranking documents');
ok(accountAdmin.includes('authPreviousUid'),'fallback must retain the previous UID for later audit/cleanup');
ok(accountAdmin.includes('authReboundByOwnerUid'),'fallback must record that the owner performed the rebind');
ok(accountAdmin.includes('user.delete()'),'a newly created replacement auth user must be rolled back if Firestore migration fails');
ok(accountAdmin.includes('adminFunctionUnavailable'),'repeated clicks must not keep waiting for a known-missing Cloud Function');

ok(passwordReset.includes("sendPasswordResetEmail(email)"),'owner must be able to send a Firebase password reset mail to a student');
ok(passwordReset.includes("id='sendStudentPasswordResetBtn'")||passwordReset.includes("id='sendStudentPasswordResetBtn'" )||passwordReset.includes("reset.id='sendStudentPasswordResetBtn'"),'password reset action must have its own button');
ok(passwordReset.includes('student.authUid'),'password reset action must only be offered for a bound Firebase student account');
ok(passwordReset.includes('api.state.isOwner'),'password reset action must be owner-only');
ok(passwordReset.includes('Passwort-Wiederherstellungs-Mail wurde an'),'successful reset mail delivery must be confirmed in the UI');

ok(login.includes('firebase-functions-compat.js'),'teacher login must load Firebase Functions for custom account mail');
ok(/js\/auth\.js\?v=[^"']+/.test(login),'teacher login must cache-bust the Functions/auth client');
ok(!login.includes('auth-legacy-fix.js'),'legacy teacher-login query patch must not be loaded');
ok(teacherAuth.includes('requestVerificationEmail'),'teacher verification must use the SprachPilot mail service');
ok(teacherAuth.includes('requestPasswordReset'),'teacher password reset must use the SprachPilot mail service');
ok(teacherAuth.includes("firebase.app().functions(FUNCTIONS_REGION)"),'teacher mail client must select Functions region through the Firebase App instance');
ok(!teacherAuth.includes("firebase.functions(FUNCTIONS_REGION)"),'teacher mail client must not pass a region string to firebase.functions-compat()');
ok(!teacherAuth.includes('sendEmailVerification'),'teacher auth must not bypass owner templates with Firebase default verification mail');
ok(!teacherAuth.includes('sendPasswordResetEmail'),'teacher auth must not bypass owner templates with Firebase default reset mail');

ok(rules.includes("settingId in ['teacherSecurity','authMailTemplates'] && ownerEmail()"),'mail templates must be owner-only in Firestore rules');

console.log('Teacher dashboard lite safety contract passed.');
