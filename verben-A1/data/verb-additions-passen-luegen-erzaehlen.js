// Ergänzung: passen, lügen, erzählen, abholen, chatten, ausleihen, versprechen, vereinbaren
(function(){
  const additions=[
    {v:"passen",img:"passen"},
    {v:"lügen",img:"luegen"},
    {v:"erzählen",img:"erzaehlen"},
    {v:"abholen",img:"abholen"},
    {v:"chatten",img:"chatten"},
    {v:"ausleihen",img:"ausleihen"},
    {v:"versprechen",img:"versprechen"},
    {v:"vereinbaren",img:"vereinbaren"}
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
      "chatten":"a discuta pe chat",
      "ausleihen":"a împrumuta",
      "versprechen":"a promite",
      "vereinbaren":"a stabili / a conveni"
    });
    Object.assign(VERB_TRANSLATIONS["Arabisch"]||(VERB_TRANSLATIONS["Arabisch"]={}),{
      "passen":"يناسب",
      "lügen":"يكذب",
      "erzählen":"يحكي / يروي",
      "abholen":"يُحضر / يذهب ليأخذ",
      "chatten":"يدردش",
      "ausleihen":"يستعير",
      "versprechen":"يعد",
      "vereinbaren":"يتفق على موعد"
    });
    Object.assign(VERB_TRANSLATIONS["Russisch"]||(VERB_TRANSLATIONS["Russisch"]={}),{
      "passen":"подходить / быть впору",
      "lügen":"лгать / врать",
      "erzählen":"рассказывать",
      "abholen":"забирать / встречать",
      "chatten":"общаться в чате",
      "ausleihen":"брать напрокат / одалживать",
      "versprechen":"обещать",
      "vereinbaren":"договариваться / назначать"
    });
    Object.assign(VERB_TRANSLATIONS["Ukrainisch"]||(VERB_TRANSLATIONS["Ukrainisch"]={}),{
      "passen":"підходити / пасувати",
      "lügen":"брехати",
      "erzählen":"розповідати",
      "abholen":"забирати / зустрічати",
      "chatten":"спілкуватися в чаті",
      "ausleihen":"позичати / брати напрокат",
      "versprechen":"обіцяти",
      "vereinbaren":"домовлятися / призначати"
    });
    Object.assign(VERB_TRANSLATIONS["Türkisch"]||(VERB_TRANSLATIONS["Türkisch"]={}),{
      "passen":"uymak / uygun olmak",
      "lügen":"yalan söylemek",
      "erzählen":"anlatmak",
      "abholen":"alıp getirmek / almak",
      "chatten":"sohbet etmek / mesajlaşmak",
      "ausleihen":"ödünç almak / kiralamak",
      "versprechen":"söz vermek",
      "vereinbaren":"kararlaştırmak / randevu ayarlamak"
    });
    Object.assign(VERB_TRANSLATIONS["Englisch"]||(VERB_TRANSLATIONS["Englisch"]={}),{
      "passen":"to fit / to suit",
      "lügen":"to lie",
      "erzählen":"to tell / to narrate",
      "abholen":"to pick up",
      "chatten":"to chat / to message",
      "ausleihen":"to borrow / rent",
      "versprechen":"to promise",
      "vereinbaren":"to arrange / agree on"
    });
    Object.assign(VERB_TRANSLATIONS["Japanisch"]||(VERB_TRANSLATIONS["Japanisch"]={}),{
      "passen":"合う / 似合う",
      "lügen":"嘘をつく",
      "erzählen":"話す / 語る",
      "abholen":"迎えに行く / 取りに行く",
      "chatten":"チャットする",
      "ausleihen":"借りる",
      "versprechen":"約束する",
      "vereinbaren":"取り決める / 予約する"
    });
  }

  if(typeof VERB_SENTENCES!=='undefined'){
    Object.assign(VERB_SENTENCES,{
      "passen":"Die Jacke passt gut.",
      "lügen":"Er lügt nicht.",
      "erzählen":"Die Frau erzählt eine Geschichte.",
      "abholen":"Ich hole meine Mutter ab.",
      "chatten":"Ich chatte mit meiner Freundin.",
      "ausleihen":"Ich leihe ein Buch aus.",
      "versprechen":"Ich verspreche es dir.",
      "vereinbaren":"Wir vereinbaren einen Termin."
    });
  }

  if(typeof IRREGULAR_VERB_FORMS!=='undefined'){
    Object.assign(IRREGULAR_VERB_FORMS,{
      "lügen":{"ich":"lüge","du":"lügst","er/sie/es":"lügt"},
      "versprechen":{"ich":"verspreche","du":"versprichst","er/sie/es":"verspricht"}
    });
  }
  if(typeof FULL_FORMS!=='undefined'){
    Object.assign(FULL_FORMS,{
      "versprechen":{"ich":"verspreche","du":"versprichst","er/sie/es":"verspricht","wir":"versprechen","ihr":"versprecht","sie/Sie":"versprechen"}
    });
  }
  if(typeof CONJ_EXAMPLES!=='undefined'){
    Object.assign(CONJ_EXAMPLES,{
      "ausleihen":"ein Buch",
      "versprechen":"es dir",
      "vereinbaren":"einen Termin"
    });
  }
  if(typeof SEPARABLE_VERBS!=='undefined'){
    Object.assign(SEPARABLE_VERBS,{
      "ausleihen":{base:"leihen",prefix:"aus"}
    });
  }
})();