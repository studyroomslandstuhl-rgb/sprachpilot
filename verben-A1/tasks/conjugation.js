const CONJ_SUBJECTS=[
  {s:"ich",key:"ich"},{s:"du",key:"du"},{s:"er",key:"er/sie/es"},{s:"sie",key:"er/sie/es",note:"sie = eine Frau"},{s:"es",key:"er/sie/es"},
  {s:"wir",key:"wir"},{s:"ihr",key:"ihr"},{s:"sie",key:"sie/Sie",note:"sie = viele Personen"},{s:"Sie",key:"sie/Sie",note:"Sie = formell"},
  {s:"Ali",key:"er/sie/es"},{s:"Maria",key:"er/sie/es"},{s:"der Mann",key:"er/sie/es"},{s:"die Frau",key:"er/sie/es"},{s:"das Kind",key:"er/sie/es"},{s:"die Kinder",key:"sie/Sie"}
];
const CONJ_EXAMPLES={
  "bekommen":"ein Paket","mieten":"eine Wohnung","vermieten":"eine Wohnung","gratulieren":"zum Geburtstag","gefallen":"mir","fehlen":"heute","kaufen":"Brot","lernen":"Deutsch","schreiben":"eine E-Mail","lesen":"ein Buch","essen":"einen Apfel","fahren":"mit dem Bus","sprechen":"Deutsch","sehen":"ein Auto","geben":"den Schlüssel","nehmen":"den Bus","helfen":"meiner Mutter","arbeiten":"heute","wohnen":"in Berlin","kommen":"um acht Uhr"
};
const FULL_FORMS={
  "sein":{"ich":"bin","du":"bist","er/sie/es":"ist","wir":"sind","ihr":"seid","sie/Sie":"sind"},
  "haben":{"ich":"habe","du":"hast","er/sie/es":"hat","wir":"haben","ihr":"habt","sie/Sie":"haben"},
  "werden":{"ich":"werde","du":"wirst","er/sie/es":"wird","wir":"werden","ihr":"werdet","sie/Sie":"werden"},
  "wissen":{"ich":"weiß","du":"weißt","er/sie/es":"weiß","wir":"wissen","ihr":"wisst","sie/Sie":"wissen"},
  "geben":{"ich":"gebe","du":"gibst","er/sie/es":"gibt","wir":"geben","ihr":"gebt","sie/Sie":"geben"},
  "nehmen":{"ich":"nehme","du":"nimmst","er/sie/es":"nimmt","wir":"nehmen","ihr":"nehmt","sie/Sie":"nehmen"},
  "sprechen":{"ich":"spreche","du":"sprichst","er/sie/es":"spricht","wir":"sprechen","ihr":"sprecht","sie/Sie":"sprechen"},
  "fahren":{"ich":"fahre","du":"fährst","er/sie/es":"fährt","wir":"fahren","ihr":"fahrt","sie/Sie":"fahren"},
  "sehen":{"ich":"sehe","du":"siehst","er/sie/es":"sieht","wir":"sehen","ihr":"seht","sie/Sie":"sehen"},
  "lesen":{"ich":"lese","du":"liest","er/sie/es":"liest","wir":"lesen","ihr":"lest","sie/Sie":"lesen"},
  "essen":{"ich":"esse","du":"isst","er/sie/es":"isst","wir":"essen","ihr":"esst","sie/Sie":"essen"},
  "helfen":{"ich":"helfe","du":"hilfst","er/sie/es":"hilft","wir":"helfen","ihr":"helft","sie/Sie":"helfen"},
  "treffen":{"ich":"treffe","du":"triffst","er/sie/es":"trifft","wir":"treffen","ihr":"trefft","sie/Sie":"treffen"},
  "werfen":{"ich":"werfe","du":"wirfst","er/sie/es":"wirft","wir":"werfen","ihr":"werft","sie/Sie":"werfen"},
  "laufen":{"ich":"laufe","du":"läufst","er/sie/es":"läuft","wir":"laufen","ihr":"lauft","sie/Sie":"laufen"},
  "schlafen":{"ich":"schlafe","du":"schläfst","er/sie/es":"schläft","wir":"schlafen","ihr":"schlaft","sie/Sie":"schlafen"},
  "halten":{"ich":"halte","du":"hältst","er/sie/es":"hält","wir":"halten","ihr":"haltet","sie/Sie":"halten"},
  "lassen":{"ich":"lasse","du":"lässt","er/sie/es":"lässt","wir":"lassen","ihr":"lasst","sie/Sie":"lassen"},
  "wachsen":{"ich":"wachse","du":"wächst","er/sie/es":"wächst","wir":"wachsen","ihr":"wachst","sie/Sie":"wachsen"},
  "laden":{"ich":"lade","du":"lädst","er/sie/es":"lädt","wir":"laden","ihr":"ladet","sie/Sie":"laden"},
  "gefallen":{"ich":"gefalle","du":"gefällst","er/sie/es":"gefällt","wir":"gefallen","ihr":"gefallt","sie/Sie":"gefallen"},
  "fehlen":{"ich":"fehle","du":"fehlst","er/sie/es":"fehlt","wir":"fehlen","ihr":"fehlt","sie/Sie":"fehlen"},
  "gratulieren":{"ich":"gratuliere","du":"gratuliertst".replace("tst","st"),"er/sie/es":"gratuliert","wir":"gratulieren","ihr":"gratuliert","sie/Sie":"gratulieren"}
};
function verbStem(v){if(v.endsWith("eln"))return v.slice(0,-3)+"el"; if(v.endsWith("ern"))return v.slice(0,-2); if(v.endsWith("en"))return v.slice(0,-2); if(v.endsWith("n"))return v.slice(0,-1); return v}
function regularForm(v,key){
  const stem=verbStem(v);const needsE=/[td]$|chn$|ffn$|gn$|tm$/.test(stem);
  if(key==="ich")return stem+"e";
  if(key==="du")return stem+(needsE?"est":"st");
  if(key==="er/sie/es")return stem+(needsE?"et":"t");
  if(key==="wir"||key==="sie/Sie")return v;
  if(key==="ihr")return stem+(needsE?"et":"t");
  return v;
}
function conjugatedForm(v,key){return (FULL_FORMS[v]&&FULL_FORMS[v][key])||(IRREGULAR_VERB_FORMS[v]&&IRREGULAR_VERB_FORMS[v][key])||regularForm(v,key)}
function capFirst(text){return String(text||"").charAt(0).toUpperCase()+String(text||"").slice(1)}
function conjugationSentence(v,subj){
  const rest=(CONJ_EXAMPLES[v]||sentenceForVerb(v).replace(/^[^ ]+ [^ ]+ /,"")).replace(/[.!?]+$/g,"").trim();
  return `${capFirst(subj.s)} _____ (${v}) ${rest}.`.replace(/\s+/g," ").trim();
}
function conjugationSubjectHint(subj){return subj&&subj.note?`<div class="example-box conj-hint">${safeText(subj.note)}</div>`:""}
function conjugationSolution(v,subj){return conjugatedForm(v,subj.key)}
function conjugationTask(){
  rememberPhase("konjugieren");
  const v=nextFromTaskQueue("konjugieren");if(!v){renderHome();return}
  ensureAttempt("konjugieren",v);
  const subj=(state.currentConj&&state.currentConj.v===v&&state.currentConj.subj)?state.currentConj.subj:shuffle(CONJ_SUBJECTS)[0];state.currentConj={v,subj};saveState();
  $("app").innerHTML=`<h2>Konjugieren</h2>${taskProgressHtml("konjugieren","Konjugieren")}${imageBox(v)}<p class="small">Schreibe die richtige Verbform.</p>${conjugationSubjectHint(subj)}<div class="assessment-card"><div class="german-word sentence-gap">${safeText(conjugationSentence(v,subj))}</div></div><input id="conjInput" placeholder="Verbform schreiben"><button class="success" onclick="checkConjugation('${safeText(v)}')">Kontrollieren</button><div id="fb"></div>`;
  renderAndHydrate();setTimeout(()=>$("conjInput")?.focus(),50);
}
function checkConjugation(v){const subj=state.currentConj&&state.currentConj.v===v?state.currentConj.subj:CONJ_SUBJECTS[0];const sol=conjugationSolution(v,subj);const good=clean($("conjInput").value)===clean(sol);if(good){state.currentConj=null;handleCorrectAnswer("konjugieren",v,conjugationTask,900,"fb")}else{handleWrongAnswer("konjugieren",v,sol,"Verbform und Subjekt","fb")}}
