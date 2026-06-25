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
{id:"orange",word:"orange",img:"orange.png",hex:"#fb923c",tr:{en:"orange",ru:"оранжевый",uk:"помаранчевий",ar:"برتقالي",tr:"turuncu",ro:"portocaliu",ja:"オレンジ",pl:"pomarańczowy",ku:"porteqalî"}},
{id:"weiss",word:"weiß",img:"weiss.png",hex:"#ffffff",tr:{en:"white",ru:"белый",uk:"білий",ar:"أبيض",tr:"beyaz",ro:"alb",ja:"白",pl:"biały",ku:"spî"}},
{id:"schwarz",word:"schwarz",img:"schwarz.png",hex:"#111827",tr:{en:"black",ru:"чёрный",uk:"чорний",ar:"أسود",tr:"siyah",ro:"negru",ja:"黒",pl:"czarny",ku:"reş"}},
{id:"grau",word:"grau",img:"grau.png",hex:"#9ca3af",tr:{en:"gray",ru:"серый",uk:"сірий",ar:"رمادي",tr:"gri",ro:"gri",ja:"灰色",pl:"szary",ku:"gewir"}},
{id:"braun",word:"braun",img:"braun.png",hex:"#92400e",tr:{en:"brown",ru:"коричневый",uk:"коричневий",ar:"بني",tr:"kahverengi",ro:"maro",ja:"茶色",pl:"brązowy",ku:"qehweyî"}}
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
{id:"sauber",word:"sauber",img:"sauber.png",tr:{en:"clean",ru:"чистый",uk:"чистий",ar:"نظيف",tr:"temiz",ro:"curat",ja:"清潔",pl:"czysty",ku:"paqij"}},
{id:"schmutzig",word:"schmutzig",img:"schmutzig.png",tr:{en:"dirty",ru:"грязный",uk:"брудний",ar:"متسخ",tr:"kirli",ro:"murdar",ja:"汚い",pl:"brudny",ku:"qirêj"}},
{id:"bequem",word:"bequem",img:"bequem.png",tr:{en:"comfortable",ru:"удобный",uk:"зручний",ar:"مريح",tr:"rahat",ro:"comod",ja:"快適",pl:"wygodny",ku:"rihet"}},
{id:"unbequem",word:"unbequem",img:"unbequem.png",tr:{en:"uncomfortable",ru:"неудобный",uk:"незручний",ar:"غير مريح",tr:"rahatsız",ro:"incomod",ja:"不快",pl:"niewygodny",ku:"ne rehet"}}
];

const FURNITURE=[
{id:"stuhl",article:"der",word:"Stuhl",full:"der Stuhl",pron:"er",pronCap:"Er",img:"stuhl.png",plural:"die Stühle",pluralWord:"Stühle"},
{id:"sessel",article:"der",word:"Sessel",full:"der Sessel",pron:"er",pronCap:"Er",img:"sessel.png",plural:"die Sessel",pluralWord:"Sessel"},
{id:"sofa",article:"das",word:"Sofa",full:"das Sofa",pron:"es",pronCap:"Es",img:"sofa.png",plural:"die Sofas",pluralWord:"Sofas"},
{id:"tisch",article:"der",word:"Tisch",full:"der Tisch",pron:"er",pronCap:"Er",img:"tisch.png",plural:"die Tische",pluralWord:"Tische"},
{id:"bett",article:"das",word:"Bett",full:"das Bett",pron:"es",pronCap:"Es",img:"bett.png",plural:"die Betten",pluralWord:"Betten"},
{id:"schrank",article:"der",word:"Schrank",full:"der Schrank",pron:"er",pronCap:"Er",img:"schrank.png",plural:"die Schränke",pluralWord:"Schränke"},
{id:"lampe",article:"die",word:"Lampe",full:"die Lampe",pron:"sie",pronCap:"Sie",img:"lampe.png",plural:"die Lampen",pluralWord:"Lampen"},
{id:"waschbecken",article:"das",word:"Waschbecken",full:"das Waschbecken",pron:"es",pronCap:"Es",img:"waschbecken.png",plural:"die Waschbecken",pluralWord:"Waschbecken"},
{id:"moebel",article:"die",word:"Möbel",full:"die Möbel",pron:"sie",pronCap:"Sie",img:"moebel.png",plural:true,pluralWord:"Möbel"}
];

const REACTIONS=[
{id:"sehr-gut",word:"Sehr gut.",emoji:"😍",score:4},
{id:"gut",word:"Gut.",emoji:"🙂",score:3},
{id:"es-geht",word:"Es geht.",emoji:"😐",score:2},
{id:"nicht-so-gut",word:"Nicht so gut.",emoji:"🙁",score:1}
];

