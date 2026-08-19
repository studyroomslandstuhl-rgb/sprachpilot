(function(root){
  'use strict';
  if(root.OneTimeDuplicateIncidentCore)return;

  const VERSION=1;
  const GROUPS=[
    {
      key:'alona-vakulenko-b174698',name:'Alona Vakulenko',canonicalId:'b174698_alona_vakulenko_1996-12-06',
      duplicateStudentIds:['a1_alona_vakulenko_1996-12-06','kurs_student'],backupGroupKey:'alona-vakulenko-b174698',useRepairBackups:true,
      profiles:[
        {profileId:'b174698_alona_vakulenko_1996-12-06',memberProgressIds:['b174698_alona_vakulenko_1996-12-06'],allowMissing:true},
        {profileId:'a1_alona_vakulenko_1996-12-06',memberProgressIds:['a1_alona_vakulenko_1996-12-06']},
        {profileId:'kurs_student',memberProgressIds:['kurs_student']}
      ]
    },
    {
      key:'shilan-mohamad-b174698',name:'Shilan Mohamad',canonicalId:'B174698_shilan_mohamad_1999-01-24',
      duplicateStudentIds:['z-b-a1-07_shilan_mohamad_1999-01-24'],backupGroupKey:'shilan-mohamad-b174698',useRepairBackups:true,
      profiles:[
        {profileId:'B174698_shilan_mohamad_1999-01-24',memberProgressIds:['B174698_shilan_mohamad_1999-01-24','b174698-shilan-mohammad1010-gmail-com']},
        {profileId:'z-b-a1-07_shilan_mohamad_1999-01-24',memberProgressIds:['z-b-a1-07_shilan_mohamad_1999-01-24']}
      ]
    },
    {
      key:'vlad-nemohushchyi-b174698',name:'Vlad Nemohushchyi',canonicalId:'b174698_777vonychka777-gmail-com',
      duplicateStudentIds:['b174698_vlad_nemohushchyi'],backupGroupKey:'',useRepairBackups:false,
      profiles:[
        {profileId:'b174698_777vonychka777-gmail-com',memberProgressIds:['b174698_777vonychka777-gmail-com','b174698-777vonychka777-gmail-com']},
        {profileId:'b174698_vlad_nemohushchyi',memberProgressIds:['b174698_vlad_nemohushchyi']}
      ]
    }
  ];

  function text(v){return String(v==null?'':v).trim()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function progressId(row={}){return text(row.__docId||row.id)}
  function studentId(row={}){return text(row.__docId||row.canonicalStudentId||row.docId||row.studentId||row.userId||row.id)}
  function stripInternal(data={}){const out={};for(const[k,v]of Object.entries(data||{})){if(!k.startsWith('__'))out[k]=v}return out}
  function positive(v){const n=Number(v);return Number.isFinite(n)&&n>0?n:0}
  function storedPoints(row={}){
    return Math.max(
      positive(row?.ranking?.points),positive(row?.totals?.points),positive(row?.pointsTotal),
      positive(row?.lifetimePoints),positive(row?.punkteGesamt),positive(row?.points)
    );
  }
  function pointValue(row={},recalculator=null){
    const stored=storedPoints(row);if(stored>0)return stored;
    try{return positive(recalculator?.calculate?.(row)?.total)}catch(e){return 0}
  }
  function enrichBackupProgress(doc={}){
    const path=text(doc.path);if(doc.kind!=='progress'||!path.startsWith('progress/'))return null;
    const id=path.slice('progress/'.length);return{...(doc.snapshot||{}),__docId:id,id};
  }
  function repairBackupRows(backups=[],group){
    if(!group.useRepairBackups)return[];
    const candidates=(backups||[]).filter(doc=>doc?.backupType==='student-collision-repair'&&text(doc.groupKey)===group.backupGroupKey&&doc.kind==='progress');
    const byPath=new Map();
    for(const doc of candidates){
      const row=enrichBackupProgress(doc);if(!row)continue;
      const id=progressId(row);if(!byPath.has(id))byPath.set(id,row);
    }
    return [...byPath.values()];
  }
  function currentRowsForGroup(progressRows=[],group){
    const ids=new Set(group.profiles.flatMap(p=>p.memberProgressIds));
    return (progressRows||[]).filter(row=>ids.has(progressId(row))||text(row.canonicalStudentId)===group.canonicalId);
  }
  function sourceRowsForPoints(progressRows=[],backups=[],group){
    const backupRows=repairBackupRows(backups,group);
    if(group.useRepairBackups){
      if(!backupRows.length)throw new Error('INCIDENT_ORIGINAL_BACKUPS_MISSING:'+group.key);
      return backupRows;
    }
    return currentRowsForGroup(progressRows,group);
  }
  function profilePointBreakdown(sourceRows=[],group,recalculator=null){
    const byId=new Map((sourceRows||[]).map(row=>[progressId(row),row]).filter(([id])=>id));
    const breakdown=[];
    for(const profile of group.profiles){
      const rows=profile.memberProgressIds.map(id=>byId.get(id)).filter(Boolean);
      if(!rows.length&&!profile.allowMissing)throw new Error('INCIDENT_PROFILE_PROGRESS_MISSING:'+group.key+':'+profile.profileId);
      const points=rows.reduce((m,row)=>Math.max(m,pointValue(row,recalculator)),0);
      breakdown.push({profileId:profile.profileId,points,memberProgressIds:profile.memberProgressIds.filter(id=>byId.has(id))});
    }
    return breakdown;
  }
  function mergeRows(rows=[],mergeFn){
    if(typeof mergeFn!=='function')throw new Error('INCIDENT_PROGRESS_MERGE_FUNCTION_MISSING');
    let merged={};
    for(const row of rows){merged=mergeFn(merged,{...stripInternal(row),id:progressId(row)});}
    return stripInternal(merged);
  }
  function applyTotalPoints(row={},total=0){
    const points=Math.max(0,Number(total)||0),out={...row};
    out.ranking={...(out.ranking||{}),points};
    out.totals={...(out.totals||{}),points};
    out.pointsTotal=points;out.lifetimePoints=points;out.punkteGesamt=points;out.points=points;
    return out;
  }
  function buildGroupPlan({group,students=[],progressRows=[],backups=[],mergeFn,recalculator=null}){
    const byStudent=new Map((students||[]).map(s=>[studentId(s),s]).filter(([id])=>id));
    const canonicalStudent=byStudent.get(group.canonicalId);
    if(!canonicalStudent)throw new Error('INCIDENT_CANONICAL_STUDENT_MISSING:'+group.canonicalId);
    const currentRows=currentRowsForGroup(progressRows,group);
    const currentCanonical=currentRows.find(row=>progressId(row)===group.canonicalId)||null;
    if(Number(currentCanonical?.oneTimeDuplicateIncidentVersion||0)>=VERSION){
      return{group,alreadyDone:true,canonicalStudent,currentCanonical};
    }
    const pointSourceRows=sourceRowsForPoints(progressRows,backups,group);
    const breakdown=profilePointBreakdown(pointSourceRows,group,recalculator);
    const baseSum=breakdown.reduce((sum,x)=>sum+x.points,0);
    const previousMergeBaseline=pointSourceRows.reduce((m,row)=>Math.max(m,pointValue(row,recalculator)),0);
    const currentCanonicalPoints=pointValue(currentCanonical||{},recalculator);
    const postRepairDelta=group.useRepairBackups?Math.max(0,currentCanonicalPoints-previousMergeBaseline):0;
    const targetPoints=baseSum+postRepairDelta;

    const contentRows=[];const seen=new Set();
    for(const row of [...pointSourceRows,...currentRows]){const id=progressId(row);const key=id+'|'+JSON.stringify(stripInternal(row));if(seen.has(key))continue;seen.add(key);contentRows.push(row)}
    let merged=mergeRows(contentRows,mergeFn);
    if(currentCanonical)merged=mergeFn(merged,{...stripInternal(currentCanonical),id:group.canonicalId});
    merged=applyTotalPoints(stripInternal(merged),targetPoints);
    const sourceIds=uniq([...pointSourceRows.map(progressId),...currentRows.map(progressId)]);
    const aliasIds=uniq([...(Array.isArray(canonicalStudent.aliasIds)?canonicalStudent.aliasIds:[]),...group.duplicateStudentIds,...sourceIds]).filter(id=>id!==group.canonicalId);
    merged.canonicalStudentId=group.canonicalId;merged.docId=group.canonicalId;merged.studentId=group.canonicalId;merged.userId=group.canonicalId;
    merged.aliasIds=uniq([...(Array.isArray(merged.aliasIds)?merged.aliasIds:[]),...aliasIds]);
    merged.securityArchived=false;
    merged.oneTimeDuplicateIncidentVersion=VERSION;
    merged.oneTimeDuplicateIncidentKey=group.key;
    merged.oneTimeDuplicateIncidentPoints=targetPoints;
    merged.oneTimeDuplicateIncidentProfilePoints=Object.fromEntries(breakdown.map(x=>[x.profileId,x.points]));
    merged.oneTimeDuplicateIncidentMergedFrom=sourceIds;
    return{
      group,alreadyDone:false,canonicalStudent,currentCanonical,pointSourceRows,currentRows,breakdown,baseSum,postRepairDelta,targetPoints,
      mergedProgress:merged,sourceIds,archiveIds:sourceIds.filter(id=>id&&id!==group.canonicalId),aliasIds,
      duplicateStudents:group.duplicateStudentIds.map(id=>byStudent.get(id)).filter(Boolean)
    };
  }

  root.OneTimeDuplicateIncidentCore={VERSION,GROUPS,text,uniq,progressId,studentId,stripInternal,positive,storedPoints,pointValue,enrichBackupProgress,repairBackupRows,currentRowsForGroup,sourceRowsForPoints,profilePointBreakdown,mergeRows,applyTotalPoints,buildGroupPlan};
})(typeof window!=='undefined'?window:globalThis);
