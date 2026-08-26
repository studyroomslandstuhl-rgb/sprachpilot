(function(){
'use strict';
if(window.__SP_L8T1_QA_V3)return;window.__SP_L8T1_QA_V3=true;
const CDN='https://sprachpilot.b-cdn.net/';
const JOBS=[
 ['Physiotherapeut','physiotherapeut.webp'],['Physiotherapeutin','physiotherapeutin.webp'],
 ['Hausmeister','hausmeister.webp'],['Hausmeisterin','hausmeisterin.webp'],
 ['Arzthelfer','arzthelfer.webp'],['Arzthelferin','arzthelferin.webp'],
 ['Arzt','arzt.webp'],['Ärztin','aerztin.webp'],
 ['Mechatroniker','mechatroniker.webp'],['Mechatronikerin','mechatronikerin.webp'],
 ['Polizist','polizist.webp'],['Polizistin','polizistin.webp'],
 ['Krankenpfleger','krankenpfleger.webp'],['Krankenpflegerin','krankenpflegerin.webp'],
 ['Lehrer','lehrer.webp'],['Lehrerin','lehrerin.webp'],
 ['Schauspieler','schauspieler.webp'],['Schauspielerin','schauspielerin.webp'],
 ['Bäcker','baecker.webp'],['Bäckerin','baeckerin.webp'],
 ['Koch','koch.webp'],['Köchin','koechin.webp'],
 ['Friseur','friseur.webp'],['Friseurin','friseurin.webp'],
 ['Chef','chef.webp'],['Chefin','chefin.webp'],
 ['Journalist','journalist.webp'],['Journalistin','journalistin.webp'],
 ['Taxifahrer','taxifahrer.webp'],['Taxifahrerin','taxifahrerin.webp'],
 ['Praktikant','praktikant.webp'],['Praktikantin','praktikantin.webp']
];
const FORMS=[
 {cue:'beruflich',register:'du',question:'Was machst du beruflich?'},
 {cue:'von Beruf',register:'du',question:'Was bist du von Beruf?'},
 {cue:'beruflich',register:'Sie',question:'Was machen Sie beruflich?'},
 {cue:'von Beruf',register:'Sie',question:'Was sind Sie von Beruf?'}
];
function rounds(){return JOBS.map(([job,file],index)=>{const form=FORMS[index%FORMS.length];return{
 cue:form.cue,register:form.register,question:form.question,job,image:CDN+file,
 preferred:`Ich bin ${job}.`,
 answers:[`Ich bin ${job}.`,`Ich bin ${job} von Beruf.`,`Von Beruf bin ich ${job}.`,`Ich arbeite als ${job}.`],
 hintQuestion:form.register==='Sie'?`Formell mit „Sie“: ${form.question}`:`Informell mit „du“: ${form.question}`,
 hintAnswer:`Bilde einen ganzen Satz mit dem Beruf auf dem Bild, z. B. „Ich bin ${job}.“`
 }})}
const TEXT={
 'karteikarten':{icon:'🃏',instruction:'Lerne die Berufe mit Bild und Übersetzung. Drehe jede Karte um und sprich oder schreibe das deutsche Wort selbst.'},
 'berufe-bild-v2':{icon:'🖼️',instruction:'Sieh das Bild an und wähle die passende Berufsbezeichnung mit der richtigen männlichen oder weiblichen Form.'},
 'berufspaare-v2':{icon:'🔁',instruction:'Wähle zu jedem Beruf die passende männliche oder weibliche Berufsbezeichnung.'},
 'berufe-plural-v2':{icon:'🔤',instruction:'Wähle zu den Berufsbezeichnungen die richtige Pluralform. Übe männliche und weibliche Formen.'},
 'berufe-artikel-v2':{icon:'🔤',instruction:'Ergänze der oder die und erkenne, ob die Berufsbezeichnung männlich oder weiblich ist.'},
 'beruf-saetze-ordnen-v2':{icon:'🧩',instruction:'Ordne die Wörter und bilde vollständige Berufsfragen und Antworten in der richtigen Satzstellung.'},
 'eigen-grammatik-v2':{icon:'🧲',instruction:'Wähle eigener, eigene, eigenes oder eigenen und lerne die Form immer zusammen mit Artikel oder Possessivwort und Nomen.'},
 'berufe-hoeren-v2':{icon:'🎧',instruction:'Höre Berufsbezeichnungen und Berufsfragen. Erkenne Beruf, du/Sie und die passende Aussage.'},
 'berufe-lesen-v2':{icon:'📖',instruction:'Lies kurze Texte über Personen und finde Beruf, Arbeitsplatz und die richtige Information.'},
 'berufe-dialoge-v2':{icon:'💬',instruction:'Ergänze kurze Gespräche über Beruf und Arbeitsplatz mit einer passenden Frage oder Antwort.'},
 'pruefung-berufe-v2':{icon:'⭐',instruction:'Bearbeite 20 gemischte Prüfungsfragen zu Berufen, männlich/weiblich, Singular/Plural, Berufsfragen und eigen-.'}
};
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;if(!theme||!Array.isArray(theme.tasks))return themes;
 const remove=new Set(['berufsfragen-du-sie-v2','berufsfragen-antworten-v2','berufsinterview-v2']);
 const old=theme.tasks;let position=old.findIndex(task=>remove.has(task?.id));if(position<0)position=Math.min(5,old.length);
 const filtered=old.filter(task=>!remove.has(task?.id));
 const interview={id:'berufsfragen-dialog-v3',kind:'berufsinterview',icon:'💬',title:'Frage und Antwort: Beruf',instruction:'Formuliere zuerst selbst die passende Berufsfrage aus der Vorgabe. Antworte danach mit einem vollständigen Satz zum Beruf auf dem Bild.',intro:'Jede Runde hat zwei Schritte: 1. Aus „beruflich“ oder „von Beruf“ und du/Sie eine Frage bilden. 2. Das Berufsbild ansehen und selbst antworten, z. B. „Ich bin Friseur.“ oder „Ich arbeite als Friseur.“',items:rounds()};
 filtered.splice(Math.min(position,filtered.length),0,interview);theme.tasks=filtered;
 for(const task of theme.tasks){const cfg=TEXT[task.id];if(cfg){task.icon=cfg.icon;task.instruction=cfg.instruction}}
 const cards=theme.tasks.find(task=>task.id==='karteikarten');if(cards){cards.icon='🃏';cards.instruction=TEXT.karteikarten.instruction}
 theme.tasks.forEach((task,index)=>task.order=index+1);
 theme.subtitle='Berufe erkennen und benennen, männliche und weibliche Formen sowie Singular und Plural unterscheiden und Berufsfragen mit du und Sie sicher fragen und beantworten.';
 theme.contentRevision='l8t1-question-answer-20260826-v3';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();