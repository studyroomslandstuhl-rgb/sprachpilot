const PATH=String(location.pathname||"");
const MATCH=PATH.match(/\/wortschatz\/(A\d-Lektion-(\d+))\/(Thema-(\d+))\//i);
const IS_EXAM=/\/pruefung\.html$/i.test(PATH);
const STORE_PREFIX="SP_EXAM_UNLOCK_FIX_";
function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"item"}
function unlockKey(){if(!MATCH)return"";return `SP_EXAM_UNLOCKED_L${MATCH[2]}_T${MATCH[4]}`}
function readJson(k,f=null){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function writeJson(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function topicMatches(key,t){if(!MATCH||!t)return false;const lesson=String(t.lesson||t.lektion||"").replace(/\D+/g,"");const theme=String(t.theme||t.thema||"").replace(/\D+/g,"");if(lesson===MATCH[2]&&theme===MATCH[4])return true;const k=cleanId(key);return k.includes(`lektion-${MATCH[2]}`)&&k.includes(`thema-${MATCH[4]}`)}
function isTaskComplete(t){return !!(t&&(t.completed===true||clamp(t.percent)>=100||Number(t.done||0)>=Number(t.total||1)&&Number(t.total||0)>0))}
function findTopic(progress){const mod=progress&&progress.wortschatz||{};for(const [key,t] of Object.entries(mod)){if(topicMatches(key,t))return{key,t}}return null}
function completeFilesFromTopic(topic){const tasks=topic&&topic.tasks||{};const out={};Object.values(tasks).forEach(t=>{const file=String(t.file||t.key||t.taskKey||"");if(!file||/pruefung\.html$/i.test(file))return;if(isTaskComplete(t))out[file]={total:Number(t.total||t.done||100)||100,done:Number(t.done||t.total||100)||100,percent:100};});return out}
function topicAllowsExam(topic){if(!topic)return false;const files=completeFilesFromTopic(topic);const nonExam=Object.keys(files);if(nonExam.length>0){const allKnown=Object.values(topic.tasks||{}).filter(t=>!String(t.file||t.key||"").includes("pruefung"));return allKnown.length>0&&allKnown.every(isTaskComplete)}
const taskPercent=clamp(topic.taskPercent||topic.current&&topic.current.taskPercent||topic.current&&topic.current.percent||topic.progressPercent||0);const completed=Number(topic.completedTasks||topic.current&&topic.current.completedTasks||0);const total=Number(topic.totalTasks||topic.current&&topic.current.totalTasks||0);return taskPercent>=100||(total>0&&completed>=total)}
function currentStateKeys(file){const keys=[];try{if(typeof window.spTaskStateKey==="function")keys.push(window.spTaskStateKey(file))}catch(e){}
try{if(typeof window.taskKey==="function")keys.push(window.taskKey(file))}catch(e){}
try{if(window.CFG&&window.CFG.key)keys.push(window.CFG.key+"_"+file)}catch(e){}
try{if(window.SP_L5_THEME){const theme=String((window.SP_L5_THEME.id||"Thema-1").match(/\d+/)?.[0]||"1");keys.push((window.SP_L5_THEME.key||`SP_L5_T${theme}_V1`)+"_"+file)}}catch(e){}
try{if(typeof window.KEY==="string")keys.push(window.KEY+"_"+file)}catch(e){}
return [...new Set(keys.filter(Boolean))]}
function seedLocalCompletion(file,total){total=Number(total||100)||100;const st={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false};currentStateKeys(file).forEach(k=>writeJson(k,st))}
function patchPercentReaders(files){if(window.__SP_EXAM_UNLOCK_PATCHED)return;window.__SP_EXAM_UNLOCK_PATCHED=true;const done=file=>!!files[String(file||"")];
if(typeof window.pctFor==="function"){const old=window.pctFor;window.pctFor=function(file,total){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p}}
if(typeof window.pct==="function"){const old=window.pct;window.pct=function(file,total){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p}}
if(typeof window.taskPercent==="function"){const old=window.taskPercent;window.taskPercent=function(file){const p=Number(old.apply(this,arguments)||0);return done(file)?Math.max(p,100):p}}
if(typeof window.isExamUnlocked==="function"){const old=window.isExamUnlocked;window.isExamUnlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)}}
if(typeof window.spL3ExamUnlocked==="function"){const old=window.spL3ExamUnlocked;window.spL3ExamUnlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)}}
if(typeof window.unlocked==="function"){const old=window.unlocked;window.unlocked=function(){return localStorage.getItem(unlockKey())==="1"||old.apply(this,arguments)}}}
function rerenderOrReload(){try{if(typeof window.renderPage==="function")window.renderPage()}catch(e){}try{if(typeof window.renderMenu==="function")window.renderMenu()}catch(e){}try{if(typeof window.render==="function")window.render()}catch(e){}try{if(typeof window.show==="function")window.show()}catch(e){}
if(IS_EXAM&&sessionStorage.getItem(STORE_PREFIX+PATH)!=="1"){sessionStorage.setItem(STORE_PREFIX+PATH,"1");setTimeout(()=>location.reload(),150)}}
async function run(){if(!MATCH)return;try{const mod=await import('/js/progress.js?v=10');const progress=await mod.loadCurrentStudentProgress();const found=findTopic(progress);if(!found||!topicAllowsExam(found.t))return;const files=completeFilesFromTopic(found.t);localStorage.setItem(unlockKey(),"1");Object.entries(files).forEach(([file,info])=>seedLocalCompletion(file,info.total));patchPercentReaders(files);rerenderOrReload()}catch(e){console.warn('Pruefungsfreigabe konnte nicht aus Firebase geprueft werden',e)}}
function patchFromLocalFlag(){if(!MATCH||localStorage.getItem(unlockKey())!=="1")return;patchPercentReaders({});}
patchFromLocalFlag();
setTimeout(run,250);
setTimeout(run,1400);
