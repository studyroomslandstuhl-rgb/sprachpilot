import {getActiveProfile,getActiveRole} from '/js/auth.js?v=login-main-4';

const engine=window.VerbGroupsEngine;
const profile=getActiveProfile()||{};
const role=String(getActiveRole()||'').toLowerCase();
let preview=role==='teacher';
try{
 const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');
 if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true;
}catch{}

if(engine&&typeof engine.setContext==='function')engine.setContext(profile,preview);

function activeLanguage(){
 const raw=String(profile.muttersprache||profile.motherLanguage||'Englisch').toLowerCase();
 const options=[
  [/russ/,'Russisch'],
  [/ukrain/,'Ukrainisch'],
  [/türk|turk/,'Türkisch'],
  [/arab/,'Arabisch'],
  [/rumän|ruman|roman/,'Rumänisch'],
  [/japan/,'Japanisch'],
  [/engl/,'Englisch']
 ];
 return options.find(([pattern])=>pattern.test(raw))?.[1]||'Englisch';
}

const languages=Array.isArray(window.SP_VERB_BASE_LANGUAGES)&&window.SP_VERB_BASE_LANGUAGES.length
 ?window.SP_VERB_BASE_LANGUAGES.slice()
 :['Englisch','Arabisch','Russisch','Ukrainisch','Türkisch','Rumänisch','Japanisch'];
const verbs=[...new Set((window.SP_VERB_GROUP_DATA?.verbs||engine?.ALL||[]).filter(Boolean))];
const maps=window.VERB_TRANSLATIONS||{};
const missing={};
for(const language of languages){
 const map=maps[language]||{};
 const absent=verbs.filter(verb=>!String(map[verb]||'').trim());
 if(absent.length)missing[language]=absent;
}

window.SP_PERFEKT_ACTIVE_LANGUAGE=activeLanguage();
window.SP_PERFEKT_TRANSLATION_AUDIT={
 complete:Object.keys(missing).length===0,
 language:window.SP_PERFEKT_ACTIVE_LANGUAGE,
 languages,
 verbCount:verbs.length,
 missing
};
if(Object.keys(missing).length)console.error('Fehlende Perfekt-Übersetzungen',missing);
