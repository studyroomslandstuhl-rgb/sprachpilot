(function(){
'use strict';
if(window.__SP_L7T3_REBUILD_V1)return;window.__SP_L7T3_REBUILD_V1=true;
const T2=[
 ['lernen','gelernt','haben'],['machen','gemacht','haben'],['schreiben','geschrieben','haben'],['hören','gehört','haben'],['spielen','gespielt','haben'],['sehen','gesehen','haben'],['lesen','gelesen','haben'],['kaufen','gekauft','haben'],['sprechen','gesprochen','haben'],['arbeiten','gearbeitet','haben'],['treffen','getroffen','haben'],['frühstücken','gefrühstückt','haben'],['schlafen','geschlafen','haben'],['kochen','gekocht','haben'],['essen','gegessen','haben'],['trinken','getrunken','haben'],['sagen','gesagt','haben'],['leben','gelebt','haben'],['kosten','gekostet','haben'],['grillen','gegrillt','haben'],['suchen','gesucht','haben'],['wohnen','gewohnt','haben']
].map(([v,p,aux])=>({v,p,aux}));
const T3=()=>window.L7T3_FORMS||[];
const wrong={
 gegangen:['gegeht','gegangen','gegehten','gangen'],gefahren:['gefahrt','gefahren','gefahrenen','fahrt'],gekommen:['gekommt','gekommen','kommen','gekommtet'],geflogen:['gefliegt','geflogen','fliegt','geflogt'],gewandert:['gewandern','gewandert','wandert','gewanderten'],
 'spazieren gegangen':['gespaziert','spazieren gegangen','spaziert gegangen','spazieren gegeht'],geblieben:['gebleibt','geblieben','bleibt','gebliebt'],geschwommen:['geschwimmt','geschwommen','schwimmt','geschwommt'],getanzt:['getanzen','getanzt','tanzt','getanzten'],gebacken:['gebackt','gebacken','backt','gebäckt']
};
const parts={gegangen:['ge','gang','en'],gefahren:['ge','fahr','en'],gekommen:['ge','komm','en'],geflogen:['ge','flog','en'],gewandert:['ge','wander','t'],'spazieren gegangen':['spazieren','ge','gang','en'],geblieben:['ge','blieb','en'],geschwommen:['ge','schwomm','en'],getanzt:['ge','tanz','t'],gebacken:['ge','back','en']};
const SEIN=[['ich','bin'],['du','bist'],['er','ist'],['sie','ist'],['es','ist'],['wir','sind'],['ihr','seid'],['sie','sind'],['Sie','sind']].map(([pronoun,form])=>({pronoun,form}));
const GRAMMAR=[
 ['Anna ist nach Berlin gefahren.',['Anna','ist','nach Berlin','gefahren'],'Was ist das Hilfsverb?','ist'],
 ['Tim ist am Sonntag gewandert.',['Tim','ist','am Sonntag','gewandert'],'Was ist das Partizip II?','gewandert'],
 ['Mia ist im Hotel geblieben.',['Mia','ist','im Hotel','geblieben'],'Was ist das Subjekt?','Mia'],
 ['Wir sind im See geschwommen.',['Wir','sind','im See','geschwommen'],'Was ist das Hilfsverb?','sind'],
 ['Omar ist nach Hause gekommen.',['Omar','ist','nach Hause','gekommen'],'Was ist das Partizip II?','gekommen'],
 ['Ihr seid lange spazieren gegangen.',['Ihr','seid','lange','spazieren gegangen'],'Was ist das Hilfsverb?','seid'],
 ['Sara hat am Abend getanzt.',['Sara','hat','am Abend','getanzt'],'Was ist das Partizip II?','getanzt'],
 ['Paul hat einen Kuchen gebacken.',['Paul','hat','einen Kuchen','gebacken'],'Was ist das Objekt?','einen Kuchen'],
 ['Die Freunde sind nach Köln geflogen.',['Die Freunde','sind','nach Köln','geflogen'],'Was ist das Subjekt?','Die Freunde'],
 ['Ich bin zu Hause geblieben.',['Ich','bin','zu Hause','geblieben'],'Was ist das Hilfsverb?','bin'],
 ['Wir haben am Samstag getanzt.',['Wir','haben','am Samstag','getanzt'],'Was ist das Hilfsverb?','haben'],
 ['Lina ist im Schwimmbad geschwommen.',['Lina','ist','im Schwimmbad','geschwommen'],'Was ist das Partizip II?','geschwommen'],
 ['Du bist mit dem Bus gefahren.',['Du','bist','mit dem Bus','gefahren'],'Was ist das Hilfsverb?','bist'],
 ['Die Kinder haben Brot gebacken.',['Die Kinder','haben','Brot','gebacken'],'Was ist das Objekt?','Brot'],
 ['Er ist spät gekommen.',['Er','ist','spät','gekommen'],'Was ist das Subjekt?','Er']
].map(([sentence,parts,question,answer])=>({sentence,parts,question,answer}));
const ORDER=[
 'Ich bin gestern nach Hause gegangen.','Anna ist am Samstag nach Berlin gefahren.','Tim ist um acht Uhr gekommen.','Wir sind im Sommer nach Spanien geflogen.','Die Freunde sind am Sonntag gewandert.','Mia ist am Abend spazieren gegangen.','Omar ist zwei Tage zu Hause geblieben.','Die Kinder sind im See geschwommen.','Sara hat am Samstag lange getanzt.','Paul hat am Morgen Brot gebacken.','Ihr seid mit dem Zug gefahren.','Meine Eltern sind spät gekommen.','Lina ist im Park spazieren gegangen.','Wir haben auf der Party getanzt.','Meine Mutter hat einen Kuchen gebacken.'
].map(sentence=>({sentence,tokens:sentence.replace(/[.]$/,'').split(' ')}));
const WRITE_SENTENCES=[
 ['ich – gestern – nach Hause – gehen','Ich bin gestern nach Hause gegangen.'],['Anna – am Samstag – nach Berlin – fahren','Anna ist am Samstag nach Berlin gefahren.'],['Tim – um acht Uhr – kommen','Tim ist um acht Uhr gekommen.'],['wir – im Sommer – nach Spanien – fliegen','Wir sind im Sommer nach Spanien geflogen.'],['die Freunde – am Sonntag – wandern','Die Freunde sind am Sonntag gewandert.'],['Mia – am Abend – spazieren gehen','Mia ist am Abend spazieren gegangen.'],['Omar – zwei Tage – zu Hause – bleiben','Omar ist zwei Tage zu Hause geblieben.'],['die Kinder – im See – schwimmen','Die Kinder sind im See geschwommen.'],['Sara – am Samstag – lange – tanzen','Sara hat am Samstag lange getanzt.'],['Paul – am Morgen – Brot – backen','Paul hat am Morgen Brot gebacken.'],['ihr – mit dem Zug – fahren','Ihr seid mit dem Zug gefahren.'],['meine Eltern – spät – kommen','Meine Eltern sind spät gekommen.'],['Lina – im Park – spazieren gehen','Lina ist im Park spazieren gegangen.'],['wir – auf der Party – tanzen','Wir haben auf der Party getanzt.'],['meine Mutter – einen Kuchen – backen','Meine Mutter hat einen Kuchen gebacken.']
].map(([cue,answer])=>({cue,answer}));
const AUX_MIX=[...T3(),...T2.filter(x=>['lernen','schreiben','essen','trinken','arbeiten','sehen','lesen','kochen','spielen','treffen'].includes(x.v))].map(x=>({kind:'choice',prompt:`${x.p} – welches Hilfsverb?`,answer:x.aux==='ist'?'sein':'haben',options:['sein','haben'],hint:x.aux==='ist'?'Denke an Bewegung oder Ortswechsel.':'Dieses Verb bildet das Perfekt mit haben.'}));
const REWRITE={present:'Am Samstag fährt Lea mit dem Zug nach Köln. Dort trifft sie ihre Freundin Nina. Sie gehen zuerst im Park spazieren und trinken Kaffee. Danach schwimmen sie im Schwimmbad. Am Nachmittag bleiben sie lange in der Stadt. Nina kauft Brot und Lea backt am Abend einen Kuchen. Später tanzen sie auf einer Party und sprechen mit Freunden. Um Mitternacht fahren sie nach Hause.',perfect:'Am Samstag ist Lea mit dem Zug nach Köln gefahren. Dort hat sie ihre Freundin Nina getroffen. Sie sind zuerst im Park spazieren gegangen und haben Kaffee getrunken. Danach sind sie im Schwimmbad geschwommen. Am Nachmittag sind sie lange in der Stadt geblieben. Nina hat Brot gekauft und Lea hat am Abend einen Kuchen gebacken. Später haben sie auf einer Party getanzt und mit Freunden gesprochen. Um Mitternacht sind sie nach Hause gefahren.'};
const ERRORS=[
 ['Ich habe gestern nach Hause gegangen.','habe','bin','Hilfsverb'],['Sara ist am Samstag getanzen.','getanzen','getanzt','Partizip II'],['Wir sind einen Kuchen gebacken.','sind','haben','Hilfsverb'],['Er ist nach Berlin gefahrt.','gefahrt','gefahren','Partizip II'],['Die Kinder sind im See geschwimmt.','geschwimmt','geschwommen','Partizip II'],['Mia hat im Hotel geblieben.','hat','ist','Hilfsverb'],['Du ist spät gekommen.','ist','bist','Konjugation'],['Ihr hat auf der Party getanzt.','hat','habt','Konjugation'],['Anna ist mit der Bus gefahren.','der','dem','Artikel'],['Paul hat ein Kuchen gebacken.','ein','einen','Artikel'],['Wir haben im Park spazieren gegangen.','haben','sind','Hilfsverb'],['Omar ist nach Hause gekommt.','gekommt','gekommen','Partizip II'],['Ich bin zwei Tage zu Hause gebleibt.','gebleibt','geblieben','Partizip II'],['Die Freunde hat nach Spanien geflogen.','hat','sind','Konjugation'],['Lina ist gestern lange gewandern.','gewandern','gewandert','Partizip II']
].map(([sentence,wrongWord,answer,errorType])=>({sentence,wrongWord,answer,errorType}));
const READINGS=[
 {text:'Nina ist am Samstag früh nach Hamburg gefahren. Dort ist sie zwei Stunden spazieren gegangen. Am Nachmittag ist sie im Schwimmbad geschwommen. Am Abend hat sie mit Freunden getanzt. Sie ist erst spät ins Hotel gekommen.',tf:[['Nina war am Samstag in Hamburg.',true],['Nina hat den ganzen Tag im Hotel verbracht.',false],['Am Abend war Nina mit anderen Menschen zusammen.',true]],abc:[['Was hat Nina am Nachmittag gemacht?',['Sie ist geschwommen.','Sie hat Brot gebacken.','Sie ist geflogen.'],'Sie ist geschwommen.'],['Was passt zu Ninas Abend?',['Sie hat getanzt.','Sie ist gewandert.','Sie hat gearbeitet.'],'Sie hat getanzt.'],['Wo war Nina am Ende des Tages?',['im Hotel','im Schwimmbad','im Zug'],'im Hotel']]},
 {text:'Omar ist am Sonntag mit seiner Familie in den Wald gefahren. Sie sind drei Stunden gewandert. Danach sind sie zu Hause geblieben. Omar hat Brot gebacken und seine Kinder haben Musik gehört. Am Abend sind alle früh schlafen gegangen.',tf:[['Omar war am Sonntag mit seiner Familie unterwegs.',true],['Die Familie hat am Abend noch eine lange Wanderung gemacht.',false],['Omar hat zu Hause etwas zum Essen gemacht.',true]],abc:[['Was hat die Familie im Wald gemacht?',['Sie ist gewandert.','Sie hat getanzt.','Sie ist geschwommen.'],'Sie ist gewandert.'],['Was hat Omar zu Hause gemacht?',['Brot gebacken','Kaffee gekauft','einen Brief geschrieben'],'Brot gebacken'],['Was passt zum Abend?',['Die Familie war müde.','Die Familie ist nach Spanien geflogen.','Omar ist arbeiten gegangen.'],'Die Familie war müde.']]},
 {text:'Lea und Mina sind am Freitag nach München geflogen. Das Wetter war schlecht, deshalb sind sie am Nachmittag im Hotel geblieben. Am Abend sind sie in ein Restaurant gegangen. Später haben sie in einer kleinen Bar getanzt. Am Samstag ist die Sonne gekommen und sie sind lange spazieren gegangen.',tf:[['Lea und Mina sind mit dem Flugzeug gereist.',true],['Am Freitag haben sie den ganzen Nachmittag draußen verbracht.',false],['Am Samstag war das Wetter besser.',true]],abc:[['Wo waren sie am Freitagnachmittag?',['im Hotel','im Schwimmbad','im Park'],'im Hotel'],['Was haben sie am Freitagabend gemacht?',['Sie haben getanzt.','Sie haben Brot gebacken.','Sie sind gewandert.'],'Sie haben getanzt.'],['Was haben sie am Samstag gemacht?',['Sie sind spazieren gegangen.','Sie sind zu Hause geblieben.','Sie haben gearbeitet.'],'Sie sind spazieren gegangen.']]},
 {text:'Tim ist am Mittwoch zu Hause geblieben, weil er frei hatte. Am Morgen hat er einen Kuchen gebacken. Mittags ist seine Schwester gekommen. Zusammen sind sie zum See gegangen und eine Stunde geschwommen. Am Abend haben sie einen Film gesehen.',tf:[['Tim hatte am Mittwoch keine Arbeit.',true],['Tim war den ganzen Tag allein.',false],['Tim und seine Schwester waren am See.',true]],abc:[['Was hat Tim am Morgen gemacht?',['einen Kuchen gebacken','im See geschwommen','einen Film gesehen'],'einen Kuchen gebacken'],['Wer ist mittags gekommen?',['seine Schwester','sein Lehrer','sein Arzt'],'seine Schwester'],['Was passt zum Abend?',['Sie haben einen Film gesehen.','Sie sind geflogen.','Sie haben getanzt.'],'Sie haben einen Film gesehen.']]},
 {text:'Familie Kaya ist im Sommer nach Österreich gefahren. Sie ist in einem kleinen Ort geblieben. Fast jeden Tag ist die Familie gewandert oder spazieren gegangen. Einmal sind alle in einem See geschwommen. Am letzten Abend haben sie zusammen getanzt und danach Kuchen gegessen.',tf:[['Familie Kaya hat Urlaub in Österreich gemacht.',true],['Die Familie hat jeden Tag nur im Haus gesessen.',false],['Am letzten Abend gab es Kuchen.',true]],abc:[['Was hat die Familie oft gemacht?',['wandern oder spazieren gehen','arbeiten','Briefe schreiben'],'wandern oder spazieren gehen'],['Was hat sie einmal gemacht?',['in einem See geschwommen','nach Berlin geflogen','Brot gekauft'],'in einem See geschwommen'],['Was passt zum letzten Abend?',['tanzen und Kuchen essen','arbeiten und lernen','fahren und schwimmen'],'tanzen und Kuchen essen']]}
];
const CLOZE={
 parts:['Gestern ',' ich früh nach Berlin gefahren. Dort ',' meine Freundin Sara schon am Bahnhof gewesen. Wir ',' zusammen in die Stadt gegangen. Sara ',' am Vormittag gearbeitet, aber ich ',' im Park spazieren gegangen. Mittags ',' wir in einem Café geblieben und ',' Kuchen gegessen. Danach ',' wir ins Schwimmbad gegangen und ',' eine Stunde geschwommen. Am Abend ',' Sara Brot gebacken und wir ',' auf einer Party getanzt. Unsere Freunde ',' auch gekommen. Ihr ',' sehr spät nach Hause gefahren, aber ich ',' noch bei Sara geblieben. Am nächsten Morgen ',' ich müde gewesen.'],
 answers:['bin','ist','sind','hat','bin','sind','haben','sind','sind','hat','haben','sind','seid','bin','bin']
};
const EXAM=[
 ['choice','gehen','gegangen',['gegangen','gegeht','gefahrt']],['choice','schwimmen','geschwommen',['geschwommen','geschwimmt','geschwimmen']],['choice','backen','gebacken',['gebacken','gebackt','gebackt']],['choice','tanzen – Hilfsverb','haben',['haben','sein']],['choice','fliegen – Hilfsverb','sein',['sein','haben']],
 ['input','ich – sein','bin'],['input','du – sein','bist'],['input','ihr – sein','seid'],
 ['choice','Wir ___ nach Köln gefahren.','sind',['sind','haben','seid']],['choice','Sara ___ einen Kuchen gebacken.','hat',['hat','ist','haben']],['choice','Die Kinder ___ im See geschwommen.','sind',['sind','haben','seid']],
 ['choice','Welcher Satz ist richtig?','Mia ist zu Hause geblieben.',['Mia ist zu Hause geblieben.','Mia hat zu Hause geblieben.','Mia ist zu Hause gebleibt.']],
 ['input','Partizip II von bleiben','geblieben'],['input','Partizip II von spazieren gehen','spazieren gegangen'],['input','Partizip II von fahren','gefahren'],
 ['choice','gegessen – Hilfsverb','haben',['haben','sein']],['choice','gekommen – Hilfsverb','sein',['sein','haben']],['choice','geschrieben – Hilfsverb','haben',['haben','sein']],
 ['choice','Was ist falsch? „Du ist spät gekommen.“','ist',['ist','spät','gekommen']],['input','Korrigiere: Du ist spät gekommen. – falsche Form','bist']
].map(([kind,prompt,answer,options])=>({kind,prompt,answer,options,hint:'Achte auf Hilfsverb, Konjugation und Partizip II.'}));
function task(id,title,description,kind,items,extra={}){return{id,title,description,kind,items,icon:extra.icon||'📝',exam:false,...extra}}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const f=T3();
 const cards=(theme.tasks||[]).find(x=>x.id==='karteikarten'||x.kind==='cards')||task('karteikarten','Karteikarten','Lern die Wörter.','cards',[]);
 const choice=f.map(x=>({kind:'choice',prompt:x.v,answer:x.p,options:wrong[x.p]||[x.p],hint:'Achte auf die Partizip-II-Form.'}));
 const memory=f.map((x,i)=>({id:`paar-${i+1}`,infinitive:x.v,perfekt:x.p}));
 const syllables=f.map(x=>({kind:'order',prompt:x.v,answer:x.p,tokens:parts[x.p]||x.p.split(' '),hint:'Baue das Partizip II.'}));
 const endings=f.map(x=>({infinitive:x.v,participle:x.p,group:/t$/.test(x.p)?'t':'en'}));
 const write=f.map(x=>({kind:'input',prompt:x.v,answer:`${x.aux} ${x.p}`,answers:[`${x.aux} ${x.p}`],hint:'Schreibe Hilfsverb und Partizip II.'}));
 const listen=f.map(x=>({infinitive:x.v,audioFile:x.audio,answer:x.p}));
 theme.tasks=[
  cards,
  task('t3-partizip-finden-v2','Partizip II finden','Wähle die richtige Partizip-II-Form.','choice',choice,{icon:'✅'}),
  task('t3-memory-v2','Memory','Finde passende Paare.','memory-pairs',memory,{icon:'🧠',spL7T2Memory:true}),
  task('t3-partizip-bauen-v2','Partizip II bauen','Baue das Partizip II.','order',syllables,{icon:'🧩'}),
  task('t3-endungen-v2','Endung -t oder -en?','Ordne die Verben zu.','endings-write',endings,{icon:'📦',spL7T2Endings:true}),
  task('t3-partizip-schreiben-v2','Partizip II schreiben','Schreibe Hilfsverb und Partizip II.','input',write,{icon:'✍️'}),
  task('t3-hoeren-partizip-v2','Hören','Höre den Infinitiv und schreibe Partizip II.','listen-participle',listen,{icon:'🎧',spL7T2ListenParticiple:true}),
  task('t3-sein-v2','sein','Konjugiere sein.','sein-table',SEIN,{icon:'🔤',spL7T3Kind:'sein'}),
  task('t3-grammatik-v2','Grammatik','Erkenne Satzteile im Perfekt.','grammar-parts',GRAMMAR,{icon:'🧲',spL7T2Grammar:true}),
  task('t3-saetze-v2','Sätze','Ordne die Sätze im Perfekt.','sentence-order',ORDER,{icon:'🧩',spL7T2SentenceOrder:true}),
  task('t3-saetze-schreiben-v2','Sätze schreiben','Schreibe die Sätze im Perfekt.','sentence-write',WRITE_SENTENCES,{icon:'✍️',spL7T2SentenceWrite:true}),
  task('t3-haben-sein-v2','haben oder sein?','Entscheide: haben oder sein.','choice',AUX_MIX,{icon:'⚖️'}),
  task('t3-text-umschreiben-v2','Text umschreiben','Schreibe den Text im Perfekt.','rewrite-text',[REWRITE],{icon:'✍️',spL7T2Rewrite:true}),
  task('t3-fehler-korrigieren-v2','Fehler korrigieren','Markiere zuerst das falsche Wort und schreibe dann die richtige Form.','error-correct',ERRORS,{icon:'🛠️',spL7T3Kind:'error'}),
  task('t3-lesen-v2','Lesen','Lies die Texte und antworte.','reading-sets',READINGS,{icon:'📖',spL7T2Reading:true}),
  task('t3-lueckentext-v2','haben oder sein','Ergänze haben oder sein in der richtigen Form.','aux-cloze',[CLOZE],{icon:'✍️',spL7T3Kind:'cloze'}),
  {id:'t3-pruefung-v2',title:'Prüfung',description:'Bearbeite die Prüfung.',kind:'choice',items:EXAM,icon:'⭐',exam:true}
 ];
 theme.title='Perfekt mit sein und haben';theme.subtitle='Perfekt · Bewegung und weitere Verben';theme.goal='Perfekt mit sein und haben sicher bilden und anwenden.';theme.contentRevision='l7t3-requested-taskset-20260818-v1';window.L7_THEME=theme;return theme;
});
})();