const PAIRS=[
["schoen","haesslich"],["hell","dunkel"],["gross","klein"],["breit","schmal"],
["teuer","billig"],["neu","alt"],["sauber","schmutzig"],["bequem","unbequem"]
];
const CARDS=[...COLORS.map(x=>({...x,type:"color"})),...ADJECTIVES.map(x=>({...x,type:"adj"}))];

const HEARING_TASKS=[
{color:"rot",options:["rot","dunkelrot","hellrot","orange"],item:"stuhl"},
{color:"dunkelrot",options:["dunkelrot","rot","hellrot","braun"],item:"sessel"},
{color:"hellrot",options:["hellrot","rot","dunkelrot","gelb"],item:"sofa"},
{color:"blau",options:["blau","dunkelblau","hellblau","grau"],item:"tisch"},
{color:"dunkelblau",options:["dunkelblau","blau","hellblau","schwarz"],item:"schrank"},
{color:"hellblau",options:["hellblau","blau","dunkelblau","weiss"],item:"bett"},
{color:"gruen",options:["gruen","dunkelgruen","hellgruen","gelb"],item:"lampe"},
{color:"dunkelgruen",options:["dunkelgruen","gruen","hellgruen","braun"],item:"sofa"},
{color:"hellgruen",options:["hellgruen","gruen","dunkelgruen","weiss"],item:"sessel"},
{color:"gelb",options:["gelb","orange","weiss","braun"],item:"stuhl"},
{color:"orange",options:["orange","gelb","rot","braun"],item:"tisch"},
{color:"grau",options:["grau","schwarz","weiss","blau"],item:"bett"}
];

const CONTRAST_TASKS=[
{item:"sofa",wrong:"hell",right:"dunkel",sentence:"Das Sofa ist nicht hell. Es ist sehr dunkel."},
{item:"lampe",wrong:"dunkel",right:"hell",sentence:"Die Lampe ist nicht dunkel. Sie ist sehr hell."},
{item:"sessel",wrong:"unbequem",right:"bequem",sentence:"Der Sessel ist nicht unbequem. Er ist sehr bequem."},
{item:"stuhl",wrong:"bequem",right:"unbequem",sentence:"Der Stuhl ist nicht bequem. Er ist sehr unbequem."},
{item:"waschbecken",wrong:"schmutzig",right:"sauber",sentence:"Das Waschbecken ist nicht schmutzig. Es ist sehr sauber."},
{item:"waschbecken",wrong:"sauber",right:"schmutzig",sentence:"Das Waschbecken ist nicht sauber. Es ist sehr schmutzig."},
{item:"sofa",wrong:"alt",right:"modern",sentence:"Das Sofa ist nicht alt. Es ist sehr modern."},
{item:"tisch",wrong:"klein",right:"groß",sentence:"Der Tisch ist nicht klein. Er ist sehr groß."},
{item:"schrank",wrong:"schmal",right:"breit",sentence:"Der Schrank ist nicht schmal. Er ist sehr breit."},
{item:"stuhl",wrong:"teuer",right:"billig",sentence:"Der Stuhl ist nicht teuer. Er ist sehr billig."},
{item:"bett",wrong:"alt",right:"neu",sentence:"Das Bett ist nicht alt. Es ist sehr neu."},
{item:"sessel",wrong:"hässlich",right:"schön",sentence:"Der Sessel ist nicht hässlich. Er ist sehr schön."},
{item:"tisch",wrong:"breit",right:"schmal",sentence:"Der Tisch ist nicht breit. Er ist sehr schmal."},
{item:"bett",wrong:"billig",right:"teuer",sentence:"Das Bett ist nicht billig. Es ist sehr teuer."},
{item:"lampe",wrong:"schön",right:"hässlich",sentence:"Die Lampe ist nicht schön. Sie ist sehr hässlich."}
];

