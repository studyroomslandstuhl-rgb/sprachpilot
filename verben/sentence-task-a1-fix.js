(function(){
'use strict';
if(window.__SP_VERB_SENTENCE_A1_FIX_1)return;
window.__SP_VERB_SENTENCE_A1_FIX_1=true;
const E=window.VerbGroupsEngine;
if(!E)return;

// Ergänzungen für Grundverben, die in sentences.js noch keinen eigenen Satz hatten.
// Jeder Eintrag ist ein kurzer, inhaltlich zum Verb passender Hauptsatz auf A1-Niveau.
const EXTRA={
 'lernen':'Die Kinder lernen Deutsch.',
 'aufräumen':'Ich räume auf.',
 'einkaufen':'Wir kaufen heute ein.',
 'anrufen':'Ich rufe Anna an.',
 'fernsehen':'Wir sehen abends fern.',
 'anfangen':'Der Kurs fängt jetzt an.',
 'beginnen':'Der Kurs beginnt um neun Uhr.',
 'starten':'Der Bus startet um acht Uhr.',
 'enden':'Der Kurs endet um zwölf Uhr.',
 'aussterben':'Viele Tiere sterben aus.',
 'aufmachen':'Ich mache die Tür auf.',
 'zumachen':'Ich mache das Fenster zu.',
 'begraben':'Der Hund begräbt einen Knochen.',
 'zerstören':'Der Sturm zerstört das Haus.',
 'verbiegen':'Er verbiegt den Draht.',
 'mitgeben':'Die Mutter gibt dem Kind Wasser mit.',
 'mitnehmen':'Ich nehme eine Flasche Wasser mit.',
 'passen':'Die Schuhe passen gut.',
 'lügen':'Der Mann lügt.',
 'erzählen':'Oma erzählt eine Geschichte.',
 'abholen':'Ich hole meine Tochter ab.',
 'chatten':'Wir chatten am Abend.',
 'ausleihen':'Ich leihe ein Buch aus.',
 'versprechen':'Ich verspreche dir Hilfe.',
 'vereinbaren':'Wir vereinbaren einen Termin.',
 'kennenlernen':'Paul lernt Anna heute kennen.',
 'ausfallen':'Der Bus fällt heute aus.',
 'aufbacken':'Wir backen die Brötchen auf.',
 'verschwenden':'Ich verschwende kein Wasser.',
 'sich verändern':'Die Stadt verändert sich.',
 'verwechseln':'Ich verwechsle die Namen.',
 'tauschen':'Wir tauschen die Plätze.',
 'austauschen':'Wir tauschen die Bücher aus.',
 'ablenken':'Das Handy lenkt mich ab.',
 'absagen':'Ich sage den Termin ab.',
 'stören':'Der Lärm stört mich.',
 'vermuten':'Ich vermute einen Fehler.',
 'abraten':'Der Arzt rät mir von Kaffee ab.',
 'beraten':'Die Verkäuferin berät den Kunden.',
 'vorschlagen':'Ich schlage einen Termin vor.',
 'wählen':'Ich wähle die Nummer.',
 'entscheiden':'Der Chef entscheidet heute.',
 'aussuchen':'Ich suche ein Kleid aus.',
 'ruinieren':'Der Regen ruiniert den Ausflug.',
 'leiten':'Frau Müller leitet den Kurs.',
 'sich benehmen':'Das Kind benimmt sich gut.',
 'sich vorstellen':'Ich stelle mich kurz vor.',
 'sich kämmen':'Ich kämme mich am Morgen.',
 'sich rasieren':'Mein Vater rasiert sich.',
 'sich schminken':'Sie schminkt sich.',
 'wandern':'Wir wandern am Sonntag.',
 'meinen':'Ich meine das ernst.',
 'grillen':'Wir grillen im Garten.',
 'wecken':'Der Wecker weckt mich um sieben Uhr.',
 'üben':'Ich übe jeden Tag Deutsch.',
 'trainieren':'Er trainiert jeden Dienstag.',
 'losfahren':'Der Bus fährt jetzt los.',
 'dabeihaben':'Ich habe meinen Pass dabei.',
 'leidtun':'Das tut mir leid.',
 'opfern':'Er opfert seine Zeit.',
 'klopfen':'Jemand klopft an die Tür.',
 'riechen':'Die Suppe riecht gut.',
 'stinken':'Der Müll stinkt.',
 'gucken':'Ich gucke einen Film.',
 'würfeln':'Das Kind würfelt.',
 'schweigen':'Alle schweigen.',
 'vernichten':'Das Feuer vernichtet die Papiere.',
 'erleben':'Wir erleben einen schönen Tag.',
 'steigen':'Die Preise steigen.',
 'sinken':'Die Temperatur sinkt.'
};

const SENTENCES=Object.assign({},window.VERB_SENTENCES||{},window.SP_VERB_SENTENCES||{},EXTRA);
window.SP_VERB_SENTENCES=SENTENCES;
window.VERB_SENTENCES=Object.assign(window.VERB_SENTENCES||{},SENTENCES);

const originalQuestion=E.question.bind(E);
const escRe=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function sentenceForVerb(v){return String(SENTENCES[v]||'').trim()}
function gapForVerb(v){
 const text=sentenceForVerb(v);
 if(!text)return null;
 const forms=[...new Set((E.forms(v)||[]).filter(Boolean))].sort((a,b)=>String(b).length-String(a).length);
 for(const form of forms){
  const re=new RegExp(`(^|[^A-Za-zÄÖÜäöüß])(${escRe(form)})(?=$|[^A-Za-zÄÖÜäöüß])`,'i');
  const match=text.match(re);
  if(!match)continue;
  const answer=match[2];
  const prompt=text.replace(re,(all,before)=>`${before}________`);
  return{prompt,answer,sentence:text};
 }
 return null;
}

E.sentence=sentenceForVerb;
E.question=function(groupId,task,v,personOverride=null){
 if(task==='sentence'){
  const gap=gapForVerb(v);
  if(gap)return{kind:'input',prompt:gap.prompt,answer:gap.answer,placeholder:'Verbform schreiben',sentence:gap.sentence};
 }
 const q=originalQuestion(groupId,task,v,personOverride);
 if(task==='read-sentence'){
  const text=sentenceForVerb(v);
  if(text)q.prompt=text;
 }
 return q;
};

const missing=(E.ALL||[]).filter(v=>!sentenceForVerb(v));
const unusable=(E.ALL||[]).filter(v=>sentenceForVerb(v)&&!gapForVerb(v));
window.SP_VERB_SENTENCE_AUDIT={total:(E.ALL||[]).length,missing,unusable};
if(missing.length||unusable.length)console.error('SprachPilot Verbsatz-Prüfung',{missing,unusable});
})();
