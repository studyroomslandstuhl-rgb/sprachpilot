const THEME={module:"wortschatz",moduleTitle:"Wortschatz",level:"A1",lesson:"4",theme:"3",title:"A1 Lektion 4 · Thema 3",key:"SP_L4_T3_V2"};
const TASK_FILES=["karteikarten.html","hoeren.html","farben.html","memory.html","gegenteile.html","kein.html","reaktionen.html","gefallen.html","saetze-bauen.html","schreiben.html"];
const TASK_TITLES={"karteikarten.html":"Karteikarten","hoeren.html":"Hören","farben.html":"Farben","memory.html":"Gegenteile-Memory","gegenteile.html":"Gegenteile beschreiben","kein.html":"nicht / kein / keine","reaktionen.html":"Reaktionen","gefallen.html":"Gefallen","saetze-bauen.html":"Sätze bauen","schreiben.html":"Schreiben"};

const COLORS=[
{id:"rot",word:"rot",img:"rot.png",hex:"#ef4444",tr:{en:"red",ru:"красный",uk:"червоний",ar:"أحمر",tr:"kırmızı",ro:"roșu",ja:"赤",pl:"czerwony",ku:"sor"}},
{id:"dunkelrot",word:"dunkelrot",img:"dunkelrot.png",hex:"#991b1b",tr:{en:"dark red",ru:"тёмно-красный",uk:"темно-червоний",ar:"أحمر داكن",tr:"koyu kırmızı",ro:"roșu închis",ja:"暗い赤",pl:"ciemnoczerwony",ku:"sora tarî"}},
{id:"hellrot",word:"hellrot",img:"hellrot.png",hex:"#fca5a5",tr:{en:"light red",ru:"светло-красный",uk:"світло-червоний",ar:"أحمر فاتح",tr:"açık kırmızı",ro:"roșu deschis",ja:"明るい赤",pl:"jasnoczerwony",ku:"sora ronahî"}},
{id:"blau",word:"blau",img:"blau.png",hex:"#3b82f6",tr:{en:"blue",ru:"синий",uk:"синій",ar:"أزرق",tr:"mavi",ro:"albastru",ja:"青",pl:"niebieski",ku:"şîn"}},
{id:"dunkelblau",word:"dunkelblau",img:"dunkelblau.png",hex:"#1e3a8a",tr:{en:"dark blue",ru:"тёмно-синий",uk:"темно-синій",ar:"أزرق داكن",tr:"koyu mavi",ro:"albastru închis",ja:"暗い青",pl:"ciemnoniebieski",ku:"şîna tarî"}},
{id:"hellblau",word:"hellblau",img:"hellblau.png",hex:"#93c5fd",tr:{en:"light blue",ru:"светло-синий",uk:"світло-синій",ar:"أزرق فاتح",tr:"açık mavi",ro:"albastru deschis",ja:"明るい青",pl:"jasnoniebieski",ku:"şîna ronahî"}},
{id:"gruen",word:"grün",img:"gruen.png",hex:"#22c55e",tr:{en:"green",ru:"зелёный",uk:"зелений",ar:"أخضر",tr:"yeşil",ro:"verde",ja:"緑",pl:"zielony",ku:"kesk"}},
{id:"dunkelgruen",word:"dunkelgrün",img:"dunkelgruen.png",hex:"#166534",tr:{en:"dark green",ru:"тёмно-зелёный",uk:"темно-зелений",ar:"أخضر داكن",tr:"koyu yeşil",ro:"verde închis",ja:"暗い緑",pl:"ciemnozielony",ku:"keska tarî"}},
{id:"hellgruen",word:"hellgrün",img:"hellgruen.png",hex:"#86efac",tr:{en:"light green",ru:"светло-зелёный",uk:"світло-зелений",ar:"أخضر فاتح",tr:"açık yeşil",ro:"verde deschis",ja:"明るい緑",pl:"jasnozielony",ku:"keska ronahî"}},
{id:"gelb",word:"gelb",img:"gelb.png",hex:"#facc15",tr:{en:"yellow",ru:"жёлтый",uk:"жовтий",ar:"أصفر",tr:"sarı",ro:"galben",ja:"黄色",pl:"żółty",ku:"zer"}},
{id:"dunkelgelb",word:"dunkelgelb",img:"dunkelgelb.png",hex:"#ca8a04",tr:{en:"dark yellow",ru:"тёмно-жёлтый",uk:"темно-жовтий",ar:"أصفر داكن",tr:"koyu sarı",ro:"galben închis",ja:"暗い黄色",pl:"ciemnożółty",ku:"zera tarî"}},
{id:"hellgelb",word:"hellgelb",img:"hellgelb.png",hex:"#fde68a",tr:{en:"light yellow",ru:"светло-жёлтый",uk:"світло-жовтий",ar:"أصفر فاتح",tr:"açık sarı",ro:"galben deschis",ja:"明るい黄色",pl:"jasnożółty",ku:"zera ronahî"}},
{id:"orange",word:"orange",speak:"o rang sche",img:"orange.png",hex:"#fb923c",tr:{en:"orange",ru:"оранжевый",uk:"помаранчевий",ar:"برتقالي",tr:"turuncu",ro:"portocaliu",ja:"オレンジ",pl:"pomarańczowy",ku:"porteqalî"}},
{id:"dunkelorange",word:"dunkelorange",speak:"dunkel o rang sche",img:"dunkelorange.png",hex:"#c2410c",tr:{en:"dark orange",ru:"тёмно-оранжевый",uk:"темно-помаранчевий",ar:"برتقالي داكن",tr:"koyu turuncu",ro:"portocaliu închis",ja:"暗いオレンジ",pl:"ciemnopomarańczowy",ku:"porteqaliya tarî"}},
{id:"hellorange",word:"hellorange",speak:"hell o rang sche",img:"hellorange.png",hex:"#fdba74",tr:{en:"light orange",ru:"светло-оранжевый",uk:"світло-помаранчевий",ar:"برتقالي فاتح",tr:"açık turuncu",ro:"portocaliu deschis",ja:"明るいオレンジ",pl:"jasnopomarańczowy",ku:"porteqaliya ronahî"}},
{id:"weiss",word:"weiß",img:"weiss.png",hex:"#ffffff",tr:{en:"white",ru:"белый",uk:"білий",ar:"أبيض",tr:"beyaz",ro:"alb",ja:"白",pl:"biały",ku:"spî"}},
{id:"schwarz",word:"schwarz",img:"schwarz.png",hex:"#111827",tr:{en:"black",ru:"чёрный",uk:"чорний",ar:"أسود",tr:"siyah",ro:"negru",ja:"黒",pl:"czarny",ku:"reş"}},
{id:"grau",word:"grau",img:"grau.png",hex:"#9ca3af",tr:{en:"gray",ru:"серый",uk:"сірий",ar:"رمادي",tr:"gri",ro:"gri",ja:"灰色",pl:"szary",ku:"gewir"}},
{id:"dunkelgrau",word:"dunkelgrau",img:"dunkelgrau.png",hex:"#4b5563",tr:{en:"dark gray",ru:"тёмно-серый",uk:"темно-сірий",ar:"رمادي داكن",tr:"koyu gri",ro:"gri închis",ja:"暗い灰色",pl:"ciemnoszary",ku:"gewira tarî"}},
{id:"hellgrau",word:"hellgrau",img:"hellgrau.png",hex:"#d1d5db",tr:{en:"light gray",ru:"светло-серый",uk:"світло-сірий",ar:"رمادي فاتح",tr:"açık gri",ro:"gri deschis",ja:"明るい灰色",pl:"jasnoszary",ku:"gewira ronahî"}},
{id:"braun",word:"braun",img:"braun.png",hex:"#92400e",tr:{en:"brown",ru:"коричневый",uk:"коричневий",ar:"بني",tr:"kahverengi",ro:"maro",ja:"茶色",pl:"brązowy",ku:"qehweyî"}},
{id:"dunkelbraun",word:"dunkelbraun",img:"dunkelbraun.png",hex:"#451a03",tr:{en:"dark brown",ru:"тёмно-коричневый",uk:"темно-коричневий",ar:"بني داكن",tr:"koyu kahverengi",ro:"maro închis",ja:"暗い茶色",pl:"ciemny brąz",ku:"qehweya tarî"}},
{id:"hellbraun",word:"hellbraun",img:"hellbraun.png",hex:"#b45309",tr:{en:"light brown",ru:"светло-коричневый",uk:"світло-коричневий",ar:"بني فاتح",tr:"açık kahverengi",ro:"maro deschis",ja:"明るい茶色",pl:"jasny brąz",ku:"qehweya ronahî"}},
{id:"rosa",word:"rosa",img:"rosa.png",hex:"#f9a8d4",tr:{en:"pink",ru:"розовый",uk:"рожевий",ar:"وردي",tr:"pembe",ro:"roz",ja:"ピンク",pl:"różowy",ku:"pembe"}},
{id:"dunkelrosa",word:"dunkelrosa",img:"dunkelrosa.png",hex:"#be185d",tr:{en:"dark pink",ru:"тёмно-розовый",uk:"темно-рожевий",ar:"وردي داكن",tr:"koyu pembe",ro:"roz închis",ja:"濃いピンク",pl:"ciemnoróżowy",ku:"pembeya tarî"}},
{id:"hellrosa",word:"hellrosa",img:"hellrosa.png",hex:"#fbcfe8",tr:{en:"light pink",ru:"светло-розовый",uk:"світло-рожевий",ar:"وردي فاتح",tr:"açık pembe",ro:"roz deschis",ja:"薄いピンク",pl:"jasnoróżowy",ku:"pembeya ronahî"}},
{id:"lila",word:"lila",img:"lila.png",hex:"#a855f7",tr:{en:"purple",ru:"фиолетовый",uk:"фіолетовий",ar:"بنفسجي",tr:"mor",ro:"mov",ja:"紫",pl:"fioletowy",ku:"binefşî"}},
{id:"dunkellila",word:"dunkellila",img:"dunkellila.png",hex:"#6b21a8",tr:{en:"dark purple",ru:"тёмно-фиолетовый",uk:"темно-фіолетовий",ar:"بنفسجي داكن",tr:"koyu mor",ro:"mov închis",ja:"濃い紫",pl:"ciemnofioletowy",ku:"binefşiya tarî"}},
{id:"helllila",word:"helllila",img:"helllila.png",hex:"#d8b4fe",tr:{en:"light purple",ru:"светло-фиолетовый",uk:"світло-фіолетовий",ar:"بنفسجي فاتح",tr:"açık mor",ro:"mov deschis",ja:"薄い紫",pl:"jasnofioletowy",ku:"binefşiya ronahî"}},
{id:"tuerkis",word:"türkis",img:"tuerkis.png",hex:"#14b8a6",tr:{en:"turquoise",ru:"бирюзовый",uk:"бірюзовий",ar:"تركوازي",tr:"turkuaz",ro:"turcoaz",ja:"ターコイズ",pl:"turkusowy",ku:"turqûaz"}},
{id:"dunkeltuerkis",word:"dunkeltürkis",img:"dunkeltuerkis.png",hex:"#0f766e",tr:{en:"dark turquoise",ru:"тёмно-бирюзовый",uk:"темно-бірюзовий",ar:"تركوازي داكن",tr:"koyu turkuaz",ro:"turcoaz închis",ja:"濃いターコイズ",pl:"ciemnoturkusowy",ku:"turqûaza tarî"}},
{id:"helltuerkis",word:"helltürkis",img:"helltuerkis.png",hex:"#5eead4",tr:{en:"light turquoise",ru:"светло-бирюзовый",uk:"світло-бірюзовий",ar:"تركوازي فاتح",tr:"açık turkuaz",ro:"turcoaz deschis",ja:"薄いターコイズ",pl:"jasnoturkusowy",ku:"turqûaza ronahî"}}
];

