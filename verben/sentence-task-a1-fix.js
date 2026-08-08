(function(){
'use strict';
if(window.__SP_VERB_SENTENCE_A1_FIX_3)return;
window.__SP_VERB_SENTENCE_A1_FIX_3=true;
const E=window.VerbGroupsEngine;
if(!E)return;

// Ergänzungen zu sentences.js. Aufgabe „Satz ergänzen“ benutzt für jedes Verb
// einen echten kurzen A1-Hauptsatz. Kein „Ich lerne das Verb …“-Fallback.
const EXTRA={
 'aufräumen':'Ich räume mein Zimmer auf.',
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
 'sinken':'Die Temperatur sinkt.',

 // Nachträglich ergänzte Verben
 'bieten':'Der Laden bietet viele Bücher.',
 'bitten':'Ich bitte um Hilfe.',
 'nennen':'Wir nennen unseren Namen.',
 'sitzen':'Ich sitze auf dem Stuhl.',
 'treiben':'Wir treiben Sport.',
 'binden':'Ich binde meine Schuhe.',
 'brennen':'Die Kerze brennt.',
 'erschrecken':'Das Kind erschrickt.',
 'fliehen':'Die Tiere fliehen.',
 'fließen':'Der Fluss fließt durch die Stadt.',
 'frieren':'Ich friere im Winter.',
 'gelingen':'Der Kuchen gelingt gut.',
 'gelten':'Das Ticket gilt heute.',
 'geschehen':'Was geschieht hier?',
 'passieren':'Was passiert hier?',
 'gleichen':'Die Brüder gleichen sich.',
 'heben':'Ich hebe die Tasche.',
 'klingen':'Das Lied klingt schön.',
 'leiden':'Er leidet unter Kopfschmerzen.',
 'leihen':'Ich leihe Anna ein Buch.',
 'meiden':'Ich meide Stress.',
 'reiben':'Ich reibe den Käse.',
 'schaffen':'Wir schaffen das.',
 'scheiden':'Die Wege scheiden sich hier.',
 'trennen':'Ich trenne Papier und Plastik.',
 'teilen':'Wir teilen den Kuchen.',
 'schauen':'Ich schaue einen Film.',
 'scheinen':'Die Sonne scheint.',
 'schießen':'Er schießt den Ball.',
 'schmeißen':'Ich schmeiße den Müll weg.',
 'senden':'Ich sende eine E-Mail.',
 'treten':'Er tritt gegen den Ball.',
 'verzeihen':'Ich verzeihe dir.',
 'weisen':'Der Pfeil weist nach rechts.',
 'hinweisen':'Die Lehrerin weist auf den Fehler hin.',
 'auffallen':'Der Fehler fällt sofort auf.',
 'einfallen':'Mir fällt eine Idee ein.',
 'wiegen':'Das Paket wiegt zwei Kilo.',
 'zwingen':'Niemand zwingt mich.',
 'sich bewegen':'Ich bewege mich jeden Tag.',
 'sich konzentrieren':'Ich konzentriere mich auf die Aufgabe.',
 'sich kümmern':'Ich kümmere mich um das Kind.',
 'sich interessieren':'Ich interessiere mich für Musik.',
 'sich erinnern':'Ich erinnere mich an den Termin.',
 'sich anziehen':'Ich ziehe mich schnell an.',
 'sich ausziehen':'Das Kind zieht sich aus.',
 'sich umziehen':'Ich ziehe mich um.',
 'sich duschen':'Ich dusche mich nach dem Sport.',
 'sich freuen':'Ich freue mich auf das Wochenende.',
 'sich ärgern':'Ich ärgere mich über den Lärm.',
 'sich beschweren':'Ich beschwere mich über den Lärm.',
 'sich überlegen':'Ich überlege mir die Antwort.',
 'hinzufügen':'Ich füge Salz hinzu.',
 'spazieren gehen':'Wir gehen im Park spazieren.'
};

const SENTENCES=Object.assign({},window.VERB_SENTENCES||{},window.SP_VERB_SENTENCES||{},EXTRA);
window.SP_VERB_SENTENCES=SENTENCES;
window.VERB_SENTENCES=Object.assign(window.VERB_SENTENCES||{},SENTENCES);

const escRe=value=>String(value).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const SPECIAL_FORMS={
 'erschrecken':['erschrecke','erschrickst','erschrickt','erschrecken','erschreckt','erschrecken'],
 'gelten':['gelte','giltst','gilt','gelten','geltet','gelten'],
 'geschehen':['geschehe','geschiehst','geschieht','geschehen','gescheht','geschehen'],
 'treten':['trete','trittst','tritt','treten','tretet','treten']
};
const FORM_BASE={
 'hinweisen':'weisen','auffallen':'fallen','einfallen':'fallen',
 'sich anziehen':'ziehen','sich ausziehen':'ziehen','sich umziehen':'ziehen',
 'hinzufügen':'fügen','spazieren gehen':'gehen'
};
function sentenceForVerb(v){return String(SENTENCES[v]||'').trim()}
function candidateForms(v){
 if(SPECIAL_FORMS[v])return SPECIAL_FORMS[v].slice();
 if(FORM_BASE[v])return E.forms(FORM_BASE[v])||[];
 return E.forms(v)||[];
}
function gapForVerb(v){
 const text=sentenceForVerb(v);
 if(!text)return null;
 const forms=[...new Set(candidateForms(v).filter(Boolean))].sort((a,b)=>String(b).length-String(a).length);
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

// Letzte und globale Regel für Aufgabe „sentence“: gilt für jede Gruppe und jedes Verb.
const previousQuestion=E.question.bind(E);
E.sentence=sentenceForVerb;
window.sentenceForVerb=sentenceForVerb;
E.question=function(groupId,task,v,personOverride=null){
 if(task==='sentence'){
  const gap=gapForVerb(v);
  if(gap)return{
   kind:'input',
   prompt:gap.prompt,
   answer:gap.answer,
   writeAnswer:gap.answer,
   placeholder:'Verbform schreiben',
   sentence:gap.sentence,
   verb:v
  };
  // Kein alter Platzhalter und kein „Ich lerne ...“. Falls ein neuer Verbdatensatz
  // ohne Satz auftaucht, bleibt das Zielverb sichtbar statt falschen Inhalt zu erzeugen.
  const pi=Number.isInteger(personOverride)?personOverride:0;
  const answer=E.displayForm(v,pi);
  return{
   kind:'input',
   prompt:`${E.PERSONS?.[pi]?.label||'ich'} ______ heute. (${v})`,
   answer,
   writeAnswer:answer,
   placeholder:'Verbform schreiben',
   sentence:'',
   verb:v,
   generatedFallback:true
  };
 }
 const q=previousQuestion(groupId,task,v,personOverride);
 if(task==='read-sentence'){
  const text=sentenceForVerb(v);
  if(text)q.prompt=text;
 }
 return q;
};

const missing=(E.ALL||[]).filter(v=>!sentenceForVerb(v));
const unusable=(E.ALL||[]).filter(v=>sentenceForVerb(v)&&!gapForVerb(v));
window.SP_VERB_SENTENCE_AUDIT={version:3,total:(E.ALL||[]).length,missing,unusable,allGroups:true};
if(missing.length||unusable.length)console.warn('SprachPilot Verbsatz-Prüfung',{missing,unusable});
})();
