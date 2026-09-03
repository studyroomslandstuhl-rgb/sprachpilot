(function(){
'use strict';
if(window.__SP_L8T4_SEMANTIC_COMPREHENSION_20260903_V1)return;
window.__SP_L8T4_SEMANTIC_COMPREHENSION_20260903_V1=true;
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const C=(prompt,options,answer,extra={})=>({type:'choice',prompt,options,answer,...extra});
const I=(prompt,answer,context='',hint='',extra={})=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint,...extra});
const F=(prompt,context,min=4)=>({type:'free',prompt,context,min});

const A8_PEOPLE={
 Maria:'Maria geht montags bis freitags von 8 bis 12 Uhr zum Deutschkurs. Danach kann sie arbeiten. Sie möchte ungefähr 20 bis 25 Stunden pro Woche arbeiten. Früher hat sie in einem Café gearbeitet und sie arbeitet gern mit Gästen. Samstag und Sonntag möchte sie für ihre Familie frei haben.',
 Yusuf:'Yusuf bringt morgens seine Kinder in die Schule. Montags, mittwochs und freitags kann er von 14 bis 18 Uhr arbeiten. Er möchte nur an diesen drei Nachmittagen arbeiten. Mathematik kann er gut und er hilft seinem Sohn oft bei den Aufgaben. Am Wochenende möchte er bei seiner Familie sein.',
 Elena:'Elena war viele Jahre Sekretärin. Sie kann sehr gut mit dem Computer arbeiten und hat viel Berufserfahrung. Sie möchte von Montag bis Freitag den ganzen Tag arbeiten, ungefähr 40 Stunden pro Woche. Am Abend möchte sie frei sein. Die Arbeit soll nicht nur für ein paar Monate sein.',
 Amir:'Amir sucht nur für Juni, Juli und August eine Arbeit. In dieser Zeit hat er tagsüber frei und möchte von Montag bis Freitag den ganzen Tag arbeiten. Im September beginnt wieder sein Deutschkurs. Amir hat einen Führerschein und fährt gern Auto. Im Büro möchte er nicht arbeiten.',
 Sofia:'Sofia hat montags bis freitags nur vormittags Zeit. Am Nachmittag ist sie im Deutschkurs. Sie möchte ungefähr 20 bis 25 Stunden pro Woche arbeiten. Früher war sie Kellnerin und hat in einem Café gearbeitet. Samstag und Sonntag möchte sie frei haben.',
 David:'David lernt an der Universität Mathematik. Mittwoch und Freitag ist er ab 13 Uhr frei. An diesen beiden Tagen kann er jeweils ungefähr vier Stunden arbeiten. Mathematik kann er sehr gut erklären und er arbeitet gern mit Kindern.',
 Olena:'Olena möchte zwei oder drei Vormittage pro Woche arbeiten. Sie arbeitet gern mit Menschen und hilft oft ihrer Mutter und ihrem Vater. Am Computer möchte sie nicht arbeiten. Samstag und Sonntag möchte sie frei haben.',
 Paul:'Paul arbeitet schon von Montag bis Freitag. Er sucht nur für Samstag und Sonntag eine kleine Arbeit. Vormittags hat er Zeit, aber spätestens um 15 Uhr möchte er fertig sein. Er spielt gern Tennis und ist gern draußen.'
};

function patchA8(theme){
 const task=(theme.tasks||[]).find(t=>String(t?.id||'')==='l8t4-person-anzeige-v2'||t?.spL8T4PersonAds);
 if(!task?.items)return;
 for(const item of task.items){if(A8_PEOPLE[item.name])item.person=A8_PEOPLE[item.name]}
 task.instruction='Lies die Person und die vier Stellenanzeigen. Welche Stelle passt am besten?';
 task.intro='Die gleichen Informationen können anders formuliert sein. Achte auf Tage, Uhrzeit, Stunden, Erfahrung und Dauer.';
}

