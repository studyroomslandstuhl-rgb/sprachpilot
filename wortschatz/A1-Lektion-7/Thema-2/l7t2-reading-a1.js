(function(){
'use strict';
if(window.__SP_L7T2_READING_A1_V1)return;
window.__SP_L7T2_READING_A1_V1=true;
function byId(theme,id){return theme?.tasks?.find(task=>task?.id===id)}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const reading=byId(theme,'lesen');
 if(reading){
  reading.items=[
   {
    text:'Gestern war Samstag. Nina hat bis acht Uhr geschlafen und um neun Uhr gefrühstückt. Danach hat sie ihre Freundin Sara getroffen. Sie haben zusammen Kaffee getrunken und ein Buch gekauft. Am Nachmittag haben sie Musik gehört. Am Abend hat Nina mit Sara Pizza gebacken. Später hat Nina noch einen Brief geschrieben und einen Film gesehen.',
    tf:[
     ['Nina trinkt keinen Kaffee.',false],
     ['Nina frühstückt erst um neun Uhr.',true],
     ['Nina schreibt den Brief vor dem Film.',true]
    ],
    abc:[
     ['Nina schläft bis acht Uhr. Wann frühstückt sie?',['um neun Uhr','um acht Uhr','um sieben Uhr'],'um neun Uhr'],
     ['Was machen Nina und Sara am Abend?',['Sie backen Pizza.','Sie frühstücken.','Sie kaufen ein Buch.'],'Sie backen Pizza.'],
     ['Was macht Nina ganz am Ende?',['Sie sieht einen Film.','Sie trinkt Kaffee.','Sie trifft Sara.'],'Sie sieht einen Film.']
    ]
   },
   {
    text:'Am Montag hat Omar früh gefrühstückt. Danach hat er bis zum Nachmittag gearbeitet. In der Pause hat er mit einer Freundin gesprochen. Nach der Arbeit hat Omar Brot und Milch gekauft. Zu Hause hat er Suppe gekocht, Brot gegessen und Tee getrunken. Am Abend hat er noch einen Film gesehen.',
    tf:[
     ['Omar kauft nach der Arbeit ein.',true],
     ['Omar trinkt in der Pause Tee.',false],
     ['Am Abend arbeitet Omar nicht mehr.',true]
    ],
    abc:[
     ['Wann spricht Omar mit einer Freundin?',['in der Pause','am Abend','beim Frühstück'],'in der Pause'],
     ['Was macht Omar zu Hause zuerst?',['Er kocht Suppe.','Er sieht einen Film.','Er arbeitet.'],'Er kocht Suppe.'],
     ['Was macht Omar ganz am Ende?',['Er sieht einen Film.','Er kauft Milch.','Er frühstückt.'],'Er sieht einen Film.']
    ]
   },
   {
    text:'Am Mittwoch hat Anna einen langen Tag gehabt. Am Vormittag hat sie Deutsch gelernt und einen Test geschrieben. Danach hat sie mit ihrer Lehrerin gesprochen. Am Nachmittag hat Anna ihre Hausaufgaben gemacht und ein Buch gelesen. Später hat sie ihre Schwester getroffen. Zusammen haben sie Musik gehört und Tee getrunken.',
    tf:[
     ['Anna schreibt den Test am Vormittag.',true],
     ['Nach dem Test spricht Anna mit ihrer Schwester.',false],
     ['Anna macht die Hausaufgaben nach dem Gespräch mit der Lehrerin.',true]
    ],
    abc:[
     ['Mit wem spricht Anna zuerst?',['mit ihrer Lehrerin','mit ihrer Schwester','mit ihrer Freundin'],'mit ihrer Lehrerin'],
     ['Was macht Anna am Nachmittag?',['Hausaufgaben','Frühstück','Tennis'],'Hausaufgaben'],
     ['Was macht Anna mit ihrer Schwester?',['Sie hören Musik und trinken Tee.','Sie schreiben einen Test.','Sie kaufen Brot.'],'Sie hören Musik und trinken Tee.']
    ]
   },
   {
    text:'Am Sonntag hat Familie Kaya lange gefrühstückt. Danach haben die Eltern in der Küche gearbeitet und die Kinder haben ein Spiel gespielt. Am Mittag haben alle zusammen gegrillt und gegessen. Später hat der Vater seinen Schlüssel gesucht. Die Mutter hat ein Buch gelesen. Am Abend haben sie noch lange gesprochen und Musik gehört.',
    tf:[
     ['Die Kinder arbeiten in der Küche.',false],
     ['Nach dem Essen sucht der Vater seinen Schlüssel.',true],
     ['Am Abend ist die Familie zusammen.',true]
    ],
    abc:[
     ['Wer liest ein Buch?',['die Mutter','der Vater','die Kinder'],'die Mutter'],
     ['Was macht die Familie vor dem Suchen nach dem Schlüssel?',['Sie grillt und isst.','Sie hört Musik.','Sie frühstückt noch einmal.'],'Sie grillt und isst.'],
     ['Was macht die Familie am Abend?',['Sie spricht und hört Musik.','Sie grillt.','Sie spielt Tennis.'],'Sie spricht und hört Musik.']
    ]
   },
   {
    text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch einen Brief geschrieben.',
    tf:[
     ['Lea trifft Mina vor der Arbeit.',false],
     ['Lea trinkt keinen Kaffee.',false],
     ['Mina schreibt den Brief nach dem Film.',true]
    ],
    abc:[
     ['Wann trifft Lea Mina?',['nach der Arbeit','vor der Arbeit','am Morgen'],'nach der Arbeit'],
     ['Wer macht den Salat?',['Lea','Mina','Nina'],'Lea'],
     ['Was macht Mina ganz am Ende?',['Sie schreibt einen Brief.','Sie kocht Suppe.','Sie kauft Brot.'],'Sie schreibt einen Brief.']
    ]
   }
  ];
 }
 theme.contentRevision='l7t2-reading-a1-20260817-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
