(function(){'use strict';
const clean=v=>String(v||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'');
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function preview(){
 const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 const context=String(localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
 const p=profile();
 const explicitPreview=p.previewOnly===true||p.teacherPreview===true||p.studentCoursePreview===true;
 if(['student','schueler','schüler'].includes(r)&&context!=='teacher-student-preview'&&!explicitPreview)return false;
 if(['teacher','lehrer','admin','owner'].includes(r))return true;
 if(context!=='teacher-student-preview'||!explicitPreview)return false;
 return !!(sessionStorage.getItem('SP_TEACHER_PREVIEW')||localStorage.getItem('SP_TEACHER_PREVIEW'))
}
function pid(){const p=profile();return clean(p.uid||p.userId||p.id||p.email||[p.kurs||p.kursnummer||p.courseCode,p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_'))||'student'}
const key=(theme,task)=>`${preview()?'SP_L8_PREVIEW':'SP_L8'}_${pid()}_T${theme}_${task}`;
function blank(total){return{total,done:[],review:{},tries:{},firstSeen:[],firstCorrect:0,answers:{},updatedAt:new Date().toISOString()}}
function load(theme,task,total){try{const x=JSON.parse(localStorage.getItem(key(theme,task))||'null');if(x&&x.total===total)return{...blank(total),...x,review:x.review||{},tries:x.tries||{}}}catch(e){}return blank(total)}
function save(theme,task,s){s.updatedAt=new Date().toISOString();if(!preview())localStorage.setItem(key(theme,task),JSON.stringify(s));try{window.L8ThemeScore?.recordState?.(theme,task,s)}catch(e){}return s}
function first(s,index,ok){if(!s.firstSeen.includes(index)){s.firstSeen.push(index);if(ok)s.firstCorrect++}}
function wrong(theme,task,total,index,answer){const s=load(theme,task,total);first(s,index,false);s.answers[index]=answer;s.tries[index]=Number(s.tries[index]||0)+1;if(!s.review[index])s.review[index]=1;save(theme,task,s);return{s,tries:s.tries[index]}}
function right(theme,task,total,index,answer){const s=load(theme,task,total);first(s,index,true);s.answers[index]=answer;const stage=Number(s.review[index]||0);if(stage===1){s.review[index]=2;s.tries[index]=0}else{if(stage===2)delete s.review[index];if(!s.done.includes(index))s.done.push(index);s.tries[index]=0}save(theme,task,s);return{s,needsReview:stage===1}}
function completeFree(theme,task,total,index,text){const s=load(theme,task,total);first(s,index,true);s.answers[index]=text;if(!s.done.includes(index))s.done.push(index);save(theme,task,s);return s}
function doneCount(theme,task,total){const s=load(theme,task,total);return new Set((s.done||[]).filter(i=>Number.isInteger(Number(i))&&Number(i)>=0&&Number(i)<total).map(Number)).size}
function pct(theme,task,total){if(!total)return 0;const done=doneCount(theme,task,total);if(done>=total)return 100;return Math.min(99,Math.round(done/total*100))}
function allDone(theme){const T=window.L8_THEME;if(!T)return false;if(preview())return true;return T.tasks.filter(t=>!t.exam).every(t=>{const total=Array.isArray(t.items)?t.items.length:0;return total<=0||doneCount(theme,t.id,total)>=total})}
function reset(theme){if(preview()){alert('In der Lehrer-Vorschau werden keine Teilnehmerfortschritte gespeichert.');return}if(!confirm(`Fortschritte in Lektion 8 · Thema ${theme} löschen? Bereits verdiente Punkte bleiben erhalten.`))return;const prefix=`SP_L8_${pid()}_T${theme}_`,del=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||'';if(k.startsWith(prefix))del.push(k)}del.forEach(k=>localStorage.removeItem(k));location.href='index.html?reset='+Date.now()}
function norm(v){return String(v??'').trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function equal(answer,expected){const a=norm(answer);return(Array.isArray(expected)?expected:[expected]).some(x=>norm(x)===a)}
function say(text,audioFile){if(audioFile){const a=new Audio(`https://sprachpilot.b-cdn.net/audio/${audioFile}`);a.onerror=()=>tts(text);a.play().catch(()=>tts(text));return}tts(text)}
function tts(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
window.L8S={profile,preview,pid,key,load,save,wrong,right,completeFree,pct,allDone,reset,norm,equal,say};
})();