const GEFAELLEN_TASKS=[
{item:"sessel",reaction:"sehr-gut",adj:"bequem",question:"Wie gefällt dir der Sessel?",answer:"Sehr gut. Er ist bequem."},
{item:"stuhl",reaction:"nicht-so-gut",adj:"unbequem",question:"Wie gefällt dir der Stuhl?",answer:"Nicht so gut. Er ist unbequem."},
{item:"waschbecken",reaction:"nicht-so-gut",adj:"schmutzig",question:"Wie gefällt dir das Waschbecken?",answer:"Nicht so gut. Es ist schmutzig."},
{item:"waschbecken",reaction:"sehr-gut",adj:"sauber",question:"Wie gefällt dir das Waschbecken?",answer:"Sehr gut. Es ist sauber."},
{item:"sofa",reaction:"gut",adj:"modern",question:"Wie gefällt dir das Sofa?",answer:"Gut. Es ist modern."},
{item:"lampe",reaction:"sehr-gut",adj:"hell",question:"Wie gefällt dir die Lampe?",answer:"Sehr gut. Sie ist hell."},
{item:"tisch",reaction:"es-geht",adj:"klein",question:"Wie gefällt dir der Tisch?",answer:"Es geht. Er ist klein."},
{item:"bett",reaction:"gut",adj:"neu",question:"Wie gefällt dir das Bett?",answer:"Gut. Es ist neu."},
{item:"stuehle",plural:true,itemImg:"stuhl.png",full:"die Stühle",question:"Wie gefallen dir die Stühle?",reaction:"gut",adj:"modern",answer:"Gut. Sie sind modern."},
{item:"sofas",plural:true,itemImg:"sofa.png",full:"die Sofas",question:"Wie gefallen dir die Sofas?",reaction:"sehr-gut",adj:"schoen",answer:"Sehr gut. Sie sind schön."},
{item:"lampen",plural:true,itemImg:"lampe.png",full:"die Lampen",question:"Wie gefallen dir die Lampen?",reaction:"nicht-so-gut",adj:"dunkel",answer:"Nicht so gut. Sie sind dunkel."},
{item:"schraenke",plural:true,itemImg:"schrank.png",full:"die Schränke",question:"Wie gefallen dir die Schränke?",reaction:"es-geht",adj:"alt",answer:"Es geht. Sie sind alt."},
{item:"sessel",reaction:"gut",adj:"schoen",question:"Wie gefällt dir der Sessel?",answer:"Gut. Er ist schön."},
{item:"bett",reaction:"nicht-so-gut",adj:"teuer",question:"Wie gefällt dir das Bett?",answer:"Nicht so gut. Es ist teuer."},
{item:"tisch",reaction:"sehr-gut",adj:"breit",question:"Wie gefällt dir der Tisch?",answer:"Sehr gut. Er ist breit."}
];

const SENTENCES=[
{img:"sessel.png",text:"Der Sessel ist bequem.",words:["Der","Sessel","ist","bequem."]},
{img:"stuhl.png",text:"Der Stuhl ist unbequem.",words:["Der","Stuhl","ist","unbequem."]},
{img:"waschbecken.png",text:"Das Waschbecken ist sauber.",words:["Das","Waschbecken","ist","sauber."]},
{img:"waschbecken.png",text:"Das Waschbecken ist schmutzig.",words:["Das","Waschbecken","ist","schmutzig."]},
{img:"sofa.png",text:"Das Sofa ist modern.",words:["Das","Sofa","ist","modern."]},
{img:"moebel.png",text:"Die Möbel sind modern.",words:["Die","Möbel","sind","modern."]},
{img:"lampe.png",text:"Die Lampe ist hell.",words:["Die","Lampe","ist","hell."]},
{img:"zimmer.png",text:"Die Zimmer sind groß.",words:["Die","Zimmer","sind","groß."]},
{img:"tisch.png",text:"Der Tisch ist klein.",words:["Der","Tisch","ist","klein."]},
{img:"bett.png",text:"Das Bett ist neu.",words:["Das","Bett","ist","neu."]},
{img:"schrank.png",text:"Der Schrank ist breit.",words:["Der","Schrank","ist","breit."]},
{img:"stuehle.png",text:"Die Stühle sind bequem.",words:["Die","Stühle","sind","bequem."]},
{img:"sofas.png",text:"Die Sofas sind schön.",words:["Die","Sofas","sind","schön."]},
{img:"lampen.png",text:"Die Lampen sind hell.",words:["Die","Lampen","sind","hell."]},
{img:"betten.png",text:"Die Betten sind teuer.",words:["Die","Betten","sind","teuer."]},
{img:"waschbecken.png",text:"Die Waschbecken sind sauber.",words:["Die","Waschbecken","sind","sauber."]},
{img:"sessel.png",text:"Der Sessel ist alt.",words:["Der","Sessel","ist","alt."]},
{img:"stuhl.png",text:"Der Stuhl ist billig.",words:["Der","Stuhl","ist","billig."]},
{img:"sofa.png",text:"Das Sofa ist dunkel.",words:["Das","Sofa","ist","dunkel."]},
{img:"tisch.png",text:"Die Tische sind schmal.",words:["Die","Tische","sind","schmal."]}
];

