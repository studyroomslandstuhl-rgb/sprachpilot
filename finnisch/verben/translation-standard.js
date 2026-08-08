(function(){
'use strict';
if(window.__SP_FI_TRANSLATION_STANDARD_V2)return;
window.__SP_FI_TRANSLATION_STANDARD_V2=true;

// Geprüfte Korrekturen/Präzisierungen. Der Wert in `fi` ist immer die
// finnische Lernform; `de` bleibt die deutsche Standardübersetzung.
const CORRECTIONS={
  'laufen':'juosta',
  'rennen':'juosta kovaa',
  'schreien':'kirkua',
  'möchten':'haluta',
  'sich benehmen':'käyttäytyä',
  'sich vorstellen':'esitellä itsensä',
  'sich kämmen':'kammata hiukset',
  'sich rasieren':'ajaa parta',
  'sich schminken':'meikata',
  'sich verändern':'muuttua',
  'verwechseln':'sekoittaa',
  'tauschen':'vaihtaa',
  'austauschen':'vaihtaa',
  'ablenken':'viedä huomio',
  'vermuten':'olettaa',
  'abraten':'neuvoa välttämään',
  'beraten':'neuvoa',
  'entscheiden':'päättää',
  'aussuchen':'valita',
  'ruinieren':'pilata',
  'leiten':'johtaa',
  'meinen':'tarkoittaa',
  'grillen':'grillata',
  'dabeihaben':'olla mukana',
  'leidtun':'olla pahoillaan',
  'opfern':'uhrata',
  'vernichten':'tuhota',
  'erleben':'kokea',
  'steigen':'nousta',
  'sinken':'laskea',
  'verzeihen':'antaa anteeksi',
  'vergeben':'antaa anteeksi',
  'kennenlernen':'tutustua',
  'hinzufügen':'lisätä',
  'spazieren gehen':'käydä kävelyllä'
};

const list=Array.isArray(window.SP_FI_VERBS)?window.SP_FI_VERBS:[];
const changed=[];
for(const item of list){
  if(!item||!item.de)continue;
  const next=CORRECTIONS[item.de];
  if(next&&item.fi!==next){changed.push({de:item.de,from:item.fi,to:next});item.fi=next}
}

// Im finnischen Kurs bedeutet "Übersetzung" die deutsche Entsprechung.
// Die gemeinsame Bedeutungsdatei darf hier deshalb keine Umschreibung liefern.
window.SP_VERB_A1_MEANINGS=window.SP_VERB_A1_MEANINGS||{};
for(const item of list){if(item?.de)window.SP_VERB_A1_MEANINGS[item.de]=item.de}

window.SP_FI_TRANSLATION_AUDIT={checked:list.length,changed,corrections:{...CORRECTIONS}};
})();