const ADJECTIVES=[
{id:"schoen",word:"schön",img:"schoen.png",tr:{en:"beautiful",ru:"красивый",uk:"гарний",ar:"جميل",tr:"güzel",ro:"frumos",ja:"きれい",pl:"ładny",ku:"xweşik"}},
{id:"haesslich",word:"hässlich",img:"haesslich.png",tr:{en:"ugly",ru:"некрасивый",uk:"некрасивий",ar:"قبيح",tr:"çirkin",ro:"urât",ja:"醜い",pl:"brzydki",ku:"ne xweşik"}},
{id:"hell",word:"hell",img:"hell.png",tr:{en:"bright",ru:"светлый",uk:"світлий",ar:"مضيء",tr:"aydınlık",ro:"luminos",ja:"明るい",pl:"jasny",ku:"ronahî"}},
{id:"dunkel",word:"dunkel",img:"dunkel.png",tr:{en:"dark",ru:"тёмный",uk:"темний",ar:"مظلم",tr:"karanlık",ro:"întunecat",ja:"暗い",pl:"ciemny",ku:"tarî"}},
{id:"gross",word:"groß",img:"gross.png",tr:{en:"big",ru:"большой",uk:"великий",ar:"كبير",tr:"büyük",ro:"mare",ja:"大きい",pl:"duży",ku:"mezin"}},
{id:"klein",word:"klein",img:"klein.png",tr:{en:"small",ru:"маленький",uk:"малий",ar:"صغير",tr:"küçük",ro:"mic",ja:"小さい",pl:"mały",ku:"biçûk"}},
{id:"breit",word:"breit",img:"breit.png",tr:{en:"wide",ru:"широкий",uk:"широкий",ar:"واسع",tr:"geniş",ro:"lat",ja:"広い",pl:"szeroki",ku:"fireh"}},
{id:"schmal",word:"schmal",img:"schmal.png",tr:{en:"narrow",ru:"узкий",uk:"вузький",ar:"ضيق",tr:"dar",ro:"îngust",ja:"狭い",pl:"wąski",ku:"tenik"}},
{id:"teuer",word:"teuer",img:"teuer.png",tr:{en:"expensive",ru:"дорогой",uk:"дорогий",ar:"غالي",tr:"pahalı",ro:"scump",ja:"高い",pl:"drogi",ku:"biha"}},
{id:"billig",word:"billig",img:"billig.png",tr:{en:"cheap",ru:"дешёвый",uk:"дешевий",ar:"رخيص",tr:"ucuz",ro:"ieftin",ja:"安い",pl:"tani",ku:"erzan"}},
{id:"neu",word:"neu",img:"neu.png",tr:{en:"new",ru:"новый",uk:"новий",ar:"جديد",tr:"yeni",ro:"nou",ja:"新しい",pl:"nowy",ku:"nû"}},
{id:"alt",word:"alt",img:"alt.png",tr:{en:"old",ru:"старый",uk:"старий",ar:"قديم",tr:"eski",ro:"vechi",ja:"古い",pl:"stary",ku:"kevn"}},
{id:"modern",word:"modern",img:"modern.png",tr:{en:"modern",ru:"современный",uk:"сучасний",ar:"حديث",tr:"modern",ro:"modern",ja:"モダン",pl:"nowoczesny",ku:"modern"}},
{id:"altmodisch",word:"altmodisch",img:"altmodisch.png",tr:{en:"old-fashioned",ru:"старомодный",uk:"старомодний",ar:"قديم الطراز",tr:"modası geçmiş",ro:"demodat",ja:"古風",pl:"staromodny",ku:"kevnşop"}},
{id:"sauber",word:"sauber",img:"sauber.png",tr:{en:"clean",ru:"чистый",uk:"чистий",ar:"نظيف",tr:"temiz",ro:"curat",ja:"清潔",pl:"czysty",ku:"paqij"}},
{id:"schmutzig",word:"schmutzig",img:"schmutzig.png",tr:{en:"dirty",ru:"грязный",uk:"брудний",ar:"متسخ",tr:"kirli",ro:"murdar",ja:"汚い",pl:"brudny",ku:"qirêj"}},
{id:"bequem",word:"bequem",img:"bequem.png",tr:{en:"comfortable",ru:"удобный",uk:"зручний",ar:"مريح",tr:"rahat",ro:"comod",ja:"快適",pl:"wygodny",ku:"rihet"}},
{id:"unbequem",word:"unbequem",img:"unbequem.png",tr:{en:"uncomfortable",ru:"неудобный",uk:"незручний",ar:"غير مريح",tr:"rahatsız",ro:"incomod",ja:"不快",pl:"niewygodny",ku:"ne rehet"}}
];

