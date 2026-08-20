'use strict';

const fs=require('node:fs');
const assert=require('node:assert/strict');
const src=fs.readFileSync(new URL('../student-admin.js',`file://${__filename}`),'utf8');
const pkg=require('../package.json');

assert.equal(pkg.main,'main.js','Firebase Functions must load the combined main wrapper');
assert.ok(src.includes("exports.updateStudentAccount=onCall"),'owner student account callable missing');
assert.ok(src.includes("getAuth().updateUser(authUid,{email,emailVerified:false})"),'Firebase Auth email must change server-side and require re-verification');
assert.ok(src.includes("generateEmailVerificationLink(email)"),'new login email must receive a verification link');
assert.ok(src.includes("collection('studentLookups')"),'student lookup mapping must be updated');
assert.ok(src.includes('authEmail=email'),'student authEmail must follow Firebase Auth email');
assert.ok(src.includes('oldAuthEmail'),'rollback data must be retained');
assert.ok(src.includes("updateUser(authUid,{email:oldAuthEmail,emailVerified:oldVerified})"),'Firebase Auth change must roll back when the coordinated update fails');
assert.ok(src.includes("OWNER_EMAILS.has(email)"),'only an allowlisted verified owner may update another student account');
assert.ok(src.includes("tokenProvider(authContext)!=='password'"),'owner must use password authentication');
assert.ok(src.includes("email_verified!==true"),'owner must have a verified email');
assert.ok(!src.includes('deleteUser('),'student identity must never be recreated for an email change');

console.log('Student account admin safety contract passed.');
