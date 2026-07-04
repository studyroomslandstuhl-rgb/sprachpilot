if(typeof TIMES_HOEREN!=='undefined'){
TIMES_HOEREN.push(
T('h0320','3:20',3,20,['drei Uhr zwanzig'],['zwanzig nach drei','zehn vor halb vier'],{dialog:[{v:'f',t:'Wie spät ist es?'},{v:'m',t:'Es ist zwanzig nach drei.'},{v:'f',t:'Danke.'}]}),
T('h0825','8:25',8,25,['acht Uhr fünfundzwanzig'],['fünfundzwanzig nach acht','fünf vor halb neun'],{dialog:[{v:'m',t:'Wann fährt der Bus?'},{v:'f',t:'Um halb neun.'},{v:'m',t:'Dann ist es jetzt fünf vor halb neun.'}]}),
T('h0935','9:35',9,35,['neun Uhr fünfunddreißig'],['fünf nach halb zehn','fünfundzwanzig vor zehn'],{dialog:[{v:'f',t:'Wie viel Uhr ist es?'},{v:'m',t:'Es ist fünf nach halb zehn.'},{v:'f',t:'Gut, danke.'}]}),
T('h1640','16:40',16,40,['sechzehn Uhr vierzig','vier Uhr vierzig'],['zehn nach halb fünf','zwanzig vor fünf'],{dialog:[{v:'m',t:'Wie spät ist es jetzt?'},{v:'f',t:'Es ist zwanzig vor fünf.'},{v:'m',t:'Dann gehen wir gleich.'}]}),
T('h0710','7:10',7,10,['sieben Uhr zehn'],['zehn nach sieben'],{dialog:[{v:'f',t:'Ist es schon halb acht?'},{v:'m',t:'Nein, es ist zehn nach sieben.'},{v:'f',t:'Okay.'}]}),
T('h1245','12:45',12,45,['zwölf Uhr fünfundvierzig'],['Viertel vor eins','fünfzehn vor eins'],{dialog:[{v:'m',t:'Wie spät ist es?'},{v:'f',t:'Es ist Viertel vor eins.'},{v:'m',t:'Danke.'}]}),
T('h1350','13:50',13,50,['dreizehn Uhr fünfzig','ein Uhr fünfzig'],['zehn vor zwei'],{dialog:[{v:'f',t:'Wann beginnt der Termin?'},{v:'m',t:'Um zwei Uhr.'},{v:'f',t:'Es ist schon zehn vor zwei.'}]}),
T('h1805','18:05',18,5,['achtzehn Uhr fünf','sechs Uhr fünf'],['fünf nach sechs'],{dialog:[{v:'m',t:'Wie viel Uhr ist es?'},{v:'f',t:'Es ist fünf nach sechs.'},{v:'m',t:'Danke.'}]}),
T('h1020','10:20',10,20,['zehn Uhr zwanzig'],['zwanzig nach zehn','zehn vor halb elf'],{dialog:[{v:'f',t:'Wie spät ist es jetzt?'},{v:'m',t:'Es ist zehn vor halb elf.'},{v:'f',t:'Dann haben wir Zeit.'}]}),
T('h1125','11:25',11,25,['elf Uhr fünfundzwanzig'],['fünfundzwanzig nach elf','fünf vor halb zwölf'],{dialog:[{v:'m',t:'Wie spät ist es?'},{v:'f',t:'Es ist fünf vor halb zwölf.'},{v:'m',t:'Gut.'}]}),
T('h1435','14:35',14,35,['vierzehn Uhr fünfunddreißig','zwei Uhr fünfunddreißig'],['fünf nach halb drei','fünfundzwanzig vor drei'],{dialog:[{v:'f',t:'Wann kommt Anna?'},{v:'m',t:'Um drei Uhr.'},{v:'f',t:'Es ist fünf nach halb drei.'}]}),
T('h1940','19:40',19,40,['neunzehn Uhr vierzig','sieben Uhr vierzig'],['zehn nach halb acht','zwanzig vor acht'],{dialog:[{v:'m',t:'Wie viel Uhr ist es?'},{v:'f',t:'Es ist zehn nach halb acht.'},{v:'m',t:'Danke.'}]}),
T('h0956','9:56',9,56,['neun Uhr sechsundfünfzig'],['kurz vor zehn','gleich zehn'],{tolerance:[{h:9,m:56},{h:9,m:57},{h:9,m:58},{h:9,m:59}],dialog:[{v:'f',t:'Wie spät ist es?'},{v:'m',t:'Es ist gleich zehn.'},{v:'f',t:'Oh, danke!'}]}),
T('h1500','15:00',15,0,['fünfzehn Uhr'],['drei Uhr'],{dialog:[{v:'m',t:'Wann beginnt der Kurs?'},{v:'f',t:'Um drei Uhr.'},{v:'m',t:'Jetzt ist es drei Uhr.'}]})
);
}
if(typeof TIMES_SPRECHEN!=='undefined'){
TIMES_SPRECHEN.push(
T('p0320','3:20',3,20,['drei Uhr zwanzig'],['zwanzig nach drei','zehn vor halb vier']),
T('p0425','4:25',4,25,['vier Uhr fünfundzwanzig'],['fünfundzwanzig nach vier','fünf vor halb fünf']),
T('p0935','9:35',9,35,['neun Uhr fünfunddreißig'],['fünf nach halb zehn','fünfundzwanzig vor zehn']),
T('p1140','11:40',11,40,['elf Uhr vierzig'],['zehn nach halb zwölf','zwanzig vor zwölf']),
T('p0720','7:20',7,20,['sieben Uhr zwanzig'],['zwanzig nach sieben','zehn vor halb acht']),
T('p1225b','12:25',12,25,['zwölf Uhr fünfundzwanzig'],['fünfundzwanzig nach zwölf','fünf vor halb eins']),
T('p1335','13:35',13,35,['dreizehn Uhr fünfunddreißig','ein Uhr fünfunddreißig'],['fünf nach halb zwei','fünfundzwanzig vor zwei']),
T('p1540','15:40',15,40,['fünfzehn Uhr vierzig','drei Uhr vierzig'],['zehn nach halb vier','zwanzig vor vier']),
T('p0645','6:45',6,45,['sechs Uhr fünfundvierzig'],['Viertel vor sieben','fünfzehn vor sieben']),
T('p2115','21:15',21,15,['einundzwanzig Uhr fünfzehn','neun Uhr fünfzehn'],['Viertel nach neun','fünfzehn nach neun']),
T('p0956','9:56',9,56,['neun Uhr sechsundfünfzig'],['kurz vor zehn','gleich zehn'],{tolerance:[{h:9,m:56},{h:9,m:57},{h:9,m:58},{h:9,m:59}]}),
T('p0000','0:00',0,0,['null Uhr','vierundzwanzig Uhr'],['zwölf Uhr'])
);
}