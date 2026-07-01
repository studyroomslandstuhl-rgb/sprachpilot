// data/verb-translation-fix.js
// Übersetzungs-Korrekturen für Verben, die sonst in Aufgaben verwechselt werden.
(function(){
  const FIXES={
    "Arabisch":{
      "sehen":"يرى / يشاهد بعينه",
      "zeigen":"يُري شخصًا شيئًا / يعرض شيئًا",
      "mieten":"يستأجر / يأخذ شيئًا بالإيجار",
      "vermieten":"يؤجّر / يعطي شيئًا للإيجار",
      "anfangen":"يبدأ / يشرع، غالبًا في الكلام اليومي",
      "beginnen":"يبدأ رسميًا / يبدأ حدث أو درس",
      "zusehen":"يشاهد / ينظر دون أن يشارك",
      "zuhören":"يصغي / يستمع بانتباه"
    },
    "Englisch":{
      "sehen":"to see / watch with the eyes",
      "zeigen":"to show someone something",
      "mieten":"to rent as tenant",
      "vermieten":"to rent out as owner/landlord",
      "anfangen":"to start / begin, everyday speech",
      "beginnen":"to begin, neutral/formal",
      "zusehen":"to watch without taking part",
      "zuhören":"to listen attentively"
    },
    "Russisch":{
      "sehen":"видеть / смотреть глазами",
      "zeigen":"показывать кому-то что-то",
      "mieten":"снимать / арендовать для себя",
      "vermieten":"сдавать в аренду",
      "anfangen":"начинать, чаще разговорно",
      "beginnen":"начинаться / начинать, нейтрально или официально",
      "zusehen":"смотреть / наблюдать, не участвуя",
      "zuhören":"слушать внимательно"
    },
    "Ukrainisch":{
      "sehen":"бачити / дивитися очима",
      "zeigen":"показувати комусь щось",
      "mieten":"орендувати для себе",
      "vermieten":"здавати в оренду",
      "anfangen":"починати, частіше розмовно",
      "beginnen":"починатися / починати, нейтрально або офіційно",
      "zusehen":"дивитися / спостерігати, не беручи участі",
      "zuhören":"уважно слухати"
    },
    "Türkisch":{
      "sehen":"görmek / gözle görmek",
      "zeigen":"birine bir şeyi göstermek",
      "mieten":"kiralamak, kiracı olarak almak",
      "vermieten":"kiraya vermek",
      "anfangen":"başlamak, günlük kullanım",
      "beginnen":"başlamak, daha nötr/resmî",
      "zusehen":"izlemek, katılmadan bakmak",
      "zuhören":"dikkatle dinlemek"
    },
    "Rumänisch":{
      "sehen":"a vedea / a privi cu ochii",
      "zeigen":"a arăta cuiva ceva",
      "mieten":"a închiria ca chiriaș",
      "vermieten":"a da în chirie / a închiria altcuiva",
      "anfangen":"a începe, uzual în vorbirea de zi cu zi",
      "beginnen":"a începe, neutru sau mai formal",
      "zusehen":"a privi fără a participa",
      "zuhören":"a asculta atent"
    },
    "Japanisch":{
      "sehen":"見る / 目で見る",
      "zeigen":"人に何かを見せる",
      "mieten":"借りる / 賃借する",
      "vermieten":"貸す / 賃貸する",
      "anfangen":"始める、日常的な言い方",
      "beginnen":"始まる / 始める、より中立的・正式",
      "zusehen":"参加せずに見る / 見守る",
      "zuhören":"注意して聞く"
    }
  };
  window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
  Object.keys(FIXES).forEach(lang=>{
    window.VERB_TRANSLATIONS[lang]=window.VERB_TRANSLATIONS[lang]||{};
    Object.assign(window.VERB_TRANSLATIONS[lang],FIXES[lang]);
  });
})();