const FURNITURE=[
{id:"schrank",article:"der",word:"Schrank",full:"der Schrank",pron:"er",pronCap:"Er",img:"schrank.png",plural:"die Schränke",pluralWord:"Schränke"},
{id:"kuehlschrank",article:"der",word:"Kühlschrank",full:"der Kühlschrank",pron:"er",pronCap:"Er",img:"kuehlschrank.png",plural:"die Kühlschränke",pluralWord:"Kühlschränke"},
{id:"sofa",article:"das",word:"Sofa",full:"das Sofa",pron:"es",pronCap:"Es",img:"sofa.png",plural:"die Sofas",pluralWord:"Sofas"},
{id:"tisch",article:"der",word:"Tisch",full:"der Tisch",pron:"er",pronCap:"Er",img:"tisch.png",plural:"die Tische",pluralWord:"Tische"},
{id:"stuhl",article:"der",word:"Stuhl",full:"der Stuhl",pron:"er",pronCap:"Er",img:"stuhl.png",plural:"die Stühle",pluralWord:"Stühle"},
{id:"bett",article:"das",word:"Bett",full:"das Bett",pron:"es",pronCap:"Es",img:"bett.png",plural:"die Betten",pluralWord:"Betten"},
{id:"fernseher",article:"der",word:"Fernseher",full:"der Fernseher",pron:"er",pronCap:"Er",img:"fernseher.png",plural:"die Fernseher",pluralWord:"Fernseher"},
{id:"teppich",article:"der",word:"Teppich",full:"der Teppich",pron:"er",pronCap:"Er",img:"teppich.png",plural:"die Teppiche",pluralWord:"Teppiche"},
{id:"sessel",article:"der",word:"Sessel",full:"der Sessel",pron:"er",pronCap:"Er",img:"sessel.png",plural:"die Sessel",pluralWord:"Sessel"},
{id:"lampe",article:"die",word:"Lampe",full:"die Lampe",pron:"sie",pronCap:"Sie",img:"lampe.png",plural:"die Lampen",pluralWord:"Lampen"},
{id:"herd",article:"der",word:"Herd",full:"der Herd",pron:"er",pronCap:"Er",img:"herd.png",plural:"die Herde",pluralWord:"Herde"},
{id:"elektrogeraet",article:"das",word:"Elektrogerät",full:"das Elektrogerät",pron:"es",pronCap:"Es",img:"elektrogeraet.png",plural:"die Elektrogeräte",pluralWord:"Elektrogeräte"},
{id:"dusche",article:"die",word:"Dusche",full:"die Dusche",pron:"sie",pronCap:"Sie",img:"dusche.png",plural:"die Duschen",pluralWord:"Duschen"},
{id:"badewanne",article:"die",word:"Badewanne",full:"die Badewanne",pron:"sie",pronCap:"Sie",img:"badewanne.png",plural:"die Badewannen",pluralWord:"Badewannen"},
{id:"toilette",article:"die",word:"Toilette",full:"die Toilette",pron:"sie",pronCap:"Sie",img:"toilette.png",plural:"die Toiletten",pluralWord:"Toiletten"},
{id:"waschbecken",article:"das",word:"Waschbecken",full:"das Waschbecken",pron:"es",pronCap:"Es",img:"waschbecken.png",plural:"die Waschbecken",pluralWord:"Waschbecken"}
];