const KEIN_TASKS=[
{gap:"nicht",sentence:"Der Sessel ist ___ unbequem. Er ist bequem."},
{gap:"kein",sentence:"Das ist ___ Stuhl. Das ist ein Sessel."},
{gap:"keine",sentence:"Das ist ___ Lampe. Das ist ein Tisch."},
{gap:"nicht",sentence:"Das Waschbecken ist ___ schmutzig. Es ist sauber."},
{gap:"kein",sentence:"Hier ist ___ Bett. Hier ist ein Sofa."},
{gap:"keine",sentence:"Hier ist ___ Dusche. Hier ist ein Waschbecken."},
{gap:"nicht",sentence:"Der Stuhl ist ___ bequem. Er ist unbequem."},
{gap:"kein",sentence:"Das ist ___ Schrank. Das ist ein Kühlschrank."},
{gap:"keine",sentence:"Das ist ___ Küche. Das ist ein Bad."},
{gap:"nicht",sentence:"Das Sofa ist ___ alt. Es ist modern."},
{gap:"kein",sentence:"Hier ist ___ Fernseher. Hier ist ein Teppich."},
{gap:"keine",sentence:"Hier ist ___ Toilette. Hier ist eine Dusche."},
{gap:"nicht",sentence:"Die Lampe ist ___ dunkel. Sie ist hell."},
{gap:"kein",sentence:"Das ist ___ Tisch. Das ist ein Stuhl."},
{gap:"keine",sentence:"Das ist ___ Badewanne. Das ist eine Dusche."}
];

const WRITING=[
{imgs:["sessel.png","bequem.png"],text:"Der Sessel ist bequem."},
{imgs:["stuhl.png","unbequem.png"],text:"Der Stuhl ist unbequem."},
{imgs:["waschbecken.png","sauber.png"],text:"Das Waschbecken ist sauber."},
{imgs:["waschbecken.png","schmutzig.png"],text:"Das Waschbecken ist schmutzig."},
{imgs:["sofa.png","modern.png"],text:"Das Sofa ist modern."},
{imgs:["lampe.png","hell.png"],text:"Die Lampe ist hell."},
{imgs:["tisch.png","klein.png"],text:"Der Tisch ist klein."},
{imgs:["bett.png","neu.png"],text:"Das Bett ist neu."},
{imgs:["schrank.png","breit.png"],text:"Der Schrank ist breit."},
{imgs:["sessel.png","schoen.png"],text:"Der Sessel ist schön."},
{imgs:["stuhl.png","billig.png"],text:"Der Stuhl ist billig."},
{imgs:["sofa.png","dunkel.png"],text:"Das Sofa ist dunkel."},
{imgs:["bett.png","teuer.png"],text:"Das Bett ist teuer."},
{imgs:["lampe.png","modern.png"],text:"Die Lampe ist modern."},
{imgs:["tisch.png","schmal.png"],text:"Der Tisch ist schmal."}
];

