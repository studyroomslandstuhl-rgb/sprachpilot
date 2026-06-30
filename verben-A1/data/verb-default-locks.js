// data/verb-default-locks.js
// Neue/zusätzlich eingebaute Verben bleiben gesperrt, bis die Lehrerin sie im Dashboard freigibt.
(function(){
  const LOCKED_BY_DEFAULT=[
    'aufräumen','einkaufen','anrufen','fernsehen','anfangen','beginnen','starten','enden','aussterben','aufmachen','zumachen','begraben','zerstören','verbiegen','mitgeben','mitnehmen',
    'vergeben','verbringen','kennenlernen','bleiben','einladen',
    'heißen','aufstehen','frühstücken','duschen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','holen','zahlen','ausfüllen','anmelden','mitkommen','zurückkommen','sitzen','liegen','hängen','stellen','legen','können','müssen','wollen','dürfen','sollen','möchten','mögen','biegen','abbiegen'
  ];
  const old=new Set(window.SP_DEFAULT_LOCKED_VERBS||[]);
  LOCKED_BY_DEFAULT.forEach(v=>old.add(v));
  window.SP_DEFAULT_LOCKED_VERBS=[...old];
  window.SP_NEW_VERBS_LOCKED_BY_DEFAULT=LOCKED_BY_DEFAULT.slice();
})();
