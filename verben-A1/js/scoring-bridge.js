(function(){
  const INFO={moduleKey:'verben',scope:'verben-a1',title:'Verben A1',lesson:'',theme:''};
  const SKILLS=['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren'];
  function teacher(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();const p=profile();return r==='teacher'||r==='lehrer'||p.teacherPreview===true||p.isTeacher===true||p.role==='teacher'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
  function run(){try{return window.SprachPilotScoring&&SprachPilotScoring.currentRun?SprachPilotScoring.currentRun(INFO.scope):Number(localStorage.getItem('SP_SCORE_RUN_'+INFO.scope)||1)||1}catch(e){return 1}}
  function pointsForRun(){const r=run();if(r===1)return 5;if(r===2)return 10;if(r===3)return 15;return 1}
  function skillName(skill){try{return typeof skillKey==='function'?skillKey(skill):skill}catch(e){return skill}}
  function rewardKey(skill){return 'SP_VERBEN_A1_REWARD_'+skill+'_RUN_'+run()}
  function pendingKey(){return 'SP_VERBEN_A1_PENDING_REWARDS'}
  function pending(){try{return JSON.parse(localStorage.getItem(pendingKey())||'[]')||[]}catch(e){return []}}
  function savePending(list){try{localStorage.setItem(pendingKey(),JSON.stringify([...new Set((list||[]).filter(Boolean))]))}catch(e){}}
  function queue(skill){if(teacher())return;const sk=skillName(skill);if(!sk)return;const list=pending();if(!list.includes(sk))list.push(sk);savePending(list)}
  function ready(){return !!(window.SprachPilotScoring&&SprachPilotScoring.awardTask)}
  function taskIsDone(skill){try{return typeof taskDone==='function'&&taskDone(skillName(skill))}catch(e){return false}}
  function safeJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch(e){return fallback}}
  function profile(){return safeJson('SP_USER_PROFILE',safeJson('SP_STUDENT_PROFILE',{}))||{}}
  function studentId(){const p=profile();return p.studentId||p.userId||p.docId||localStorage.getItem('SP_STUDENT_ID')||''}
  function studentName(){const p=profile();return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
  function course(){const p=profile();return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem('SP_COURSE_CODE')||''}
  function number(x){const n=Number(x);return Number.isFinite(n)?n:0}
  function bestTotal(d){return Math.max(number(d&&d.lifetimePoints),number(d&&d.pointsTotal),number(d&&d.punkteGesamt),number(d&&d.totals&&d.totals.points),number(localStorage.getItem('SP_POINTS_TOTAL')))}
  async function directAward(skill){
    if(teacher())return 0;
    const sk=skillName(skill);if(!sk||localStorage.getItem(rewardKey(sk))==='1')return 0;
    const delta=pointsForRun();
    const localNow=number(localStorage.getItem('SP_POINTS_TOTAL'));
    const sid=studentId();
    if(!sid||!window.db){localStorage.setItem('SP_POINTS_TOTAL',String(localNow+delta));localStorage.setItem(rewardKey(sk),'1');return delta;}
    try{
      const ref=db.collection('progress').doc(sid);
      const snap=await ref.get();
      const old=snap.exists?(snap.data()||{}):{};
      const oldTotal=bestTotal(old);
      const nextTotal=oldTotal+delta;
      const oldVerben=old.verben||{};
      const topic=oldVerben[INFO.scope]||{};
      const life=topic.lifetime||{};
      const taskRuns=life.taskPointRuns||{};
      const byRun=taskRuns[sk]||{};
      if(byRun[String(run())]){localStorage.setItem(rewardKey(sk),'1');localStorage.setItem('SP_POINTS_TOTAL',String(oldTotal));return 0;}
      byRun[String(run())]=delta;
      taskRuns[sk]=byRun;
      const tasks=topic.tasks||{};
      tasks[sk]={...(tasks[sk]||{}),key:sk,file:sk+'.html',title:(window.VERB_SKILL_LABELS&&VERB_SKILL_LABELS[sk])||sk,percent:100,completed:true,completedAt:(tasks[sk]&&tasks[sk].completedAt)||new Date().toISOString(),points:number(tasks[sk]&&tasks[sk].points)+delta,pointsByRun:byRun,run:run()};
      const nextVerben={...oldVerben,[INFO.scope]:{...topic,title:'Verben A1',moduleTitle:'verben',level:'A1',tasks,lifetime:{...life,points:number(life.points)+delta,taskPointRuns:taskRuns,resets:Math.max(number(life.resets),run()-1)},completedTasks:Object.values(tasks).filter(t=>t&&t.completed).length,totalTasks:Object.keys(tasks).length,progressPercent:topic.progressPercent||0,current:{percent:topic.progressPercent||0,updatedAt:new Date().toISOString()}}};
      await ref.set({studentId:sid,userId:sid,studentName:studentName(),kurs:course(),verben:nextVerben,lifetimePoints:nextTotal,pointsTotal:nextTotal,punkteGesamt:nextTotal,totals:{...(old.totals||{}),points:nextTotal,updatedAt:new Date().toISOString()},lastPage:location.pathname,lastActiveAt:new Date().toISOString(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      localStorage.setItem('SP_POINTS_TOTAL',String(nextTotal));
      localStorage.setItem(rewardKey(sk),'1');
      return delta;
    }catch(e){console.warn('Direkte Verben-Punkte-Sicherung fehlgeschlagen',e);queue(sk);return 0;}
  }
  function markTask(skill){
    if(teacher())return;
    const sk=skillName(skill);
    if(!sk)return;
    if(!taskIsDone(sk))return;
    if(localStorage.getItem(rewardKey(sk))==='1')return;
    if(ready()){
      try{
        SprachPilotScoring.awardTask(sk+'.html',{info:INFO,title:(window.VERB_SKILL_LABELS&&VERB_SKILL_LABELS[sk])||sk}).then(delta=>{
          if(delta>0){localStorage.setItem(rewardKey(sk),'1');const list=pending().filter(x=>x!==sk);savePending(list);if(typeof renderHome==='function'&&window.state&&state.phase==='home')setTimeout(renderHome,50)}
          else directAward(sk).then(d=>{if(d>0&&typeof renderHome==='function'&&window.state&&state.phase==='home')setTimeout(renderHome,50)});
        }).catch(()=>{directAward(sk)});
        return;
      }catch(e){console.warn('Verben Aufgabe Punkte Fehler',e)}
    }
    directAward(sk);
  }
  function allowedVerbs(){try{return typeof window.spStrictReleasedVerbList==='function'?window.spStrictReleasedVerbList():[]}catch(e){return []}}
  function patchVerbOverview(){if(typeof window.renderVerbOverview!=='function'||window.renderVerbOverview.__releaseView)return;window.renderVerbOverview=function(){try{if(typeof clearVerbHash==='function')clearVerbHash(true)}catch(e){}const app=document.getElementById('app');if(!app)return;if(window.state)state.phase='home';try{if(typeof spSyncVerbRelease==='function')spSyncVerbRelease()}catch(e){}const allowed=allowedVerbs();const A=new Set(allowed);const learned=new Set([...(state.learned||[]),...(state.known||[])].filter(v=>A.has(v)));const active=[...(state.active||[]),...(state.unsure||[]),...(state.unknown||[])].filter(v=>A.has(v)&&!learned.has(v));const AS=new Set(active);const neu=allowed.filter(v=>!learned.has(v)&&!AS.has(v));let html='<section class="card"><h2>Verben-Übersicht</h2><p class="small">Nur die für deinen Kurs freigegebenen Verben.</p>';if(typeof verbOverviewDetails==='function'){html+=verbOverviewDetails('Aktive Verben · gerade lernen',active,true,'Diese Verben sind aktuell offen.');html+=verbOverviewDetails('Gelernt / ich kann',[...learned],false,'Diese Verben kannst du schon.');html+=verbOverviewDetails('Noch nicht gelernt',neu,false,'Diese Verben sind freigegeben, aber noch nicht gelernt.')}else{html+='<p class="small">Freigegeben: '+allowed.join(', ')+'</p>'}html+='<div class="actions"><button class="btn secondary" onclick="renderHome()">Zur Aufgabenübersicht</button></div></section>';app.classList.remove('card');app.innerHTML=html;try{saveState();renderAndHydrate()}catch(e){}};window.renderVerbOverview.__releaseView=true}
  function scanDoneTasks(){if(teacher())return;SKILLS.forEach(markTask);pending().forEach(markTask)}
  function ensureScoringLoaded(){if(ready())return;try{import('/js/scoring.js?v=4').then(()=>setTimeout(scanDoneTasks,100)).catch(()=>{})}catch(e){}}
  function patchFinish(){if(typeof window.finishQueuedVerb==='function'&&!window.finishQueuedVerb.__spScoring){const old=window.finishQueuedVerb;window.finishQueuedVerb=function(skill,v,good){const out=old.apply(this,arguments);if(good!==false){const sk=skillName(skill);setTimeout(()=>markTask(sk),0);setTimeout(()=>markTask(sk),300);setTimeout(()=>markTask(sk),1200)}return out};window.finishQueuedVerb.__spScoring=true}}
  function patchSaveState(){if(typeof window.saveState==='function'&&!window.saveState.__spScoringScan){const old=window.saveState;window.saveState=function(){const out=old.apply(this,arguments);setTimeout(scanDoneTasks,50);return out};window.saveState.__spScoringScan=true}}
  function patchExam(){if(typeof window.renderVerbExamResult==='function'&&!window.renderVerbExamResult.__spScoring){const old=window.renderVerbExamResult;window.renderVerbExamResult=function(){const out=old.apply(this,arguments);try{if(!teacher()){const ex=window.state&&state.exam?state.exam:{};const percent=Number(ex.score||0);if(window.SprachPilotScoring&&SprachPilotScoring.awardExam)SprachPilotScoring.awardExam({percent,score:percent},{info:INFO})}}catch(e){console.warn('Verben Prüfung Punkte Fehler',e)}return out};window.renderVerbExamResult.__spScoring=true}}
  function patchReset(){if(typeof window.resetCurrentPackage==='function'&&!window.resetCurrentPackage.__spScoring){window.resetCurrentPackage=function(){if(!confirm('Alle Verben wieder auf „nicht eingeschätzt“ setzen? Punkte bleiben erhalten.'))return;const finishLocalReset=()=>{try{if(typeof migrateState==='function')migrateState();if(typeof resetAllVerbProgressKeepPoints==='function')resetAllVerbProgressKeepPoints();if(typeof saveState==='function')saveState();if(typeof renderHome==='function')renderHome()}catch(e){console.warn('Verben Reset Fehler',e)}};if(window.SprachPilotScoring&&SprachPilotScoring.resetScope){SprachPilotScoring.resetScope(INFO).finally(finishLocalReset)}else{finishLocalReset()}};window.resetCurrentPackage.__spScoring=true}}
  function patchAll(){ensureScoringLoaded();patchFinish();patchSaveState();patchExam();patchReset();patchVerbOverview();scanDoneTasks()}
  patchAll();document.addEventListener('DOMContentLoaded',patchAll);setTimeout(patchAll,100);setTimeout(patchAll,500);setTimeout(patchAll,1500);setInterval(()=>{ensureScoringLoaded();patchVerbOverview();scanDoneTasks()},3000);
  window.spVerbScoreScan=scanDoneTasks;
})();