function makeA9(old){
 const id=old?.id||'l8t4-telefon-hoeren';
 const title=old?.title||'Telefon: hören und verstehen';
 const dialogues=[
  {title:'Dialog 1 · Café',fileName:'l8t4_telefon_01.mp3',audioFile:'l8t4_telefon_01.mp3',audio:'Frau: Guten Tag. Ich habe Ihre Stellenanzeige für das Café gelesen. Ist die Stelle noch frei? Mann: Ja. Wir suchen noch eine Aushilfe. Frau: Wann arbeitet man? Mann: Montags bis freitags von acht bis zwölf Uhr. Frau: Und wie viel verdient man? Mann: Vierzehn Euro pro Stunde. Frau: Danke.'},
  {title:'Dialog 2 · Nachhilfe',fileName:'l8t4_telefon_02.mp3',audioFile:'l8t4_telefon_02.mp3',audio:'Mann: Guten Tag. Ich rufe wegen der Nachhilfe-Stelle an. Frau: Ja, gern. Mann: Ich kann dienstags, aber donnerstags erst ab sechzehn Uhr. Ist das möglich? Frau: Ja. Wichtig ist nur, dass Sie bis achtzehn Uhr bleiben können. Mann: Das geht. Können wir uns morgen treffen? Frau: Ja, um zehn Uhr.'},
  {title:'Dialog 3 · Universität',fileName:'l8t4_telefon_03.mp3',audioFile:'l8t4_telefon_03.mp3',audio:'Frau: Guten Tag. Ich interessiere mich für die Stelle im Sekretariat. Ist sie befristet? Mann: Nein, die Stelle ist dauerhaft. Frau: Ist es Vollzeit? Mann: Ja, montags bis freitags. Frau: Brauche ich Berufserfahrung? Mann: Erfahrung im Büro ist gut. Computerkenntnisse sind aber besonders wichtig.'},
  {title:'Dialog 4 · Senior und Seniorin',fileName:'l8t4_telefon_04.mp3',audioFile:'l8t4_telefon_04.mp3',audio:'Mann: Guten Tag. Ist die Stelle bei der Seniorenhilfe noch frei? Frau: Ja. Können Sie samstags und sonntags arbeiten? Mann: Ja, vormittags habe ich Zeit. Frau: Haben Sie einen Führerschein? Mann: Ja. Frau: Gut. Dann kommen Sie bitte am Freitag um vierzehn Uhr zu einem Gespräch.'},
  {title:'Dialog 5 · Service',fileName:'l8t4_telefon_05.mp3',audioFile:'l8t4_telefon_05.mp3',audio:'Frau: Guten Tag. Ich habe Ihre Anzeige für den Service gelesen. Ich habe noch nicht im Hotel gearbeitet. Kann ich mich trotzdem bewerben? Mann: Ja. Erfahrung ist nicht notwendig. Frau: Ich kann freitags und samstags ab siebzehn Uhr. Mann: Das passt sehr gut. Frau: Wie viel verdient man? Mann: Sechzehn Euro pro Stunde.'}
 ];
 const qsets=[
  [C('Die Arbeit ist nur einen halben Tag.',['Richtig','Falsch'],'Richtig'),C('Die Arbeit geht jeden Tag bis zum Abend.',['Richtig','Falsch'],'Falsch'),C('Samstag und Sonntag muss man hier nicht arbeiten.',['Richtig','Falsch'],'Richtig')],
  [C('Am Donnerstag kann der Mann zwei Stunden arbeiten.',['Richtig','Falsch'],'Richtig'),C('Am Donnerstag soll der Mann schon am Morgen kommen.',['Richtig','Falsch'],'Falsch'),C('Der Termin ist morgen am Vormittag.',['Richtig','Falsch'],'Richtig')],
  [C('Die Frau sucht eine Arbeit für lange Zeit.',['Richtig','Falsch'],'Richtig'),C('Für diese Stelle ist Arbeiten am Computer sehr wichtig.',['Richtig','Falsch'],'Richtig'),C('Die Stelle ist nur für den Vormittag.',['Richtig','Falsch'],'Falsch')],
  [C('Unter der Woche beginnt die Arbeit schon am Montag.',['Richtig','Falsch'],'Falsch'),C('Der Mann hat am Wochenende vormittags Zeit. Das passt zur Stelle.',['Richtig','Falsch'],'Richtig'),C('Am Freitag arbeitet der Mann noch nicht. Er kommt zuerst zu einem Gespräch.',['Richtig','Falsch'],'Richtig')],
  [C('Die Frau hat noch keine Erfahrung im Hotel. Sie kann sich trotzdem melden.',['Richtig','Falsch'],'Richtig'),C('Die Frau kann an beiden Abenden arbeiten.',['Richtig','Falsch'],'Richtig'),C('Die Arbeit ist nur am Morgen.',['Richtig','Falsch'],'Falsch')]
 ];
 const items=[];dialogues.forEach((d,di)=>{d.questionIndexes=[];qsets[di].forEach(q=>{d.questionIndexes.push(items.length);items.push(q)})});
 return {...old,id,title,kind:old?.kind||'listening-groups',icon:'📞',emoji:'📞',spL8T4ListeningGroups:true,instruction:'Höre den Dialog. Beantworte drei Fragen. Die Fragen sagen die Information anders als im Audio.',dialogues,items};
}
function patchA9(theme){
 const i=(theme.tasks||[]).findIndex(t=>t?.spL8T4ListeningGroups||Array.isArray(t?.dialogues)&&t.dialogues.length===5);
 if(i<0)return;
 theme.tasks.splice(i,1,makeA9(theme.tasks[i]));
}
function patchExam(theme){
 const task=(theme.tasks||[]).find(t=>t?.exam||String(t?.id||'')==='pruefung');if(!task)return;
 const keep=(task.items||[]).slice(0,7);
 task.items=[...keep,
  I('Kann Maria diese Arbeit machen? Schreibe ja oder nein.',['ja','Ja'],'Maria ist jeden Vormittag im Deutschkurs. Ab 13 Uhr hat sie Zeit und sie möchte ungefähr 20 Stunden pro Woche arbeiten.\n\nStellenanzeige: Aushilfe im Service. Montag bis Freitag von 14 bis 18 Uhr. Teilzeit.','Vergleiche Kurszeit und Arbeitszeit.',{sourceTask:'A7'}),
  I('Passt diese Sommerstelle zu David? Schreibe ja oder nein.',['ja','Ja'],'David möchte im Sommer den ganzen Tag arbeiten. Ab September hat er wieder Deutschkurs.\n\nStellenanzeige: Arbeit von Juni bis August. Montag bis Freitag von 8 bis 17 Uhr.','Vergleiche Monate und Tageszeit.',{sourceTask:'A7'}),
  I('Welche Stelle passt zu Sofia? Schreibe A, B, C oder D.',['B','b'],'Sofia kann nur vormittags arbeiten. Sie möchte ungefähr 20 bis 25 Stunden pro Woche arbeiten. Früher hat sie in einem Café gearbeitet. Am Wochenende möchte sie frei haben.\n\nA · Restaurant: Freitag und Samstag, 17–22 Uhr.\nB · Café: Montag bis Freitag, 7–12 Uhr, Teilzeit.\nC · Universität: Montag bis Freitag, 8–17 Uhr, Vollzeit.\nD · Nachhilfe: Montag, Mittwoch und Freitag, 15–18 Uhr.','Verbinde ihre freie Zeit und Erfahrung mit der Anzeige.',{sourceTask:'A8'}),
  I('Passt diese Arbeitszeit zur Frau? Schreibe ja oder nein.',['ja','Ja'],'Frau: Vormittags bin ich im Deutschkurs. Nach dem Mittag habe ich Zeit.\nMann: Wir brauchen eine Aushilfe von 14 bis 18 Uhr.','Vergleiche ihre freie Zeit mit der Stelle.',{sourceTask:'A9'}),
  I('Ist die fehlende Berufserfahrung hier ein Problem? Schreibe ja oder nein.',['nein','Nein'],'Frau: Ich habe noch nicht im Büro gearbeitet. Mit dem Computer kann ich aber sehr gut arbeiten.\nMann: Berufserfahrung ist gut, aber nicht nötig. Computerkenntnisse sind wichtig.','Was braucht man wirklich für diese Stelle?',{sourceTask:'A9'}),
  I('Schreibe eine passende Frage für das Telefon.',['Ist die Stelle noch frei?','Ist Ihre Stelle noch frei?'],'Du hast die Anzeige gestern gelesen. Du weißt nicht, ob die Firma heute noch eine Person sucht.','Frage, ob die Arbeit noch da ist.',{sourceTask:'A10'}),
  I('Schreibe eine passende Frage.',['Wann arbeitet man?','Wie ist die Arbeitszeit?','Wann ist die Arbeitszeit?'],'In der Anzeige steht keine Uhrzeit. Du möchtest wissen, wann du anfangen und wann du fertig sein musst.','Frage nach der Zeit.',{sourceTask:'A10'}),
  F('Schreibe mindestens 4 kurze Sätze. Schreibe, wann du arbeiten kannst. Stelle zwei Fragen: eine Frage zur Zeit und eine Frage zum Geld.','Stellenanzeige: Wir suchen eine Aushilfe im Service. Die Stelle ist noch frei.',4)
 ];
 task.instruction='Bearbeite 15 Aufgaben. Die Informationen können anders formuliert sein als in den Lernaufgaben.';
 task.intro='Achte auf gleiche Bedeutung: halbtags / wenige Stunden, ganztags / den ganzen Tag, vormittags / morgens, nachmittags / nach dem Mittag.';
}
function apply(theme){if(!theme)return theme;patchA8(theme);patchA9(theme);patchExam(theme);theme.contentRevision=String(theme.contentRevision||'')+'-semantic-comprehension-20260903-v1';if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;return theme}
const previous=window.L8_CONTENT_READY;window.L8_T4_SEMANTIC_COMPREHENSION_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 Bedeutungs-Verstehen',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_SEMANTIC_COMPREHENSION_READY;window.L8T4SemanticComprehension20260903={apply,version:1};
})();