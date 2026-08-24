'use strict';

const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync(new URL('../student-delete.js',`file://${__filename}`),'utf8');
const main=fs.readFileSync(new URL('../main.js',`file://${__filename}`),'utf8');

assert.ok(main.includes("...require('./student-delete')"),'combined Functions entry point must export student deletion');
assert.ok(src.includes('exports.deleteStudentAccount=onCall'),'student deletion callable missing');
assert.ok(src.includes("confirmation!=='DELETE_STUDENT'"),'irreversible deletion must require an explicit server-side confirmation token');
assert.ok(src.includes("authContext?.token?.email_verified!==true"),'teacher account must have a verified e-mail');
assert.ok(src.includes("tokenProvider(authContext)!=='password'"),'teacher must authenticate with password provider');
assert.ok(src.includes('securityApprovedV2!==true'),'non-owner teachers must have current security approval');
assert.ok(src.includes("['teacherUid','==',admin.uid]")&&src.includes("collection('courses').where(field,op,value)"),'teacher deletion must be scoped to assigned courses');
assert.ok(src.includes('STUDENT_OUTSIDE_TEACHER_COURSES'),'a teacher must not delete students from inaccessible courses');
assert.ok(src.includes('STUDENT_AUTH_IS_TEACHER'),'student deletion must protect teacher/owner Firebase accounts');
assert.ok(src.includes("collection('students').where('authUid','==',authUid)"),'all student profiles bound to the Firebase account must be collected');
assert.ok(src.includes("collection('progress').where('authUid','==',authUid)"),'all progress bound to the Firebase account must be collected');
assert.ok(src.includes("collection('studentRankings').where('authUid','==',authUid)"),'all ranking rows bound to the Firebase account must be collected');
assert.ok(src.includes("collection('studentLookups').where('canonicalStudentId'"),'student lookup mappings must be deleted');
assert.ok(src.includes('revokeRefreshTokens(authUid)'),'sessions must be revoked before account deletion');
assert.ok(src.includes('getAuth().deleteUser(authUid)'),'Firebase Authentication user must be deleted server-side');
assert.ok(src.indexOf('deleteRefs(database,otherRefs.values())')<src.indexOf('deleteRefs(database,studentRefs.values())'),'dependent data must be deleted before the student profile so failed cleanup can be retried');
assert.ok(!src.includes('getUserByEmail('),'an unbound legacy e-mail must never be used to guess which Firebase Auth user to delete');

console.log('Student full deletion safety contract passed.');