const REACTIONS=[
{id:"sehr-gut",word:"Sehr gut.",emoji:"🤩",score:4},
{id:"gut",word:"Gut.",emoji:"🙂",score:3},
{id:"ganz-gut",word:"Ganz gut.",emoji:"🙂",score:3},
{id:"es-geht",word:"Es geht.",emoji:"😐",score:2},
{id:"nicht-so-gut",word:"Nicht so gut.",emoji:"🙁",score:1}
];

const PAIRS=[
["schoen","haesslich"],["hell","dunkel"],["gross","klein"],["breit","schmal"],
["teuer","billig"],["neu","alt"],["modern","altmodisch"],["sauber","schmutzig"],["bequem","unbequem"]
];
const CARDS=[...COLORS.map(x=>({...x,type:"color"})),...ADJECTIVES.map(x=>({...x,type:"adj"})),...REACTIONS.map(x=>({...x,type:"reaction",tr:{en:x.word}}))];

const HEARING_TASKS=[
{color:"rot",options:["rot","dunkelrot","hellrot","orange"],item:"stuhl"},
{color:"dunkelrot",options:["dunkelrot","rot","hellrot","dunkelbraun"],item:"sessel"},
{color:"hellrot",options:["hellrot","rot","dunkelrot","hellorange"],item:"sofa"},
{color:"blau",options:["blau","dunkelblau","hellblau","tuerkis"],item:"tisch"},
{color:"dunkelblau",options:["dunkelblau","blau","hellblau","dunkeltuerkis"],item:"kuehlschrank"},
{color:"hellblau",options:["hellblau","blau","dunkelblau","helltuerkis"],item:"bett"},
{color:"gruen",options:["gruen","dunkelgruen","hellgruen","tuerkis"],item:"lampe"},
{color:"dunkelgruen",options:["dunkelgruen","gruen","hellgruen","dunkeltuerkis"],item:"fernseher"},
{color:"hellgruen",options:["hellgruen","gruen","dunkelgruen","helltuerkis"],item:"teppich"},
{color:"gelb",options:["gelb","dunkelgelb","hellgelb","orange"],item:"schrank"},
{color:"dunkelgelb",options:["dunkelgelb","gelb","hellgelb","dunkelorange"],item:"herd"},
{color:"hellgelb",options:["hellgelb","gelb","dunkelgelb","hellorange"],item:"elektrogeraet"},
{color:"orange",options:["orange","dunkelorange","hellorange","gelb"],item:"dusche"},
{color:"dunkelorange",options:["dunkelorange","orange","hellorange","braun"],item:"badewanne"},
{color:"hellorange",options:["hellorange","orange","dunkelorange","hellgelb"],item:"toilette"},
{color:"grau",options:["grau","dunkelgrau","hellgrau","schwarz"],item:"waschbecken"},
{color:"dunkelgrau",options:["dunkelgrau","grau","hellgrau","schwarz"],item:"stuhl"},
{color:"hellgrau",options:["hellgrau","grau","dunkelgrau","weiss"],item:"tisch"},
{color:"braun",options:["braun","dunkelbraun","hellbraun","orange"],item:"bett"},
{color:"dunkelbraun",options:["dunkelbraun","braun","hellbraun","schwarz"],item:"schrank"},
{color:"hellbraun",options:["hellbraun","braun","dunkelbraun","hellorange"],item:"sessel"},
{color:"rosa",options:["rosa","dunkelrosa","hellrosa","lila"],item:"lampe"},
{color:"dunkelrosa",options:["dunkelrosa","rosa","hellrosa","dunkellila"],item:"sofa"},
{color:"hellrosa",options:["hellrosa","rosa","dunkelrosa","helllila"],item:"badewanne"},
{color:"lila",options:["lila","dunkellila","helllila","rosa"],item:"sessel"},
{color:"dunkellila",options:["dunkellila","lila","helllila","dunkelblau"],item:"fernseher"},
{color:"helllila",options:["helllila","lila","dunkellila","hellrosa"],item:"toilette"},
{color:"tuerkis",options:["tuerkis","dunkeltuerkis","helltuerkis","blau"],item:"elektrogeraet"},
{color:"dunkeltuerkis",options:["dunkeltuerkis","tuerkis","helltuerkis","dunkelgruen"],item:"waschbecken"},
{color:"helltuerkis",options:["helltuerkis","tuerkis","dunkeltuerkis","hellblau"],item:"kuehlschrank"}
];

