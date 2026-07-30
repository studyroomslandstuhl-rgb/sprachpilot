(function(){const s=document.createElement('style');s.id='l7t1-rev6-style';s.textContent=":root{\n --lesson-main:#8ec5ff;\n --lesson-main-dark:#235a92;\n --lesson-soft:#eef7ff;\n --lesson-line:#b9dcff;\n --lesson-bg:#eef8ff;\n --green:#15803d;\n --red:#b91c1c;\n --yellow:#fff8d8;\n --text:#172033;\n --muted:#667085;\n}\n*{box-sizing:border-box}\nhtml{background:var(--lesson-bg)}\nbody.l7t1-l6t4{margin:0;font-family:system-ui,-apple-system,\"Segoe UI\",Arial,sans-serif;background:linear-gradient(180deg,var(--lesson-bg),#fff);color:var(--text);min-height:100vh}\nbutton,input,textarea{font:inherit}\na{color:inherit}\n.container{max-width:1120px;margin:0 auto;padding:18px}\n.topbar,.card,.module{background:#fff;border:2px solid var(--lesson-line);border-radius:24px;box-shadow:0 8px 22px rgba(35,90,146,.10)}\n.topbar{padding:16px;margin-bottom:18px}\n.topbar-main{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}\n.brand{display:flex;align-items:center;gap:12px;text-decoration:none}\n.logo img{width:54px;height:54px;object-fit:contain}\n.brand h1{margin:0;font-size:26px;color:var(--lesson-main-dark)}\n.subtitle{margin-top:2px;font-size:14px;color:var(--muted)}\n.account-tools{display:flex;gap:8px;flex-wrap:wrap;align-items:center}\n.account-pill,.account-link{background:var(--lesson-soft);border:1px solid var(--lesson-line);border-radius:999px;padding:8px 12px;font-weight:800;color:var(--lesson-main-dark);text-decoration:none}\n.nav,.actions,.mode-actions,.answer-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.nav{margin-top:14px}\n.btn,.start{display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--lesson-main-dark);background:var(--lesson-main-dark);color:#fff;border-radius:999px;padding:10px 16px;font-weight:900;text-decoration:none;cursor:pointer;min-height:44px}\n.btn.secondary,.btn.ghost,.start{background:#fff;color:var(--lesson-main-dark)}\n.btn.ghost{border-style:dashed}\n.btn.danger-btn{background:#fee2e2;color:#991b1b;border-color:#ef4444}\n.btn:disabled,.choice:disabled,.token:disabled{cursor:not-allowed;opacity:.55}\n.card{padding:18px;margin-bottom:16px}\n.progress-card{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:22px}\n.circle{width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:9px solid var(--lesson-main);background:var(--lesson-soft);font-size:24px;font-weight:900;color:var(--lesson-main-dark)}\nh1,h2,h3{color:var(--lesson-main-dark)}\n.progress-card h2{margin:0 0 7px;font-size:28px}\n.small{font-size:14px;color:var(--muted);line-height:1.45}\n.progress{height:12px;background:#e7edf3;border-radius:999px;overflow:hidden;margin-top:10px}\n.bar{height:100%;background:var(--lesson-main-dark);border-radius:999px}\n.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}\n.module{display:block;padding:18px;text-decoration:none;transition:transform .16s,box-shadow .16s}\n.module:hover{transform:translateY(-2px);box-shadow:0 12px 25px rgba(35,90,146,.16)}\n.module .num{font-weight:900;color:var(--lesson-main-dark);font-size:19px;line-height:1.3}\n.big-icon{font-size:42px;margin:14px 0;min-height:52px;display:flex;align-items:center}\n.module .start{margin-top:14px}\n.module.exam-locked{filter:grayscale(1);background:#e5e7eb;border-color:#9ca3af;color:#6b7280;box-shadow:none;cursor:not-allowed;pointer-events:none;opacity:.86}\n.preview-note{padding:12px 14px;margin-bottom:16px;border-radius:15px;background:var(--yellow);border:1px solid #f1d36b;font-weight:800}\n.task-title-block{display:grid;gap:4px;margin-bottom:14px}\n.task-number{font-size:14px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:var(--lesson-main-dark)}\n.task-title-block h1{margin:0;font-size:clamp(24px,4vw,34px);line-height:1.15}\n.task-progress-row{display:flex;justify-content:space-between;gap:10px;margin:4px 0 7px;color:var(--muted);font-size:14px}\n.task-instruction{background:var(--lesson-soft);border:1px solid var(--lesson-line);border-radius:18px;padding:12px;font-weight:800;color:var(--lesson-main-dark);margin:14px 0 18px;text-align:center}\n.question-card{max-width:860px;margin:18px auto 0;padding:20px;border:2px solid var(--lesson-line);border-radius:24px;background:#fff;text-align:center}\n.question{font-size:24px;line-height:1.4;color:var(--text);margin:16px 0}\n.dialog-box{background:#f8fafc;border:2px solid var(--lesson-line);border-radius:20px;padding:18px;margin:14px 0;line-height:1.75;font-size:18px;text-align:left}\n.task-img-box,.card-image,.smiley-image{width:min(430px,100%);min-height:220px;margin:14px auto;border:2px solid var(--lesson-line);border-radius:22px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden}\n.task-img-box img,.card-image img,.smiley-image img{display:block;width:100%;height:100%;max-height:360px;object-fit:contain}\n.bunny-image-link{display:flex;width:100%;height:100%;align-items:center;justify-content:center;text-decoration:none}\n.image-fallback{padding:20px;color:var(--muted);font-weight:800}\n.audio-panel{margin:14px auto;padding:14px;border:2px solid var(--lesson-line);border-radius:18px;background:var(--lesson-soft);display:flex;justify-content:center}\n.large-audio .btn{font-size:18px;padding:13px 22px}\n.choice-grid,.token-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:18px 0}\n.choice,.token{border:2px solid var(--lesson-line);border-radius:18px;background:#fff;padding:14px;font-weight:900;font-size:17px;cursor:pointer;color:var(--text);min-height:54px}\n.choice:hover,.token:hover{background:var(--lesson-soft)}\n.abc-list{grid-template-columns:1fr}\n.abc-list .choice{display:grid;grid-template-columns:38px 1fr;align-items:center;text-align:left;gap:10px}\n.abc-letter{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#dceeff;color:var(--lesson-main-dark);font-weight:900}\n.answer-area{max-width:690px;margin:17px auto;text-align:left}\n.answer-area label{display:block;font-weight:900;margin-bottom:8px}\n.answer-row input{width:100%;padding:14px;border:2px solid var(--lesson-line);border-radius:16px;font-size:18px;flex:1;min-width:190px}\n.order-answer{min-height:62px;padding:14px;margin:14px 0;border:3px dashed var(--lesson-line);border-radius:18px;background:var(--lesson-soft);font-weight:900;font-size:19px}\n.centered{justify-content:center}\n.feedback{margin-top:14px}\n.ok,.no,.hint{padding:12px 14px;border-radius:14px;margin-top:12px;font-weight:800}\n.ok{background:#ecfdf3;color:var(--green);border:1px solid #86efac}\n.no{background:#fff1f2;color:var(--red);border:1px solid #fda4af}\n.hint{background:var(--yellow);color:#725400;border:1px solid #f1d36b}\n.flip-wrap{width:min(460px,100%);margin:18px auto;perspective:1100px}\n.flip-card{position:relative;width:100%;height:430px;transform-style:preserve-3d;transition:transform .55s ease;cursor:pointer;touch-action:manipulation}\n.flip-card.flipped{transform:rotateY(180deg)}\n.flip-face{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:20px;border:3px solid var(--lesson-line);border-radius:26px;background:#fff;box-shadow:0 12px 28px rgba(0,0,0,.10);backface-visibility:hidden;-webkit-backface-visibility:hidden;text-align:center;overflow:auto}\n.flip-back{transform:rotateY(180deg);background:var(--lesson-soft)}\n.card-image{margin:0;width:100%;min-height:240px;max-height:280px}\n.card-image img{max-height:270px}\n.flip-word{font-size:32px;font-weight:900;color:var(--lesson-main-dark);line-height:1.3}\n.flip-note{font-size:14px;color:var(--muted)}\n.card-translation-box{width:100%;padding:10px 13px;border:2px solid var(--lesson-line);border-radius:14px;background:var(--lesson-soft)}\n.card-translation-box span,.card-details span{display:block;font-size:13px;color:var(--muted)}\n.card-translation-box strong{display:block;margin-top:4px;font-size:20px}\n.card-details{display:grid;grid-template-columns:1fr;gap:10px;width:100%}\n.card-details>div{padding:10px;border-radius:13px;background:#fff}\n.card-listen-btn{position:relative;z-index:5}\n.card-actions,.mode-actions{justify-content:center;margin:16px 0}\n.smiley-prompt{display:grid;grid-template-columns:1fr minmax(210px,360px) 1fr;align-items:center;gap:18px;margin:10px auto 18px;max-width:780px}\n.person-name{font-size:30px;font-weight:900;color:var(--lesson-main-dark)}\n.smiley-image{width:100%;min-height:210px;margin:0}\n.ability-smiley{font-size:76px;line-height:1}\n.conj-table-wrap{overflow-x:auto;margin:18px 0}\n.conj-table{width:100%;border-collapse:separate;border-spacing:6px;min-width:560px}\n.conj-table th{font-weight:900;color:var(--lesson-main-dark)}\n.conj-table th,.conj-table td{padding:8px;text-align:center}\n.drop-zone{width:100%;min-height:46px;border:2px dashed var(--lesson-main-dark);border-radius:14px;background:var(--lesson-soft);color:var(--lesson-main-dark);font-weight:900;cursor:pointer}\n.verb-bank{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:18px 0;padding:15px;border:2px solid var(--lesson-line);border-radius:18px;background:#f8fbff}\n.verb-chip{padding:10px 14px;border:2px solid var(--lesson-main-dark);border-radius:999px;background:#fff;color:var(--lesson-main-dark);font-weight:900;cursor:grab}\n.verb-chip.selected{background:var(--lesson-main-dark);color:#fff}\n.overview-intro p{margin-bottom:0;line-height:1.55}\n.vocabulary-section{margin-top:18px}\n.section-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}\n.section-heading h2{margin:0}\n.section-heading span{background:var(--lesson-soft);border:1px solid var(--lesson-line);border-radius:999px;padding:7px 11px;font-weight:800;color:var(--lesson-main-dark)}\n.overview-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px}\n.overview-word{display:grid;grid-template-columns:84px 1fr auto;align-items:center;gap:12px;padding:12px;border:2px solid var(--lesson-line);border-radius:18px;background:#fff;min-height:112px}\n.overview-image{width:84px;height:84px;border-radius:14px;border:1px solid var(--lesson-line);overflow:hidden;background:var(--lesson-soft);display:flex;align-items:center;justify-content:center}\n.overview-image img{width:100%;height:100%;object-fit:contain}\n.overview-word h3{margin:0;font-size:18px}\n.overview-word p{margin:5px 0 0}\n.audio-circle{width:46px;height:46px;padding:0;border-radius:50%;font-size:0}\n.audio-circle::before{content:'🔊';font-size:20px}\n.finish-box{text-align:center;padding:36px}\n.finish-icon{font-size:58px;color:var(--green)}\n.finish-box h2{font-size:29px}\n.stars{font-size:36px;color:#e6a700;margin:12px}\nfooter{text-align:center;color:var(--muted);margin:28px 0}\n[hidden]{display:none!important}\n@media(max-width:760px){\n .container{padding:8px 6px 24px}\n .card{padding:15px}\n .progress-card{grid-template-columns:1fr;text-align:center}\n .circle{margin:auto}\n .account-tools{display:none}\n .brand h1{font-size:22px}\n .grid{grid-template-columns:1fr}\n .question-card{padding:15px}\n .answer-row{display:grid}\n .answer-row .btn{width:100%}\n .flip-card{height:390px}\n .card-image{min-height:215px}\n .flip-word{font-size:27px}\n .smiley-prompt{grid-template-columns:1fr;text-align:center}\n .smiley-image{width:min(330px,100%);margin:auto}\n .overview-grid{grid-template-columns:1fr}\n .overview-word{grid-template-columns:76px 1fr auto}\n .overview-image{width:76px;height:76px}\n}\n";document.head.appendChild(s);})();
(function(){
'use strict';
const VERSION='l7t1-rev6';
const V=(word,category,meaning,extra={})=>({word,category,meaning,...extra});
const vocab=[
 V('prima','Andere Wörter','sehr gut'),
 V('das Team','Nomen','eine Gruppe, die zusammenarbeitet',{article:'das',plural:'die Teams'}),
 V('wecken','Verben','dafür sorgen, dass jemand wach wird'),
 V('das Frühstück','Nomen','die erste Mahlzeit am Morgen',{article:'das',plural:'die Frühstücke'}),
 V('fertig sein','Redewendungen','bereit oder beendet sein'),
 V('los sein','Redewendungen','passieren; nicht in Ordnung sein'),
 V('schreiben','Verben','Wörter und Sätze aufschreiben'),
 V('die Mathematik','Nomen','Rechnen und Zahlen',{article:'die'}),
 V('der Test','Nomen','eine kurze Prüfung',{article:'der',plural:'die Tests'}),
 V('pünktlich','Andere Wörter','genau zur richtigen Zeit'),
 V('auf keinen Fall','Redewendungen','ganz sicher nicht'),
 V('auf jeden Fall','Redewendungen','ganz sicher'),
 V('schmecken','Verben','einen bestimmten Geschmack haben'),
 V('nach Hause','Redewendungen','in die eigene Wohnung oder zum eigenen Haus'),
 V('die Schule','Nomen','Ort zum Lernen',{article:'die',plural:'die Schulen'}),
 V('können','Verben','eine Fähigkeit oder Möglichkeit haben'),
 V('krank','Andere Wörter','nicht gesund'),
 V('der Arzt','Nomen','männliche Person, die Kranke behandelt',{article:'der',plural:'die Ärzte'}),
 V('die Ärztin','Nomen','weibliche Person, die Kranke behandelt',{article:'die',plural:'die Ärztinnen'}),
 V('backen','Verben','Kuchen oder Brot im Ofen machen'),
 V('singen','Verben','Musik mit der Stimme machen'),
 V('reiten','Verben','auf einem Pferd sitzen und fahren'),
 V('das Klavier','Nomen','ein Musikinstrument mit Tasten',{article:'das',plural:'die Klaviere'}),
 V('malen','Verben','ein Bild mit Farben machen'),
 V('der Ski','Nomen','ein langes Sportgerät für Schnee',{article:'der',plural:'die Skier'}),
 V('das Tennis','Nomen','eine Sportart mit Ball und Schläger',{article:'das'}),
 V('wollen','Verben','einen Wunsch oder Plan haben'),
 V('möchten','Verben','einen höflichen Wunsch ausdrücken'),
 V('endlich','Andere Wörter','nach langem Warten'),
 V('das Lied','Nomen','ein Text mit Musik',{article:'das',plural:'die Lieder'}),
 V('üben','Verben','etwas oft machen, damit man es besser kann'),
 V('der Text','Nomen','mehrere geschriebene Sätze',{article:'der',plural:'die Texte'}),
 V('die Übung','Nomen','eine Aufgabe zum Lernen',{article:'die',plural:'die Übungen'}),
 V('der Brief','Nomen','eine schriftliche Nachricht auf Papier',{article:'der',plural:'die Briefe'}),
 V('der Film','Nomen','eine Geschichte im Kino oder Fernsehen',{article:'der',plural:'die Filme'}),
 V('die Grammatik','Nomen','Regeln einer Sprache',{article:'die',plural:'die Grammatiken'}),
 V('das Spiel','Nomen','eine Aktivität mit Regeln und Spaß',{article:'das',plural:'die Spiele'}),
 V('das Fahrrad','Nomen','ein Fahrzeug mit zwei Rädern',{article:'das',plural:'die Fahrräder'}),
 V('die Gitarre','Nomen','ein Musikinstrument mit Saiten',{article:'die',plural:'die Gitarren'}),
 V('der Kuchen','Nomen','eine süße Speise aus dem Ofen',{article:'der',plural:'die Kuchen'}),
 V('die Hausaufgabe','Nomen','eine Aufgabe für zu Hause',{article:'die',plural:'die Hausaufgaben'}),
 V('der Freund','Nomen','eine männliche Person, die man gut kennt und mag',{article:'der',plural:'die Freunde'}),
 V('hören','Verben','mit den Ohren wahrnehmen'),
 V('machen','Verben','etwas tun oder herstellen'),
 V('lesen','Verben','einen geschriebenen Text verstehen'),
 V('sehen','Verben','mit den Augen wahrnehmen'),
 V('spielen','Verben','ein Spiel oder Instrument benutzen'),
 V('fahren','Verben','sich mit einem Fahrzeug bewegen'),
 V('treffen','Verben','mit einer Person zusammenkommen'),
 V('gehen','Verben','zu Fuß an einen Ort kommen'),
 V('sprechen','Verben','Wörter mit der Stimme sagen'),
 V('tanzen','Verben','sich zur Musik bewegen'),
 V('wandern','Verben','lange zu Fuß in der Natur gehen'),
 V('grillen','Verben','Essen auf einem Grill zubereiten'),
 V('schwimmen','Verben','sich im Wasser bewegen'),
 V('stricken','Verben','mit Wolle und Nadeln arbeiten'),
 V('jonglieren','Verben','mehrere Dinge in die Luft werfen und fangen'),
 V('kochen','Verben','eine warme Mahlzeit zubereiten'),
 V('fotografieren','Verben','Fotos machen'),
 V('einkaufen','Verben','Waren in einem Geschäft kaufen'),
 V('aufstehen','Verben','das Bett oder einen Sitzplatz verlassen')
];
const byWord=word=>vocab.find(v=>v.word===word)||{word};
const slug=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
vocab.forEach(v=>{v.asset=v.asset||slug(v.word);v.audioText=v.word;v.image=v.asset+'.webp';v.audioFile=v.asset+'.mp3';});
const choice=(prompt,answer,options,extra={})=>({kind:'choice',prompt,answer,options,...extra});
const input=(prompt,answer,extra={})=>({kind:'input',prompt,answer,...extra});
const order=(answer,extra={})=>({kind:'order',prompt:extra.prompt||'Ordne den Satz.',answer,tokens:answer.replace(/([?.!])$/,' $1').split(/\s+/),...extra});
const shuffleOptions=(answer,pool,index,count=4)=>{const rest=pool.filter(x=>x!==answer);const rotated=rest.slice(index%Math.max(1,rest.length)).concat(rest.slice(0,index%Math.max(1,rest.length)));return[answer,...rotated.slice(0,count-1)];};
const meaningItems=[
 choice('Man macht Musik mit seiner Stimme.','singen',['singen','schreiben','reiten','malen']),
 choice('Man sorgt dafür, dass eine Person nicht mehr schläft.','wecken',['wecken','schmecken','sehen','hören']),
 choice('Man kommt genau zur richtigen Zeit.','pünktlich',['pünktlich','krank','endlich','prima']),
 choice('Man ist nicht gesund.','krank',['krank','pünktlich','fertig','prima']),
 choice('Man macht Wörter und Sätze auf Papier oder am Computer.','schreiben',['schreiben','singen','schwimmen','spielen']),
 choice('Man sitzt auf einem Pferd.','reiten',['reiten','fahren','wandern','jonglieren']),
 choice('Man macht einen Kuchen im Ofen.','backen',['backen','kochen','grillen','malen']),
 choice('Man macht ein Bild mit Farben.','malen',['malen','fotografieren','lesen','schreiben']),
 choice('Man macht etwas oft, damit man es besser kann.','üben',['üben','treffen','gehen','wecken']),
 choice('Das bedeutet: ganz sicher nicht.','auf keinen Fall',['auf keinen Fall','auf jeden Fall','nach Hause','endlich']),
 choice('Das bedeutet: ganz sicher.','auf jeden Fall',['auf jeden Fall','auf keinen Fall','los sein','fertig sein']),
 choice('Das sagt man nach langem Warten.','endlich',['endlich','prima','krank','pünktlich']),
 choice('Dorthin geht man in die eigene Wohnung.','nach Hause',['nach Hause','in die Schule','zum Arzt','zum Team']),
 choice('Das Essen hat einen guten oder schlechten Geschmack.','schmecken',['schmecken','wecken','sprechen','sehen'])
];
const nouns=vocab.filter(v=>v.article);
const articlePluralItems=nouns.flatMap(v=>{
 const items=[input(`Schreibe den Artikel: ___ ${v.word.replace(/^(der|die|das)\s+/,'')}`,v.article,{hint:'Achte auf den Artikel in der Karteikarte.'})];
 if(v.plural)items.push(input(`Schreibe den Plural mit Artikel: ${v.word}`,v.plural,{hint:'Beginne mit „die“.',answers:[v.plural]}));
 return items;
});
const dictationWords=['das Team','das Frühstück','der Test','pünktlich','auf keinen Fall','auf jeden Fall','die Schule','der Arzt','die Ärztin','das Klavier','das Lied','der Text','die Übung','der Brief','der Film','die Grammatik','das Fahrrad','die Gitarre','der Kuchen','die Hausaufgabe'];
const dictationItems=dictationWords.map(word=>({kind:'dictation',prompt:'Höre und schreibe das Wort.',answer:word,...byWord(word)}));
const activities=['tanzen','Gitarre spielen','wandern','Fahrrad fahren','grillen','schwimmen','Freunde treffen','Kuchen backen','malen','Ski fahren','Tennis spielen','stricken','jonglieren','Klavier spielen','fotografieren'];
const activityAsset=a=>slug(a);
const hearingItems=activities.map((answer,index)=>({kind:'audio-choice',prompt:'Welche Aktivität hörst du?',answer,options:shuffleOptions(answer,activities,index,4),audioText:answer,audioFile:activityAsset(answer)+'.mp3'}));
const nounVerbItems=[
 choice('Lieder ___','hören',['hören','sehen','machen','lesen']),
 choice('Spiele ___','machen',['machen','lesen','üben','fahren']),
 choice('Texte ___','lesen',['lesen','hören','backen','treffen']),
 choice('Filme ___','sehen',['sehen','sprechen','fahren','machen']),
 choice('Grammatik ___','üben',['üben','lesen','spielen','gehen']),
 choice('Übungen ___','machen',['machen','sehen','fahren','treffen']),
 choice('Hausaufgaben ___','machen',['machen','hören','reiten','singen']),
 choice('Kuchen ___','backen',['backen','spielen','lesen','sprechen']),
 choice('Freunde ___','treffen',['treffen','fahren','üben','malen']),
 choice('Fahrrad ___','fahren',['fahren','spielen','gehen','machen']),
 choice('Ski ___','fahren',['fahren','spielen','hören','lesen']),
 choice('Tennis ___','spielen',['spielen','fahren','backen','sehen']),
 choice('Gitarre ___','spielen',['spielen','hören','sprechen','gehen']),
 choice('Klavier ___','spielen',['spielen','machen','fahren','treffen']),
 choice('zum Arzt ___','gehen',['gehen','fahren','machen','hören'])
];
const modalMixed=[
 choice('Ich ___ heute schwimmen.','will',['will','kann','wollen','könnt']),
 choice('Maria ___ sehr gut singen.','kann',['kann','will','können','wollt']),
 choice('Peter und Tom ___ Gitarre spielen.','können',['können','wollen','kann','will']),
 choice('Ihr ___ heute einen Film sehen.','wollt',['wollt','könnt','will','kann']),
 choice('Du ___ gut reiten.','kannst',['kannst','willst','könnt','wollen']),
 choice('Wir ___ morgen Kuchen backen.','wollen',['wollen','können','will','kann']),
 choice('Frau Becker ___ pünktlich nach Hause gehen.','will',['will','kann','wollen','können']),
 choice('Die Kinder ___ schon lesen.','können',['können','wollen','kann','will']),
 choice('Ali ___ heute nicht zum Arzt gehen.','will',['will','kann','wollt','könnt']),
 choice('Anna und Lea ___ gut malen.','können',['können','wollen','kann','will']),
 choice('Du ___ Französisch sprechen.','kannst',['kannst','willst','kann','will']),
 choice('Sie ___ heute Tennis spielen.','wollen',['wollen','können','will','kann']),
 choice('Der Arzt ___ den Brief schreiben.','will',['will','kann','wollen','können']),
 choice('Ich ___ noch nicht jonglieren.','kann',['kann','will','können','wollen']),
 choice('Ihr ___ am Samstag Fahrrad fahren.','wollt',['wollt','könnt','will','kann'])
];
const tableItem={kind:'conjugation-table',prompt:'Ordne die Verbformen zu.',rows:[
 {pronoun:'ich',koennen:'kann',wollen:'will'},{pronoun:'du',koennen:'kannst',wollen:'willst'},
 {pronoun:'er',koennen:'kann',wollen:'will'},{pronoun:'sie',koennen:'kann',wollen:'will'},
 {pronoun:'es',koennen:'kann',wollen:'will'},{pronoun:'wir',koennen:'können',wollen:'wollen'},
 {pronoun:'ihr',koennen:'könnt',wollen:'wollt'},{pronoun:'sie',koennen:'können',wollen:'wollen'},
 {pronoun:'Sie',koennen:'können',wollen:'wollen'}
]};
const verbForms=[
 input('Heute ___ Peter nicht in die Schule kommen. (können)','kann'),
 input('Am Samstag ___ Maria und Julius Tennis spielen. (wollen)','wollen'),
 input('In der Schule ___ du nicht laut sprechen. (können)','kannst'),
 input('Einen Kuchen ___ meine Freunde morgen backen. (wollen)','wollen'),
 input('Nach Hause ___ Frau Becker jetzt gehen. (möchten)','möchte'),
 input('Sehr gut Klavier ___ Anna schon spielen. (können)','kann'),
 input('Am Wochenende ___ wir schwimmen gehen. (möchten)','möchten'),
 input('Zum Frühstück ___ ich gern Tee trinken. (möchten)','möchte'),
 input('Heute ___ ihr Grammatik üben. (wollen)','wollt'),
 input('Den Text ___ Ali schon lesen. (können)','kann'),
 input('Morgen ___ du deine Freunde treffen. (möchten)','möchtest'),
 input('Auf keinen Fall ___ die Kinder zu spät kommen. (wollen)','wollen'),
 input('Sehr gut ___ Maria und Jana singen. (können)','können'),
 input('Nach der Schule ___ er Fahrrad fahren. (wollen)','will'),
 input('Zum Arzt ___ Sie heute gehen. (möchten)','möchten'),
 input('Die Übung ___ ich allein machen. (können)','kann'),
 input('Endlich ___ Peter nach Hause gehen. (wollen)','will'),
 input('Heute Abend ___ wir einen Film sehen. (möchten)','möchten')
];
const wollenMoechten=[
 choice('Im Café: Ich ___ einen Tee, bitte.','möchte',['möchte','will','kann','wollen']),
 choice('Zu einem Freund: Ich ___ heute Fußball spielen.','will',['will','möchte','kann','möchten']),
 choice('Höflich: ___ Sie noch einen Kaffee?','Möchten',['Möchten','Wollen','Können','Will']),
 choice('Peter sagt direkt: Ich ___ nach Hause.','will',['will','möchte','kann','wollen']),
 choice('Im Restaurant: Wir ___ zwei Salate, bitte.','möchten',['möchten','wollen','können','will']),
 choice('Die Kinder sagen: Wir ___ jetzt spielen!','wollen',['wollen','möchten','können','möchte']),
 choice('Höfliche Frage: ___ du mitkommen?','Möchtest',['Möchtest','Willst','Kannst','Möchten']),
 choice('Starker Plan: Maria ___ morgen Ski fahren.','will',['will','möchte','kann','wollen']),
 choice('Höflich beim Arzt: Ich ___ einen Termin.','möchte',['möchte','will','kann','wollen']),
 choice('Die Freunde haben einen festen Plan: Sie ___ grillen.','wollen',['wollen','möchten','können','will']),
 choice('Im Geschäft: Ich ___ dieses Spiel nicht.','möchte',['möchte','will','kann','wollen']),
 choice('Direkter Wunsch: Du ___ heute nicht lernen.','willst',['willst','möchtest','kannst','wollt']),
 choice('Höflich: Wir ___ gern bezahlen.','möchten',['möchten','wollen','können','will']),
 choice('Fester Wunsch: Ihr ___ den Film sehen.','wollt',['wollt','möchtet','könnt','will']),
 choice('Höflich zur Lehrerin: Ich ___ eine Frage stellen.','möchte',['möchte','will','kann','wollen'])
];
const statements=[
 'Ich kann sehr gut schwimmen.','Heute kann Maria sehr gut singen.','Peter will morgen Tennis spielen.',
 'Am Samstag wollen Maria und Julius Fahrrad fahren.','Du kannst den Text schon lesen.','Nach der Schule möchte Ali seine Freunde treffen.',
 'Wir wollen heute Grammatik üben.','Zum Frühstück möchte Frau Becker Tee trinken.','Ihr könnt sehr gut Gitarre spielen.',
 'Auf keinen Fall will Peter zu spät kommen.','Die Ärztin kann den Brief schreiben.','Endlich wollen die Kinder nach Hause gehen.',
 'Sie möchten am Wochenende Kuchen backen.','Im Team kann jeder gut arbeiten.','Heute möchte ich ein Lied hören.'
].map(s=>order(s));
const questions=[
 'Kann Maria gut schwimmen?','Willst du heute Tennis spielen?','Wann möchte Peter nach Hause gehen?',
 'Was können Maria und Julius gut?','Warum will die Ärztin heute früher gehen?','Könnt ihr Gitarre spielen?',
 'Wo möchten die Freunde grillen?','Will Ali einen Film sehen?','Wann wollen wir Grammatik üben?',
 'Kannst du den Text lesen?','Was möchte Frau Becker zum Frühstück trinken?','Warum können die Kinder nicht kommen?',
 'Wollt ihr am Samstag Fahrrad fahren?','Wer kann sehr gut singen?','Möchten Sie zum Arzt gehen?'
].map(s=>order(s,{prompt:'Ordne die Frage.'}));
const smileys={
 'sehr gut':'🤩','gut':'🙂','nicht so gut':'🙁','gar nicht':'😣'
};
const abilityData=[
 ['Sarah','Ski fahren','sehr gut'],['Ali','Klavier spielen','gut'],['Maria','jonglieren','gar nicht'],['Peter','schwimmen','nicht so gut'],['Jana','singen','sehr gut'],
 ['Omar','Fahrrad fahren','gut'],['Anna','reiten','nicht so gut'],['Lukas','Tennis spielen','gar nicht'],['Mina','malen','sehr gut'],['Yusuf','Gitarre spielen','gut'],
 ['Lea','stricken','nicht so gut'],['Tim','fotografieren','sehr gut'],['Nora','tanzen','gut'],['Samir','wandern','gar nicht'],['Eva','backen','nicht so gut']
];
const abilitySentence=(person,activity,level)=>`${person} kann ${level} ${activity}.`;
const smileChoice=abilityData.map(([person,activity,level],i)=>{const answer=abilitySentence(person,activity,level);const wrongLevels=Object.keys(smileys).filter(x=>x!==level);return{kind:'smiley-choice',person,activity,level,emoji:smileys[level],image:activityAsset(activity)+'.webp',prompt:'Welcher Satz passt?',answer,options:[answer,...wrongLevels.slice(i%3).concat(wrongLevels.slice(0,i%3)).slice(0,2).map(x=>abilitySentence(person,activity,x))]};});
const smileProduce=abilityData.map(([person,activity,level])=>({kind:'smiley-produce',person,activity,level,emoji:smileys[level],image:activityAsset(activity)+'.webp',prompt:'Bilde den Satz und sprich oder schreibe.',answer:abilitySentence(person,activity,level),answers:[abilitySentence(person,activity,level).replace(/\.$/,'')]}));
const qa=[
 choice('Kannst du gut schwimmen?','Ja, ich kann sehr gut schwimmen.',['Ja, ich kann sehr gut schwimmen.','Ja, ich will schwimmen.','Nein, ich möchte Tee.']),
 choice('Was willst du heute machen?','Ich will einen Film sehen.',['Ich will einen Film sehen.','Ich kann einen Film.','Ich bin ein Film.']),
 choice('Möchtest du mitkommen?','Ja, gern.',['Ja, gern.','Ich kann gut.','Auf keinen Fall gut.']),
 choice('Kann Maria Klavier spielen?','Nein, sie kann gar nicht Klavier spielen.',['Nein, sie kann gar nicht Klavier spielen.','Nein, sie will ein Klavier.','Ja, Maria ist Klavier.']),
 choice('Was möchtet ihr trinken?','Wir möchten Tee trinken.',['Wir möchten Tee trinken.','Wir können Tee.','Wir wollen pünktlich.']),
 choice('Will Peter heute lernen?','Nein, er will heute nicht lernen.',['Nein, er will heute nicht lernen.','Nein, er kann nicht Schule.','Ja, er möchte krank.']),
 choice('Wie gut kannst du singen?','Ich kann nicht so gut singen.',['Ich kann nicht so gut singen.','Ich will nicht so gut.','Ich singe ein Team.']),
 choice('Wann wollt ihr losgehen?','Wir wollen um acht Uhr losgehen.',['Wir wollen um acht Uhr losgehen.','Wir können acht Uhr.','Wir möchten pünktlich sein?']),
 choice('Wer kann gut reiten?','Anna kann gut reiten.',['Anna kann gut reiten.','Anna will ein Pferd gut.','Anna reitet können.']),
 choice('Warum möchtest du zum Arzt gehen?','Weil ich krank bin.',['Weil ich krank bin.','Weil ich pünktlich kann.','Weil ich Tennis möchte.']),
 choice('Wollt ihr Kuchen backen?','Ja, auf jeden Fall.',['Ja, auf jeden Fall.','Nein, sehr gut.','Ich kann Kuchen.']),
 choice('Kannst du den Brief schreiben?','Ja, das kann ich.',['Ja, das kann ich.','Ja, das will Brief.','Nein, ich bin Schreiben.']),
 choice('Was möchte Frau Becker üben?','Sie möchte Grammatik üben.',['Sie möchte Grammatik üben.','Sie kann Grammatik wollen.','Sie ist eine Übung.']),
 choice('Willst du nach Hause gehen?','Ja, ich will nach Hause gehen.',['Ja, ich will nach Hause gehen.','Ja, ich kann zu Hause.','Nein, ich möchte Schule.']),
 choice('Wie schmeckt das Frühstück?','Es schmeckt prima.',['Es schmeckt prima.','Es will prima.','Es kann Frühstück.'])
];
const readingItems=[
 {context:'Maria: Kannst du heute mit mir schwimmen gehen?\nJana: Heute kann ich leider nicht. Ich muss noch Grammatik üben. Aber morgen möchte ich gern schwimmen.\nMaria: Gut. Dann wollen wir morgen um drei Uhr losgehen.',prompt:'Jana kann heute schwimmen gehen.',answer:'Falsch',options:['Richtig','Falsch','Das steht nicht im Text.']},
 {context:'Maria: Kannst du heute mit mir schwimmen gehen?\nJana: Heute kann ich leider nicht. Ich muss noch Grammatik üben. Aber morgen möchte ich gern schwimmen.\nMaria: Gut. Dann wollen wir morgen um drei Uhr losgehen.',prompt:'Was muss Jana heute machen?',answer:'Grammatik üben',options:['Grammatik üben','Tennis spielen','einen Brief schreiben']},
 {context:'Maria: Kannst du heute mit mir schwimmen gehen?\nJana: Heute kann ich leider nicht. Ich muss noch Grammatik üben. Aber morgen möchte ich gern schwimmen.\nMaria: Gut. Dann wollen wir morgen um drei Uhr losgehen.',prompt:'Wann wollen sie losgehen?',answer:'morgen um drei Uhr',options:['heute um drei Uhr','morgen um drei Uhr','morgen um vier Uhr']},
 {context:'Peter: Ich will am Samstag Kuchen backen. Kannst du mir helfen?\nAli: Ja, gern. Ich kann gut backen. Danach möchte ich einen Film sehen.',prompt:'Peter will am Samstag Kuchen backen.',answer:'Richtig',options:['Richtig','Falsch','Das steht nicht im Text.']},
 {context:'Peter: Ich will am Samstag Kuchen backen. Kannst du mir helfen?\nAli: Ja, gern. Ich kann gut backen. Danach möchte ich einen Film sehen.',prompt:'Was kann Ali gut?',answer:'backen',options:['backen','schwimmen','reiten']},
 {context:'Peter: Ich will am Samstag Kuchen backen. Kannst du mir helfen?\nAli: Ja, gern. Ich kann gut backen. Danach möchte ich einen Film sehen.',prompt:'Was möchte Ali danach machen?',answer:'einen Film sehen',options:['einen Film sehen','Grammatik üben','nach Hause schreiben']},
 {context:'Lehrerin: Könnt ihr den Text schon lesen?\nMina: Ich kann ihn lesen, aber Omar kann noch nicht alle Wörter verstehen.\nOmar: Ich möchte den Text noch einmal hören.',prompt:'Mina kann den Text lesen.',answer:'Richtig',options:['Richtig','Falsch','Das steht nicht im Text.']},
 {context:'Lehrerin: Könnt ihr den Text schon lesen?\nMina: Ich kann ihn lesen, aber Omar kann noch nicht alle Wörter verstehen.\nOmar: Ich möchte den Text noch einmal hören.',prompt:'Wer versteht noch nicht alle Wörter?',answer:'Omar',options:['Omar','Mina','die Lehrerin']},
 {context:'Lehrerin: Könnt ihr den Text schon lesen?\nMina: Ich kann ihn lesen, aber Omar kann noch nicht alle Wörter verstehen.\nOmar: Ich möchte den Text noch einmal hören.',prompt:'Was möchte Omar?',answer:'den Text noch einmal hören',options:['den Text noch einmal hören','einen Test schreiben','Klavier spielen']},
 {context:'Sara: Willst du morgen Fahrrad fahren?\nNora: Auf jeden Fall. Aber ich kann nicht so schnell fahren.\nSara: Kein Problem. Wir wollen langsam fahren.',prompt:'Nora will nicht Fahrrad fahren.',answer:'Falsch',options:['Richtig','Falsch','Das steht nicht im Text.']},
 {context:'Sara: Willst du morgen Fahrrad fahren?\nNora: Auf jeden Fall. Aber ich kann nicht so schnell fahren.\nSara: Kein Problem. Wir wollen langsam fahren.',prompt:'Wie gut kann Nora schnell fahren?',answer:'nicht so gut',options:['sehr gut','nicht so gut','gar nicht']},
 {context:'Sara: Willst du morgen Fahrrad fahren?\nNora: Auf jeden Fall. Aber ich kann nicht so schnell fahren.\nSara: Kein Problem. Wir wollen langsam fahren.',prompt:'Wie wollen die beiden fahren?',answer:'langsam',options:['langsam','sehr schnell','gar nicht']},
 {context:'Arzt: Was ist los?\nTim: Ich bin krank und möchte nach Hause gehen.\nArzt: Sie sollen heute nicht arbeiten. Sie können sich ausruhen.',prompt:'Tim ist krank.',answer:'Richtig',options:['Richtig','Falsch','Das steht nicht im Text.']},
 {context:'Arzt: Was ist los?\nTim: Ich bin krank und möchte nach Hause gehen.\nArzt: Sie sollen heute nicht arbeiten. Sie können sich ausruhen.',prompt:'Wohin möchte Tim gehen?',answer:'nach Hause',options:['nach Hause','in die Schule','zum Tennis']},
 {context:'Arzt: Was ist los?\nTim: Ich bin krank und möchte nach Hause gehen.\nArzt: Sie sollen heute nicht arbeiten. Sie können sich ausruhen.',prompt:'Was kann Tim machen?',answer:'sich ausruhen',options:['sich ausruhen','einen Test schreiben','Ski fahren']}
].map(x=>({kind:'choice',...x}));
const examItems=[
 choice('Man macht Musik mit der Stimme.','singen',['singen','schreiben','reiten']),
 input('Schreibe den Artikel: ___ Lied','das'),
 input('Schreibe den Plural mit Artikel: der Brief','die Briefe'),
 choice('Maria ___ sehr gut schwimmen.','kann',['kann','will','möchte']),
 input('Heute ___ wir Grammatik üben. (wollen)','wollen'),
 choice('Im Café: Ich ___ einen Tee, bitte.','möchte',['möchte','will','kann']),
 order('Heute kann Peter gut singen.'),
 order('Kann Maria gut schwimmen?',{prompt:'Ordne die Frage.'}),
 choice('Lieder ___','hören',['hören','sehen','machen']),
 choice('Wie gut kann Sarah Ski fahren?','Sarah kann sehr gut Ski fahren.',['Sarah kann sehr gut Ski fahren.','Sarah kann gar nicht Ski fahren.','Sarah will Ski fahren.']),
 choice('Möchtest du mitkommen?','Ja, gern.',['Ja, gern.','Ich kann gern.','Nein, ich bin mitkommen.']),
 input('Nach Hause ___ Frau Becker jetzt gehen. (möchten)','möchte'),
 choice('Das bedeutet: ganz sicher nicht.','auf keinen Fall',['auf keinen Fall','auf jeden Fall','prima']),
 choice('Was kann Ali gut?','backen',['backen','reiten','schwimmen'],{context:'Ali kann sehr gut Kuchen backen. Er möchte danach einen Film sehen.'}),
 choice('Ali möchte danach einen Film sehen.','Richtig',['Richtig','Falsch','Das steht nicht im Text.'],{context:'Ali kann sehr gut Kuchen backen. Er möchte danach einen Film sehen.'})
];
const tasks=[
 {id:'karteikarten',title:'Karteikarten',icon:'🃏',description:'Lerne die Wörter.',kind:'cards',items:vocab},
 {id:'bild-erklaerung-wort',title:'Bedeutung → Wort',icon:'💡',description:'Finde das passende Wort.',kind:'choice',items:meaningItems},
 {id:'artikel-plural',title:'Artikel und Plural',icon:'der',description:'Schreibe Artikel und Pluralform.',kind:'input',items:articlePluralItems},
 {id:'wortdiktat',title:'Hören und Schreiben',icon:'🎧✍️',description:'Höre und schreibe das Wort.',kind:'dictation',items:dictationItems},
 {id:'hoeren-erkennen',title:'Hören und Erkennen',icon:'🔉',description:'Höre und erkenne die Aktivität.',kind:'audio-choice',items:hearingItems},
 {id:'nomen-verb',title:'Nomen-Verb-Verbindungen',icon:'↔️',description:'Finde das passende Verb.',kind:'choice',items:nounVerbItems},
 {id:'koennen-wollen',title:'Können oder wollen',icon:'K/W',description:'Wähle das passende Verb und die richtige Form.',kind:'choice',items:modalMixed},
 {id:'konjugationstabelle',title:'Verbformen zuordnen',icon:'⇄',description:'Ordne die Formen von „können“ und „wollen“ zu.',kind:'conjugation-table',items:[tableItem]},
 {id:'verbformen-satz',title:'Verbformen im Satz',icon:'✓',description:'Setze können, wollen oder möchten richtig ein.',kind:'input',items:verbForms},
 {id:'wollen-moechten',title:'Wollen oder möchten',icon:'☕',description:'Wähle „wollen“ oder „möchten“.',kind:'choice',items:wollenMoechten},
 {id:'aussagen-ordnen',title:'Aussagesätze',icon:'1-2-3',description:'Ordne den Satz.',kind:'order',items:statements},
 {id:'fragesaetze',title:'Fragesätze',icon:'?',description:'Ordne die Frage.',kind:'order',items:questions},
 {id:'faehigkeiten-abstufen',title:'Wie gut?',icon:'🙂',description:'Wähle den passenden Satz.',kind:'smiley-choice',items:smileChoice},
 {id:'bildimpulse',title:'Sprechen und Schreiben',icon:'🎤✍️',description:'Bilde den Satz und sprich oder schreibe.',kind:'smiley-produce',items:smileProduce},
 {id:'fragen-antworten',title:'Fragen und Antworten',icon:'↔️',description:'Finde die passende Antwort.',kind:'choice',items:qa},
 {id:'lesen-dialoge',title:'Lesen: kurze Dialoge',icon:'📖',description:'Lies den Dialog und entscheide.',kind:'choice',items:readingItems},
 {id:'pruefung',title:'Themenprüfung',icon:'⭐',description:'Zeige, was du gelernt hast.',kind:'mixed',exam:true,items:examItems}
];
const theme={title:'können, wollen und möchten',subtitle:'Lektion 7 · Thema 1',goal:'Du lernst die Wörter aus Thema 1 und sprichst über Fähigkeiten, Wünsche und Pläne.',lessonColor:'blue',tasks};
window.L7T1_VERSION=VERSION;
window.L7T1_VOCAB=vocab;
window.L7T1_MEDIA={imageBase:'https://sprachpilot.b-cdn.net/',audioBase:'https://sprachpilot.b-cdn.net/Audio/'};
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(()=>{window.L7_THEME=theme;return theme;});
})();

