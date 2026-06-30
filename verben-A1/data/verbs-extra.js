// data/verbs-extra.js
// Ergänzt neue A1-Verben, eindeutige Übersetzungen, A1-Sätze und Grammatikdaten.
(function(){
  const NEW_VERBS=[
    {v:"aufräumen",img:"aufraeumen"},
    {v:"einkaufen",img:"einkaufen"},
    {v:"anrufen",img:"anrufen"},
    {v:"fernsehen",img:"fernsehen"},
    {v:"anfangen",img:"anfangen"},
    {v:"beginnen",img:"beginnen"},
    {v:"starten",img:"starten"},
    {v:"enden",img:"enden"},
    {v:"aussterben",img:"aussterben"},
    {v:"aufmachen",img:"aufmachen"},
    {v:"zumachen",img:"zumachen"},
    {v:"begraben",img:"begraben"},
    {v:"zerstören",img:"zerstoeren"},
    {v:"verbiegen",img:"verbiegen"},
    {v:"mitgeben",img:"mitgeben"},
    {v:"mitnehmen",img:"mitnehmen"}
  ];
  const SENTENCES={
    "aufräumen":"Ich räume mein Zimmer auf.",
    "einkaufen":"Wir kaufen im Supermarkt ein.",
    "anrufen":"Ich rufe meine Mutter an.",
    "fernsehen":"Am Abend sehe ich fern.",
    "anfangen":"Der Kurs fängt um acht Uhr an.",
    "beginnen":"Der Unterricht beginnt um neun Uhr.",
    "starten":"Der Bus startet am Bahnhof.",
    "enden":"Der Film endet um zehn Uhr.",
    "aussterben":"Viele Tiere sterben aus.",
    "aufmachen":"Ich mache das Fenster auf.",
    "zumachen":"Bitte mach die Tür zu.",
    "begraben":"Die Familie begräbt den Hund im Garten.",
    "zerstören":"Der Sturm zerstört das Dach.",
    "verbiegen":"Das Kind verbiegt den Draht.",
    "mitgeben":"Die Mutter gibt dem Kind Essen mit.",
    "mitnehmen":"Ich nehme eine Flasche Wasser mit."
  };
  const EXTRA_TRANSLATIONS={
    "Englisch":{
      "aufräumen":"to tidy up a room",
      "einkaufen":"to go shopping / buy groceries",
      "anrufen":"to call by phone",
      "fernsehen":"to watch TV",
      "anfangen":"to begin / start (informal)",
      "beginnen":"to begin (formal)",
      "starten":"to start / launch",
      "enden":"to end",
      "aussterben":"to die out / become extinct",
      "aufmachen":"to open up / open (informal)",
      "zumachen":"to close / shut (informal)",
      "begraben":"to bury",
      "zerstören":"to destroy",
      "verbiegen":"to bend out of shape",
      "mitgeben":"to give someone something to take along",
      "mitnehmen":"to take along"
    },
    "Russisch":{
      "aufräumen":"убирать комнату",
      "einkaufen":"ходить за покупками / покупать продукты",
      "anrufen":"звонить по телефону",
      "fernsehen":"смотреть телевизор",
      "anfangen":"начинать (разговорно)",
      "beginnen":"начинаться / начинать (официально)",
      "starten":"стартовать / запускать",
      "enden":"заканчиваться",
      "aussterben":"вымирать",
      "aufmachen":"открывать (разговорно)",
      "zumachen":"закрывать (разговорно)",
      "begraben":"хоронить / закапывать",
      "zerstören":"разрушать",
      "verbiegen":"гнуть / сгибать криво",
      "mitgeben":"давать с собой",
      "mitnehmen":"брать с собой"
    },
    "Ukrainisch":{
      "aufräumen":"прибирати кімнату",
      "einkaufen":"ходити за покупками / купувати продукти",
      "anrufen":"дзвонити телефоном",
      "fernsehen":"дивитися телевізор",
      "anfangen":"починати (розмовно)",
      "beginnen":"починатися / починати (офіційно)",
      "starten":"стартувати / запускати",
      "enden":"закінчуватися",
      "aussterben":"вимирати",
      "aufmachen":"відчиняти / відкривати (розмовно)",
      "zumachen":"зачиняти / закривати (розмовно)",
      "begraben":"ховати / закопувати",
      "zerstören":"руйнувати",
      "verbiegen":"гнути / викривляти",
      "mitgeben":"давати із собою",
      "mitnehmen":"брати із собою"
    },
    "Arabisch":{
      "aufräumen":"يرتب الغرفة",
      "einkaufen":"يتسوق / يشتري أغراضًا",
      "anrufen":"يتصل بالهاتف",
      "fernsehen":"يشاهد التلفاز",
      "anfangen":"يبدأ (بشكل عادي)",
      "beginnen":"يبدأ (بشكل رسمي)",
      "starten":"ينطلق / يبدأ التشغيل",
      "enden":"ينتهي",
      "aussterben":"ينقرض",
      "aufmachen":"يفتح (بشكل عادي)",
      "zumachen":"يغلق / يقفل (بشكل عادي)",
      "begraben":"يدفن",
      "zerstören":"يدمر",
      "verbiegen":"يثني / يعوج",
      "mitgeben":"يعطي شيئًا ليأخذه معه",
      "mitnehmen":"يأخذ معه"
    },
    "Türkisch":{
      "aufräumen":"odayı toplamak",
      "einkaufen":"alışveriş yapmak / market alışverişi yapmak",
      "anrufen":"telefonla aramak",
      "fernsehen":"televizyon izlemek",
      "anfangen":"başlamak (günlük)",
      "beginnen":"başlamak (resmî)",
      "starten":"başlatmak / start vermek",
      "enden":"bitmek / sona ermek",
      "aussterben":"nesli tükenmek",
      "aufmachen":"açmak (günlük)",
      "zumachen":"kapatmak (günlük)",
      "begraben":"gömmek / defnetmek",
      "zerstören":"yok etmek / tahrip etmek",
      "verbiegen":"eğmek / bükmek",
      "mitgeben":"yanına vermek",
      "mitnehmen":"yanına almak"
    },
    "Rumänisch":{
      "aufräumen":"a face ordine în cameră",
      "einkaufen":"a merge la cumpărături / a cumpăra alimente",
      "anrufen":"a suna la telefon",
      "fernsehen":"a se uita la televizor",
      "anfangen":"a începe (uzual)",
      "beginnen":"a începe (formal)",
      "starten":"a porni / a lansa",
      "enden":"a se termina",
      "aussterben":"a dispărea ca specie",
      "aufmachen":"a deschide (uzual)",
      "zumachen":"a închide (uzual)",
      "begraben":"a îngropa",
      "zerstören":"a distruge",
      "verbiegen":"a îndoi / a deforma",
      "mitgeben":"a da cuiva ceva de luat cu el",
      "mitnehmen":"a lua cu sine"
    },
    "Japanisch":{
      "aufräumen":"部屋を片付ける",
      "einkaufen":"買い物をする / 食料品を買う",
      "anrufen":"電話をかける",
      "fernsehen":"テレビを見る",
      "anfangen":"始める（日常）",
      "beginnen":"始まる / 始める（正式）",
      "starten":"スタートする / 起動する",
      "enden":"終わる",
      "aussterben":"絶滅する",
      "aufmachen":"開ける（日常）",
      "zumachen":"閉める（日常）",
      "begraben":"埋める / 埋葬する",
      "zerstören":"破壊する",
      "verbiegen":"曲げる / ゆがめる",
      "mitgeben":"持たせる",
      "mitnehmen":"持って行く / 連れて行く"
    }
  };
  function addNewVerbs(){
    if(!window.ALL_VERBS)return;
    const existing=new Set(window.ALL_VERBS.map(x=>x.v));
    NEW_VERBS.forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
  }
  function addSentences(){
    window.VERB_SENTENCES=window.VERB_SENTENCES||{};
    Object.assign(window.VERB_SENTENCES,SENTENCES);
    const old=window.sentenceForVerb;
    window.sentenceForVerb=function(v){return window.VERB_SENTENCES[v] || (typeof old==="function"?old(v):`Ich lerne ${v}.`);};
  }
  function addTranslations(){
    window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
    Object.keys(EXTRA_TRANSLATIONS).forEach(lang=>{
      window.VERB_TRANSLATIONS[lang]=window.VERB_TRANSLATIONS[lang]||{};
      Object.assign(window.VERB_TRANSLATIONS[lang],EXTRA_TRANSLATIONS[lang]);
    });
  }
  function clarifyDuplicateTranslations(){
    Object.keys(window.VERB_TRANSLATIONS||{}).forEach(lang=>{
      const map=window.VERB_TRANSLATIONS[lang]||{};
      const reverse={};
      Object.keys(map).forEach(v=>{
        const key=String(map[v]||"").trim().toLowerCase();
        if(!key)return;
        reverse[key]=reverse[key]||[];
        reverse[key].push(v);
      });
      Object.keys(reverse).forEach(key=>{
        const verbs=reverse[key];
        if(verbs.length<2)return;
        verbs.forEach(v=>{
          if(!/\(|\/|Deutsch:|нем\.|укр\.|A1|日常|официаль|formal|günlük|uzual|رسمي|عادي/i.test(map[v])){
            map[v]=`${map[v]} (${v})`;
          }
        });
      });
    });
  }
  function patchConjugationData(){
    if(typeof CONJ_EXAMPLES!=="undefined")Object.assign(CONJ_EXAMPLES,{
      "aufräumen":"mein Zimmer",
      "einkaufen":"im Supermarkt",
      "anrufen":"meine Mutter",
      "fernsehen":"am Abend",
      "anfangen":"um acht Uhr",
      "beginnen":"um neun Uhr",
      "starten":"am Bahnhof",
      "enden":"um zehn Uhr",
      "aussterben":"langsam",
      "aufmachen":"das Fenster",
      "zumachen":"die Tür",
      "begraben":"den Hund im Garten",
      "zerstören":"das Dach",
      "verbiegen":"den Draht",
      "mitgeben":"dem Kind Essen",
      "mitnehmen":"eine Flasche Wasser"
    });
    if(typeof SEPARABLE_VERBS!=="undefined")Object.assign(SEPARABLE_VERBS,{
      "aufräumen":{base:"räumen",prefix:"auf"},
      "einkaufen":{base:"kaufen",prefix:"ein"},
      "anrufen":{base:"rufen",prefix:"an"},
      "fernsehen":{base:"sehen",prefix:"fern"},
      "anfangen":{base:"fangen",prefix:"an"},
      "aussterben":{base:"sterben",prefix:"aus"},
      "aufmachen":{base:"machen",prefix:"auf"},
      "zumachen":{base:"machen",prefix:"zu"},
      "mitgeben":{base:"geben",prefix:"mit"},
      "mitnehmen":{base:"nehmen",prefix:"mit"}
    });
    if(typeof FULL_FORMS!=="undefined")Object.assign(FULL_FORMS,{
      "beginnen":{"ich":"beginne","du":"beginnst","er/sie/es":"beginnt","wir":"beginnen","ihr":"beginnt","sie/Sie":"beginnen"},
      "enden":{"ich":"ende","du":"endest","er/sie/es":"endet","wir":"enden","ihr":"endet","sie/Sie":"enden"},
      "sterben":{"ich":"sterbe","du":"stirbst","er/sie/es":"stirbt","wir":"sterben","ihr":"sterbt","sie/Sie":"sterben"},
      "räumen":{"ich":"räume","du":"räumst","er/sie/es":"räumt","wir":"räumen","ihr":"räumt","sie/Sie":"räumen"},
      "rufen":{"ich":"rufe","du":"rufst","er/sie/es":"ruft","wir":"rufen","ihr":"ruft","sie/Sie":"rufen"},
      "machen":{"ich":"mache","du":"machst","er/sie/es":"macht","wir":"machen","ihr":"macht","sie/Sie":"machen"},
      "verbiegen":{"ich":"verbiege","du":"verbiegst","er/sie/es":"verbiegt","wir":"verbiegen","ihr":"verbiegt","sie/Sie":"verbiegen"},
      "zerstören":{"ich":"zerstöre","du":"zerstörst","er/sie/es":"zerstört","wir":"zerstören","ihr":"zerstört","sie/Sie":"zerstören"},
      "begraben":{"ich":"begrabe","du":"begräbst","er/sie/es":"begräbt","wir":"begraben","ihr":"begrabt","sie/Sie":"begraben"}
    });
  }
  addNewVerbs();
  addSentences();
  addTranslations();
  clarifyDuplicateTranslations();
  patchConjugationData();
  window.SP_EXTRA_VERBS=NEW_VERBS.map(x=>x.v);
})();
