(function(root){
  'use strict';
  if(root.StudentSecurityLookupDetails)return;

  function text(value){return String(value==null?'':value).trim()}
  function emailOf(student={}){return text(student.email||student.authEmail).toLowerCase()}
  function courseOf(student={}){return text(student.courseCode||student.kurs||student.kursnummer||student.courseDocId||student.course)}
  function nameOf(student={}){
    const direct=text(student.name||student.displayName);
    if(direct)return direct;
    return [student.vorname,student.nachname].map(text).filter(Boolean).join(' ')||'—';
  }
  function reasonText(item={}){
    if(item.reason==='EMAIL_MISSING')return 'E-Mail fehlt';
    if(item.reason==='COURSE_MISSING')return 'Kurs fehlt';
    if(item.key)return 'Lookup fehlt: '+text(item.key);
    return text(item.reason||'Lookup fehlt/ungültig');
  }
  function formatRow(item={},student={}){
    const id=text(item.studentId||student.__docId||student.id)||'—';
    return `${id}\n  Name: ${nameOf(student)}\n  E-Mail: ${emailOf(student)||'—'}\n  Kurs: ${courseOf(student)||'—'}\n  Problem: ${reasonText(item)}`;
  }
  function formatDetails(rows=[]){
    return rows.map((row,index)=>`${index+1}. ${formatRow(row.item,row.student)}`).join('\n\n');
  }

  async function enrichMissing(missing=[]){
    if(!Array.isArray(missing)||!missing.length)return[];
    let database=null;
    try{database=firebase.firestore()}catch(e){return missing.map(item=>({item,student:{}}))}
    return Promise.all(missing.map(async item=>{
      const id=text(item?.studentId);
      if(!id)return{item,student:{}};
      try{
        const snap=await database.collection('students').doc(id).get();
        return{item,student:snap.exists?{...(snap.data()||{}),__docId:snap.id}:{__docId:id}};
      }catch(e){
        return{item,student:{__docId:id}};
      }
    }));
  }

  async function appendFailureDetails(){
    const state=root.SP_STUDENT_LOOKUP_MIGRATION;
    if(!state||state.ok!==false||!Array.isArray(state.missing)||!state.missing.length)return;
    const rows=await enrichMissing(state.missing);
    const details=formatDetails(rows);
    const box=typeof document!=='undefined'?document.getElementById('sp-security-lookup-result'):null;
    if(!box||!details)return;
    const base=`Sicherheitsmigration NICHT bereit.\nFehler: ${state.error?.message||state.error||'LOOKUP_VERIFICATION_FAILED'}\nKollisionen: ${Array.isArray(state.collisions)?state.collisions.length:0}\nFehlend/ungültig: ${state.missing.length}\n\nDETAILS DER BETROFFENEN SCHÜLER:\n${details}\n\nEs wurde kein sicherer Cutover freigegeben.`;
    box.textContent=base;
  }

  function install(){
    const lookup=root.StudentSecurityLookup;
    if(!lookup||lookup.__missingDetailsV1)return false;
    const originalRunUi=lookup.runUi;
    if(typeof originalRunUi!=='function')return false;
    lookup.runUi=async function(...args){
      const result=await originalRunUi.apply(this,args);
      await appendFailureDetails();
      return result;
    };
    lookup.__missingDetailsV1=true;
    return true;
  }

  root.StudentSecurityLookupDetails={text,emailOf,courseOf,nameOf,reasonText,formatRow,formatDetails,enrichMissing,appendFailureDetails,install};
  if(typeof document!=='undefined'){
    if(!install())setTimeout(install,0);
  }
})(typeof window!=='undefined'?window:globalThis);