const CONTRAST_TASKS=[
{item:"sofa",wrong:"hell",right:"dunkel",sentence:"Das Sofa ist nicht hell. Es ist sehr dunkel."},
{item:"lampe",wrong:"dunkel",right:"hell",sentence:"Die Lampe ist nicht dunkel. Sie ist sehr hell."},
{item:"sessel",wrong:"unbequem",right:"bequem",sentence:"Der Sessel ist nicht unbequem. Er ist sehr bequem."},
{item:"stuhl",wrong:"bequem",right:"unbequem",sentence:"Der Stuhl ist nicht bequem. Er ist sehr unbequem."},
{item:"waschbecken",wrong:"schmutzig",right:"sauber",sentence:"Das Waschbecken ist nicht schmutzig. Es ist sehr sauber."},
{item:"dusche",wrong:"schmutzig",right:"sauber",sentence:"Die Dusche ist nicht schmutzig. Sie ist sehr sauber."},
{item:"kuehlschrank",wrong:"altmodisch",right:"modern",sentence:"Der Kühlschrank ist nicht altmodisch. Er ist sehr modern."},
{item:"fernseher",wrong:"klein",right:"groß",sentence:"Der Fernseher ist nicht klein. Er ist sehr groß."},
{item:"schrank",wrong:"schmal",right:"breit",sentence:"Der Schrank ist nicht schmal. Er ist sehr breit."},
{item:"teppich",wrong:"teuer",right:"billig",sentence:"Der Teppich ist nicht teuer. Er ist sehr billig."},
{item:"bett",wrong:"alt",right:"neu",sentence:"Das Bett ist nicht alt. Es ist sehr neu."},
{item:"badewanne",wrong:"hässlich",right:"schön",sentence:"Die Badewanne ist nicht hässlich. Sie ist sehr schön."},
{item:"tisch",wrong:"breit",right:"schmal",sentence:"Der Tisch ist nicht breit. Er ist sehr schmal."},
{item:"herd",wrong:"billig",right:"teuer",sentence:"Der Herd ist nicht billig. Er ist sehr teuer."},
{item:"toilette",wrong:"schön",right:"hässlich",sentence:"Die Toilette ist nicht schön. Sie ist sehr hässlich."},
{item:"elektrogeraet",wrong:"alt",right:"modern",sentence:"Das Elektrogerät ist nicht alt. Es ist sehr modern."}
];

const GEFAELLEN_TASKS=[
{item:"schrank",reaction:"gut",adj:"modern",question:"Wie gefällt dir der Schrank?",answer:"Gut. Er ist modern."},
{item:"kuehlschrank",reaction:"sehr-gut",adj:"sauber",question:"Wie gefällt dir der Kühlschrank?",answer:"Sehr gut. Er ist sauber."},
{item:"sofa",reaction:"gut",adj:"dunkelrot",question:"Wie gefällt dir das Sofa?",answer:"Gut. Es ist dunkelrot."},
{item:"tisch",reaction:"ganz-gut",adj:"hellblau",question:"Wie gefällt dir der Tisch?",answer:"Ganz gut. Er ist hellblau."},
{item:"stuhl",reaction:"nicht-so-gut",adj:"unbequem",question:"Wie gefällt dir der Stuhl?",answer:"Nicht so gut. Er ist unbequem."},
{item:"bett",reaction:"gut",adj:"bequem",question:"Wie gefällt dir das Bett?",answer:"Gut. Es ist bequem."},
{item:"fernseher",reaction:"nicht-so-gut",adj:"teuer",question:"Wie gefällt dir der Fernseher?",answer:"Nicht so gut. Er ist teuer."},
{item:"teppich",reaction:"sehr-gut",adj:"schoen",question:"Wie gefällt dir der Teppich?",answer:"Sehr gut. Er ist schön."},
{item:"sessel",reaction:"ganz-gut",adj:"dunkelgruen",question:"Wie gefällt dir der Sessel?",answer:"Ganz gut. Er ist dunkelgrün."},
{item:"lampe",reaction:"sehr-gut",adj:"hell",question:"Wie gefällt dir die Lampe?",answer:"Sehr gut. Sie ist hell."},
{item:"herd",reaction:"nicht-so-gut",adj:"altmodisch",question:"Wie gefällt dir der Herd?",answer:"Nicht so gut. Er ist altmodisch."},
{item:"elektrogeraet",reaction:"gut",adj:"tuerkis",question:"Wie gefällt dir das Elektrogerät?",answer:"Gut. Es ist türkis."},
{item:"dusche",reaction:"sehr-gut",adj:"sauber",question:"Wie gefällt dir die Dusche?",answer:"Sehr gut. Sie ist sauber."},
{item:"badewanne",reaction:"ganz-gut",adj:"hellrosa",question:"Wie gefällt dir die Badewanne?",answer:"Ganz gut. Sie ist hellrosa."},
{item:"toilette",reaction:"nicht-so-gut",adj:"schmutzig",question:"Wie gefällt dir die Toilette?",answer:"Nicht so gut. Sie ist schmutzig."},
{item:"waschbecken",reaction:"gut",adj:"weiss",question:"Wie gefällt dir das Waschbecken?",answer:"Gut. Es ist weiß."},
{item:"stuehle",plural:true,itemImg:"stuhl.png",full:"die Stühle",question:"Wie gefallen dir die Stühle?",reaction:"gut",adj:"modern",answer:"Gut. Sie sind modern."},
{item:"sofas",plural:true,itemImg:"sofa.png",full:"die Sofas",question:"Wie gefallen dir die Sofas?",reaction:"sehr-gut",adj:"bequem",answer:"Sehr gut. Sie sind bequem."},
{item:"lampen",plural:true,itemImg:"lampe.png",full:"die Lampen",question:"Wie gefallen dir die Lampen?",reaction:"nicht-so-gut",adj:"dunkel",answer:"Nicht so gut. Sie sind dunkel."},
{item:"betten",plural:true,itemImg:"bett.png",full:"die Betten",question:"Wie gefallen dir die Betten?",reaction:"gut",adj:"sauber",answer:"Gut. Sie sind sauber."}
];

