(function(){
'use strict';
if(window.__SP_L7T2_CONTENT_FINAL_V3)return;
window.__SP_L7T2_CONTENT_FINAL_V3=true;

function byId(theme,id){return theme?.tasks?.find(task=>task?.id===id)}

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

  const reading=byId(theme,'lesen');
  if(reading?.items?.length>=5){
    reading.items[1]={
      text:'Am Montag hat Omar früh gefrühstückt. Danach hat er bis zum Nachmittag gearbeitet. In der Pause hat er mit einer Freundin gesprochen. Nach der Arbeit hat Omar Brot und Milch gekauft. Zu Hause hat er Suppe gekocht, Brot gegessen und Tee getrunken. Am Abend hat er noch einen Film gesehen.',
      tf:[['Omar hat am Montag gearbeitet.',true],['Omar hat nach der Arbeit ein Buch gekauft.',false],['Am Abend hat Omar einen Film gesehen.',true]],
      abc:[['Mit wem hat Omar in der Pause gesprochen?',['mit einer Freundin','mit einem Arzt','mit seiner Lehrerin'],'mit einer Freundin'],['Was hat Omar gekocht?',['Suppe','Pizza','Kuchen'],'Suppe'],['Was hat Omar getrunken?',['Tee','Kaffee','Milch'],'Tee']]
    };
    reading.items[4]={
      text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch einen Brief geschrieben.',
      tf:[['Lea hat am Freitag bis 16 Uhr gearbeitet.',true],['Lea und Mina haben zuerst Tee getrunken.',false],['Nach dem Essen haben sie einen Film gesehen.',true]],
      abc:[['Was haben Lea und Mina gekauft?',['Brot','ein Buch','eine Gitarre'],'Brot'],['Wer hat Suppe gekocht?',['Mina','Lea','Sara'],'Mina'],['Was hat Mina später geschrieben?',['einen Brief','einen Test','ein Buch'],'einen Brief']]
    };
  }

  const listening=byId(theme,'hoeren-tagesrueckblicke');
  if(listening){
    listening.title='Hören';
    listening.description='Höre kurze Tagesrückblicke und antworte.';
    listening.items=[
      {
        name:'Nina',
        audioFile:'l7t2_tagesrueckblick_01.mp3',
        transcript:'Gestern habe ich lange gearbeitet. In der Pause habe ich mit meiner Freundin gesprochen. Nach der Arbeit habe ich Brot gekauft. Zu Hause habe ich Suppe gekocht und später einen Film gesehen.',
        questions:[
          ['Was hat Nina in der Pause gemacht?',['Sie hat mit einer Freundin gesprochen.','Sie hat ein Buch gelesen.','Sie hat Tennis gespielt.'],'Sie hat mit einer Freundin gesprochen.'],
          ['Was hat Nina gekauft?',['Brot','ein Buch','einen Test'],'Brot'],
          ['Was hat Nina am Abend gesehen?',['einen Film','eine Schule','einen Brief'],'einen Film']
        ]
      },
      {
        name:'Omar',
        audioFile:'l7t2_tagesrueckblick_02.mp3',
        transcript:'Am Samstag habe ich lange geschlafen und um neun Uhr gefrühstückt. Danach habe ich meine Freundin getroffen. Wir haben Kaffee getrunken, Musik gehört und am Abend zusammen gegrillt.',
        questions:[
          ['Wann hat Omar gefrühstückt?',['um neun Uhr','um sieben Uhr','um zwölf Uhr'],'um neun Uhr'],
          ['Wen hat Omar getroffen?',['eine Freundin','einen Arzt','eine Lehrerin'],'eine Freundin'],
          ['Was haben Omar und seine Freundin am Abend gemacht?',['gegrillt','gearbeitet','gelernt'],'gegrillt']
        ]
      },
      {
        name:'Sofia',
        audioFile:'l7t2_tagesrueckblick_03.mp3',
        transcript:'Heute habe ich viel Deutsch gelernt. Am Vormittag habe ich einen Text gelesen und einen Brief geschrieben. Später habe ich mit meinem Lehrer gesprochen. Am Abend habe ich noch Musik gehört.',
        questions:[
          ['Was hat Sofia gelernt?',['Deutsch','Mathematik','Französisch'],'Deutsch'],
          ['Was hat Sofia geschrieben?',['einen Brief','ein Buch','einen Test'],'einen Brief'],
          ['Mit wem hat Sofia gesprochen?',['mit dem Lehrer','mit dem Arzt','mit der Freundin'],'mit dem Lehrer']
        ]
      },
      {
        name:'Daniel',
        audioFile:'l7t2_tagesrueckblick_04.mp3',
        transcript:'Am Sonntag haben wir zusammen gefrühstückt. Danach haben wir Tennis gespielt. Am Mittag haben wir gekocht und gegessen. Später habe ich meinen Schlüssel gesucht und meine Schwester hat ein Buch gelesen.',
        questions:[
          ['Was haben Daniel und seine Familie nach dem Frühstück gemacht?',['Tennis gespielt','einen Film gesehen','Deutsch gelernt'],'Tennis gespielt'],
          ['Was hat Daniel gesucht?',['einen Schlüssel','ein Buch','Brot'],'einen Schlüssel'],
          ['Wer hat ein Buch gelesen?',['seine Schwester','sein Lehrer','seine Freundin'],'seine Schwester']
        ]
      },
      {
        name:'Lea',
        audioFile:'l7t2_tagesrueckblick_05.mp3',
        transcript:'Ich habe lange in Köln gewohnt und dort auch gearbeitet. Gestern habe ich alte Freunde getroffen. Wir haben zusammen gegessen und Tee getrunken. Das Essen hat zwanzig Euro gekostet. Später haben wir noch lange gesprochen.',
        questions:[
          ['Wo hat Lea gewohnt?',['in Köln','in Berlin','in Bonn'],'in Köln'],
          ['Wen hat Lea getroffen?',['alte Freunde','eine Ärztin','eine Lehrerin'],'alte Freunde'],
          ['Wie viel hat das Essen gekostet?',['zwanzig Euro','zehn Euro','fünf Euro'],'zwanzig Euro']
        ]
      }
    ];
  }

  theme.contentRevision='l7t2-standard-20260817-v9';
  window.L7_THEME=theme;
  return theme;
});
})();
