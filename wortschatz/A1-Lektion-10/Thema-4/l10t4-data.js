(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const raw=[
['dringend','dringend','dringend','','🚨','Etwas kann nicht warten und muss schnell geschehen.','adjective'],
['in_der_naehe','in der Nähe','in der Nähe','','📍','Nicht weit von hier.','phrase'],
['unfall','der Unfall','Unfall','die Unfälle','🚗','Ein plötzliches Ereignis, bei dem etwas beschädigt oder jemand verletzt wird.','noun'],
['notfall','der Notfall','Notfall','die Notfälle','🆘','Eine gefährliche Situation, in der sofort Hilfe nötig ist.','noun'],
['in_ordnung','in Ordnung','in Ordnung','','👌','Alles ist gut oder richtig.','phrase'],
['versichertenkarte','die Versichertenkarte','Versichertenkarte','die Versichertenkarten','💳','Diese Karte zeigt die Krankenversicherung.','noun'],
['sofort','sofort','sofort','','⚡','Ohne zu warten.','adverb'],
['gleich','gleich','gleich','','⏱️','In sehr kurzer Zeit.','adverb'],
['vorbeikommen','vorbeikommen','vorbeikommen','','🚪','Zu einer Person oder einem Ort kommen.','verb'],
['boden','der Boden','Boden','die Böden','⬇️','Die Fläche, auf der man steht oder geht.','noun'],
['notdienst','der Notdienst','Notdienst','die Notdienste','☎️','Medizinische Hilfe außerhalb der normalen Öffnungszeiten.','noun'],
['notdienst_apotheke','die Notdienst-Apotheke','Notdienst-Apotheke','die Notdienst-Apotheken','⚕️','Eine Apotheke, die nachts oder am Wochenende geöffnet ist.','noun'],
['notaufnahme','die Notaufnahme','Notaufnahme','die Notaufnahmen','🏥','Die Abteilung im Krankenhaus für akute Notfälle.','noun'],
['krankenhaus','das Krankenhaus','Krankenhaus','die Krankenhäuser','🏥','Dort werden kranke oder verletzte Menschen behandelt.','noun'],
['es_gibt','es gibt','es gibt','','ℹ️','Damit sagt man, dass etwas vorhanden ist.','phrase'],
['ploetzlich','plötzlich','plötzlich','','❗','Unerwartet und sehr schnell.','adverb'],
['rettungsdienst','der Rettungsdienst','Rettungsdienst','die Rettungsdienste','🚑','Er hilft bei Notfällen und bringt Verletzte ins Krankenhaus.','noun'],
['bereitschaftspraxis','die Bereitschaftspraxis','Bereitschaftspraxis','die Bereitschaftspraxen','🩺','Dort bekommt man außerhalb der Sprechstunden ärztliche Hilfe.','noun'],
['verletzen','verletzen','verletzen','','🩹','Den Körper von jemandem oder sich selbst beschädigen.','verb'],
['verletzt','verletzt','verletzt','','🤕','Jemand hat eine Verletzung.','adjective'],
['meist','meist','meist','','📊','In den meisten Fällen.','adverb'],
['meistens','meistens','meistens','','🔁','Fast immer oder sehr oft.','adverb'],
['sprechstunde','die Sprechstunde','Sprechstunde','die Sprechstunden','🗓️','Die Zeit, in der eine Arztpraxis Patienten behandelt.','noun'],
['minute','die Minute','Minute','die Minuten','⏱️','Eine Zeiteinheit mit 60 Sekunden.','noun'],
['liegen','liegen','liegen','','🛏️','In waagerechter Position sein.','verb'],
['notarzt','der Notarzt','Notarzt','die Notärzte','👨‍⚕️','Ein Arzt, der zu einem medizinischen Notfall kommt.','noun'],
['notaerztin','die Notärztin','Notärztin','die Notärztinnen','👩‍⚕️','Eine Ärztin, die zu einem medizinischen Notfall kommt.','noun'],
['stark','stark','stark','','💪','Mit großer Kraft oder Intensität.','adjective'],
['passieren','passieren','passieren','','❓','Geschehen oder sich ereignen.','verb'],
['medikament','das Medikament','Medikament','die Medikamente','💊','Ein Mittel zur Behandlung einer Krankheit.','noun'],
['motorrad','das Motorrad','Motorrad','die Motorräder','🏍️','Ein Fahrzeug mit zwei Rädern und Motor.','noun'],
['verletzung','die Verletzung','Verletzung','die Verletzungen','🩸','Eine beschädigte Stelle am Körper.','noun']
];
const cards=raw.map(x=>({id:x[0],full:x[1],word:x[2],plural:x[3],emoji:x[4],meaning:x[5],type:x[6],article:/^(der|die|das) /.test(x[1])?x[1].split(' ')[0]:'',image:CDN+x[0]+'.webp?v=20260914-l10t4-bunny1',audioFile:x[0]+'.mp3',audio:AUDIO+x[0]+'.mp3?v=20260914-l10t4-bunny1',audioFallback:CDN+x[0]+'.mp3?v=20260914-l10t4-bunny1'}));
window.L10T4={title:'Beim Arzt anrufen und im Notfall reagieren',cards,nouns:cards.filter(x=>x.type==='noun')};
})();