const SENTENCES=[
{img:"schrank.png",text:"Der Schrank ist modern.",words:["Der","Schrank","ist","modern."]},
{img:"kuehlschrank.png",text:"Der Kühlschrank ist sauber.",words:["Der","Kühlschrank","ist","sauber."]},
{img:"sofa.png",text:"Das Sofa ist dunkelrot.",words:["Das","Sofa","ist","dunkelrot."]},
{img:"tisch.png",text:"Der Tisch ist hellblau.",words:["Der","Tisch","ist","hellblau."]},
{img:"stuhl.png",text:"Der Stuhl ist unbequem.",words:["Der","Stuhl","ist","unbequem."]},
{img:"bett.png",text:"Das Bett ist bequem.",words:["Das","Bett","ist","bequem."]},
{img:"fernseher.png",text:"Der Fernseher ist teuer.",words:["Der","Fernseher","ist","teuer."]},
{img:"teppich.png",text:"Der Teppich ist schön.",words:["Der","Teppich","ist","schön."]},
{img:"sessel.png",text:"Der Sessel ist dunkelgrün.",words:["Der","Sessel","ist","dunkelgrün."]},
{img:"lampe.png",text:"Die Lampe ist hell.",words:["Die","Lampe","ist","hell."]},
{img:"herd.png",text:"Der Herd ist altmodisch.",words:["Der","Herd","ist","altmodisch."]},
{img:"elektrogeraet.png",text:"Das Elektrogerät ist türkis.",words:["Das","Elektrogerät","ist","türkis."]},
{img:"dusche.png",text:"Die Dusche ist sauber.",words:["Die","Dusche","ist","sauber."]},
{img:"badewanne.png",text:"Die Badewanne ist hellrosa.",words:["Die","Badewanne","ist","hellrosa."]},
{img:"toilette.png",text:"Die Toilette ist schmutzig.",words:["Die","Toilette","ist","schmutzig."]},
{img:"waschbecken.png",text:"Das Waschbecken ist weiß.",words:["Das","Waschbecken","ist","weiß."]},
{img:"stuhl.png",text:"Die Stühle sind modern.",words:["Die","Stühle","sind","modern."]},
{img:"sofa.png",text:"Die Sofas sind bequem.",words:["Die","Sofas","sind","bequem."]},
{img:"lampe.png",text:"Die Lampen sind hell.",words:["Die","Lampen","sind","hell."]},
{img:"bett.png",text:"Die Betten sind teuer.",words:["Die","Betten","sind","teuer."]}
];

const KEIN_TASKS=[
{gap:"nicht",sentence:"Der Schrank ist ___ altmodisch. Er ist modern."},
{gap:"kein",sentence:"Das ist ___ Kühlschrank. Das ist ein Schrank."},
{gap:"kein",sentence:"Das ist ___ Sofa. Das ist ein Bett."},
{gap:"kein",sentence:"Hier ist ___ Tisch. Hier ist ein Stuhl."},
{gap:"kein",sentence:"Das ist ___ Stuhl. Das ist ein Sessel."},
{gap:"kein",sentence:"Hier ist ___ Bett. Hier ist ein Sofa."},
{gap:"kein",sentence:"Hier ist ___ Fernseher. Hier ist ein Teppich."},
{gap:"kein",sentence:"Das ist ___ Teppich. Das ist ein Tisch."},
{gap:"nicht",sentence:"Der Sessel ist ___ unbequem. Er ist bequem."},
{gap:"keine",sentence:"Das ist ___ Lampe. Das ist ein Herd."},
{gap:"kein",sentence:"Das ist ___ Herd. Das ist ein Elektrogerät."},
{gap:"kein",sentence:"Das ist ___ Elektrogerät. Das ist ein Fernseher."},
{gap:"keine",sentence:"Hier ist ___ Dusche. Hier ist eine Badewanne."},
{gap:"keine",sentence:"Hier ist ___ Badewanne. Hier ist eine Dusche."},
{gap:"keine",sentence:"Hier ist ___ Toilette. Hier ist ein Waschbecken."},
{gap:"nicht",sentence:"Das Waschbecken ist ___ schmutzig. Es ist sauber."}
];

const WRITING=[
{imgs:["schrank.png","modern.png"],text:"Der Schrank ist modern."},
{imgs:["kuehlschrank.png","sauber.png"],text:"Der Kühlschrank ist sauber."},
{imgs:["sofa.png","dunkelrot.png"],text:"Das Sofa ist dunkelrot."},
{imgs:["tisch.png","hellblau.png"],text:"Der Tisch ist hellblau."},
{imgs:["stuhl.png","unbequem.png"],text:"Der Stuhl ist unbequem."},
{imgs:["bett.png","bequem.png"],text:"Das Bett ist bequem."},
{imgs:["fernseher.png","teuer.png"],text:"Der Fernseher ist teuer."},
{imgs:["teppich.png","schoen.png"],text:"Der Teppich ist schön."},
{imgs:["sessel.png","dunkelgruen.png"],text:"Der Sessel ist dunkelgrün."},
{imgs:["lampe.png","hell.png"],text:"Die Lampe ist hell."},
{imgs:["herd.png","altmodisch.png"],text:"Der Herd ist altmodisch."},
{imgs:["elektrogeraet.png","tuerkis.png"],text:"Das Elektrogerät ist türkis."},
{imgs:["dusche.png","sauber.png"],text:"Die Dusche ist sauber."},
{imgs:["badewanne.png","hellrosa.png"],text:"Die Badewanne ist hellrosa."},
{imgs:["toilette.png","schmutzig.png"],text:"Die Toilette ist schmutzig."},
{imgs:["waschbecken.png","weiss.png"],text:"Das Waschbecken ist weiß."}
];

