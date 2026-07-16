// Übersetzungen für die neuen Verben vom 16.07.2026.
(function(){
  const TRANSLATIONS={
    "Englisch":{"klopfen":"knock","riechen":"smell","stinken":"stink","schauen":"look / watch","gucken":"look / watch","würfeln":"roll dice","schweigen":"be silent","vernichten":"destroy","erleben":"experience"},
    "Russisch":{"klopfen":"стучать","riechen":"нюхать / пахнуть","stinken":"вонять","schauen":"смотреть","gucken":"смотреть","würfeln":"бросать кубик","schweigen":"молчать","vernichten":"уничтожать","erleben":"переживать / испытывать"},
    "Ukrainisch":{"klopfen":"стукати","riechen":"нюхати / пахнути","stinken":"смердіти","schauen":"дивитися","gucken":"дивитися","würfeln":"кидати кубик","schweigen":"мовчати","vernichten":"знищувати","erleben":"переживати / відчувати"},
    "Arabisch":{"klopfen":"يطرق","riechen":"يشم / تفوح منه رائحة","stinken":"ينتن","schauen":"ينظر / يشاهد","gucken":"ينظر / يشاهد","würfeln":"يرمي النرد","schweigen":"يصمت","vernichten":"يدمر","erleben":"يختبر / يعيش تجربة"},
    "Türkisch":{"klopfen":"vurmak / kapıyı çalmak","riechen":"koklamak / kokmak","stinken":"kötü kokmak","schauen":"bakmak / izlemek","gucken":"bakmak / izlemek","würfeln":"zar atmak","schweigen":"susmak","vernichten":"yok etmek","erleben":"yaşamak / deneyimlemek"},
    "Rumänisch":{"klopfen":"a bate / a ciocăni","riechen":"a mirosi","stinken":"a mirosi urât","schauen":"a privi / a se uita","gucken":"a privi / a se uita","würfeln":"a arunca zarul","schweigen":"a tăcea","vernichten":"a distruge","erleben":"a trăi / a experimenta"},
    "Japanisch":{"klopfen":"ノックする","riechen":"においをかぐ / におう","stinken":"臭う","schauen":"見る","gucken":"見る","würfeln":"サイコロを振る","schweigen":"黙る","vernichten":"破壊する","erleben":"経験する"}
  };
  function mergeTranslations(target){
    if(!target||typeof target!=='object')return;
    Object.keys(TRANSLATIONS).forEach(lang=>{
      target[lang]=Object.assign(target[lang]||{},TRANSLATIONS[lang]);
    });
  }
  window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
  mergeTranslations(window.VERB_TRANSLATIONS);
  if(window.TRANSLATIONS&&window.TRANSLATIONS!==window.VERB_TRANSLATIONS)mergeTranslations(window.TRANSLATIONS);
  window.SP_VERB_TRANSLATION_ADDITIONS_20260716=Object.keys(TRANSLATIONS.Englisch);
})();
