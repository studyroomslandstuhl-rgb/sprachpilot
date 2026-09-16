(function(){'use strict';
const T={
flugzeug:{en:'airplane',ru:'самолёт',tr:'uçak',uk:'літак',ar:'طائرة',ja:'飛行機',ro:'avion',pl:'samolot',ku:'balafir',fa:'هواپیما',fr:'avion',es:'avión',it:'aereo'},
strassenbahn:{en:'tram',ru:'трамвай',tr:'tramvay',uk:'трамвай',ar:'ترام',ja:'路面電車',ro:'tramvai',pl:'tramwaj',ku:'tramvay',fa:'تراموا',fr:'tramway',es:'tranvía',it:'tram'},
zug:{en:'train',ru:'поезд',tr:'tren',uk:'поїзд',ar:'قطار',ja:'列車',ro:'tren',pl:'pociąg',ku:'tren',fa:'قطار',fr:'train',es:'tren',it:'treno'},
u_bahn:{en:'subway / metro',ru:'метро',tr:'metro',uk:'метро',ar:'مترو',ja:'地下鉄',ro:'metrou',pl:'metro',ku:'metro',fa:'مترو',fr:'métro',es:'metro',it:'metropolitana'},
bus:{en:'bus',ru:'автобус',tr:'otobüs',uk:'автобус',ar:'حافلة',ja:'バス',ro:'autobuz',pl:'autobus',ku:'otobus',fa:'اتوبوس',fr:'bus',es:'autobús',it:'autobus'},
s_bahn:{en:'suburban train / S-Bahn',ru:'городская электричка',tr:'banliyö treni / S-Bahn',uk:'міська електричка',ar:'قطار ضواحي',ja:'都市近郊鉄道',ro:'tren urban / S-Bahn',pl:'kolej miejska / S-Bahn',ku:'trena bajêr / S-Bahn',fa:'قطار شهری',fr:'train de banlieue / S-Bahn',es:'tren de cercanías / S-Bahn',it:'treno suburbano / S-Bahn'},
station:{en:'station / stop',ru:'станция / остановка',tr:'istasyon / durak',uk:'станція / зупинка',ar:'محطة',ja:'駅 / 停留所',ro:'stație',pl:'stacja / przystanek',ku:'stasyon / rawestgeh',fa:'ایستگاه',fr:'station / arrêt',es:'estación / parada',it:'stazione / fermata'},
fahrrad:{en:'bicycle',ru:'велосипед',tr:'bisiklet',uk:'велосипед',ar:'دراجة هوائية',ja:'自転車',ro:'bicicletă',pl:'rower',ku:'bisîklet',fa:'دوچرخه',fr:'vélo',es:'bicicleta',it:'bicicletta'},
auto:{en:'car',ru:'машина / автомобиль',tr:'araba / otomobil',uk:'автомобіль',ar:'سيارة',ja:'車',ro:'mașină',pl:'samochód',ku:'erebe / otomobîl',fa:'ماشین',fr:'voiture',es:'coche / automóvil',it:'auto / macchina'}
};
const apply=()=>{(window.L11T2?.cards||[]).forEach(c=>{c.translations=T[c.id]||{};});window.L11T2Translations=T};
apply();
})();