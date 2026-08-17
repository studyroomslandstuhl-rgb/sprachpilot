(function(){
'use strict';
if(window.__SP_L7T2_READING_A1_V2)return;
window.__SP_L7T2_READING_A1_V2=true;
function byId(theme,id){return theme?.tasks?.find(task=>task?.id===id)}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const reading=byId(theme,'lesen');
 if(reading){
  reading.items=[
   {
    text:'Gestern war Samstag. Nina hat bis acht Uhr geschlafen und um neun Uhr gefrühstückt. Danach hat sie ihre Freundin Sara getroffen. Sie haben zusammen Kaffee getrunken und ein Buch gekauft. Am Nachmittag haben sie Musik gehört. Am Abend hat Nina mit Sara Pizza gebacken. Später hat Nina noch einen Brief geschrieben und einen Film gesehen.',
    tf:[
     ['Nina ist am Samstag nicht allein.',true],
     ['Nina kauft etwas zum Essen.',false],
     ['Nina macht am Abend mehr als eine Sache.',true]
    ],
    abc:[
     ['Was passt zu Ninas Samstag?',['Freundin, Buch und Film','Arbeit, Test und Bus','Arzt, Schule und Tennis'],'Freundin, Buch und Film'],
     ['Nina und Sara machen viel zusammen. Was macht Nina allein?',['einen Brief schreiben','Kaffee trinken','Pizza backen'],'einen Brief schreiben'],
     ['Wie ist Ninas Tag?',['Sie schläft lange und trifft eine Freundin.','Sie arbeitet lange und fährt mit dem Bus.','Sie lernt für einen Test und spielt Tennis.'],'Sie schläft lange und trifft eine Freundin.']
    ]
   },
   {
    text:'Am Montag hat Omar früh gefrühstückt. Danach hat er bis zum Nachmittag gearbeitet. In der Pause hat er mit einer Freundin gesprochen. Nach der Arbeit hat Omar Brot und Milch gekauft. Zu Hause hat er Suppe gekocht, Brot gegessen und Tee getrunken. Am Abend hat er noch einen Film gesehen.',
    tf:[
     ['Omar hat am Montag einen Arbeitstag.',true],
     ['Omar isst nur im Restaurant.',false],
     ['Am Abend hat Omar Freizeit.',true]
    ],
    abc:[
     ['Was passt zu Omars Tag?',['Arbeit, Einkauf, Essen und Film','Schule, Test, Tennis und Arzt','Reise, Hotel, Flug und Konzert'],'Arbeit, Einkauf, Essen und Film'],
     ['Omar braucht Brot und Milch. Was macht er?',['Er kauft ein.','Er lernt Deutsch.','Er spielt Fußball.'],'Er kauft ein.'],
     ['Was macht Omar zu Hause?',['Er kocht und isst.','Er arbeitet weiter.','Er trifft seine Lehrerin.'],'Er kocht und isst.']
    ]
   },
   {
    text:'Am Mittwoch hat Anna einen langen Tag gehabt. Am Vormittag hat sie Deutsch gelernt und einen Test geschrieben. Danach hat sie mit ihrer Lehrerin gesprochen. Am Nachmittag hat Anna ihre Hausaufgaben gemacht und ein Buch gelesen. Später hat sie ihre Schwester getroffen. Zusammen haben sie Musik gehört und Tee getrunken.',
    tf:[
     ['Anna hat am Mittwoch viel zu tun.',true],
     ['Anna spricht nur mit ihrer Schwester.',false],
     ['Am Abend ist Anna nicht allein.',true]
    ],
    abc:[
     ['Was passt zu Annas Tag?',['Deutsch, Test, Hausaufgaben und Schwester','Arbeit, Einkauf, Grillen und Film','Bus, Reise, Hotel und Arzt'],'Deutsch, Test, Hausaufgaben und Schwester'],
     ['Anna hat eine Frage zur Schule. Mit wem kann sie sprechen?',['mit ihrer Lehrerin','mit ihrer Schwester','mit einem Verkäufer'],'mit ihrer Lehrerin'],
     ['Was macht Anna zusammen mit ihrer Schwester?',['Musik hören und Tee trinken','einen Test schreiben','Hausaufgaben machen'],'Musik hören und Tee trinken']
    ]
   },
   {
    text:'Am Sonntag hat Familie Kaya lange gefrühstückt. Danach haben die Eltern in der Küche gearbeitet und die Kinder haben ein Spiel gespielt. Am Mittag haben alle zusammen gegrillt und gegessen. Später hat der Vater seinen Schlüssel gesucht. Die Mutter hat ein Buch gelesen. Am Abend haben sie noch lange gesprochen und Musik gehört.',
    tf:[
     ['Am Sonntag macht Familie Kaya viele Dinge.',true],
     ['Die Kinder helfen in der Küche.',false],
     ['Am Abend spricht niemand.',false]
    ],
    abc:[
     ['Was passt zu Familie Kaya?',['Frühstück, Grillen und Musik','Schule, Test und Bus','Arbeit, Hotel und Flug'],'Frühstück, Grillen und Musik'],
     ['Der Vater braucht etwas. Was sucht er?',['seinen Schlüssel','sein Buch','sein Frühstück'],'seinen Schlüssel'],
     ['Wer hat Zeit zum Lesen?',['die Mutter','der Vater','die Kinder'],'die Mutter']
    ]
   },
   {
    text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch einen Brief geschrieben.',
    tf:[
     ['Lea und Mina verbringen viel Zeit zusammen.',true],
     ['Lea kocht die Suppe.',false],
     ['Mina macht am Abend mehr als eine Sache.',true]
    ],
    abc:[
     ['Was passt zu Lea und Mina?',['Kaffee, Essen, Musik und Film','Test, Schule, Bus und Arzt','Hotel, Flug, Tennis und Arbeit'],'Kaffee, Essen, Musik und Film'],
     ['Wer macht etwas Warmes zu essen?',['Mina','Lea','Nina'],'Mina'],
     ['Was macht Mina ganz am Ende?',['Sie schreibt einen Brief.','Sie kauft Brot.','Sie trinkt Kaffee.'],'Sie schreibt einen Brief.']
    ]
   }
  ];
 }
 theme.contentRevision='l7t2-reading-a1-20260817-v2';
 window.L7_THEME=theme;
 return theme;
});
})();
