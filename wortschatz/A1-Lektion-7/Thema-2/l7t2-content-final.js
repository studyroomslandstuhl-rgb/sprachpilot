(function(){
'use strict';
if(window.__SP_L7T2_CONTENT_FINAL_V2)return;
window.__SP_L7T2_CONTENT_FINAL_V2=true;

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
      tf:[
        ['Omar hat am Montag gearbeitet.',true],
        ['Omar hat nach der Arbeit ein Buch gekauft.',false],
        ['Am Abend hat Omar einen Film gesehen.',true]
      ],
      abc:[
        ['Mit wem hat Omar in der Pause gesprochen?',['mit einer Freundin','mit einem Arzt','mit seiner Lehrerin'],'mit einer Freundin'],
        ['Was hat Omar gekocht?',['Suppe','Pizza','Kuchen'],'Suppe'],
        ['Was hat Omar getrunken?',['Tee','Kaffee','Milch'],'Tee']
      ]
    };
    reading.items[4]={
      text:'Lea hat am Freitag bis 16 Uhr gearbeitet. Danach hat sie ihre Freundin Mina getroffen. Sie haben zuerst Kaffee getrunken und lange gesprochen. Dann haben sie Brot gekauft. Zu Hause hat Lea Salat gemacht und Mina hat Suppe gekocht. Nach dem Essen haben sie Musik gehört und einen Film gesehen. Mina hat später noch einen Brief geschrieben.',
      tf:[
        ['Lea hat am Freitag bis 16 Uhr gearbeitet.',true],
        ['Lea und Mina haben zuerst Tee getrunken.',false],
        ['Nach dem Essen haben sie einen Film gesehen.',true]
      ],
      abc:[
        ['Was haben Lea und Mina gekauft?',['Brot','ein Buch','eine Gitarre'],'Brot'],
        ['Wer hat Suppe gekocht?',['Mina','Lea','Sara'],'Mina'],
        ['Was hat Mina später geschrieben?',['einen Brief','einen Test','ein Buch'],'einen Brief']
      ]
    };
  }

  const listening=byId(theme,'hoeren-tagesrueckblicke');
  if(listening?.items?.[0]){
    listening.items[0]={
      audioFile:'l7t2_tagesrueckblick_01.mp3',
      transcript:'Gestern habe ich lange gearbeitet. In der Pause habe ich mit meiner Freundin gesprochen. Nach der Arbeit habe ich Brot gekauft. Zu Hause habe ich Suppe gekocht und später einen Film gesehen.',
      questions:[
        ['Was hat die Person in der Pause gemacht?',['mit einer Freundin gesprochen','ein Buch gelesen','Tennis gespielt'],'mit einer Freundin gesprochen'],
        ['Was hat die Person gekauft?',['Brot','ein Buch','einen Test'],'Brot'],
        ['Was hat die Person am Abend gesehen?',['einen Film','eine Schule','einen Brief'],'einen Film']
      ]
    };
  }

  theme.contentRevision='l7t2-standard-20260817-v8';
  window.L7_THEME=theme;
  return theme;
});
})();
