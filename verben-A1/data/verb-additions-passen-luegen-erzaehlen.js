// Ergänzung: passen, lügen, erzählen, abholen, chatten
(function(){
  const additions=[
    {v:"passen",img:"passen"},
    {v:"lügen",img:"luegen"},
    {v:"erzählen",img:"erzaehlen"},
    {v:"abholen",img:"abholen"},
    {v:"chatten",img:"chatten"}
  ];

  if(typeof window!=='undefined'){
    window.ALL_VERBS=window.ALL_VERBS||[];
  }
  if(typeof ALL_VERBS!=='undefined'){
    additions.forEach(function(item){
      if(!ALL_VERBS.some(function(x){return x&&x.v===item.v;}))ALL_VERBS.push(item);
    });
  }

  if(typeof VERB_TRANSLATIONS!=='undefined'){
    Object.assign(VERB_TRANSLATIONS["Rumänisch"]||(VERB_TRANSLATIONS["Rumänisch"]={}),{
      "passen":"a se potrivi",
      "lügen":"a minți",
      "erzählen":"a povesti / a spune",
      "abholen":"a lua / a ridica",
      "chatten":"a discuta pe chat"
    });
    Object.assign(VERB_TRANSLATIONS["Arabisch"]||(VERB_TRANSLATIONS["Arabisch"]={}),{
      "passen":"يناسب",
      "lügen":"يكذب",
      "erzählen":"يحكي / يروي",
      "abholen":"يُحضر / يذهب ليأخذ",
      "chatten":"يدردش"
    });
    Object.assign(VERB_TRANSLATIONS["Russisch"]||(VERB_TRANSLATIONS["Russisch"]={}),{
      "passen":"подходить / быть впору",
      "lügen":"лгать / врать",
      "erzählen":"рассказывать",
      "abholen":"забирать / встречать",
      "chatten":"общаться в чате"
    });
    Object.assign(VERB_TRANSLATIONS["Ukrainisch"]||(VERB_TRANSLATIONS["Ukrainisch"]={}),{
      "passen":"підходити / пасувати",
      "lügen":"брехати",
      "erzählen":"розповідати",
      "abholen":"забирати / зустрічати",
      "chatten":"спілкуватися в чаті"
    });
    Object.assign(VERB_TRANSLATIONS["Türkisch"]||(VERB_TRANSLATIONS["Türkisch"]={}),{
      "passen":"uymak / uygun olmak",
      "lügen":"yalan söylemek",
      "erzählen":"anlatmak",
      "abholen":"alıp getirmek / almak",
      "chatten":"sohbet etmek / mesajlaşmak"
    });
    Object.assign(VERB_TRANSLATIONS["Englisch"]||(VERB_TRANSLATIONS["Englisch"]={}),{
      "passen":"to fit / to suit",
      "lügen":"to lie",
      "erzählen":"to tell / to narrate",
      "abholen":"to pick up",
      "chatten":"to chat / to message"
    });
    Object.assign(VERB_TRANSLATIONS["Japanisch"]||(VERB_TRANSLATIONS["Japanisch"]={}),{
      "passen":"合う / 似合う",
      "lügen":"嘘をつく",
      "erzählen":"話す / 語る",
      "abholen":"迎えに行く / 取りに行く",
      "chatten":"チャットする"
    });
  }

  if(typeof VERB_SENTENCES!=='undefined'){
    Object.assign(VERB_SENTENCES,{
      "passen":"Die Jacke passt gut.",
      "lügen":"Er lügt nicht.",
      "erzählen":"Die Frau erzählt eine Geschichte.",
      "abholen":"Ich hole meine Mutter ab.",
      "chatten":"Ich chatte mit meiner Freundin."
    });
  }

  if(typeof IRREGULAR_VERB_FORMS!=='undefined'){
    Object.assign(IRREGULAR_VERB_FORMS,{
      "lügen":{"ich":"lüge","du":"lügst","er/sie/es":"lügt"}
    });
  }
})();
