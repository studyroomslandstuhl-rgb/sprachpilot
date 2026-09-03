(function(){
'use strict';
if(window.__SP_L8T4_A8_PERSON_ADS_20260903_V1)return;
window.__SP_L8T4_A8_PERSON_ADS_20260903_V1=true;
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);

function task(){
 const items=[
  {
   name:'Maria',
   person:'Maria ist 29 Jahre alt. Sie geht montags bis freitags von 8 bis 12 Uhr zum Deutschkurs. Nachmittags und abends hat sie Zeit. Früher hat sie in einem Café gearbeitet. Sie kann gut backen und arbeitet gern mit Gästen. Maria sucht Teilzeit. Am Wochenende möchte sie Zeit für ihre Familie haben.',
   answer:['A'],
   ads:[
    {id:'A',title:'Café am Markt',text:'Wir suchen eine Aushilfe im Service. Arbeitszeit: montags bis freitags von 14 bis 19 Uhr. Die Stelle ist Teilzeit und nicht befristet. Sie bringen Kaffee und Kuchen und sprechen mit den Gästen. Berufserfahrung im Café ist gut, aber nicht nötig. Verdienst: 15 Euro pro Stunde.'},
    {id:'B',title:'Bäckerei Morgen',text:'Wir suchen dringend eine Aushilfe. Sie verkaufen Brot und Brötchen und helfen beim Frühstück. Arbeitszeit: montags bis freitags von 6 bis 11 Uhr. Die Stelle ist Teilzeit. Sie müssen früh anfangen können. Verdienst: 14 Euro pro Stunde.'},
    {id:'C',title:'Restaurant Abendrot',text:'Wir suchen eine Aushilfe im Service. Arbeitszeit: freitags und samstags von 17 bis 23 Uhr. Sie bringen Essen und Getränke und helfen bei großen Gruppen. Die Arbeit ist manchmal stressig. Die Stelle ist für sechs Monate befristet. Verdienst: 16 Euro pro Stunde.'},
    {id:'D',title:'Büro West',text:'Wir suchen eine Sekretärin oder einen Sekretär. Die Stelle ist Vollzeit, montags bis freitags von 8 bis 16 Uhr. Gute Computerkenntnisse sind wichtig. Sie schreiben E-Mails, beantworten Fragen und machen Termine. Die Stelle ist nicht befristet. Verdienst: 18 Euro pro Stunde.'}
   ]
  },
  {
   name:'Yusuf',
   person:'Yusuf ist 35 Jahre alt und hat zwei Kinder. Morgens bringt er die Kinder in die Schule. Ab 9:30 Uhr hat er Zeit. Er kann gut mit Kindern arbeiten und hilft seinem Sohn oft bei Mathematik. Montags, mittwochs und freitags kann er am Nachmittag arbeiten. Samstag und Sonntag möchte er mit seiner Familie zusammen sein.',
   answer:['B'],
   ads:[
    {id:'A',title:'Grundschule Sonnenweg',text:'Wir suchen eine Aushilfe für eine Klasse. Sie helfen der Lehrerin im Unterricht und bereiten Bücher und Übungen vor. Arbeitszeit: montags bis freitags von 7:30 bis 12:30 Uhr. Die Stelle ist Teilzeit. Erfahrung mit Kindern ist gut. Verdienst: 15 Euro pro Stunde.'},
    {id:'B',title:'Nachhilfe Plus',text:'Wir suchen eine Aushilfe für Mathematik. Sie helfen Kindern aus der Schule bei den Aufgaben und erklären einfache Übungen. Arbeitszeit: montags, mittwochs und freitags von 14 bis 18 Uhr. Die Stelle ist Teilzeit. Gute Mathematikkenntnisse sind wichtig. Verdienst: 17 Euro pro Stunde.'},
    {id:'C',title:'Supermarkt City',text:'Wir suchen dringend eine Aushilfe. Sie räumen Waren ein und helfen Kunden im Geschäft. Arbeitszeit: dienstags und donnerstags von 16 bis 20 Uhr. Manchmal arbeiten Sie auch bis 21 Uhr. Die Stelle ist Teilzeit und nicht befristet. Verdienst: 14 Euro pro Stunde.'},
    {id:'D',title:'Tennisverein Grün',text:'Wir suchen eine Aushilfe für das Wochenende. Sie arbeiten samstags und sonntags von 9 bis 15 Uhr. Sie helfen bei den Tennisplätzen und verkaufen Getränke. Tennis spielen müssen Sie nicht können. Die Stelle ist für den Sommer befristet. Verdienst: 15 Euro pro Stunde.'}
   ]
  },
  {
   name:'Elena',
   person:'Elena ist 42 Jahre alt. Früher war sie Sekretärin und hat viele Jahre im Büro gearbeitet. Sie hat viel Berufserfahrung und kann sehr gut mit dem Computer arbeiten. Elena sucht eine Vollzeitstelle von Montag bis Freitag. Sie möchte morgens anfangen und am Abend frei sein. Eine nicht befristete Stelle ist ihr wichtig.',
   answer:['C'],
   ads:[
    {id:'A',title:'Möbelhaus Wohnen',text:'Wir suchen eine Aushilfe im Geschäft. Sie zeigen Kunden Möbel und Elektrogeräte und beantworten Fragen. Arbeitszeit: montags, mittwochs und freitags von 10 bis 14 Uhr. Die Stelle ist Teilzeit und für fünf Monate befristet. Erfahrung ist nicht nötig. Verdienst: 15 Euro pro Stunde.'},
    {id:'B',title:'Hilfe im Alltag',text:'Wir suchen eine Aushilfe für einen Senior und eine Seniorin. Sie kaufen im Supermarkt ein, machen kleine Arbeiten in der Wohnung und sprechen mit den beiden Personen. Arbeitszeit: dienstags und donnerstags von 9 bis 12 Uhr. Die Stelle ist Teilzeit. Verdienst: 16 Euro pro Stunde.'},
    {id:'C',title:'Universität West',text:'Für unser Sekretariat suchen wir eine Sekretärin oder einen Sekretär. Die Stelle ist Vollzeit, montags bis freitags von 8 bis 16:30 Uhr. Sie arbeiten am Computer, schreiben E-Mails und machen Termine. Berufserfahrung im Büro ist wichtig. Die Stelle ist nicht befristet. Verdienst: 20 Euro pro Stunde.'},
    {id:'D',title:'Hotel Central',text:'Wir suchen eine Aushilfe am Abend. Sie arbeiten an der Rezeption und sprechen mit Gästen. Arbeitszeit: montags bis freitags von 16 bis 22 Uhr. Die Stelle ist Teilzeit. Manchmal ist viel los und die Arbeit ist stressig. Verdienst: 17 Euro pro Stunde.'}
   ]
  },
  {
   name:'Amir',
   person:'Amir ist 24 Jahre alt. Er sucht für drei Monate im Sommer eine Arbeit. Er kann tagsüber Vollzeit arbeiten. Amir hat einen Führerschein und fährt gern Auto. Er möchte nicht im Büro arbeiten. Im September beginnt wieder sein Deutschkurs, deshalb möchte er dann mit der Arbeit fertig sein.',
   answer:['D'],
   ads:[
    {id:'A',title:'Restaurant Seeblick',text:'Wir suchen eine Aushilfe im Service. Arbeitszeit: donnerstags bis sonntags von 17 bis 23 Uhr. Die Stelle ist Teilzeit und für den Sommer befristet. Sie bringen Essen und Getränke und helfen bei Partys. Berufserfahrung ist nicht nötig. Verdienst: 16 Euro pro Stunde.'},
    {id:'B',title:'Büro Aktiv',text:'Wir suchen einen Mitarbeiter oder eine Mitarbeiterin im Büro. Die Stelle ist Vollzeit, montags bis freitags von 8 bis 17 Uhr. Sie arbeiten am Computer, telefonieren und schreiben E-Mails. Die Stelle ist nicht befristet. Gute Computerkenntnisse sind wichtig. Verdienst: 19 Euro pro Stunde.'},
    {id:'C',title:'Möbel-Lager',text:'Wir suchen dringend eine Aushilfe im Lager. Die Stelle ist Vollzeit, montags bis freitags von 7 bis 15 Uhr. Sie tragen Möbel und räumen Waren ein. Die Stelle ist nicht befristet. Ein Führerschein ist nicht nötig. Verdienst: 17 Euro pro Stunde.'},
    {id:'D',title:'City Lieferdienst',text:'Wir suchen eine Aushilfe für drei Monate im Sommer. Die Stelle ist Vollzeit. Arbeitszeit: montags bis freitags von 8 bis 16 Uhr. Sie fahren mit dem Auto zu Kunden und bringen Bestellungen. Ein Führerschein ist wichtig. Verdienst: 18 Euro pro Stunde.'}
   ]
  }
 ];
 return {
  id:'l8t4-person-anzeige-v2',title:'Person → Stellenanzeige',kind:'person-ads',icon:'🧑‍💼',emoji:'🧑‍💼',spL8T4PersonAds:true,spL8T4PersonAdsPerItem:true,
  instruction:'Lies die Person. Lies vier Stellenanzeigen. Wähle die beste Stelle.',
  intro:'Achte auf Arbeitszeit, Vollzeit oder Teilzeit, Erfahrung, Aufgaben und Dauer.',
  items
 };
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const i=theme.tasks.findIndex(t=>String(t?.id||'')==='l8t4-person-anzeige-v2');
 if(i>=0)theme.tasks.splice(i,1,task());
 theme.contentRevision=String(theme.contentRevision||'')+'-a8-person-ads-20260903-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T4_A8_PERSON_ADS_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes;
}).catch(error=>{console.error('L8T4 A8 Person-Anzeigen',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_A8_PERSON_ADS_READY;
window.L8T4A8PersonAds20260903={apply,task,version:1};
})();