function $(id){return document.getElementById(id)}
function simple(s){return String(s||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[.,!?]/g,"").replace(/\s+/g," ")}
function safe(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function shuffle(a){
  const arr=[...a];
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function mixWithCorrect(correct, pool, count=4){
  const others=shuffle(pool.filter(x=>x&&correct&&x.id!==correct.id)).slice(0,count-1);
  return shuffle([correct,...others]);
}
function ttsGermanText(text){
  return String(text||'')
    .replace(/dunkelorange/gi,'dunkel o rang sche')
    .replace(/hellorange/gi,'hell o rang sche')
    .replace(/orange/gi,'o rang sche');
}
function currentMotherLang(){try{let p=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null");let raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||localStorage.getItem("motherLanguage")||"en";let n=String(raw).trim().toLowerCase();let map={"russisch":"ru","englisch":"en","ukrainisch":"uk","arabisch":"ar","türkisch":"tr","tuerkisch":"tr","rumänisch":"ro","rumaenisch":"ro","japanisch":"ja","polnisch":"pl","kurdisch":"ku","deutsch":"de"};return map[n]||n||"en"}catch(e){return"en"}}
function translate(x){let l=currentMotherLang();return x.tr?.[l]||x.tr?.en||x.word}
function img(name,cls="task-img"){return `<img class="${cls}" src="../bilder/${name}" onerror="fixImg(this)" alt="">`}
function colorImg(c,cls="task-img"){return `<img class="${cls} color-img" src="../bilder/${c.img||c.id+'.png'}" onerror="fixImg(this)" alt="">`}
function colorSwatchNode(hex){let d=document.createElement('div');d.className='swatch-img';d.style.background=hex;return d}
function fixImg(el){el.classList.add("missing");el.alt="Bild fehlt"}
function swatch(c,small=false){return `<div class="swatch ${small?'small':''}" style="background:${c.hex};${c.id==='weiss'?'border-color:#cbd5e1':''}"></div>`}
function furnitureById(id){return FURNITURE.find(x=>x.id===id)||FURNITURE[0]}
function adjById(id){return ADJECTIVES.find(x=>x.id===id)||ADJECTIVES[0]}
function colorById(id){return COLORS.find(x=>x.id===id)||COLORS[0]}
function reactionById(id){return REACTIONS.find(x=>x.id===id)||REACTIONS[0]}
function backHrefForPage(){
  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(page==='statistik.html')return 'uebersicht.html';
  if(page==='uebersicht.html')return 'index.html';
  return 'index.html';
}
function header(title){const h=document.querySelector('.topbar');if(!h)return;let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'{}')}catch(e){};const who=`${safe(p.vorname||p.firstName||'')} ${safe(p.nachname||p.lastName||'')}`.trim()||'Schüler/in';const kurs=safe(p.kurs||p.kursnummer||p.courseCode||'');const backHref=backHrefForPage();h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${safe(title)} · A1 Lektion 4 · Thema 3</div></div></a><div class="account-tools"><span class="account-pill">${who}${kurs?' · '+kurs:''}</span><a class="account-link" href="/student-dashboard/index.html">📊 Dashboard</a><a class="account-link" href="/profile/index.html">👤 Profil</a><button class="account-link account-btn" onclick="logoutSP()">🚪 Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="${backHref}">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button></nav>`}
function logoutSP(){localStorage.removeItem('SP_USER_PROFILE');localStorage.removeItem('SP_KEEP_LOGGED_IN');location.href='/index.html'}
function taskKey(file){return THEME.key+"_"+file}
function loadTask(file,total){try{let st=JSON.parse(localStorage.getItem(taskKey(file))||"null");if(st&&st.total===total&&Array.isArray(st.queue)&&Array.isArray(st.done))return st}catch(e){}return{total,queue:shuffle([...Array(total).keys()]),done:[],current:null,tries:0,hadWrong:false,wrongItems:[]}}
function saveTask(file,st){localStorage.setItem(taskKey(file),JSON.stringify(st));syncTask(file,st)}
function nextIndex(file,total){let st=loadTask(file,total);if(st.done.length>=total)return null;if(st.current===null||st.current===undefined){if(!st.queue.length)st.queue=[...Array(total).keys()].filter(i=>!st.done.includes(i));st.current=st.queue.shift();st.tries=0;st.hadWrong=false;saveTask(file,st)}return st.current}
function markWrong(file,total,item){let st=loadTask(file,total);st.tries=(st.tries||0)+1;st.hadWrong=true;if(item)st.wrongItems=[...(st.wrongItems||[]),item].slice(-80);saveTask(file,st);return st.tries}
function markRight(file,total){let st=loadTask(file,total),cur=st.current;if(cur!==null&&cur!==undefined){if(st.hadWrong||st.tries>0){if(!st.done.includes(cur)&&!st.queue.includes(cur))st.queue.push(cur)}else{if(!st.done.includes(cur))st.done.push(cur)}}st.current=null;st.tries=0;st.hadWrong=false;saveTask(file,st);return st.done.length>=total}
function pct(file,total){let st=loadTask(file,total);return Math.round((st.done.length||0)/total*100)||0}
function progressHtml(file,total){let st=loadTask(file,total),p=pct(file,total);return `<div class="small">${st.done.length} richtig · ${total-st.done.length} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function feedbackForTry(tries,solution,type){if(tries===1)return"Da ist noch ein Fehler.";if(tries===2)return"Tipp: Prüfe "+(type||"Form und Schreibweise")+".";return"Lösung: "+solution}
function complete(area,file,next="index.html"){syncTask(file,loadTask(file,getTotal(file)));area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Aufgabe geschafft!</div><div class="big">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="actions finish-actions"><button class="btn" onclick="resetOneTask('${file}')">Nochmal üben</button><a class="btn green" href="${next}?done=1">Weiter</a><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>`}
function resetOneTask(file){localStorage.removeItem(taskKey(file));location.reload()}

function maybeStart(renderFn,file){
  try{
    const params=new URLSearchParams(location.search);
    if(params.get('done')==='1'){
      const title=TASK_TITLES[file]||'Aufgabe';
      const target=typeof area!=='undefined'?area:document.getElementById('area');
      if(target){
        target.innerHTML=`<div class="finish-box"><div class="question">${safe(title)}</div><p class="small">Die Aufgabe startet erst, wenn du auf „Starten“ klickst.</p><div class="actions finish-actions"><button class="btn green" onclick="history.replaceState(null,'',location.pathname); (${renderFn.name||'render'})()">Starten</button><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>`;
        return;
      }
    }
  }catch(e){}
  renderFn();
}
function getTotal(file){return {"karteikarten.html":CARDS.length,"hoeren.html":HEARING_TASKS.length,"farben.html":COLORS.length,"memory.html":PAIRS.length*2,"gegenteile.html":CONTRAST_TASKS.length,"kein.html":KEIN_TASKS.length,"reaktionen.html":REACTIONS.length,"gefallen.html":GEFAELLEN_TASKS.length,"saetze-bauen.html":SENTENCES.length,"schreiben.html":WRITING.length}[file]||1}
function taskDoneCount(){return TASK_FILES.filter(f=>pct(f,getTotal(f))>=100).length}
function allPrereqComplete(){return TASK_FILES.every(f=>pct(f,getTotal(f))>=100)}
function examUnlockKey(){return THEME.key+"_EXAM_UNLOCKED"}
function examUnlocked(){if(allPrereqComplete())localStorage.setItem(examUnlockKey(),"1");return localStorage.getItem(examUnlockKey())==="1"}
function examHistory(){try{return JSON.parse(localStorage.getItem("SP_L4_T3_EXAM_HISTORY_V1")||"[]")}catch(e){return[]}}
function starsForPercent(p){p=Number(p||0);return p>=100?3:p>=70?2:p>=50?1:0}
function starsHtml(n){return `<span class="stars">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>`}
function bestExamResult(){let h=examHistory();if(!h.length)return null;return h.reduce((b,x)=>Number(x.percent||0)>Number(b.percent||0)?x:b,h[0])}
function resetThemeProgress(){if(!confirm("Möchten Sie wirklich alle Fortschritte in diesem Thema löschen?"))return;Object.keys(localStorage).forEach(k=>{if(k.startsWith(THEME.key)||k.startsWith("SP_L4_T3_EXAM"))localStorage.removeItem(k)});syncReset();location.href="index.html"}
function syncTask(file,st){try{const total=Number(st.total||getTotal(file));const done=Array.isArray(st.done)?st.done.length:0;const percent=Math.round(done/total*100)||0;const payload={...THEME,file,taskKey:file,taskTitle:TASK_TITLES[file]||file,total,done,percent,completed:percent>=100,wrongItems:st.wrongItems||[]};if(window.SPProgress?.recordTaskProgress)window.SPProgress.recordTaskProgress(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordTaskProgress",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function syncExam(result){try{const payload={...THEME,score:result.score,maxScore:result.maxScore,percent:result.percent,stars:result.stars};if(window.SPProgress?.recordExamResult)window.SPProgress.recordExamResult(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordExamResult",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function syncReset(){try{const payload={...THEME};if(window.SPProgress?.recordThemeReset)window.SPProgress.recordThemeReset(payload);else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:"recordThemeReset",payload});import('/js/progress.js').catch(()=>{})}}catch(e){}}
function speak(text,slow=false){
  if(!('speechSynthesis'in window))return;
  const run=()=>{
    speechSynthesis.cancel();
    let u=new SpeechSynthesisUtterance(ttsGermanText(text));
    u.lang='de-DE';
    u.rate=slow ? 0.38 : 0.98;
    u.pitch=1;
    u.volume=1;
    let voices=speechSynthesis.getVoices();
    let german=voices.filter(v=>String(v.lang||'').toLowerCase().startsWith('de'));
    let v=german.find(v=>/google|microsoft|anna|katja|deutsch|german/i.test(v.name||''))||german[0];
    if(v)u.voice=v;
    speechSynthesis.speak(u);
  };
  if(!speechSynthesis.getVoices().length){speechSynthesis.onvoiceschanged=run;setTimeout(run,250)}else run();
}
function startMic(btn,callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const status=$('micStatus');if(!SR){if(status)status.textContent='Mikrofon geht hier nicht. Bitte schreibe.';return}let rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;if(btn)btn.classList.add('active');if(status)status.textContent='Ich höre zu …';rec.onresult=e=>{let txt=e.results[0][0].transcript;if(status)status.textContent='Gehört: '+txt;callback(txt,true)};rec.onerror=()=>{if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe.'};rec.onend=()=>{if(btn)btn.classList.remove('active')};rec.start()}
function normalizeSentence(s){return simple(s).replace(/\s+/g,' ').trim()}
function isLooseSentence(ans,sol){return normalizeSentence(ans)===normalizeSentence(sol)}
function isExactSentence(ans,sol,fromSpeech=false){if(fromSpeech)return isLooseSentence(ans,sol);return String(ans||"").trim()===String(sol||"").trim()||isLooseSentence(ans,sol)}
function exactOrSpeech(ans,sol,fromSpeech=false){if(fromSpeech)return isLooseSentence(ans,sol);return String(ans||"").trim()===String(sol||"").trim()}
function exampleBox(html){return `<div class="example-box"><b>Beispiel:</b><br>${html}</div>`}
function instruction(text){return `<div class="task-instruction">${text}</div>`}
function iconCard(content){return `<div class="image-card">${content}</div>`}
