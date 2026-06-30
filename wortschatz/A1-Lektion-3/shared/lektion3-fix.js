(function(){
  const path=String(location.pathname||"");
  const m=path.match(/A1-Lektion-3\/Thema-(\d+)/i)||path.match(/lektion-3\/thema-(\d+)/i);
  const themeNo=m?m[1]:"0";
  const topicId=`wortschatz-a1-lektion-3-thema-${themeNo}`;
  const topicTitle=`A1 Lektion 3 · Thema ${themeNo}`;
  const runKey=`SP_L3_T${themeNo}_POINT_RUN`;
  const clean=s=>String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item";
  const num=v=>Number.isFinite(Number(v))?Number(v):0;
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
  function currentRun(){let r=Math.round(num(localStorage.getItem(runKey)||1));if(r<1)r=1;return r;}
  function taskPoints(){const r=currentRun();return r===1?5:r===2?10:r===3?15:1;}
  function examPoints(){const r=currentRun();return r===1?100:r===2?200:r===3?300:1;}
  function profile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"{}")}catch(e){return {}}}
  function studentId(p=profile()){return p.studentId||p.userId||p.docId||localStorage.getItem("SP_STUDENT_ID")||clean((p.kurs||p.kursnummer||p.courseCode||"")+"_"+(p.email||p.vorname||"student"));}
  function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||"";}
  function studentName(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in";}
  function isTeacherPreview(){try{const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const prev=JSON.parse(sessionStorage.getItem("SP_TEACHER_PREVIEW")||"null");return role==="teacher"&&prev&&prev.teacherPreview===true;}catch(e){return false;}}
  function addLocalPoints(delta){
    delta=Math.max(0,Math.round(num(delta)));if(!delta)return;
    const total=num(localStorage.getItem("SP_POINTS_TOTAL"))+delta;
    localStorage.setItem("SP_POINTS_TOTAL",String(total));
    const c=course();let by={};try{by=JSON.parse(localStorage.getItem("SP_POINTS_BY_COURSE")||"{}")}catch(e){by={}}
    if(c){by[c]=num(by[c])+delta;localStorage.setItem("SP_POINTS_BY_COURSE",JSON.stringify(by));}
  }
  async function writeProgress(delta,kind,file,extra={}){
    delta=Math.max(0,Math.round(num(delta)));if(!delta||isTeacherPreview())return;
    try{
      const [{db,doc,getDoc,setDoc,serverTimestamp}]=await Promise.all([import("/js/firebase.js")]);
      const p=profile();const sid=studentId(p);if(!sid)return;
      const ref=doc(db,"progress",sid);const snap=await getDoc(ref);const data=snap.exists()?snap.data():{};
      const mod={...(data.wortschatz||{})};const topic={...(mod[topicId]||{})};
      const tasks={...(topic.tasks||{})};const exam={...(topic.exam||{})};const lifetime={...(topic.lifetime||{})};
      if(kind==="task"){
        const key=clean(file);const old=tasks[key]||{};
        tasks[key]={...old,key,file,title:file.replace(".html",""),percent:100,completed:true,completedAt:old.completedAt||new Date().toISOString(),points:num(old.points)+delta,run:currentRun()};
      }
      if(kind==="exam"){
        const percent=clamp(extra.percent||100,0,100);const maxScore=examPoints();const score=Math.round(maxScore*percent/100);
        const oldBest=num(exam.bestScore);const better=score>oldBest;
        exam.attempted=true;exam.unlocked=true;exam.attempts=num(exam.attempts)+1;exam.lastScore=score;exam.lastPercent=percent;exam.maxScore=maxScore;exam.lastAttemptAt=new Date().toISOString();
        exam.bestScore=better?score:oldBest;exam.bestPercent=better?percent:num(exam.bestPercent);exam.stars=percent>=100?3:percent>=70?2:percent>=50?1:0;
      }
      lifetime.points=num(lifetime.points)+delta;
      lifetime.resets=Math.max(num(lifetime.resets),currentRun()-1);
      topic.title=topic.title||topicTitle;topic.moduleTitle="Wortschatz";topic.level="A1";topic.lesson="3";topic.theme=themeNo;
      topic.tasks=tasks;topic.exam=exam;topic.examUnlocked=true;topic.lifetime=lifetime;
      const vals=Object.values(tasks);topic.completedTasks=vals.filter(t=>t&&t.completed).length;topic.totalTasks=Math.max(num(topic.totalTasks),vals.length);topic.progressPercent=vals.length?Math.round(vals.reduce((s,t)=>s+num(t.percent),0)/vals.length):num(topic.progressPercent);
      topic.current={percent:topic.progressPercent,completedTasks:topic.completedTasks,totalTasks:topic.totalTasks,updatedAt:new Date().toISOString()};
      mod[topicId]=topic;
      const oldTotal=Math.max(num(data.lifetimePoints),num(data.pointsTotal),num(data.punkteGesamt),num(data.totals&&data.totals.points));
      const nextTotal=oldTotal+delta;
      const totals={...(data.totals||{}),points:nextTotal,updatedAt:new Date().toISOString()};
      await setDoc(ref,{...data,wortschatz:mod,studentId:sid,userId:sid,kurs:course(p),studentName:studentName(p),email:p.email||data.email||"",muttersprache:p.muttersprache||p.motherLanguage||data.muttersprache||"",lifetimePoints:nextTotal,pointsTotal:nextTotal,punkteGesamt:nextTotal,totals,lastActive:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});
    }catch(e){console.warn("L3 Punkte konnten nicht synchronisiert werden",e);}
  }
  function awardTask(file){
    if(!file||/pruefung/i.test(file))return awardExam(100);
    const key=`SP_L3_T${themeNo}_AWARDED_RUN_${currentRun()}_TASK_${file}`;
    if(localStorage.getItem(key)==="1")return;
    localStorage.setItem(key,"1");const p=taskPoints();addLocalPoints(p);writeProgress(p,"task",file);
  }
  function awardExam(percent){
    percent=clamp(percent||100,0,100);const max=examPoints();const score=Math.round(max*percent/100);
    const key=`SP_L3_T${themeNo}_EXAM_BEST_RUN_${currentRun()}`;const old=num(localStorage.getItem(key));const delta=Math.max(0,score-old);
    if(!delta)return;localStorage.setItem(key,String(score));addLocalPoints(delta);writeProgress(delta,"exam","pruefung.html",{percent});
  }
  window.spL3AwardTask=awardTask;window.spL3AwardExam=awardExam;
  if(typeof window.complete==="function"&&!window.complete.__l3fixed){const old=window.complete;window.complete=function(area,file,next){if(/pruefung/i.test(String(file||"")))awardExam(100);else awardTask(file);return old.apply(this,arguments)};window.complete.__l3fixed=true;}
  if(typeof window.spMarkRight==="function"&&!window.spMarkRight.__l3fixed){const old=window.spMarkRight;window.spMarkRight=function(file,total){const done=old.apply(this,arguments);if(done)awardTask(file);return done};window.spMarkRight.__l3fixed=true;}
  window.done=function(file,total){try{total=total||((typeof WORDS!=="undefined"&&WORDS.length)||1);const st={total,queue:[],done:[...Array(total).keys()],current:null,tries:0};if(typeof spTaskStateKey==="function")localStorage.setItem(spTaskStateKey(file),JSON.stringify(st));else localStorage.setItem("SP_TASK_STATE_"+file,JSON.stringify(st));awardTask(file);}catch(e){}}
  const oldReset=window.resetThemeProgress;
  window.resetThemeProgress=function(){
    if(!confirm("Fortschritte für dieses Thema wirklich löschen? Punkte bleiben erhalten."))return;
    const nextRun=Math.max(1,currentRun()+1);localStorage.setItem(runKey,String(nextRun));
    try{if(typeof KEY!=="undefined")localStorage.removeItem(KEY)}catch(e){}
    Object.keys(localStorage).forEach(k=>{if(k.startsWith("SP_TASK_STATE_")||k.startsWith(`SP_L3_T${themeNo}_EXAM_STATE_`))localStorage.removeItem(k)});
    writeProgress(0,"reset","",{run:nextRun});
    setTimeout(()=>{location.href="index.html"},250);
  };
  function preferredLang(){try{const p=profile();const visible=p.muttersprache||p.motherLanguage||localStorage.getItem("muttersprache")||"Russisch";const code=localStorage.getItem("SP_MOTHER_LANGUAGE_CODE")||localStorage.getItem("motherLanguage")||"";const map={sq:"Albanisch",am:"Amharisch",ar:"Arabisch",hy:"Armenisch",az:"Aserbaidschanisch",bn:"Bengalisch",bs:"Bosnisch",bg:"Bulgarisch",zh:"Chinesisch",fa:"Farsi/Persisch",prs:"Dari",de:"Deutsch",en:"Englisch",fr:"Französisch",ka:"Georgisch",el:"Griechisch",hi:"Hindi",it:"Italienisch",ja:"Japanisch",kk:"Kasachisch",hr:"Kroatisch",ku:"Kurdisch",ps:"Paschtu",pl:"Polnisch",pt:"Portugiesisch",ro:"Rumänisch",ru:"Russisch",sr:"Serbisch",so:"Somali",es:"Spanisch",ta:"Tamil",th:"Thai",ti:"Tigrinya",cs:"Tschechisch",tr:"Türkisch",uk:"Ukrainisch",hu:"Ungarisch",ur:"Urdu",uz:"Usbekisch",vi:"Vietnamesisch"};return map[String(code).toLowerCase()]||visible||"Russisch";}catch(e){return "Russisch"}}
  window.spL3PreferredLang=preferredLang;
  window.lang=preferredLang;
  function normalizePrice(s){return String(s||"").toLowerCase().trim().replace(/€/g," euro ").replace(/[.]/g,",").replace(/\s+/g," ").replace(/[!?]/g,"").trim()}
  window.spL3AcceptPrice=function(ans,price){const a=normalizePrice(ans);const p=String(price||"").replace("€","").trim();const parts=p.split(",");const e=parseInt(parts[0]||"0",10);const c=parseInt((parts[1]||"00").padEnd(2,"0"),10);const list=[p,`${p} euro`,`${e},${String(c).padStart(2,"0")}`,`${e} euro ${c}`,`${e} euro ${c} cent`,`${e} ${c}`];if(e===0){list.push(`${c} cent`,`null euro ${c}`)}return list.map(normalizePrice).some(x=>a===x||a.includes(x));}
  window.priceVariants=function(price){return [String(price||"")];}
  window.acceptablePriceSentence=function(ans,price){const a=String(ans||"").toLowerCase();return (a.includes("kostet")||a.includes("macht")||a.includes("preis"))&&window.spL3AcceptPrice(ans,price)};
  window.startMic=function(btn,callback){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const status=document.getElementById("micStatus");
    if(!SR){if(status)status.textContent="Mikrofon wird auf diesem Gerät/Browser nicht unterstützt. Bitte schreibe oder nutze den Ersatz-Button.";return;}
    try{const rec=new SR();rec.lang="de-DE";rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=1;if(btn)btn.classList.add("active");if(status)status.textContent="Ich höre zu …";rec.onresult=e=>{const txt=e.results&&e.results[0]&&e.results[0][0]?e.results[0][0].transcript:"";if(status)status.textContent="Gehört: "+txt;if(callback)callback(txt,"result")};rec.onerror=e=>{if(status)status.textContent="Mikrofon hat nicht funktioniert. Bitte schreibe oder nutze den Ersatz-Button."};rec.onend=()=>{if(btn)btn.classList.remove("active")};rec.start();}catch(e){if(status)status.textContent="Mikrofon konnte nicht gestartet werden. Bitte schreibe oder nutze den Ersatz-Button.";}
  };
})();
