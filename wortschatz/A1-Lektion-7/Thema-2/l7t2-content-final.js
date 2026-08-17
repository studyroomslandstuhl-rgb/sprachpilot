(function(){
'use strict';
if(window.__SP_L7T2_CONTENT_FINAL_V5)return;
window.__SP_L7T2_CONTENT_FINAL_V5=true;

function byId(theme,id){return theme?.tasks?.find(task=>task?.id===id)}
function permutations(values){
 if(values.length<=1)return[values];
 const out=[];
 values.forEach((value,index)=>{
  const rest=values.slice(0,index).concat(values.slice(index+1));
  permutations(rest).forEach(p=>out.push([value,...p]));
 });
 return out;
}
function cap(value){const s=String(value||'');return s?s[0].toUpperCase()+s.slice(1):s}
function orderVariants(subject,subjectMid,aux,middle,tail){
 const variants=[];
 const add=parts=>variants.push(parts.filter(Boolean).join(' ').replace(/\s+/g,' ').trim()+'.');
 permutations(middle).forEach(p=>add([subject,aux,...p,tail]));
 middle.forEach((front,index)=>{
  const rest=middle.filter((_,i)=>i!==index);
  permutations(rest).forEach(p=>add([cap(front),aux,subjectMid,...p,tail]));
 });
 return [...new Set(variants)];
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
  const rewrite=byId(theme,'text-umschreiben');
  if(rewrite?.items?.[0]){
    rewrite.items[0]={
      present:'Am Samstag frühstückt Lara um acht Uhr und hört Musik. Danach lernt sie Deutsch und schreibt einen kurzen Text. Am Mittag trifft sie ihre Freundin Mia. Sie trinken Kaffee und kaufen ein Buch. Am Nachmittag machen sie Hausaufgaben. Am Abend kocht Lara Suppe, liest im Buch und sieht einen Film.',
      perfect:'Am Samstag hat Lara um acht Uhr gefrühstückt und Musik gehört. Danach hat sie Deutsch gelernt und einen kurzen Text geschrieben. Am Mittag hat sie ihre Freundin Mia getroffen. Sie haben Kaffee getrunken und ein Buch gekauft. Am Nachmittag haben sie Hausaufgaben gemacht. Am Abend hat Lara Suppe gekocht, im Buch gelesen und einen Film gesehen.'
    };
  }

  const sentenceWrite=byId(theme,'saetze-schreiben');
  if(sentenceWrite?.items?.length>=15){
    sentenceWrite.items[14]={cue:'das Buch – gestern – zehn Euro – kosten',answer:'Das Buch hat gestern zehn Euro gekostet.'};
  }

  const order=byId(theme,'saetze');
  if(order?.items?.length>=15){
    const schemas=[
      ['Ich','ich','habe',['am Montag','Deutsch'],'gelernt'],
      ['Anna','Anna','hat',['am Vormittag','eine Übung'],'gemacht'],
      ['Tim','Tim','hat',['am Abend','einen Brief'],'geschrieben'],
      ['Wir','wir','haben',['nach dem Unterricht','Musik'],'gehört'],
      ['Die Freunde','die Freunde','haben',['am Samstag','Tennis'],'gespielt und später gegrillt'],
      ['Sara','Sara','hat',['am Abend','einen Film'],'gesehen'],
      ['Paul','Paul','hat',['lange','in Köln'],'gelebt und viele Bücher gelesen'],
      ['Meine Mutter','meine Mutter','hat',['am Morgen','Brot'],'gekauft'],
      ['Wir','wir','haben',['in der Pause','Deutsch'],'gesprochen'],
      ['Omar','Omar','hat',['lange','in Berlin'],'gewohnt und dort gearbeitet'],
      ['Ich','ich','habe',['am Nachmittag','meine Freunde'],'getroffen und meinen Schlüssel gesucht'],
      ['Wir','wir','haben',['am Sonntag','lange'],'geschlafen und zusammen gefrühstückt'],
      ['Maria','Maria','hat',['am Abend','Suppe'],'gekocht und Brot gegessen'],
      ['Tim','Tim','hat',['Tee'],'getrunken und Danke gesagt'],
      ['Das Buch','das Buch','hat',['zehn Euro'],'gekostet']
    ];
    schemas.forEach((schema,index)=>{
      if(order.items[index])order.items[index].acceptedSentences=orderVariants(...schema);
    });
  }

  const reading=byId(theme,'lesen');
  if(reading){
    reading.items=[
      {
        text:'Gestern war Samstag. Nina hat bis acht Uhr geschlafen und um neun Uhr gefrühstückt. Danach hat sie ihre Freundin Sara getroffen. Sie haben zusammen Kaffee getrunken und ein Buch gekauft. Am Nachmittag haben sie Musik gehört. Am Abend hat Nina mit Sara Pizza gebacken. Später hat Nina noch einen Brief geschrieben und einen Film gesehen.',
        tf:[
          ['Zuerst hat Nina gefrühstückt. Dann hat sie Sara getroffen.',true],
          ['Am Nachmittag haben Nina und Sara Pizza gebacken.',false],
          ['Der Film war nach dem Brief.',true]
        ],
        abc:[
          ['Was war zuerst?',['frühstücken','Sara treffen','einen Film sehen'],'frühstücken'],
          ['Was war nach der Musik?',['Pizza backen','frühstücken','ein Buch kaufen'],'Pizza backen'],
          ['Was war zuletzt?',['einen Film sehen','Kaffee trinken','ein Buch kaufen'],'einen Film sehen']
        ]
      },
      {
        text:'Am Montag hat Omar früh gefrühstückt. Danach hat er bis zum Nachmittag gearbeitet. In der Pause hat er mit einer Freundin gesprochen. Nach der Arbeit hat Omar Brot und Milch gekauft. Zu Hause hat er Suppe gekocht, Brot gegessen und Tee getrunken. Am Abend hat er noch einen Film gesehen.',
        tf:[
          ['Zuerst hat Omar gefrühstückt. Dann hat er gearbeitet.',true],
          ['Nach der Arbeit hat Omar zuerst einen Film gesehen.',false],
          ['Der Film war am Abend.',true]
        ],
        abc:[
          ['Was war nach der Arbeit?',['Brot und Milch kaufen','einen Film sehen','frühstücken'],'Brot und Milch kaufen'],
          ['Was war vor dem Film?',['Suppe kochen','frühstücken','arbeiten'],'Suppe kochen'],
          ['Was war zuerst?',['frühstücken','einkaufen','Film sehen'],'frühstücken']
        ]
      },
      {
        text:'Am Mittwoch hat Anna einen langen Tag gehabt. Am Vormittag hat sie Deutsch gelernt und einen Test geschrieben. Danach hat sie mit ihrer Lehrerin gesprochen. Am Nachmittag hat Anna ihre Hausaufgaben gemacht und ein Buch gelesen. Später hat sie ihre Schwester getroffen. Zusammen haben sie Musik gehört und Tee getrunken.',
        tf:[
          ['Der Test war am Vormittag.',true],
          ['Anna hat ihre Schwester vor den Hausaufgaben getroffen.',false],
          ['Musik und Tee waren am Ende.',true]
        ],
        abc:[
          ['Was war nach dem Test?',['mit der Lehrerin sprechen','die Schwester treffen','Tee trinken'],'mit der Lehrerin sprechen'],
          ['Was war vor dem Treffen mit der Schwester?',['Hausaufgaben machen','Musik hören','Tee trinken'],'Hausaufgaben machen'],
          ['Was war zuletzt?',['Musik hören und Tee trinken','Deutsch lernen','einen Test schreiben'],'Musik hören und Tee trinken']
        ]
      },
      {
        text:'Am Sonntag hat Familie Kaya lange gefrühstückt. Danach haben die Eltern in der Küche gearbeitet und die Kinder haben ein Spiel gespielt. Am Mittag haben alle zusammen gegrillt und gegessen. Später hat der Vater seinen Schlüssel gesucht. Die Mutter hat ein Buch gelesen. Am Abend haben sie noch lange gesprochen und Musik gehört.',
        tf:[
          ['Das Frühstück war vor dem Grillen.',true],
          ['Der Vater hat den Schlüssel vor dem Essen gesucht.',false],
          ['Am Abend hat Familie Kaya Musik gehört.',true]
        ],
        abc:[
          ['Was war nach dem Frühstück?',['arbeiten und spielen','grillen und essen','Musik hören'],'arbeiten und spielen'],
          ['Was war nach dem Essen?',['den Schlüssel suchen','frühstücken','ein Spiel spielen'],'den Schlüssel suchen'],
          ['Was war am Ende?',['sprechen und Musik hören','grillen und essen','frühstücken'],'sprechen und Musik hören']
        ]
      },
      {
        text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch einen Brief geschrieben.',
        tf:[
          ['Lea hat Mina nach der Arbeit getroffen.',true],
          ['Brot kaufen war vor Kaffee trinken.',false],
          ['Der Brief war nach dem Film.',true]
        ],
        abc:[
          ['Was war zuerst nach dem Treffen?',['Kaffee trinken und sprechen','Brot kaufen','einen Film sehen'],'Kaffee trinken und sprechen'],
          ['Was war vor Musik und Film?',['essen','arbeiten','Brief schreiben'],'essen'],
          ['Was war zuletzt?',['einen Brief schreiben','Brot kaufen','Suppe kochen'],'einen Brief schreiben']
        ]
      }
    ];
  }

  const listening=byId(theme,'hoeren-tagesrueckblicke');
  if(listening){
    listening.title='Hören';
    listening.description='Höre kurze Tagesrückblicke und antworte.';
    listening.items=[
      {
        name:'Nina',audioFile:'l7t2_tagesrueckblick_01.mp3',
        transcript:'Gestern habe ich lange gearbeitet. In der Pause habe ich mit meiner Freundin gesprochen. Nach der Arbeit habe ich Brot gekauft. Zu Hause habe ich Suppe gekocht und später einen Film gesehen.',
        questions:[['Was hat Nina in der Pause gemacht?',['Sie hat mit einer Freundin gesprochen.','Sie hat ein Buch gelesen.','Sie hat Tennis gespielt.'],'Sie hat mit einer Freundin gesprochen.'],['Was hat Nina gekauft?',['Brot','ein Buch','einen Test'],'Brot'],['Was hat Nina am Abend gesehen?',['einen Film','eine Schule','einen Brief'],'einen Film']]
      },
      {
        name:'Omar',audioFile:'l7t2_tagesrueckblick_02.mp3',
        transcript:'Am Samstag habe ich lange geschlafen und um neun Uhr gefrühstückt. Danach habe ich meine Freundin getroffen. Wir haben Kaffee getrunken, Musik gehört und am Abend zusammen gegrillt.',
        questions:[['Wann hat Omar gefrühstückt?',['um neun Uhr','um sieben Uhr','um zwölf Uhr'],'um neun Uhr'],['Wen hat Omar getroffen?',['eine Freundin','einen Arzt','eine Lehrerin'],'eine Freundin'],['Was haben Omar und seine Freundin am Abend gemacht?',['gegrillt','gearbeitet','gelernt'],'gegrillt']]
      },
      {
        name:'Sofia',audioFile:'l7t2_tagesrueckblick_03.mp3',
        transcript:'Heute habe ich viel Deutsch gelernt. Am Vormittag habe ich einen Text gelesen und einen Brief geschrieben. Später habe ich mit meinem Lehrer gesprochen. Am Abend habe ich noch Musik gehört.',
        questions:[['Was hat Sofia gelernt?',['Deutsch','Mathematik','Französisch'],'Deutsch'],['Was hat Sofia geschrieben?',['einen Brief','ein Buch','einen Test'],'einen Brief'],['Mit wem hat Sofia gesprochen?',['mit dem Lehrer','mit dem Arzt','mit der Freundin'],'mit dem Lehrer']]
      },
      {
        name:'Daniel',audioFile:'l7t2_tagesrueckblick_04.mp3',
        transcript:'Am Sonntag haben wir zusammen gefrühstückt. Danach haben wir Tennis gespielt. Am Mittag haben wir gekocht und gegessen. Später habe ich meinen Schlüssel gesucht und meine Schwester hat ein Buch gelesen.',
        questions:[['Was haben Daniel und seine Familie nach dem Frühstück gemacht?',['Tennis gespielt','einen Film gesehen','Deutsch gelernt'],'Tennis gespielt'],['Was hat Daniel gesucht?',['einen Schlüssel','ein Buch','Brot'],'einen Schlüssel'],['Wer hat ein Buch gelesen?',['seine Schwester','sein Lehrer','seine Freundin'],'seine Schwester']]
      },
      {
        name:'Lea',audioFile:'l7t2_tagesrueckblick_05.mp3',
        transcript:'Ich habe lange in Köln gewohnt und dort auch gearbeitet. Gestern habe ich alte Freunde getroffen. Wir haben zusammen gegessen und Tee getrunken. Das Essen hat zwanzig Euro gekostet. Später haben wir noch lange gesprochen.',
        questions:[['Wo hat Lea gewohnt?',['in Köln','in Berlin','in Bonn'],'in Köln'],['Wen hat Lea getroffen?',['alte Freunde','eine Ärztin','eine Lehrerin'],'alte Freunde'],['Wie viel hat das Essen gekostet?',['zwanzig Euro','zehn Euro','fünf Euro'],'zwanzig Euro']]
      }
    ];
  }

  theme.contentRevision='l7t2-standard-20260817-v13';
  window.L7_THEME=theme;
  return theme;
});
})();
