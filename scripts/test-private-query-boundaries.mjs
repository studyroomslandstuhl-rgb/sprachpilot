import fs from 'node:fs';
import assert from 'node:assert/strict';

const files=[
  'js/student-identity.js',
  'js/account-progress-sync-safe.js',
  'student-dashboard/progress-alias-unifier.js',
  'student-dashboard/dashboard-lite.js'
];

for(const file of files){
  const source=fs.readFileSync(file,'utf8');
  assert.doesNotMatch(
    source,
    /collection\s*\(\s*db\s*,\s*['"](?:students|progress)['"]\s*\)[\s\S]{0,400}?where\s*\(\s*['"]email['"]/i,
    `${file} must not query private students/progress collections by email`
  );
}

const identity=fs.readFileSync('js/student-identity.js','utf8');
assert.match(identity,/where\s*\(\s*['"]authUid['"]\s*,\s*['"]==['"]\s*,\s*uid\s*\)/,'student identity lookup must use authUid');
assert.match(identity,/studentLookups/,'corrected legacy students must use direct lookup documents');

const sync=fs.readFileSync('js/account-progress-sync-safe.js','utf8');
assert.doesNotMatch(sync,/getDocs\s*\(|getDocsFromServer\s*\(|collection\s*\(\s*db\s*,\s*['"]progress['"]/,'account progress sync must use only direct progress document IDs');

const aliases=fs.readFileSync('student-dashboard/progress-alias-unifier.js','utf8');
assert.doesNotMatch(aliases,/getDocs\s*\(|getDocsFromServer\s*\(|collection\s*\(\s*db\s*,\s*['"]progress['"]/,'dashboard alias unifier must use only direct progress document IDs');

const dashboard=fs.readFileSync('student-dashboard/dashboard-lite.js','utf8');
assert.doesNotMatch(dashboard,/collection\s*\(\s*db\s*,\s*['"](?:students|progress)['"]/,'dashboard must not list private students/progress collections');
assert.match(dashboard,/studentRankings/,'dashboard leaderboard must use the sanitized ranking collection');

const profile=fs.readFileSync('profile/index.html','utf8');
assert.doesNotMatch(profile,/global-sync|updateStudentProfile|requireLogin\s*\(/,'profile page must not use legacy broad profile sync');
assert.match(profile,/verifySecureAccess/,'profile page must verify secure Firebase access');
assert.match(profile,/id="email"[^>]*disabled/,'student login email must not be edited only in Firestore');

const guard=fs.readFileSync('js/guard.js','utf8');
assert.match(guard,/verifySecureAccess/,'legacy learning guard must verify Firebase UID access');
const injectedGate=fs.readFileSync('js/learning-auth-gate.js','utf8');
assert.match(injectedGate,/verifySecureAccess/,'injected learning gate must verify Firebase UID access');
const bootstrap=fs.readFileSync('student-dashboard/dashboard-bootstrap.js','utf8');
assert.match(bootstrap,/verifySecureAccess\(\{allowTeacher:false/,'student dashboard must require student UID access');

console.log('Private-query and secure-entry boundary checks passed.');
