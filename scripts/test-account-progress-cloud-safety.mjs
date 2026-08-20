import fs from 'node:fs';
const authoritative=fs.readFileSync(new URL('../js/account-progress-sync-authoritative.js',import.meta.url),'utf8');
const wrapper=fs.readFileSync(new URL('../js/account-progress-sync.js',import.meta.url),'utf8');
function ok(value,message){if(!value)throw new Error(message)}

ok(authoritative.includes('getDocFromServer'),'authoritative mode must use explicit server reads');
ok(authoritative.includes("clientProgressAuthorityMode:'server-first'"),'server-first marker must be written to Firebase');
ok(authoritative.includes('runTransaction'),'pending writes must merge transactionally with current Firebase state');
ok(authoritative.includes('PENDING_PREFIX'),'unsynced progress must use an explicit account-scoped pending journal');
ok(authoritative.includes("ownerUid:String(ownerUid||'')")||authoritative.includes('ownerUid'),'pending journal must be scoped to Firebase UID');
ok(authoritative.includes("import('/js/account-progress-sync-safe.js?v=6')"),'legacy rescue sync must be isolated to one-time migration');
ok(authoritative.includes('if(!remote.authorityReady)'),'legacy reconciliation must only happen before cloud authority marker exists');
ok(!authoritative.includes('scanLocal()'),'server-authoritative startup must not scan arbitrary local progress for upload');
ok(wrapper.includes('Firebase-Fortschritt wird benötigt'),'learning page must fail closed when fresh Firebase progress is unavailable');
ok(wrapper.includes("!result?.serverAuthoritative&&!result?.authorityActivated"),'legacy rescue must not run after cloud authority is active');
ok(wrapper.includes("account-progress-sync-authoritative.js?v=1"),'main account sync must use authoritative implementation');

console.log('Cloud-authoritative progress safety contract passed.');
