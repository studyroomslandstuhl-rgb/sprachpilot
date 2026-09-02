(function(){
'use strict';
if(window.__SP_L8T3_READING_CONTEXT_PATCH_20260902_V1)return;
window.__SP_L8T3_READING_CONTEXT_PATCH_20260902_V1=true;
const C=(prompt,options,answer,context,hint='')=>({type:'choice',prompt,options,answer,context,hint});
function themeOf(all,n){return all?.[n]||all?.[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null)}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>String(t?.id)==='lesen-erster-job-fuenf-texte');if(!task)return theme;
 const texts=[
  ['Text 1 · Mariams erster Job','Mein erster Job war in einer kleinen Bäckerei. Ich war 19 Jahre alt und hatte noch keine Berufserfahrung. Ich habe morgens sehr früh angefangen und habe Brot und Kuchen verkauft. Meine Chefin war freundlich, aber die Arbeit war manchmal stressig. Am Anfang habe ich viele Fragen gestellt. Nach einigen Wochen war die Arbeit für mich einfacher.',[
   ['Für Mariam war am Anfang vieles neu.',['Falsch','Richtig'],'Richtig'],
   ['Was zeigt, dass Mariam am Anfang noch Orientierung gebraucht hat?',['Sie hat oft nach Informationen gefragt.','Sie hat sofort alle Aufgaben allein gekannt.','Sie hat nur mit Freunden gesprochen.'],'Sie hat oft nach Informationen gefragt.'],
   ['Wie hat sich die Arbeit für Mariam entwickelt?',['Sie war später leichter für sie.','Sie war später immer stressiger.','Sie hat nach wenigen Tagen aufgehört.'],'Sie war später leichter für sie.']
  ]],
  ['Text 2 · Omars erster Job','Mein erster Job war in einem großen Restaurant. Ich war Küchenhilfe und habe dem Koch geholfen. Das Team war groß und wir hatten am Abend oft viel Arbeit. Mein Chef war professionell und hat mir alles genau gezeigt. Ich hatte wenig Erfahrung, aber die Kollegen waren nett. Nach drei Monaten habe ich schon viele Aufgaben allein gemacht.',[
   ['Nach drei Monaten war Omar selbstständiger als am Anfang.',['Richtig','Falsch'],'Richtig'],
   ['Warum war der Chef für einen Anfänger hilfreich?',['Er hat die Arbeit verständlich erklärt.','Er hat Omar keine Aufgaben gegeben.','Er war jeden Abend nicht da.'],'Er hat die Arbeit verständlich erklärt.'],
   ['Welche Entwicklung passt zu Omar?',['Wenig Erfahrung → später mehr Selbstständigkeit','Viel Erfahrung → später keine Aufgaben','Großes Team → später Arbeit ohne Kollegen'],'Wenig Erfahrung → später mehr Selbstständigkeit']
  ]],
  ['Text 3 · Elenas erster Job','Mit 20 Jahren war mein erster Job in einem Café. Ich habe dort als Kellnerin gearbeitet. Das Café war klein und hatte nur zehn Tische. Ich habe Bestellungen aufgenommen, Kaffee gebracht und die Tische sauber gemacht. Die Gäste waren meistens freundlich. Manchmal hatte ich Stress, aber ich hatte auch viel Spaß mit meiner Kollegin.',[
   ['Elenas Arbeit hatte angenehme und anstrengende Seiten.',['Falsch','Richtig'],'Richtig'],
   ['Welche Beschreibung passt am besten zu ihrem Arbeitsplatz?',['klein und mit direktem Kontakt zu Gästen','groß und ohne Kontakt zu Menschen','ein Büro ohne Kunden'],'klein und mit direktem Kontakt zu Gästen'],
   ['Warum war die Arbeit für Elena nicht nur negativ?',['Sie hatte gute Momente mit einer Kollegin.','Sie hatte jeden Tag frei.','Sie hatte nie Gäste.'],'Sie hatte gute Momente mit einer Kollegin.']
  ]],
  ['Text 4 · Pavels erster Job','Mein erster Job war in einer kleinen Firma. Ich war Arbeiter und habe dort jeden Tag von sieben bis fünfzehn Uhr gearbeitet. Die Arbeit war nicht schwer, aber sie war oft langweilig. Wir hatten jeden Morgen eine kurze Besprechung. Mein Team war nett und mein Kollege Viktor hat mir viel geholfen. Deshalb hatte ich am Anfang wenig Stress.',[
   ['Pavel war am Anfang nicht allein mit neuen Problemen.',['Richtig','Falsch'],'Richtig'],
   ['Warum war der Einstieg für Pavel eher ruhig?',['Ein Kollege hat ihn unterstützt.','Er hatte keine Arbeitszeit.','Er hat nie mit anderen gearbeitet.'],'Ein Kollege hat ihn unterstützt.'],
   ['Welche Beschreibung passt zu seiner Arbeit?',['nicht schwer, aber wenig abwechslungsreich','sehr schwer und sehr spannend','kurz und immer neu'],'nicht schwer, aber wenig abwechslungsreich']
  ]],
  ['Text 5 · Sofias erster Job','Nach meiner Ausbildung war mein erster Job in einem Hotel. Ich habe an der Rezeption gearbeitet. Das Hotel war modern und die Gäste waren aus vielen Ländern. Ich hatte oft Kontakt mit Menschen und habe viele Fragen beantwortet. Meine Arbeit war interessant, aber manchmal hatte ich wenig Zeit. Meine Kolleginnen waren sehr erfahren und haben mir oft geholfen.',[
   ['Auch nach der Ausbildung war Unterstützung im neuen Job für Sofia wichtig.',['Falsch','Richtig'],'Richtig'],
   ['Warum war die Arbeit manchmal anstrengend?',['Für ihre Aufgaben war die Zeit manchmal knapp.','Im Hotel waren nie Gäste.','Sofia hatte jeden Tag Urlaub.'],'Für ihre Aufgaben war die Zeit manchmal knapp.'],
   ['Welche Fähigkeit war in Sofias Job besonders wichtig?',['mit vielen Menschen kommunizieren','Häuser zeichnen','Maschinen reparieren'],'mit vielen Menschen kommunizieren']
  ]]
 ];
 const items=[];texts.forEach(([title,text,qs])=>qs.forEach(([prompt,options,answer])=>items.push(C(prompt,options,answer,`${title}\n\n${text}`,'Nutze den ganzen Text und nicht nur ein einzelnes Wort.'))));
 task.items=items;task.instruction='Lies den Text, verstehe die Situation und beantworte die Fragen.';task.intro='Die Antworten stehen nicht wortwörtlich im Text. Nutze Bedeutung und Zusammenhang.';
 theme.contentRevision=String(theme.contentRevision||'l8t3')+'-reading-context-v1';return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T3_READING_CONTEXT_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all,3);apply(theme);if(Number(document.body?.dataset?.theme||0)===3&&theme)window.L8_THEME=theme;return themes}).catch(error=>{console.error('L8T3 Lese-Kontext-Patch konnte nicht angewendet werden',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T3_READING_CONTEXT_READY;
window.L8T3ReadingContextPatch20260902={apply,version:1};
})();