function $(id){return document.getElementById(id)}
function simple(s){return String(s||"").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss").replace(/[.,!?]/g,"").replace(/\s+/g," ")}
function safe(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function currentMotherLang(){try{let p=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null");let raw=p?.motherLanguageCode||p?.muttersprache||p?.motherLanguage||localStorage.getItem("motherLanguage")||"en";let n=String(raw).trim().toLowerCase();let map={"russisch":"ru","englisch":"en","ukrainisch":"uk","arabisch":"ar","türkisch":"tr","tuerkisch":"tr","rumänisch":"ro","rumaenisch":"ro","japanisch":"ja","polnisch":"pl","kurdisch":"ku","deutsch":"de"};return map[n]||n||"en"}catch(e){return"en"}}
function translate(x){let l=currentMotherLang();return x.tr?.[l]||x.tr?.en||x.word}
function img(name,cls="task-img"){return `<img class="${cls}" src="../bilder/${name}" onerror="fixImg(this)" alt="">`}
function colorImg(c,cls="task-img"){return `<img class="${cls} color-img" src="../bilder/${c.img||c.id+'.png'}" onerror="this.replaceWith(colorSwatchNode('${c.hex||'#ddd'}'))" alt="">`}
function colorSwatchNode(hex){let d=document.createElement('div');d.className='swatch-img';d.style.background=hex;return d}
function fixImg(el){el.classList.add("missing");el.alt="Bild fehlt"}
function swatch(c,small=false){return `<div class="swatch ${small?'small':''}" style="background:${c.hex};${c.id==='weiss'?'border-color:#cbd5e1':''}"></div>`}
function furnitureById(id){return FURNITURE.find(x=>x.id===id)||FURNITURE[0]}
function adjById(id){return ADJECTIVES.find(x=>x.id===id)||ADJECTIVES[0]}
function colorById(id){return COLORS.find(x=>x.id===id)||COLORS[0]}
function reactionById(id){return REACTIONS.find(x=>x.id===id)||REACTIONS[0]}
function header(title){const h=document.querySelector('.topbar');if(!h)return;let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'{}')}catch(e){};const who=`${safe(p.vorname||p.firstName||'')} ${safe(p.nachname||p.lastName||'')}`.trim()||'Schüler/in';const kurs=safe(p.kurs||p.kursnummer||p.courseCode||'');h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="subtitle">${safe(title)} · A1 Lektion 4 · Thema 3</div></div></a><div class="account-tools"><span class="account-pill">${who}${kurs?' · '+kurs:''}</span><a class="account-link" href="/student-dashboard/index.html">📊 Dashboard</a><a class="account-link" href="/profile/index.html">👤 Profil</a><button class="account-link account-btn" onclick="logoutSP()">🚪 Abmelden</button></div></div><nav class="nav"><a class="btn secondary" href="index.html">← Zurück</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><button class="btn danger-btn" onclick="resetThemeProgress()">Fortschritte löschen</button></nav>`}
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
function complete(area,file,next="index.html"){syncTask(file,loadTask(file,getTotal(file)));area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Aufgabe geschafft!</div><div class="big">100% erreicht.</div><div class="progress"><div class="bar" style="width:100%"></div></div><div class="actions finish-actions"><button class="btn" onclick="resetOneTask('${file}')">Nochmal üben</button><a class="btn green" href="${next}">Weiter</a><a class="btn secondary" href="index.html">Zurück zum Thema</a></div></div>`}
function resetOneTask(file){localStorage.removeItem(taskKey(file));location.reload()}
function getTotal(file){return {"karteikarten.html":CARDS.length,"hoeren.html":HEARING_TASKS.length,"farben.html":COLORS.length,"memory.html":16,"gegenteile.html":CONTRAST_TASKS.length,"kein.html":KEIN_TASKS.length,"reaktionen.html":REACTIONS.length,"gefallen.html":GEFAELLEN_TASKS.length,"saetze-bauen.html":SENTENCES.length,"schreiben.html":WRITING.length}[file]||1}
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
function speak(text,slow=false){if(!('speechSynthesis'in window))return;const run=()=>{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(String(text||''));u.lang='de-DE';u.rate=slow?.72:.88;let voices=speechSynthesis.getVoices();let v=voices.find(v=>v.lang==='de-DE'&&/google|microsoft|anna|katja|deutsch|german/i.test(v.name||''))||voices.find(v=>v.lang==='de-DE')||voices.find(v=>String(v.lang).startsWith('de'));if(v)u.voice=v;speechSynthesis.speak(u)};if(!speechSynthesis.getVoices().length){speechSynthesis.onvoiceschanged=run;setTimeout(run,250)}else run()}
function startMic(btn,callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;const status=$('micStatus');if(!SR){if(status)status.textContent='Mikrofon geht hier nicht. Bitte schreibe.';return}let rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;if(btn)btn.classList.add('active');if(status)status.textContent='Ich höre zu …';rec.onresult=e=>{let txt=e.results[0][0].transcript;if(status)status.textContent='Gehört: '+txt;callback(txt,true)};rec.onerror=()=>{if(status)status.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe.'};rec.onend=()=>{if(btn)btn.classList.remove('active')};rec.start()}
function normalizeSentence(s){return simple(s).replace(/\s+/g,' ').trim()}
function isLooseSentence(ans,sol){return normalizeSentence(ans)===normalizeSentence(sol)}
function isExactSentence(ans,sol,fromSpeech=false){if(fromSpeech)return isLooseSentence(ans,sol);return String(ans||"").trim()===String(sol||"").trim()||isLooseSentence(ans,sol)}
function exactOrSpeech(ans,sol,fromSpeech=false){if(fromSpeech)return isLooseSentence(ans,sol);return String(ans||"").trim()===String(sol||"").trim()}
function exampleBox(html){return `<div class="example-box"><b>Beispiel:</b><br>${html}</div>`}
function instruction(text){return `<div class="task-instruction">${text}</div>`}
function iconCard(content){return `<div class="image-card">${content}</div>`}