(function(){
'use strict';
const VERSION=window.L7T1_VERSION||'l7t1-rev6';
const THEME_NO=1;
const root=document.getElementById('app');
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.appendChild(s);});}
Promise.resolve(window.L7_THEME_READY).then(()=>load(`../shared/l7-state.js?v=${VERSION}`)).then(start).catch(fail);
function fail(error){console.error(error);if(root)root.innerHTML='<div class="container"><section class="card finish-box"><h2>Die Inhalte konnten nicht geladen werden.</h2><button class="btn" onclick="location.reload()">Neu laden</button></section></div>';}
function start(){
 const S=window.L7S,T=window.L7_THEME;
 let runtime=null,order=[],cardFlipped=false,writeOpen=false,tableModel=null,currentAudio=null;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const norm=value=>S.norm(value).replace(/\s+/g,' ').trim();
 const profile=()=>S.profile()||{};
 const role=()=>String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 const dashboard=()=>role()==='teacher'?'/teacher/index.html':'/student-dashboard/index.html';
 const slug=value=>String(value||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
 const basename=value=>String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';
 const uniq=list=>[...new Set(list.filter(Boolean))];
 const encodedPath=(base,file)=>base+String(file).split('/').map(encodeURIComponent).join('/');
 function imageCandidates(item={}){
  const word=item.word||item.activity||item.answer||item.prompt||'';
  const stem=item.asset||slug(word),raw=basename(item.image);
  const names=uniq([raw,stem&&stem+'.webp',stem&&stem.replace(/-/g,'_')+'.webp']);
  const bases=['https://sprachpilot.b-cdn.net/','https://sprachpilot.b-cdn.net/Bilder/','https://sprachpilot.b-cdn.net/bilder/'];
  return uniq(names.flatMap(name=>bases.map(base=>encodedPath(base,name))));
 }
 function audioCandidates(item={}){
  const word=item.audioText||item.word||item.activity||item.answer||'';
  const stem=item.asset||slug(word),raw=basename(item.audioFile);
  const names=uniq([raw,stem&&stem+'.mp3',stem&&stem.replace(/-/g,'_')+'.mp3']);
  const bases=['https://sprachpilot.b-cdn.net/Audio/','https://sprachpilot.b-cdn.net/audio/','https://sprachpilot.b-cdn.net/'];
  return uniq(names.flatMap(name=>bases.map(base=>encodedPath(base,name))));
 }
 function mediaImage(item,alt='Bild',className='task-img-box',linked=false){
  const list=imageCandidates(item),json=esc(JSON.stringify(list)),first=list[0]||'';
  if(!first)return'';
  const img=`<img src="${esc(first)}" data-image-candidates='${json}' data-image-index="0" alt="${esc(alt)}" loading="lazy"><div class="image-fallback" hidden>${esc(alt)}</div>`;
  return `<div class="${className}">${linked?`<a class="bunny-image-link" href="${esc(first)}" target="_blank" rel="noopener">${img}</a>`:img}</div>`;
 }
 function audioButton(item,label='Anhören',className='btn secondary'){
  const list=audioCandidates(item);return `<button type="button" class="${className}" data-action="play-audio" data-audio-candidates='${esc(JSON.stringify(list))}' data-audio-text="${esc(item.audioText||item.word||item.activity||item.answer||'')}">🔊 ${esc(label)}</button>`;
 }
 function bindImages(scope=document){
  scope.querySelectorAll('img[data-image-candidates]').forEach(img=>{if(img.dataset.bound==='1')return;img.dataset.bound='1';img.addEventListener('error',()=>{let list=[];try{list=JSON.parse(img.dataset.imageCandidates||'[]');}catch(e){}let index=Number(img.dataset.imageIndex||0)+1;if(index<list.length){img.dataset.imageIndex=String(index);img.src=list[index];}else{img.hidden=true;const fallback=img.parentElement?.querySelector('.image-fallback')||img.nextElementSibling;if(fallback)fallback.hidden=false;}});});
 }
 function playAudio(button){
  let list=[];try{list=JSON.parse(button.dataset.audioCandidates||'[]');}catch(e){}
  const text=button.dataset.audioText||'';let index=0;
  if(currentAudio){try{currentAudio.pause();currentAudio.src='';}catch(e){}}
  const tryNext=()=>{if(index>=list.length){technical('Die Bunny-Audiodatei wurde nicht gefunden.');if(text)S.say(text);return;}const audio=new Audio(list[index++]);currentAudio=audio;audio.preload='auto';audio.onerror=tryNext;audio.play().catch(tryNext);};
  tryNext();
 }
 function header(title,showReset=false,page='theme'){
  const p=profile(),name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(S.preview()?'Lehrer-Vorschau':'Schüler/in');
  const back=page==='theme'?'../index.html':'index.html';
  return `<header class="topbar"><div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · A1 Lektion 7 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}</span><a class="account-link" href="${dashboard()}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a></div></div><nav class="nav"><a class="btn secondary" href="${back}">← Zurück</a><a class="btn secondary" href="uebersicht.html?v=${VERSION}">Übersicht</a>${showReset?'<button class="btn danger-btn" id="resetTheme">Fortschritte löschen</button>':''}</nav></header>`;
 }
 const previewNote=()=>S.preview()?'<div class="preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':'';
 const taskFile=t=>`task.html?task=${encodeURIComponent(t.id)}&v=${VERSION}`;
 const taskNumber=t=>Math.max(1,T.tasks.indexOf(t)+1);
 function progress(t){const st=S.load(THEME_NO,t.id,t.items.length),p=S.pct(THEME_NO,t.id,t.items.length);return `<div class="task-progress-row"><span>${st.done.length} fehlerfrei · ${t.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`;}
 function renderTheme(){
  const tasks=T.tasks||[],avg=Math.round(tasks.reduce((sum,t)=>sum+S.pct(THEME_NO,t.id,t.items.length),0)/Math.max(1,tasks.length)),finished=tasks.filter(t=>S.pct(THEME_NO,t.id,t.items.length)>=100).length;
  root.innerHTML=`<div class="container">${header(T.title,true,'theme')}${previewNote()}<section class="card progress-card"><div class="circle">${avg}%</div><div><h2>Dein Fortschritt</h2><p class="small">${finished} / ${tasks.length} Aufgaben abgeschlossen</p><div class="progress"><div class="bar" style="width:${avg}%"></div></div><p class="small">${esc(T.goal)}</p></div></section><section id="taskGrid"><div class="grid">${tasks.map((t,index)=>{const p=S.pct(THEME_NO,t.id,t.items.length),locked=t.exam&&!S.allDone(THEME_NO),done=p>=100;return `<a class="module ${locked?'exam-locked':''}" ${locked?'aria-disabled="true"':`href="${taskFile(t)}"`}><div class="num">${index+1}. ${esc(t.title)}</div><div class="big-icon">${t.icon||'▶'}</div><p class="small">${esc(locked?'Die Prüfung wird geöffnet, wenn alle vorherigen Aufgaben 100% erreicht haben.':t.description)}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${locked?'Gesperrt':done?'Fertig':'Starten'}</div></a>`;}).join('')}</div></section><footer>© SprachPilot</footer></div>`;
  document.getElementById('resetTheme')?.addEventListener('click',()=>S.reset(THEME_NO));
  if(location.hash)setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),80);
 }
 function renderOverview(){
  const categories=['Nomen','Verben','Redewendungen','Andere Wörter'];
  const vocab=window.L7T1_VOCAB||[];
  root.innerHTML=`<div class="container">${header('Übersicht',false,'overview')}<section class="card overview-intro"><div class="task-title-block"><span class="task-number">Wortschatzübersicht</span><h1>Wörter aus Thema 1</h1></div><p>Hier siehst und hörst du nur die einzelnen Wörter und Redewendungen aus diesem Thema.</p></section>${categories.map(category=>{const words=vocab.filter(v=>v.category===category);if(!words.length)return'';return `<section class="card vocabulary-section"><div class="section-heading"><h2>${esc(category)}</h2><span>${words.length} Wörter</span></div><div class="overview-grid">${words.map(item=>`<article class="overview-word">${mediaImage(item,item.word,'overview-image',true)}<div class="overview-word-main"><h3>${esc(item.word)}</h3>${item.plural?`<p class="small">Plural: ${esc(item.plural)}</p>`:''}</div>${audioButton(item,'Hören','audio-circle')}</article>`).join('')}</div></section>`;}).join('')}<div id="tech"></div><footer>© SprachPilot</footer></div>`;
  bindAll();
 }
 function currentItem(){return runtime.t.items[runtime.index];}
 function accepted(item){return [item.answer,item.word,...(item.answers||[])].filter(Boolean);}
 function taskInstruction(t,item){if(t.kind==='cards')return'';return item.instruction||t.description||item.prompt||'';}
 function taskTop(t,item){const instruction=taskInstruction(t,item);return `<div class="task-title-block"><span class="task-number">Aufgabe ${taskNumber(t)}</span><h1>${esc(t.title)}</h1></div>${progress(t)}${instruction?`<div class="task-instruction">${esc(instruction)}</div>`:''}`;}
 function contextHtml(item){return item.context?`<div class="dialog-box">${esc(item.context).replace(/\n/g,'<br>')}</div>`:'';}
 function feedbackHtml(item){const st=S.load(THEME_NO,runtime.t.id,runtime.t.items.length),tries=st.tries||0;if(tries===1)return'<div class="no">Noch nicht richtig. Versuche es noch einmal.</div>';if(tries===2)return `<div class="hint"><strong>Hinweis:</strong> ${esc(item.hint||genericHint(item))}</div>`;if(tries>=3)return `<div class="no"><strong>Lösung:</strong> ${esc(item.answer||item.word||'')}<br>Gib die richtige Antwort selbst ein. Die Aufgabe kommt später noch einmal.</div>`;return'';}
 function genericHint(item){const answer=String(item.answer||item.word||'');if((runtime.t.kind||item.kind)==='order')return'Achte auf Verbposition, Subjekt und Satzzeichen.';return answer?`Die Lösung beginnt mit „${answer.charAt(0)}“.`:'Lies die Aufgabe noch einmal.';}
 function inputHtml(label='Schreibe deine Antwort.',hidden=false){return `<div class="answer-area" ${hidden?'hidden':''}><label for="answerInput">${esc(label)}</label><div class="answer-row"><input id="answerInput" autocomplete="off"><button type="button" class="btn" data-action="check">Kontrollieren</button></div></div>`;}
 function optionsHtml(item){const values=S.shuffle(item.options||[]),letters=values.length===3;return `<div class="choice-grid ${letters?'abc-list':''}">${values.map((value,index)=>`<button type="button" class="choice" data-answer="${esc(value)}">${letters?`<span class="abc-letter">${String.fromCharCode(65+index)}</span>`:''}<span>${esc(value)}</span></button>`).join('')}</div>`;}
 function cardHtml(item){
  return `<div class="flip-wrap"><div id="flipCard" class="flip-card ${cardFlipped?'flipped':''}" tabindex="0"><div class="flip-face flip-front">${mediaImage(item,item.word,'card-image',true)}<div class="card-translation-box"><span>Bedeutung</span><strong>${esc(item.meaning||'')}</strong></div><div class="flip-note">Karte umdrehen</div></div><div class="flip-face flip-back"><div class="flip-word">${esc(item.word)}</div>${item.plural?`<div class="card-details"><div><span>Plural</span><strong>${esc(item.plural)}</strong></div></div>`:''}${audioButton(item,'Hören','btn secondary card-listen-btn')}</div></div></div><div class="actions card-actions"><button class="btn" data-action="card-mic">🎤 Sprechen</button><button class="btn secondary" data-action="card-write">✍️ Schreiben</button>${cardFlipped?'<button class="btn" data-action="card-next">Weiter</button>':''}</div><div id="cardWrite" ${writeOpen?'':'hidden'}>${inputHtml('Wort schreiben')}</div>`;
 }
 function orderHtml(item){const used={};order.forEach(token=>used[token]=(used[token]||0)+1);const tokens=S.shuffle(item.tokens||[]);return `<div id="orderAnswer" class="order-answer">${order.length?esc(order.join(' ')):'Klicke die Wörter in der richtigen Reihenfolge an.'}</div><div class="token-grid">${tokens.map((token,index)=>{const disabled=used[token]>0;if(disabled)used[token]--;return `<button type="button" class="token" data-token="${esc(token)}" data-token-index="${index}" ${disabled?'disabled':''}>${esc(token)}</button>`;}).join('')}</div><div class="actions centered"><button class="btn" data-action="check-order">Kontrollieren</button><button class="btn secondary" data-action="undo">Zurück</button><button class="btn ghost" data-action="reset-order">Neu</button></div>`;}
 function smilePrompt(item){return `<div class="smiley-prompt"><div class="person-name">${esc(item.person)}</div>${mediaImage(item,item.activity,'smiley-image',true)}<div class="ability-smiley" aria-label="${esc(item.level)}">${item.emoji}</div></div>`;}
 function initTable(item){if(tableModel&&tableModel.item===item)return;const tokens=[];item.rows.forEach((row,rowIndex)=>{tokens.push({id:`k-${rowIndex}`,value:row.koennen});tokens.push({id:`w-${rowIndex}`,value:row.wollen});});tableModel={item,tokens,assignments:{},selected:null};}
 function tableHtml(item){initTable(item);const used=new Set(Object.values(tableModel.assignments).map(token=>token?.id).filter(Boolean));return `<div class="conj-table-wrap"><table class="conj-table"><thead><tr><th>Pronomen</th><th>können</th><th>wollen</th></tr></thead><tbody>${item.rows.map((row,index)=>`<tr><th>${esc(row.pronoun)}</th><td><button class="drop-zone" data-cell="${index}:koennen">${esc(tableModel.assignments[`${index}:koennen`]?.value||'hier ablegen')}</button></td><td><button class="drop-zone" data-cell="${index}:wollen">${esc(tableModel.assignments[`${index}:wollen`]?.value||'hier ablegen')}</button></td></tr>`).join('')}</tbody></table></div><div class="verb-bank">${tableModel.tokens.filter(token=>!used.has(token.id)).map(token=>`<button type="button" draggable="true" class="verb-chip ${tableModel.selected===token.id?'selected':''}" data-table-token="${token.id}">${esc(token.value)}</button>`).join('')}</div><div class="actions centered"><button class="btn" data-action="check-table">Kontrollieren</button><button class="btn secondary" data-action="reset-table">Neu</button></div>`;}
 function renderTaskBody(t,item){const kind=item.kind||t.kind||'choice';
  if(kind==='cards')return cardHtml(item);
  if(kind==='choice')return `${item.image?mediaImage(item,item.prompt||item.answer):''}${item.prompt?`<h2 class="question">${esc(item.prompt)}</h2>`:''}${optionsHtml(item)}`;
  if(kind==='input')return `${item.prompt?`<h2 class="question">${esc(item.prompt)}</h2>`:''}${inputHtml('Schreibe die vollständige Antwort.')}`;
  if(kind==='dictation')return `<div class="audio-panel large-audio">${audioButton(item,'Wort hören','btn')}</div>${inputHtml('Schreibe das gehörte Wort.')}`;
  if(kind==='audio-choice')return `<div class="audio-panel large-audio">${audioButton(item,'Aktivität hören','btn')}</div><h2 class="question">${esc(item.prompt)}</h2>${optionsHtml(item)}`;
  if(kind==='order')return orderHtml(item);
  if(kind==='smiley-choice')return `${smilePrompt(item)}<h2 class="question">${esc(item.prompt)}</h2>${optionsHtml(item)}`;
  if(kind==='smiley-produce')return `${smilePrompt(item)}<h2 class="question">${esc(item.prompt)}</h2><div class="mode-actions"><button class="btn" data-action="mic">🎤 Sprechen</button><button class="btn secondary" data-action="write">✍️ Schreiben</button></div>${inputHtml('Schreibe den vollständigen Satz.',!writeOpen)}`;
  if(kind==='conjugation-table')return tableHtml(item);
  return optionsHtml(item);
 }
 function renderTask(){
  const t=runtime.t,item=currentItem();document.title=`Aufgabe ${taskNumber(t)} · ${t.title}`;
  root.innerHTML=`<div class="container">${header(t.title,false,'task')}${previewNote()}<section class="card task-card">${taskTop(t,item)}<div class="question-card">${contextHtml(item)}${renderTaskBody(t,item)}<div id="feedback" class="feedback">${feedbackHtml(item)}</div><div id="tech"></div></div></section><footer>© SprachPilot</footer></div>`;
  bindAll();
 }
 function openTask(id){
  const t=T.tasks.find(task=>task.id===id);if(!t){root.innerHTML=`<div class="container">${header('Aufgabe',false,'task')}<section class="card finish-box"><h2>Aufgabe nicht gefunden</h2><a class="btn" href="index.html">Zur Übersicht</a></section></div>`;return;}
  if(t.exam&&!S.allDone(THEME_NO)){root.innerHTML=`<div class="container">${header(t.title,false,'task')}<section class="card finish-box"><div class="finish-icon">🔒</div><h2>Prüfung gesperrt</h2><p>Schließe zuerst alle anderen Aufgaben mit 100% ab.</p><a class="btn" href="index.html">Zur Übersicht</a></section></div>`;return;}
  const st=S.load(THEME_NO,t.id,t.items.length);if(st.done.length>=t.items.length){finish(t);return;}
  runtime={t,index:S.index(THEME_NO,t.id,t.items.length)};order=[];cardFlipped=false;writeOpen=false;tableModel=null;renderTask();
 }
 function correctValue(item,value){const compact=v=>norm(v).replace(/\s+/g,'');return accepted(item).some(answer=>norm(answer)===norm(value)||((item.kind||runtime.t.kind)==='order'&&compact(answer)===compact(value)));}
 function check(value){const item=currentItem();if(!String(value||'').trim())return;const ok=correctValue(item,value);S.attempt(THEME_NO,runtime.t.id,runtime.t.items.length,runtime.index,ok);if(ok){markRight();return;}S.wrong(THEME_NO,runtime.t.id,runtime.t.items.length);writeOpen=true;renderTask();}
 function markRight(){const st=S.load(THEME_NO,runtime.t.id,runtime.t.items.length),repeat=st.hadWrong||st.tries>0;S.right(THEME_NO,runtime.t.id,runtime.t.items.length);root.querySelectorAll('button,input,textarea,audio').forEach(el=>el.disabled=true);const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML=`<div class="ok">Richtig.${repeat?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;setTimeout(()=>openTask(runtime.t.id),600);}
 function revealCard(){if(cardFlipped)return;cardFlipped=true;renderTask();}
 function cardNext(){S.attempt(THEME_NO,runtime.t.id,runtime.t.items.length,runtime.index,true);S.right(THEME_NO,runtime.t.id,runtime.t.items.length);openTask(runtime.t.id);}
 function mic(cardMode=false){const item=currentItem();S.mic(item,answers=>{const exact=answers.find(answer=>correctValue(item,answer));check(exact||answers[0]||'');},technical);}
 function token(button){if(button.disabled)return;order.push(button.dataset.token);button.disabled=true;const answer=document.getElementById('orderAnswer');if(answer)answer.textContent=order.join(' ');}
 function undo(){if(!order.length)return;order.pop();renderTask();}
 function resetOrder(){order=[];renderTask();}
 function assignTable(tokenId,cell){if(!tableModel)return;for(const key of Object.keys(tableModel.assignments)){if(tableModel.assignments[key]?.id===tokenId)delete tableModel.assignments[key];}tableModel.assignments[cell]=tableModel.tokens.find(token=>token.id===tokenId);tableModel.selected=null;renderTask();}
 function checkTable(){const item=currentItem();let ok=true;item.rows.forEach((row,index)=>{if(tableModel.assignments[`${index}:koennen`]?.value!==row.koennen)ok=false;if(tableModel.assignments[`${index}:wollen`]?.value!==row.wollen)ok=false;});S.attempt(THEME_NO,runtime.t.id,runtime.t.items.length,runtime.index,ok);if(ok){markRight();return;}S.wrong(THEME_NO,runtime.t.id,runtime.t.items.length);const fb=document.getElementById('feedback');if(fb)fb.innerHTML=feedbackHtml(item);}
 function resetTable(){if(tableModel){tableModel.assignments={};tableModel.selected=null;}renderTask();}
 function technical(message){const target=document.getElementById('tech');if(target)target.innerHTML=`<div class="hint">${esc(message)}</div>`;}
 function finish(t){const st=S.load(THEME_NO,t.id,t.items.length),index=T.tasks.indexOf(t),next=T.tasks[index+1],score=t.exam?Math.round((st.firstCorrect||0)/Math.max(1,t.items.length)*100):100,stars=score>=100?3:score>=70?2:score>=50?1:0;root.innerHTML=`<div class="container">${header(t.title,false,'task')}<section class="card finish-box"><div class="finish-icon">✓</div><h2>Geschafft!</h2>${t.exam?`<div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${score}% beim ersten Versuch</p>`:'<p>Du hast diese Aufgabe fehlerfrei abgeschlossen.</p>'}<div class="actions centered">${next?`<a class="btn" href="${taskFile(next)}">Weiter →</a>`:''}<a class="btn secondary" href="index.html">Zur Aufgabenübersicht</a></div></section><footer>© SprachPilot</footer></div>`;}
 function bindAll(){
  bindImages(root);
  root.onclick=event=>{const button=event.target.closest('button');if(!button){if(event.target.closest('#flipCard'))revealCard();return;}if(button.dataset.answer!==undefined){check(button.dataset.answer);return;}if(button.dataset.token!==undefined){token(button);return;}if(button.dataset.tableToken){tableModel.selected=button.dataset.tableToken;renderTask();return;}if(button.dataset.cell){if(tableModel?.selected)assignTable(tableModel.selected,button.dataset.cell);return;}const action=button.dataset.action;if(action==='play-audio')playAudio(button);else if(action==='check')check(document.getElementById('answerInput')?.value);else if(action==='check-order')check(order.join(' '));else if(action==='undo')undo();else if(action==='reset-order')resetOrder();else if(action==='card-mic')mic(true);else if(action==='card-write'){writeOpen=true;renderTask();}else if(action==='card-next')cardNext();else if(action==='mic')mic(false);else if(action==='write'){writeOpen=true;renderTask();}else if(action==='check-table')checkTable();else if(action==='reset-table')resetTable();};
  root.querySelectorAll('[data-table-token]').forEach(chip=>{chip.addEventListener('dragstart',event=>event.dataTransfer.setData('text/plain',chip.dataset.tableToken));});
  root.querySelectorAll('[data-cell]').forEach(zone=>{zone.addEventListener('dragover',event=>event.preventDefault());zone.addEventListener('drop',event=>{event.preventDefault();assignTable(event.dataTransfer.getData('text/plain'),zone.dataset.cell);});});
  document.getElementById('answerInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')check(event.target.value);});
 }
 const page=document.body.dataset.page||'theme';
 if(page==='overview')renderOverview();else if(page==='task')openTask(new URLSearchParams(location.search).get('task')||T.tasks[0]?.id);else renderTheme();
}
})();
