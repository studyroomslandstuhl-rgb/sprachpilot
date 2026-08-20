import fs from 'node:fs';

const index=fs.readFileSync(new URL('../teacher/index.html',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../teacher/dashboard-lite.js',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../teacher/login.html',import.meta.url),'utf8');
const teacherAuth=fs.readFileSync(new URL('../teacher/js/auth.js',import.meta.url),'utf8');
const rules=fs.readFileSync(new URL('../firestore.rules',import.meta.url),'utf8');

function ok(value,message){if(!value)throw new Error(message)}

const scripts=[...index.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]);
ok(scripts.length===5,`teacher dashboard should load exactly 5 initial scripts, got ${scripts.length}`);
ok(scripts.includes('dashboard-lite.js?v=1'),'teacher dashboard must load the lightweight dashboard core');
ok(!index.includes('live-progress-refresh.js'),'live refresh must not be loaded on the teacher dashboard');
ok(!index.includes('analytics.js'),'progress analytics must not load during dashboard startup');
ok(!index.includes('students.js'),'legacy students bundle must not load during dashboard startup');
ok(!index.includes('releases.js'),'large release editor must be lazy-loaded');
ok(!index.includes('dashboard-stable-start.js'),'legacy competing dashboard bootstrap must not load');

ok(!dashboard.includes('setInterval('),'teacher dashboard must not poll or rerender on an interval');
ok(!dashboard.includes('visibilitychange'),'teacher dashboard must not rerender on visibility changes');
ok(!dashboard.includes("addEventListener('scroll'"),'teacher dashboard must not rerender on scroll');
ok(!dashboard.includes("collection('progress')"),'overview must not fetch the full progress collection');
ok(dashboard.includes('data-owner-only')===false,'owner-only controls should be driven from the HTML navigation');
ok(dashboard.includes('teachers_pending'),'owner must be able to review pending teachers through Firebase');
ok(dashboard.includes('authMailTemplates'),'owner mail templates must be stored in Firebase');
ok(dashboard.includes('ensureReleaseTools'),'release editor must be loaded lazily');
ok(dashboard.includes('releases.js?v=teacher-lite1'),'existing release editor should only load on demand');

ok(login.includes('firebase-functions-compat.js'),'teacher login must load Firebase Functions for custom account mail');
ok(!login.includes('auth-legacy-fix.js'),'legacy teacher-login query patch must not be loaded');
ok(teacherAuth.includes('requestVerificationEmail'),'teacher verification must use the SprachPilot mail service');
ok(teacherAuth.includes('requestPasswordReset'),'teacher password reset must use the SprachPilot mail service');
ok(!teacherAuth.includes('sendEmailVerification'),'teacher auth must not bypass owner templates with Firebase default verification mail');
ok(!teacherAuth.includes('sendPasswordResetEmail'),'teacher auth must not bypass owner templates with Firebase default reset mail');

ok(rules.includes("settingId in ['teacherSecurity','authMailTemplates'] && ownerEmail()"),'mail templates must be owner-only in Firestore rules');

console.log('Teacher dashboard lite safety contract passed.');