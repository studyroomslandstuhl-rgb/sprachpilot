// Verlässliche Sätze für alle 36 neuen Verben, inklusive Aliasnamen für reflexive Verben.
(function(){
  const SENTENCES={
    'ausfallen':'Der Kurs fällt heute aus.',
    'aufbacken':'Ich backe die Brötchen auf.',
    'verschwenden':'Wir verschwenden kein Wasser.',
    'sich verändern':'Das Wetter verändert sich.',
    'verändern':'Das Wetter verändert sich.',
    'verwechseln':'Ich verwechsle die Namen.',
    'tauschen':'Wir tauschen die Plätze.',
    'austauschen':'Der Techniker tauscht die Batterie aus.',
    'ablenken':'Das Handy lenkt mich ab.',
    'absagen':'Ich sage den Termin ab.',
    'stören':'Der Lärm stört mich.',
    'vermuten':'Ich vermute einen Fehler.',
    'abraten':'Die Ärztin rät davon ab.',
    'beraten':'Die Mitarbeiterin berät den Kunden.',
    'vorschlagen':'Ich schlage einen Termin vor.',
    'wählen':'Ich wähle einen Kurs.',
    'entscheiden':'Wir entscheiden heute.',
    'aussuchen':'Ich suche ein Geschenk aus.',
    'ruinieren':'Der Regen ruiniert das Fest.',
    'leiten':'Frau Klein leitet den Kurs.',
    'sich benehmen':'Das Kind benimmt sich gut.',
    'benehmen':'Das Kind benimmt sich gut.',
    'sich vorstellen':'Ich stelle mich kurz vor.',
    'vorstellen':'Ich stelle mich kurz vor.',
    'sich kämmen':'Ich kämme mich am Morgen.',
    'kämmen':'Ich kämme mich am Morgen.',
    'sich rasieren':'Er rasiert sich am Morgen.',
    'rasieren':'Er rasiert sich am Morgen.',
    'sich schminken':'Sie schminkt sich vor der Arbeit.',
    'schminken':'Sie schminkt sich vor der Arbeit.',
    'sich bewegen':'Wir bewegen uns jeden Tag.',
    'bewegen':'Wir bewegen uns jeden Tag.',
    'wandern':'Wir wandern in den Bergen.',
    'meinen':'Ich meine das ernst.',
    'grillen':'Wir grillen im Garten.',
    'wecken':'Der Wecker weckt mich.',
    'üben':'Ich übe die Verben.',
    'trainieren':'Sie trainiert jeden Dienstag.',
    'losfahren':'Der Bus fährt um acht Uhr los.',
    'dabeihaben':'Ich habe meinen Ausweis dabei.',
    'leidtun':'Das tut mir leid.',
    'leiden':'Er leidet unter Rückenschmerzen.',
    'opfern':'Sie opfert viel Zeit für das Projekt.'
  };
  window.VERB_SENTENCES=window.VERB_SENTENCES||{};
  Object.assign(window.VERB_SENTENCES,SENTENCES);
  const old=window.sentenceForVerb;
  window.sentenceForVerb=function(v){
    const key=String(v||'').trim();
    const bare=key.replace(/^sich\s+/i,'');
    return window.VERB_SENTENCES[key]||window.VERB_SENTENCES[bare]||(typeof old==='function'?old(v):'');
  };
  window.SP_NEW_VERB_SENTENCES_20260714=SENTENCES;
})();