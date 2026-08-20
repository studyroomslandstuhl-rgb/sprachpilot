import fs from 'node:fs';
const authoritative=fs.readFileSync(new URL('../js/account-progress-sync-authoritative-v2.js',import.meta.url),'utf8');
const wrapper=fs.readFileSync(new URL('../js/account-progress-sync.js',import.meta.url),'utf8');
const bridge=fs.readFileSync(new URL('../js/account-progress-l78-bridge.js',import.meta.url),'utf8');
const guard=fs.readFileSync(new URL('../js/guard.js',import.meta.url),'utf8');
const dashboardBootstrap=fs.readFileSync(new URL('../student-dashboard/dashboard-bootstrap.js',import.meta.url),'utf8');
const dashboardServer=fs.readFileSync(new URL('../student-dashboard/dashboard-server-v2.js',import.meta.url),'utf8');
function ok(value,message){if(!value)throw new Error(message)}

ok(authoritative.includes("const AUTHORITY_VERSION=2"),'cross-device authority repair must use a new version');
ok(authoritative.includes('getDocFromServer'),'authoritative mode must use explicit server reads');
ok(authoritative.includes("clientProgressAuthorityMode:'server-first-v2'"),'server-first v2 marker must be written to Firebase');
ok(authoritative.includes('runTransaction'),'pending writes must merge transactionally with current Firebase state');
ok(authoritative.includes('PENDING_PREFIX'),'unsynced progress must use an explicit account-scoped pending journal');
ok(authoritative.includes('ownerUid'),'pending journal must be scoped to Firebase UID');
ok(authoritative.includes('bootstrapAuthorityV2'),'pre-v2 accounts need an explicit one-time repair path');
ok(authoritative.includes('recoverStructuredLessons(remote.docs)'),'structured Firebase lesson data must be mirrored back to local task state during repair');
ok(authoritative.includes('const local=scanLocal()'),'the one-time pre-v2 repair must rescue existing progress from the verified account browser');
ok(authoritative.includes("structuredProgressEvidence(remote.docs)&&!entriesHaveMeaningful(merged)"),'an empty device must not finalize a known non-empty legacy account as zero progress');
ok(authoritative.includes("new Error('CLOUD_PROGRESS_REPAIR_SOURCE_REQUIRED')"),'missing repair source must fail closed instead of marking zero as authoritative');
ok(authoritative.includes("new Error('CLOUD_PROGRESS_STATE_VERIFY_FAILED')"),'repaired progress must be read back and verified before authority v2 is accepted');
ok(authoritative.includes('if(!remote.authorityReady){repair=await bootstrapAuthorityV2(remote)'),'general local rescue must only run before v2 authority is established');
ok(!authoritative.includes("account-progress-sync-safe.js"),'v2 authority must not trust the old migration success result');

ok(wrapper.includes("account-progress-l78-bridge.js?v=1"),'main account sync must load the L7/L8 bridge before authoritative hydration');
ok(wrapper.includes('prepareL78AccountProgressBridge'),'existing L7/L8 ledgers must be staged before cloud hydration');
ok(wrapper.includes('hydrateL78VisibleProgress'),'restored L7/L8 ledgers must rebuild the visible practice state');
ok(wrapper.includes('installL78RuntimeBridge'),'new L7/L8 task state must be mirrored into the account ledger');
ok(wrapper.includes("account-progress-sync-authoritative-v2.js?v=3"),'main account sync must load the cache-busted authority v2 implementation');
ok(wrapper.includes('CLOUD_PROGRESS_REPAIR_SOURCE_REQUIRED'),'learning pages must explain when the old-progress device is required');
ok(wrapper.includes('alreadyCanonicalSecureProfile'),'canonical UID profiles must avoid the legacy identity rewrite before cloud sync');

ok(bridge.includes('clientStates'),'L7/L8 ledgers must carry exact current task state across devices');
ok(bridge.includes('clientStateProgressFloor'),'resettable visible task state must not make an account ledger weaker than its cloud predecessor');
ok(bridge.includes('allowedLedgerPids'),'legacy L7/L8 migration must be restricted to identities belonging to the active student');
ok(bridge.includes("value&&value!=='student'"),'generic student ledgers must not be claimed by a secure Firebase account');
ok(bridge.includes('canonicalizeLedgers'),'legacy same-account ledger aliases must be copied to the current canonical pid');
ok(bridge.includes('SP_THEME_RESET_A1_L'),'L7/L8 reset markers must be account-synced');
ok(bridge.includes('clearVisibleTheme'),'a reset received from another device must clear stale visible task state');
ok(bridge.includes("SP_ACCOUNT_PROGRESS_REFRESHED"),'L7/L8 visible state must react to fresh cloud updates during an active session');
ok(bridge.includes('hydratingVisible'),'cloud hydration must not create a false new reset marker');
ok(bridge.includes('Storage.prototype.removeItem'),'practice resets must be detected without cloud-syncing raw task state');
ok(bridge.includes('MIGRATION_PREFIX'),'legacy local L7/L8 ledgers need a one-time account migration marker');

ok(guard.includes('if(FULL_FIREBASE&&IS_SECURE_STUDENT){aliasRepairPromise.finally'),'secure students must start account sync on learning pages');
ok(!guard.includes('IS_SECURE_STUDENT&&!IS_L7&&!IS_L8'),'L7/L8 must no longer be excluded from account progress sync');
ok(guard.includes("account-progress-sync.js?v=12"),'learning guard must load the current account progress wrapper');

ok(dashboardBootstrap.includes("import('/js/account-progress-sync.js?v=12')"),'student dashboard must wait for the current progress wrapper before rendering');
ok(dashboardBootstrap.includes('alreadyCanonicalSecureProfile'),'dashboard must avoid legacy identity rewrites for already canonical UID profiles');
ok(dashboardBootstrap.includes("Number(progressState?.authorityVersion||0)<2"),'student dashboard must require authority v2');
ok(dashboardBootstrap.includes("import('./dashboard-server-v2.js?v=1')"),'student dashboard must use the server-only renderer');
ok(dashboardServer.includes('getDocFromServer'),'dashboard progress must come from explicit Firestore server reads');
ok(dashboardServer.includes('getDocsFromServer'),'dashboard ranking must come from explicit Firestore server reads');
ok(!dashboardServer.includes('SP_STUDENT_DASHBOARD_LITE_V3'),'server dashboard must not use the old local progress cache');
ok(!dashboardServer.includes('getDoc('),'server dashboard must not fall back to cached getDoc reads');
ok(!dashboardServer.includes('getDocs('),'server dashboard must not fall back to cached getDocs reads');

console.log('Cloud-authoritative progress v2, L7/L8 bridge and server-only dashboard safety contract passed.');
