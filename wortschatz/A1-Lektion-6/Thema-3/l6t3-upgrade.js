(function(){
  const VERSION='20260716-1';
  const AP_FILE='akkusativ-praepositionen.html';
  const DIALOG_FILE='bilddialoge.html';
  const NEW_WORDS=[
    {id:'endlich',group:'Planen',type:'adverb',article:'',word:'endlich',full:'endlich',image:'endlich.webp',sentence:'Endlich ist Samstag.',tr:{en:'finally',ru:'наконец',uk:'нарешті',tr:'sonunda',ar:'أخيرًا',ja:'ついに',ro:'în sfârșit',pl:'wreszcie',ku:'di dawiyê de'}},
    {id:'zuerst',group:'Planen',type:'adverb',article:'',word:'zuerst',full:'zuerst',image:'zuerst.webp',sentence:'Zuerst kaufen wir ein.',tr:{en:'first',ru:'сначала',uk:'спочатку',tr:'önce',ar:'أولاً',ja:'最初に',ro:'mai întâi',pl:'najpierw',ku:'pêşî'}},
    {id:'dann',group:'Planen',type:'adverb',article:'',word:'dann',full:'dann',image:'dann.webp',sentence:'Dann machen wir einen Ausflug.',tr:{en:'then',ru:'потом',uk:'потім',tr:'sonra',ar:'ثم',ja:'それから',ro:'apoi',pl:'potem',ku:'paşê'}},
    {id:'naemlich',group:'Planen',type:'adverb',article:'',word:'nämlich',full:'nämlich',image:'naemlich.webp',sentence:'Ich kann nicht kommen. Ich arbeite nämlich.',tr:{en:'because / namely',ru:'ведь',uk:'адже',tr:'çünkü',ar:'لأن',ja:'というのも',ro:'fiindcă',pl:'ponieważ',ku:'ji ber ku'}},
    {id:'ausflug',group:'Planen',type:'noun',article:'der',word:'Ausflug',full:'der Ausflug',image:'ausflug.webp',sentence:'Der Ausflug ist am Sonntag.',tr:{en:'trip',ru:'экскурсия',uk:'екскурсія',tr:'gezi',ar:'نزهة',ja:'遠足',ro:'excursie',pl:'wycieczka',ku:'ger'}},
    {id:'gerade',group:'Planen',type:'time',article:'',word:'gerade',full:'gerade',image:'gerade.webp',sentence:'Ich koche gerade.',tr:{en:'right now',ru:'сейчас',uk:'зараз',tr:'şu anda',ar:'الآن',ja:'ちょうど今',ro:'chiar acum',pl:'właśnie',ku:'niha'}},
    {id:'einladung',group:'Planen',type:'noun',article:'die',word:'Einladung',full:'die Einladung',image:'einladung.webp',sentence:'Die Einladung ist schön.',tr:{en:'invitation',ru:'приглашение',uk:'запрошення',tr:'davet',ar:'دعوة',ja:'招待状',ro:'invitație',pl:'zaproszenie',ku:'vexwendin'}},
    {id:'einladen',group:'Planen',type:'verb',article:'',word:'einladen',full:'einladen',image:'einladen.webp',sentence:'Ich lade Anna ein.',tr:{en:'to invite',ru:'приглашать',uk:'запрошувати',tr:'davet etmek',ar:'يدعو',ja:'招待する',ro:'a invita',pl:'zapraszać',ku:'vexwendin'}},
    {id:'sofort',group:'Planen',type:'adverb',article:'',word:'sofort',full:'sofort',image:'sofort.webp',sentence:'Komm bitte sofort.',tr:{en:'immediately',ru:'сразу',uk:'негайно',tr:'hemen',ar:'فورًا',ja:'すぐに',ro:'imediat',pl:'natychmiast',ku:'tavilê'}}
  ];
  NEW_WORDS.forEach(w=>{if(!WORDS.some(x=>x.id===w.id))WORDS.push(w)});

  const BASE_ANALYSIS=[
    {id:'b01',sentence:'Der Mann kauft den Apfel.',target:'Der Mann',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b02',sentence:'Der Mann kauft den Apfel.',target:'den Apfel',article:'den',case:'Akkusativ',reason:'Aktion'},
    {id:'b03',sentence:'Die Frau trinkt die Milch.',target:'Die Frau',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b04',sentence:'Die Frau trinkt die Milch.',target:'die Milch',article:'die',case:'Akkusativ',reason:'Aktion'},
    {id:'b05',sentence:'Das Kind isst das Brot.',target:'Das Kind',article:'das',case:'Nominativ',reason:'Subjekt'},
    {id:'b06',sentence:'Das Kind isst das Brot.',target:'das Brot',article:'das',case:'Akkusativ',reason:'Aktion'},
    {id:'b07',sentence:'Der Vater kauft den Tisch.',target:'Der Vater',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b08',sentence:'Der Vater kauft den Tisch.',target:'den Tisch',article:'den',case:'Akkusativ',reason:'Aktion'},
    {id:'b09',sentence:'Die Mutter putzt die Küche.',target:'Die Mutter',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b10',sentence:'Die Mutter putzt die Küche.',target:'die Küche',article:'die',case:'Akkusativ',reason:'Aktion'},
    {id:'b11',sentence:'Das Mädchen macht das Bett.',target:'Das Mädchen',article:'das',case:'Nominativ',reason:'Subjekt'},
    {id:'b12',sentence:'Das Mädchen macht das Bett.',target:'das Bett',article:'das',case:'Akkusativ',reason:'Aktion'},
    {id:'b13',sentence:'Der Schüler besucht den Kurs.',target:'Der Schüler',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b14',sentence:'Der Schüler besucht den Kurs.',target:'den Kurs',article:'den',case:'Akkusativ',reason:'Aktion'},
    {id:'b15',sentence:'Die Lehrerin verschiebt den Termin.',target:'Die Lehrerin',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b16',sentence:'Die Lehrerin verschiebt den Termin.',target:'den Termin',article:'den',case:'Akkusativ',reason:'Aktion'},
    {id:'b17',sentence:'Das Kind öffnet die Tür.',target:'Das Kind',article:'das',case:'Nominativ',reason:'Subjekt'},
    {id:'b18',sentence:'Das Kind öffnet die Tür.',target:'die Tür',article:'die',case:'Akkusativ',reason:'Aktion'},
    {id:'b19',sentence:'Die Studentin besucht die Bibliothek.',target:'Die Studentin',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b20',sentence:'Die Studentin besucht die Bibliothek.',target:'die Bibliothek',article:'die',case:'Akkusativ',reason:'Aktion'},
    {id:'b21',sentence:'Der Apfel ist rot.',target:'Der Apfel',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b22',sentence:'Die Milch ist kalt.',target:'Die Milch',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b23',sentence:'Das Brot ist frisch.',target:'Das Brot',article:'das',case:'Nominativ',reason:'Subjekt'},
    {id:'b24',sentence:'Das ist der Tisch.',target:'der Tisch',article:'der',case:'Nominativ',reason:'keine Aktion'},
    {id:'b25',sentence:'Das ist die Lampe.',target:'die Lampe',article:'die',case:'Nominativ',reason:'keine Aktion'},
    {id:'b26',sentence:'Das ist das Bett.',target:'das Bett',article:'das',case:'Nominativ',reason:'keine Aktion'},
    {id:'b27',sentence:'Der Kurs beginnt am Montag.',target:'Der Kurs',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b28',sentence:'Die Praxis öffnet um neun Uhr.',target:'Die Praxis',article:'die',case:'Nominativ',reason:'Subjekt'},
    {id:'b29',sentence:'Der Fernseher ist neu.',target:'Der Fernseher',article:'der',case:'Nominativ',reason:'Subjekt'},
    {id:'b30',sentence:'Anna liest die Speisekarte.',target:'die Speisekarte',article:'die',case:'Akkusativ',reason:'Aktion'}
  ];

  const AP_ANALYSIS=[
    {id:'ap01',sentence:'Ich kaufe Brot für den Ausflug.',target:'den Ausflug',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap02',sentence:'Wir gehen um den Tisch.',target:'den Tisch',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap03',sentence:'Die Kinder laufen um das Haus.',target:'das Haus',article:'das',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap04',sentence:'Anna läuft durch die Wohnung.',target:'die Wohnung',article:'die',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap05',sentence:'Wir gehen durch den Flur.',target:'den Flur',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap06',sentence:'Der Mann geht durch das Wohnzimmer.',target:'das Wohnzimmer',article:'das',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap07',sentence:'Der Ball fliegt gegen die Wand.',target:'die Wand',article:'die',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap08',sentence:'Die Tür schlägt gegen den Schrank.',target:'den Schrank',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap09',sentence:'Der Tisch steht gegen das Sofa.',target:'das Sofa',article:'das',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap10',sentence:'Ich gehe ohne den Schlüssel.',target:'den Schlüssel',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap11',sentence:'Wir kommen ohne die Einladung.',target:'die Einladung',article:'die',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap12',sentence:'Anna fährt ohne das Auto.',target:'das Auto',article:'das',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap13',sentence:'Wir gehen den Flur entlang.',target:'den Flur',article:'den',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap14',sentence:'Anna läuft die Straße entlang.',target:'die Straße',article:'die',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ap15',sentence:'Das Kind läuft das Haus entlang.',target:'das Haus',article:'das',case:'Akkusativ',reason:'Akkusativpräposition'}
  ];

  const DEF_BASE=[
    ['d01','___ Zucker ist süß.','der','Nominativ','Subjekt','Der Zucker ist süß.'],['d02','Ich brauche ___ Zucker.','den','Akkusativ','Aktion','Ich brauche den Zucker.'],
    ['d03','___ Butter ist weich.','die','Nominativ','Subjekt','Die Butter ist weich.'],['d04','Ich kaufe ___ Butter.','die','Akkusativ','Aktion','Ich kaufe die Butter.'],
    ['d05','___ Ei ist frisch.','das','Nominativ','Subjekt','Das Ei ist frisch.'],['d06','Ich esse ___ Ei.','das','Akkusativ','Aktion','Ich esse das Ei.'],
    ['d07','___ Schrank ist groß.','der','Nominativ','Subjekt','Der Schrank ist groß.'],['d08','Wir öffnen ___ Schrank.','den','Akkusativ','Aktion','Wir öffnen den Schrank.'],
    ['d09','___ Wohnung ist hell.','die','Nominativ','Subjekt','Die Wohnung ist hell.'],['d10','Wir suchen ___ Wohnung.','die','Akkusativ','Aktion','Wir suchen die Wohnung.'],
    ['d11','___ Sofa ist bequem.','das','Nominativ','Subjekt','Das Sofa ist bequem.'],['d12','Anna kauft ___ Sofa.','das','Akkusativ','Aktion','Anna kauft das Sofa.'],
    ['d13','Das ist ___ Teppich.','der','Nominativ','keine Aktion','Das ist der Teppich.'],['d14','Das ist ___ Dusche.','die','Nominativ','keine Aktion','Das ist die Dusche.'],
    ['d15','Das ist ___ Fenster.','das','Nominativ','keine Aktion','Das ist das Fenster.'],['d16','___ Kurs beginnt um neun.','der','Nominativ','Subjekt','Der Kurs beginnt um neun.'],
    ['d17','Ich besuche ___ Kurs.','den','Akkusativ','Aktion','Ich besuche den Kurs.'],['d18','___ Praxis öffnet am Montag.','die','Nominativ','Subjekt','Die Praxis öffnet am Montag.'],
    ['d19','Wir suchen ___ Praxis.','die','Akkusativ','Aktion','Wir suchen die Praxis.'],['d20','Ich verschiebe ___ Termin.','den','Akkusativ','Aktion','Ich verschiebe den Termin.'],
    ['d21','___ Ausflug ist am Sonntag.','der','Nominativ','Subjekt','Der Ausflug ist am Sonntag.'],['d22','Wir planen ___ Ausflug.','den','Akkusativ','Aktion','Wir planen den Ausflug.'],
    ['d23','___ Einladung liegt auf dem Tisch.','die','Nominativ','Subjekt','Die Einladung liegt auf dem Tisch.'],['d24','Ich lese ___ Einladung.','die','Akkusativ','Aktion','Ich lese die Einladung.']
  ].map(x=>({id:x[0],q:x[1],answer:x[2],case:x[3],reason:x[4],solution:x[5]}));

  const DEF_AP=[
    ['da01','Ich kaufe Brot für ___ Ausflug.','den','Akkusativ','Akkusativpräposition','Ich kaufe Brot für den Ausflug.'],
    ['da02','Wir gehen um ___ Tisch.','den','Akkusativ','Akkusativpräposition','Wir gehen um den Tisch.'],
    ['da03','Die Kinder laufen um ___ Haus.','das','Akkusativ','Akkusativpräposition','Die Kinder laufen um das Haus.'],
    ['da04','Anna läuft durch ___ Wohnung.','die','Akkusativ','Akkusativpräposition','Anna läuft durch die Wohnung.'],
    ['da05','Wir gehen durch ___ Flur.','den','Akkusativ','Akkusativpräposition','Wir gehen durch den Flur.'],
    ['da06','Der Ball fliegt gegen ___ Wand.','die','Akkusativ','Akkusativpräposition','Der Ball fliegt gegen die Wand.'],
    ['da07','Die Tür schlägt gegen ___ Schrank.','den','Akkusativ','Akkusativpräposition','Die Tür schlägt gegen den Schrank.'],
    ['da08','Anna fährt ohne ___ Auto.','das','Akkusativ','Akkusativpräposition','Anna fährt ohne das Auto.'],
    ['da09','Wir kommen ohne ___ Einladung.','die','Akkusativ','Akkusativpräposition','Wir kommen ohne die Einladung.'],
    ['da10','Wir gehen ___ Flur entlang.','den','Akkusativ','Akkusativpräposition','Wir gehen den Flur entlang.']
  ].map(x=>({id:x[0],q:x[1],answer:x[2],case:x[3],reason:x[4],solution:x[5]}));

  const INDEF_BASE=[
    ['i01','___ Apfel ist rot.','ein','Nominativ','Subjekt','Ein Apfel ist rot.'],['i02','Ich kaufe ___ Apfel.','einen','Akkusativ','Aktion','Ich kaufe einen Apfel.'],
    ['i03','___ Flasche ist leer.','eine','Nominativ','Subjekt','Eine Flasche ist leer.'],['i04','Ich kaufe ___ Flasche.','eine','Akkusativ','Aktion','Ich kaufe eine Flasche.'],
    ['i05','___ Ei ist frisch.','ein','Nominativ','Subjekt','Ein Ei ist frisch.'],['i06','Ich esse ___ Ei.','ein','Akkusativ','Aktion','Ich esse ein Ei.'],
    ['i07','___ Schrank ist groß.','ein','Nominativ','Subjekt','Ein Schrank ist groß.'],['i08','Wir öffnen ___ Schrank.','einen','Akkusativ','Aktion','Wir öffnen einen Schrank.'],
    ['i09','___ Wohnung ist hell.','eine','Nominativ','Subjekt','Eine Wohnung ist hell.'],['i10','Wir suchen ___ Wohnung.','eine','Akkusativ','Aktion','Wir suchen eine Wohnung.'],
    ['i11','___ Sofa ist bequem.','ein','Nominativ','Subjekt','Ein Sofa ist bequem.'],['i12','Anna kauft ___ Sofa.','ein','Akkusativ','Aktion','Anna kauft ein Sofa.'],
    ['i13','Das ist ___ Teppich.','ein','Nominativ','keine Aktion','Das ist ein Teppich.'],['i14','Das ist ___ Dusche.','eine','Nominativ','keine Aktion','Das ist eine Dusche.'],
    ['i15','Das ist ___ Fenster.','ein','Nominativ','keine Aktion','Das ist ein Fenster.'],['i16','___ Kurs beginnt um neun.','ein','Nominativ','Subjekt','Ein Kurs beginnt um neun.'],
    ['i17','Ich besuche ___ Kurs.','einen','Akkusativ','Aktion','Ich besuche einen Kurs.'],['i18','___ Praxis öffnet am Montag.','eine','Nominativ','Subjekt','Eine Praxis öffnet am Montag.'],
    ['i19','Wir suchen ___ Praxis.','eine','Akkusativ','Aktion','Wir suchen eine Praxis.'],['i20','Ich brauche ___ Termin.','einen','Akkusativ','Aktion','Ich brauche einen Termin.'],
    ['i21','___ Ausflug ist geplant.','ein','Nominativ','Subjekt','Ein Ausflug ist geplant.'],['i22','Wir machen ___ Ausflug.','einen','Akkusativ','Aktion','Wir machen einen Ausflug.'],
    ['i23','___ Einladung liegt hier.','eine','Nominativ','Subjekt','Eine Einladung liegt hier.'],['i24','Ich schreibe ___ Einladung.','eine','Akkusativ','Aktion','Ich schreibe eine Einladung.']
  ].map(x=>({id:x[0],q:x[1],answer:x[2],case:x[3],reason:x[4],solution:x[5]}));

  const INDEF_AP=[
    ['ia01','Ich brauche eine Idee für ___ Ausflug.','einen','Akkusativ','Akkusativpräposition','Ich brauche eine Idee für einen Ausflug.'],
    ['ia02','Wir laufen um ___ Tisch.','einen','Akkusativ','Akkusativpräposition','Wir laufen um einen Tisch.'],
    ['ia03','Die Kinder laufen um ___ Haus.','ein','Akkusativ','Akkusativpräposition','Die Kinder laufen um ein Haus.'],
    ['ia04','Anna geht durch ___ Wohnung.','eine','Akkusativ','Akkusativpräposition','Anna geht durch eine Wohnung.'],
    ['ia05','Wir gehen durch ___ Flur.','einen','Akkusativ','Akkusativpräposition','Wir gehen durch einen Flur.'],
    ['ia06','Der Ball fliegt gegen ___ Wand.','eine','Akkusativ','Akkusativpräposition','Der Ball fliegt gegen eine Wand.'],
    ['ia07','Anna fährt ohne ___ Auto.','ein','Akkusativ','Akkusativpräposition','Anna fährt ohne ein Auto.'],
    ['ia08','Ich komme ohne ___ Einladung.','eine','Akkusativ','Akkusativpräposition','Ich komme ohne eine Einladung.']
  ].map(x=>({id:x[0],q:x[1],answer:x[2],case:x[3],reason:x[4],solution:x[5]}));

  const POSS_BASE=[
    ['p01','Ich','___ Apfel ist rot.','mein',['mein','meinen','meine'],'Nominativ','Subjekt','Mein Apfel ist rot.'],
    ['p02','Ich','Ich esse ___ Apfel.','meinen',['mein','meinen','meine'],'Akkusativ','Aktion','Ich esse meinen Apfel.'],
    ['p03','Du','___ Flasche ist leer.','deine',['dein','deinen','deine'],'Nominativ','Subjekt','Deine Flasche ist leer.'],
    ['p04','Du','Du kaufst ___ Flasche.','deine',['dein','deinen','deine'],'Akkusativ','Aktion','Du kaufst deine Flasche.'],
    ['p05','Sie','___ Schrank ist groß.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ','Subjekt','Ihr Schrank ist groß.'],
    ['p06','Sie','Sie öffnen ___ Schrank.','Ihren',['Ihr','Ihren','Ihre'],'Akkusativ','Aktion','Sie öffnen Ihren Schrank.'],
    ['p07','Ich','___ Ei ist frisch.','mein',['mein','meinen','meine'],'Nominativ','Subjekt','Mein Ei ist frisch.'],
    ['p08','Ich','Ich esse ___ Ei.','mein',['mein','meinen','meine'],'Akkusativ','Aktion','Ich esse mein Ei.'],
    ['p09','Du','___ Wohnung ist hell.','deine',['dein','deinen','deine'],'Nominativ','Subjekt','Deine Wohnung ist hell.'],
    ['p10','Du','Du suchst ___ Wohnung.','deine',['dein','deinen','deine'],'Akkusativ','Aktion','Du suchst deine Wohnung.'],
    ['p11','Sie','___ Sofa ist bequem.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ','Subjekt','Ihr Sofa ist bequem.'],
    ['p12','Sie','Sie kaufen ___ Sofa.','Ihr',['Ihr','Ihren','Ihre'],'Akkusativ','Aktion','Sie kaufen Ihr Sofa.'],
    ['p13','Ich','Das ist ___ Teppich.','mein',['mein','meinen','meine'],'Nominativ','keine Aktion','Das ist mein Teppich.'],
    ['p14','Du','Das ist ___ Dusche.','deine',['dein','deinen','deine'],'Nominativ','keine Aktion','Das ist deine Dusche.'],
    ['p15','Sie','Das ist ___ Fenster.','Ihr',['Ihr','Ihren','Ihre'],'Nominativ','keine Aktion','Das ist Ihr Fenster.'],
    ['p16','Ich','___ Kurs beginnt um neun.','mein',['mein','meinen','meine'],'Nominativ','Subjekt','Mein Kurs beginnt um neun.'],
    ['p17','Ich','Ich besuche ___ Kurs.','meinen',['mein','meinen','meine'],'Akkusativ','Aktion','Ich besuche meinen Kurs.'],
    ['p18','Du','___ Praxis öffnet am Montag.','deine',['dein','deinen','deine'],'Nominativ','Subjekt','Deine Praxis öffnet am Montag.'],
    ['p19','Sie','Sie verschieben ___ Termin.','Ihren',['Ihr','Ihren','Ihre'],'Akkusativ','Aktion','Sie verschieben Ihren Termin.'],
    ['p20','Du','Du verkaufst ___ Fernseher.','deinen',['dein','deinen','deine'],'Akkusativ','Aktion','Du verkaufst deinen Fernseher.'],
    ['p21','Sie','___ Einladung liegt auf dem Tisch.','Ihre',['Ihr','Ihren','Ihre'],'Nominativ','Subjekt','Ihre Einladung liegt auf dem Tisch.'],
    ['p22','Sie','Sie lesen ___ Einladung.','Ihre',['Ihr','Ihren','Ihre'],'Akkusativ','Aktion','Sie lesen Ihre Einladung.'],
    ['p23','Du','___ Ausflug ist am Sonntag.','dein',['dein','deinen','deine'],'Nominativ','Subjekt','Dein Ausflug ist am Sonntag.'],
    ['p24','Du','Du planst ___ Ausflug.','deinen',['dein','deinen','deine'],'Akkusativ','Aktion','Du planst deinen Ausflug.']
  ].map(x=>({id:x[0],owner:x[1],q:x[2],answer:x[3],options:x[4],case:x[5],reason:x[6],solution:x[7]}));

  const POSS_AP=[
    ['pa01','Ich','Ich kaufe Brot für ___ Ausflug.','meinen',['mein','meinen','meine'],'Akkusativ','Akkusativpräposition','Ich kaufe Brot für meinen Ausflug.'],
    ['pa02','Du','Du gehst durch ___ Wohnung.','deine',['dein','deinen','deine'],'Akkusativ','Akkusativpräposition','Du gehst durch deine Wohnung.'],
    ['pa03','Sie','Sie laufen um ___ Tisch.','Ihren',['Ihr','Ihren','Ihre'],'Akkusativ','Akkusativpräposition','Sie laufen um Ihren Tisch.'],
    ['pa04','Ich','Ich komme ohne ___ Einladung.','meine',['mein','meinen','meine'],'Akkusativ','Akkusativpräposition','Ich komme ohne meine Einladung.'],
    ['pa05','Du','Du gehst ___ Flur entlang.','deinen',['dein','deinen','deine'],'Akkusativ','Akkusativpräposition','Du gehst deinen Flur entlang.'],
    ['pa06','Sie','Sie stellen den Stuhl gegen ___ Wand.','Ihre',['Ihr','Ihren','Ihre'],'Akkusativ','Akkusativpräposition','Sie stellen den Stuhl gegen Ihre Wand.'],
    ['pa07','Ich','Ich gehe ohne ___ Schlüssel.','meinen',['mein','meinen','meine'],'Akkusativ','Akkusativpräposition','Ich gehe ohne meinen Schlüssel.'],
    ['pa08','Sie','Sie gehen durch ___ Wohnzimmer.','Ihr',['Ihr','Ihren','Ihre'],'Akkusativ','Akkusativpräposition','Sie gehen durch Ihr Wohnzimmer.']
  ].map(x=>({id:x[0],owner:x[1],q:x[2],answer:x[3],options:x[4],case:x[5],reason:x[6],solution:x[7]}));

  const DIALOG_BASE=[
    {id:'g01',image:'hamburger.webp',dialog:['A: Hast du schon bestellt?','B: Ja, ich habe einen Hamburger bestellt.','A: Möchtest du noch etwas anderes?','B: Nein, ich esse nur ___.'],answer:'den Hamburger',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g02',image:'speisekarte.webp',dialog:['A: Was möchtest du essen?','B: Ich weiß es noch nicht.','A: Die Speisekarte liegt vor dir auf dem Tisch.','B: Stimmt. Ich lese zuerst ___.'],answer:'die Speisekarte',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g03',image:'fenster.webp',dialog:['A: Hier ist es sehr warm.','B: Ja, das Fenster neben der Tür ist geschlossen.','A: Kannst du es bitte öffnen?','B: Natürlich. Ich öffne ___ sofort.'],answer:'das Fenster',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g04',image:'termin.webp',dialog:['A: Am Dienstag habe ich einen Termin in der Praxis.','B: Aber am Dienstag machen wir den Ausflug.','A: Richtig. Dann muss ich ___ verschieben.'],answer:'den Termin',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g05',image:'einladung.webp',dialog:['A: Anna macht am Samstag eine Party.','B: Woher weißt du das?','A: Ihre Einladung liegt auf dem Tisch.','B: Ach ja, jetzt sehe ich ___.'],answer:'die Einladung',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g06',image:'salat.webp',dialog:['A: Was möchten Sie bestellen?','B: Ich möchte heute nichts Schweres essen.','A: Wir haben verschiedene Salate.','B: Gut, dann nehme ich ___.'],answer:'einen Salat',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g07',image:'cola.webp',dialog:['A: Möchtest du etwas trinken?','B: Ja, aber keinen Kaffee.','A: Wir haben Wasser, Saft und Cola.','B: Dann nehme ich ___.'],answer:'eine Cola',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g08',image:'sofa.webp',dialog:['A: Was fehlt noch im Wohnzimmer?','B: Wir haben einen Tisch und einen Fernseher.','A: Aber wir können noch nicht bequem sitzen.','B: Stimmt. Wir brauchen ___.'],answer:'ein Sofa',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g09',image:'ausflug.webp',dialog:['A: Was machen wir am Sonntag?','B: Ich möchte nicht den ganzen Tag zu Hause bleiben.','A: Wir können in die Stadt oder in den Park fahren.','B: Gute Idee. Wir machen ___.'],answer:'einen Ausflug',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g10',image:'lampe.webp',dialog:['A: Das Schlafzimmer ist abends sehr dunkel.','B: Dort steht nur das Bett und ein Schrank.','A: Dann brauchen wir noch Licht.','B: Ja, ich kaufe morgen ___.'],answer:'eine Lampe',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g11',image:'ketchup.webp',dialog:['A: Möchtest du Ketchup zu den Pommes?','B: Nein, ich mag keinen Ketchup.','A: Soll ich trotzdem welchen mitbringen?','B: Nein danke. Ich brauche ___.'],answer:'keinen Ketchup',articleType:'Negativartikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g12',image:'milch.webp',dialog:['A: Möchtest du Milch in deinen Kaffee?','B: Nein, ich trinke meinen Kaffee schwarz.','A: Auch nur ein bisschen Milch?','B: Nein, ich möchte ___.'],answer:'keine Milch',articleType:'Negativartikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g13',image:'brot.webp',dialog:['A: Was habt ihr für das Picknick gekauft?','B: Wir haben Salat, Getränke und Käse.','A: Habt ihr auch Brot gekauft?','B: Nein, wir haben noch ___.'],answer:'kein Brot',articleType:'Negativartikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g14',image:'termin.webp',dialog:['A: Kann ich heute mit dem Arzt sprechen?','B: Haben Sie einen Termin?','A: Nein, leider nicht.','B: Dann haben Sie heute ___.'],answer:'keinen Termin',articleType:'Negativartikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g15',image:'einladung.webp',dialog:['A: Kommst du auch zu Annas Party?','B: Ich weiß nicht. Anna hat mir nichts geschrieben.','A: Hast du eine Einladung bekommen?','B: Nein, ich habe ___.'],answer:'keine Einladung',articleType:'Negativartikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g16',image:'pommes.webp',dialog:['A: Möchtest du einen Hamburger?','B: Nein, heute möchte ich kein Fleisch essen.','A: Was bestellst du dann?','B: Ich nehme nur ___.'],answer:'Pommes',articleType:'kein Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g17',image:'wasser.webp',dialog:['A: Möchtest du eine Cola oder einen Saft?','B: Nein, ich möchte nichts Süßes trinken.','A: Was möchtest du dann?','B: Ich trinke ___.'],answer:'Wasser',articleType:'kein Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g18',image:'brot.webp',dialog:['A: Was müssen wir noch für das Frühstück kaufen?','B: Butter und Käse haben wir schon.','A: Aber der Brotkorb ist leer.','B: Stimmt. Ich kaufe ___.'],answer:'Brot',articleType:'kein Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g19',image:'stuhl.webp',dialog:['A: Können alle Gäste am Tisch sitzen?','B: Nein, wir haben nur vier Stühle.','A: Aber acht Personen kommen zur Party.','B: Dann brauchen wir noch ___.'],answer:'Stühle',articleType:'kein Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g20',image:'getraenk.webp',dialog:['A: Haben wir alles für das Picknick?','B: Wir haben Brot, Salat und Käse.','A: Aber niemand hat etwas zu trinken gekauft.','B: Dann kaufe ich noch ___.'],answer:'Getränke',articleType:'kein Artikel',case:'Akkusativ',reason:'Aktion'},
    {id:'g21',image:'ausflug.webp',dialog:['A: Was ist am Sonntag geplant?','B: Wir fahren mit dem Deutschkurs in den Park.','A: Ach so. Dann ist ___ am Sonntag.'],answer:'der Ausflug',articleType:'bestimmter Artikel',case:'Nominativ',reason:'Subjekt'},
    {id:'g22',image:'einladung.webp',dialog:['A: Was liegt auf dem Tisch?','B: Anna hat uns zur Party eingeladen.','A: Dann ist das sicher ___.'],answer:'die Einladung',articleType:'bestimmter Artikel',case:'Nominativ',reason:'Subjekt'},
    {id:'g23',image:'sofa.webp',dialog:['A: Was steht neu im Wohnzimmer?','B: Wir haben gestern Möbel gekauft.','A: Ah, das ist ___.'],answer:'das Sofa',articleType:'bestimmter Artikel',case:'Nominativ',reason:'keine Aktion'},
    {id:'g24',image:'lampe.webp',dialog:['A: Was ist neben dem Bett?','B: Dort ist ___.','A: Sie ist sehr schön.'],answer:'eine Lampe',articleType:'unbestimmter Artikel',case:'Nominativ',reason:'Subjekt'}
  ];

  const DIALOG_AP=[
    {id:'ga01',image:'ausflug.webp',dialog:['A: Warum kaufst du so viele Getränke?','B: Wir fahren am Sonntag in den Park.','A: Ach ja, der Ausflug mit dem Deutschkurs.','B: Genau. Die Getränke sind für ___.'],answer:'den Ausflug',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga02',image:'ausflug.webp',dialog:['A: Was möchtet ihr am Wochenende machen?','B: Wir möchten nicht zu Hause bleiben.','A: Habt ihr schon einen konkreten Plan?','B: Noch nicht. Wir brauchen zuerst eine Idee für ___.'],answer:'einen Ausflug',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga03',image:'einladung.webp',dialog:['A: Kann jeder zu der Party kommen?','B: Ja, Anna hat alle Teilnehmer eingeladen.','A: Muss man eine Karte zeigen?','B: Nein, man kann auch ohne ___ kommen.'],answer:'Einladung',articleType:'kein Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga04',image:'einladung.webp',dialog:['A: Wo ist die Einladung von Anna?','B: Sie liegt noch zu Hause auf dem Tisch.','A: Aber dort steht die genaue Adresse.','B: Stimmt. Ohne ___ finde ich die Wohnung nicht.'],answer:'die Einladung',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga05',image:'flur.webp',dialog:['A: Wie kommt man vom Eingang ins Wohnzimmer?','B: Man geht zuerst durch eine Tür.','A: Und danach?','B: Danach geht man durch ___.'],answer:'einen Flur',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga06',image:'flur.webp',dialog:['A: Wo ist das Badezimmer in deiner Wohnung?','B: Es ist neben dem Schlafzimmer.','A: Wie komme ich dorthin?','B: Geh durch ___ und dann nach links.'],answer:'den Flur',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga07',image:'auto.webp',dialog:['A: Wie kommt ihr am Sonntag zum Park?','B: Wir nehmen den Bus.','A: Fahrt ihr nicht mit dem Auto?','B: Nein, wir machen den Ausflug ohne ___.'],answer:'Auto',articleType:'kein Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga08',image:'schluessel.webp',dialog:['A: Kannst du schon in die neue Wohnung gehen?','B: Nein, die Vermieterin kommt erst morgen.','A: Warum kannst du heute nicht hinein?','B: Ohne ___ kann ich die Tür nicht öffnen.'],answer:'einen Schlüssel',articleType:'unbestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga09',image:'tisch.webp',dialog:['A: Wo sollen die Stühle stehen?','B: Die Gäste möchten zusammen sitzen.','A: Dann stellen wir sie um ___.'],answer:'den Tisch',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'},
    {id:'ga10',image:'wand.webp',dialog:['A: Wo soll der Schrank stehen?','B: Neben dem Fenster ist kein Platz.','A: Dann stellen wir ihn gegen ___.'],answer:'die Wand',articleType:'bestimmter Artikel',case:'Akkusativ',reason:'Akkusativpräposition'}
  ];

  const FUDGOEB=[
    {id:'f01',kind:'letter',letter:'F',answer:'für'}, {id:'f02',kind:'letter',letter:'U',answer:'um'}, {id:'f03',kind:'letter',letter:'D',answer:'durch'},
    {id:'f04',kind:'letter',letter:'G',answer:'gegen'}, {id:'f05',kind:'letter',letter:'O',answer:'ohne'}, {id:'f06',kind:'letter',letter:'E',answer:'entlang'}, {id:'f07',kind:'letter',letter:'B',answer:'bis'},
    {id:'f08',kind:'sentence',q:'Die Getränke sind ___ den Ausflug.',answer:'für'},
    {id:'f09',kind:'sentence',q:'Wir laufen ___ den Tisch.',answer:'um'},
    {id:'f10',kind:'sentence',q:'Wir gehen ___ den Flur.',answer:'durch'},
    {id:'f11',kind:'sentence',q:'Der Ball fliegt ___ die Wand.',answer:'gegen'},
    {id:'f12',kind:'sentence',q:'Ich komme ___ die Einladung.',answer:'ohne'},
    {id:'f13',kind:'sentence',q:'Wir gehen den Weg ___.',answer:'entlang'},
    {id:'f14',kind:'sentence',q:'Der Kurs dauert ___ Freitag.',answer:'bis'},
    {id:'f15',kind:'sentence',q:'Anna kauft eine Lampe ___ die Wohnung.',answer:'für'},
    {id:'f16',kind:'sentence',q:'Die Kinder laufen ___ das Haus.',answer:'um'},
    {id:'f17',kind:'sentence',q:'Anna läuft ___ die Wohnung.',answer:'durch'},
    {id:'f18',kind:'sentence',q:'Die Tür schlägt ___ den Schrank.',answer:'gegen'},
    {id:'f19',kind:'sentence',q:'Anna fährt ___ das Auto.',answer:'ohne'},
    {id:'f20',kind:'sentence',q:'Die Praxis ist ___ 18 Uhr geöffnet.',answer:'bis'}
  ];

  function getPath(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function releaseData(){
    if(window.SprachPilotRelease&&typeof SprachPilotRelease.localData==='function')return SprachPilotRelease.localData()||{};
    try{return JSON.parse(localStorage.getItem('SP_COURSE_RELEASES')||'{}')||{}}catch(e){return{}}
  }
  function apEnabled(){
    const d=releaseData();
    const paths=[
      ['enabledTasks',AP_FILE],['enabledTasks','Thema-3/'+AP_FILE],['enabledTasks','A1-Lektion-6/Thema-3/'+AP_FILE],['enabledTasks','wortschatz/A1-Lektion-6/Thema-3/'+AP_FILE],['enabledTasks','Wortschatz/A1-Lektion-6/Thema-3/'+AP_FILE],
      ['releases','wortschatz','lessons','A1-Lektion-6','themes','Thema-3','tasks',AP_FILE],['releases','Wortschatz','lessons','A1-Lektion-6','themes','Thema-3','tasks',AP_FILE]
    ];
    return paths.some(p=>getPath(d,p)===true);
  }

  function fisher(list){const a=list.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  function selectMixed(base,ap,count,apCount){
    if(!apEnabled())return fisher(base).slice(0,count);
    const pickedAp=fisher(ap).slice(0,Math.min(apCount,ap.length));
    const pickedBase=fisher(base).slice(0,Math.max(0,count-pickedAp.length));
    return fisher(pickedBase.concat(pickedAp));
  }
  function stableSelection(file,base,ap,count=20,apCount=6){
    const enabled=apEnabled(),key=CFG.key+'_selection_v4_'+file+'_'+(enabled?'ap':'base');
    const all=base.concat(enabled?ap:[]),map=new Map(all.map(x=>[x.id,x]));
    let ids=[];try{ids=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}
    if(!Array.isArray(ids)||ids.length!==Math.min(count,all.length)||ids.some(id=>!map.has(id))){
      ids=selectMixed(base,ap,count,apCount).map(x=>x.id);localStorage.setItem(key,JSON.stringify(ids));
    }
    return ids.map(id=>map.get(id)).filter(Boolean);
  }
  function reasonOptions(){const opts=['Subjekt','Aktion','keine Aktion'];if(apEnabled())opts.push('Akkusativpräposition');return opts}
  function markTarget(sentence,target){const safeTarget=String(target).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return sentence.replace(new RegExp(safeTarget),'<mark>'+target+'</mark>')}

  const ALL_TASKS=[
    ['karteikarten.html',()=>WORDS.length,'Karteikarten'],['artikel.html',()=>WORDS.filter(w=>w.type==='noun').length,'Artikel'],['bild-wort.html',()=>WORDS.length,'Bild → Wort'],
    ['komposita-artikel.html',()=>COMPOUNDS.length,'Artikel von Komposita'],['komposita-bauen.html',()=>COMPOUNDS.length,'Komposita bauen'],
    ['svo.html',()=>20,'Subjekt · Verb · Objekt'],['nom-akk.html',()=>20,'Nominativ oder Akkusativ'],['akkusativ-bestimmt.html',()=>20,'der · den · die · das'],
    ['akkusativ-unbestimmt.html',()=>20,'ein · einen · eine'],['meinen-deinen.html',()=>20,'mein · dein · Ihr'],['akkusativ-praepositionen.html',()=>20,'Akkusativpräpositionen'],
    ['bilddialoge.html',()=>20,'Bilddialoge · Artikel und Nomen'],['dialoge-planen.html',()=>8,'Dialoge planen'],['nachrichten-rf.html',()=>8,'Nachrichten R/F'],
    ['fehler-finden.html',()=>ERRORS.length,'Fehler finden'],['satz-bauen.html',()=>SENTENCES.length,'Satz bauen'],['pruefung.html',()=>20,'Prüfung']
  ];
  function activeTasks(){return ALL_TASKS.filter(t=>t[0]!==AP_FILE||apEnabled()).map(t=>[t[0],t[1](),t[2]])}
  if(Array.isArray(TASKS))TASKS.splice(0,TASKS.length,...ALL_TASKS.map(t=>[t[0],t[1](),t[2]]));
  Object.assign(ICONS,{'komposita-artikel.html':'🏷️','komposita-bauen.html':'🧱','svo.html':'📌','nom-akk.html':'⚖️','akkusativ-bestimmt.html':'🎯','akkusativ-unbestimmt.html':'1️⃣','meinen-deinen.html':'👤','akkusativ-praepositionen.html':'🧭','bilddialoge.html':'🗨️'});
  function nextFile(file){const files=activeTasks().map(t=>t[0]);const i=files.indexOf(file);return files[i+1]||'index.html'}
  window.renderMenu=function(){
    const tasks=activeTasks(),avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;
    totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';totalText.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';
    taskGrid.innerHTML='<div class="grid">'+tasks.map((t,i)=>{const p=pctFor(t[0],t[1]);return `<a class="module" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${ICONS[t[0]]||'▶'}</div><p class="small">Akkusativ, Artikel, Restaurant und Planen üben.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')+'</div>';
  };
  async function refreshRelease(callback){try{if(window.SprachPilotRelease&&SprachPilotRelease.refresh)await SprachPilotRelease.refresh()}catch(e){}if(callback)callback()}

  window.L6T3={
    version:VERSION,apFile:AP_FILE,dialogFile:DIALOG_FILE,apEnabled,activeTasks,nextFile,refreshRelease,reasonOptions,markTarget,fisher,
    analysisItems:file=>stableSelection(file,BASE_ANALYSIS,AP_ANALYSIS,20,8),
    definiteItems:()=>stableSelection('akkusativ-bestimmt.html',DEF_BASE,DEF_AP,20,6),
    indefiniteItems:()=>stableSelection('akkusativ-unbestimmt.html',INDEF_BASE,INDEF_AP,20,6),
    possessiveItems:()=>stableSelection('meinen-deinen.html',POSS_BASE,POSS_AP,20,6),
    dialogItems:()=>stableSelection(DIALOG_FILE,DIALOG_BASE,DIALOG_AP,20,6),
    fudgoebItems:()=>stableSelection(AP_FILE,FUDGOEB,[],20,0),
    articleTypeOptions:['bestimmter Artikel','unbestimmter Artikel','Negativartikel','kein Artikel']
  };
})();