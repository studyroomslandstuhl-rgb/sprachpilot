(function(){'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['flugzeug','das Flugzeug','die Flugzeuge','das_flugzeug.webp',['airplane','самолёт','uçak','літак','طائرة','飛行機','avion','samolot','balafir','هواپیما','avion','avión','aereo']],
['strassenbahn','die Straßenbahn','die Straßenbahnen','die_strassenbahn.webp',['tram','трамвай','tramvay','трамвай','ترام','路面電車','tramvai','tramwaj','tramvay','تراموا','tramway','tranvía','tram']],
['zug','der Zug','die Züge','der_zug.webp',['train','поезд','tren','поїзд','قطار','電車','tren','pociąg','trên','قطار','train','tren','treno']],
['u_bahn','die U-Bahn','die U-Bahnen','die_u_bahn.webp',['subway','метро','metro','метро','مترو الأنفاق','地下鉄','metrou','metro','metro','مترو','métro','metro','metropolitana']],
['bus','der Bus','die Busse','der_bus.webp',['bus','автобус','otobüs','автобус','حافلة','バス','autobuz','autobus','otobês','اتوبوس','bus','autobús','autobus']],
['s_bahn','die S-Bahn','die S-Bahnen','die_s_bahn.webp',['suburban train','городская электричка','banliyö treni','міська електричка','قطار الضواحي','都市近郊電車','tren suburban','kolej miejska','trêna derdorê bajêr','قطار حومه','train de banlieue','tren de cercanías','treno suburbano']],
['station','die Station','die Stationen','die_station.webp',['station','станция','istasyon','станція','محطة','駅','stație','stacja','rawestgeh','ایستگاه','station','estación','stazione']],
['fahrrad','das Fahrrad','die Fahrräder','das_fahrrad.webp',['bicycle','велосипед','bisiklet','велосипед','دراجة هوائية','自転車','bicicletă','rower','bisîklet','دوچرخه','vélo','bicicleta','bicicletta']],
['auto','das Auto','die Autos','das_auto.webp',['car','автомобиль','araba','автомобіль','سيارة','車','mașină','samochód','erebe','ماشین','voiture','coche','automobile']]
];
const languageCodes=['en','ru','tr','uk','ar','ja','ro','pl','ku','fa','fr','es','it'];
const translations=values=>Object.fromEntries(languageCodes.map((code,index)=>[code,values[index]]));
const cards=raw.map(x=>({id:x[0],full:x[1],plural:x[2],article:x[1].split(' ')[0],image:CDN+x[3],audio:AUDIO+x[0]+'.mp3',type:'noun',translations:translations(x[4])}));
const prepositionCards=[
['an','an',['at / on','у / на','yanında / -de','біля / на','عند / على','～に / ～で','la / pe','przy / na','li / ber','کنار / روی','à / contre','en / junto a','a / su']],
['auf','auf',['on','на','üstünde','на','على','～の上に','pe','na','li ser','روی','sur','sobre','su']],
['hinter','hinter',['behind','за','arkasında','за','خلف','～の後ろに','în spatele','za','li pişt','پشت','derrière','detrás de','dietro']],
['in','in',['in / into','в','içinde / içine','в','في / إلى داخل','～の中に / ～へ','în','w / do','di / ber bi hundir','در / به داخل','dans','en / dentro de','in']],
['neben','neben',['next to','рядом с','yanında','поруч із','بجانب','～の隣に','lângă','obok','li kêleka','کنار','à côté de','al lado de','accanto a']],
['ueber','über',['above / over','над','üstünde','над','فوق','～の上方に','deasupra','nad','li jor','بالای','au-dessus de','encima de','sopra']],
['unter','unter',['under','под','altında','під','تحت','～の下に','sub','pod','li bin','زیر','sous','debajo de','sotto']],
['vor','vor',['in front of','перед','önünde','перед','أمام','～の前に','în fața','przed','li ber','جلوی','devant','delante de','davanti a']],
['zwischen','zwischen',['between','между','arasında','між','بين','～の間に','între','między','di navbera','بین','entre','entre','tra']]
].map(([id,full,values])=>({id:'wp_'+id,full,image:CDN+id+'.webp',audio:AUDIO+id+'.mp3',type:'preposition',translations:translations(values)}));
const tasks=[
{id:'karteikarten',title:'Karteikarten',icon:'🃏',cardText:'Lerne die Verkehrsmittel und Wechselpräpositionen.'},
{id:'bild-wort',title:'Bild – Wort',icon:'🖼️',cardText:'Sieh das Bild und wähle das richtige Wort.'},
{id:'wort-bild',title:'Wort – Bild',icon:'🔎',cardText:'Lies das Wort und wähle das passende Bild.'},
{id:'hoeren-bild',title:'Hören – Bild',icon:'🎧',cardText:'Höre das Wort und wähle das passende Bild.'},
{id:'memory',title:'Memory',icon:'🧠',cardText:'Finde Bild und Wort als Paar.'},
{id:'wp-bild-hoeren',title:'Wechselpräpositionen: Bild + Hören',icon:'🎧',cardText:'Ordne jede Bildkarte der passenden Hörkarte zu.'},
{id:'praeposition-gruppen',title:'Präpositionen zuordnen',icon:'🗂️',cardText:'Ordne zu: Akkusativ, Dativ oder Wechselpräposition.'},
{id:'in-mit-artikel',title:'in + Artikel',icon:'✍️',cardText:'Bestimme wo/wohin und den Kasus. Ergänze danach in + Artikel.'},
{id:'fehler-markieren',title:'Fehler markieren und korrigieren',icon:'🛠️',cardText:'Finde den falschen Kasus, das falsche Partizip II oder Hilfsverb.'},
{id:'fahren-mit',title:'fahren mit',icon:'🚍',cardText:'Übe: Ich fahre mit dem Bus, mit dem Zug, mit der U-Bahn …'},
{id:'fahren-zu',title:'fahren zu',icon:'📍',cardText:'Übe: Ich fahre zum Bahnhof, zur Station, zur Schule …'},
{id:'mit-und-zu',title:'fahren mit + fahren zu',icon:'🧭',cardText:'Bilde vollständige Sätze mit Verkehrsmittel und Ziel.'},
{id:'pruefung',title:'Prüfung',icon:'⭐',exam:true,cardText:'Löse gemischte Aufgaben zu Thema 2.'}
];
window.L11T2={cards,prepositionCards,tasks,CDN,AUDIO};
})();
