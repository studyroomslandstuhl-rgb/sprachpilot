(function(){
'use strict';
const task=window.L6T4_DATA?.tasks?.find(item=>item.id==='gaps');
if(!task)return;
const D=(speaker,text,side='left')=>({speaker,text,side});
const rows=[
 ['Anna','Sag mal, Daniel, was ist dein Hobby?','Daniel','Mein Hobby ist Schwimmen.','Anna','Wie oft gehst du schwimmen?','Daniel','Jeden Dienstag und Freitag.','Sag mal',['Sag mal','Guck mal','Leider','Stimmt']],
 ['Mara','Ich spiele gern Tennis.','Tim','Stimmt, ich auch.','Mara','Spielst du oft?','Tim','Ja, jeden Samstag.','Stimmt',['Stimmt','Moment mal','Leider','Ich weiß es nicht']],
 ['Sofia','Kommst du nächsten Samstag zum Grillen?','Paul','Vielleicht, ich habe noch keinen Plan.','Sofia','Sag mir bitte morgen Bescheid.','Paul','Ja, das mache ich.','Vielleicht',['Vielleicht','Ganz sicher','Immer','Stimmt']],
 ['Lea','Ich habe den Würfel vergessen.','Omar','Kein Problem, wir haben noch einen.','Lea','Super, dann können wir spielen.','Omar','Na klar, du würfelst zuerst.','Kein Problem',['Kein Problem','Oh, wie dumm!','Leider','Nie']],
 ['Nina','Guck mal, da ist dein Buch.','Jonas','Danke! Ich habe es überall gesucht.','Nina','Es lag unter dem Tisch.','Jonas','Das habe ich nicht gesehen.','Guck mal',['Guck mal','Sag mal','Moment mal','Vielleicht']],
 ['Anna','Wann beginnt der Film?','Daniel','Ich weiß es nicht.','Anna','Kannst du kurz im Internet gucken?','Daniel','Ja, Moment mal.','Ich weiß es nicht.',['Ich weiß es nicht.','Na klar.','Stimmt.','Auf jeden Fall.']],
 ['Mara','Der Bus ist schon weg.','Tim','Oh, wie dumm!','Mara','Der nächste Bus kommt erst in einer Stunde.','Tim','Dann trinken wir noch einen Kaffee.','Oh, wie dumm!',['Oh, wie dumm!','Na klar.','Kein Problem.','Guck mal.']],
 ['Sofia','Kommst du mit ins Schwimmbad?','Paul','Na klar!','Sofia','Treffen wir uns um zehn Uhr?','Paul','Ja, ich bin pünktlich da.','Na klar',['Na klar','Leider','Vielleicht','Moment mal']],
 ['Lea','Ich komme heute etwas später.','Omar','Kein Problem.','Lea','Wartest du vor dem Kino?','Omar','Ja, ich bin schon dort.','Kein Problem.',['Kein Problem.','Auf keinen Fall.','Nie.','Oh, wie dumm!']],
 ['Nina','Der neue Film ist toll.','Jonas','Stimmt. Das finde ich auch.','Nina','Besonders die Musik ist schön.','Jonas','Ja, sie gefällt mir sehr.','Stimmt.',['Stimmt.','Leider.','Moment mal.','Vielleicht.']],
 ['Anna','Ich glaube, Tim kommt um acht.','Daniel','Moment mal, er hat mir sieben Uhr geschrieben.','Anna','Dann müssen wir uns beeilen.','Daniel','Ja, wir fahren gleich los.','Moment mal',['Moment mal','Na klar','Ganz sicher','Kein Problem']],
 ['Mara','Kommst du nächste Woche mit?','Tim','Leider nicht. Ich bin dann im Urlaub.','Mara','Schade. Vielleicht beim nächsten Mal.','Tim','Ja, sehr gern.','Leider nicht.',['Leider nicht.','Na klar.','Stimmt.','Guck mal.']],
 ['Sofia','Ist das dein Lieblingsfilm?','Paul','Ja, genau. Ich mag besonders Krimis.','Sofia','Ich sehe lieber Komödien.','Paul','Die finde ich manchmal auch gut.','Ja, genau.',['Ja, genau.','Oh, wie dumm!','Moment mal.','Vielleicht nicht.']],
 ['Lea','Wann kommt der Bus?','Omar','Ich weiß es nicht, vielleicht in fünf Minuten.','Lea','Dann warten wir hier.','Omar','Ja, er kommt bestimmt gleich.','Ich weiß es nicht.',['Ich weiß es nicht.','Auf jeden Fall.','Na klar.','Stimmt.']],
 ['Nina','Spielst du nicht gern Gitarre?','Jonas','Doch, sehr gern.','Nina','Warum spielst du dann so selten?','Jonas','Leider habe ich wenig Freizeit.','Doch',['Doch','Nein','Leider','Vielleicht']]
];
task.items=rows.map(row=>({kind:'choice',prompt:'Welche Ergänzung passt?',answer:row[8],options:row[9],hint:'Achte auf die Situation und die Reaktion.',dialog:[D(row[0],row[1]),D(row[2],row[3],'right'),D(row[4],row[5]),D(row[6],row[7],'right')]}));
})();