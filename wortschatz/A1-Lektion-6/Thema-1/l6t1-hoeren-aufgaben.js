(function(){
  const AUDIO='https://sprachpilot.b-cdn.net/audio/';
  const TASKS=[
    {
      file:'a1-l6-t1-hoeren-01.mp3',
      transcript:'Guten Morgen. Am Montag ist es in Berlin zuerst bewölkt. Ab neun Uhr scheint die Sonne. Die Temperaturen steigen von acht auf vierzehn Grad. Am Abend sinken sie wieder. Der Wind kommt aus dem Westen.',
      q:'Wie ist das Wetter am Montagvormittag?',
      a:'Sonnig und trocken.',
      opts:['Sonnig und trocken.','Regnerisch und kalt.','Es schneit.']
    },
    {
      file:'a1-l6-t1-hoeren-02.mp3',
      transcript:'Am Dienstag ist es in Hamburg am frühen Morgen noch trocken. Gegen acht Uhr kommen Wolken aus dem Westen. Dann beginnt es zu regnen. Am Abend hört der Regen auf, und die Temperaturen sinken.',
      q:'Wann beginnt es zu regnen?',
      a:'Gegen acht Uhr.',
      opts:['Um sechs Uhr.','Gegen acht Uhr.','Am Abend.']
    },
    {
      file:'a1-l6-t1-hoeren-03.mp3',
      transcript:'Am Mittwoch schneit es in München seit dem Morgen. Der Wind kommt aus dem Norden. Die Temperaturen steigen am Mittag auf null Grad. In Berlin und Köln bleibt es meistens trocken.',
      q:'Wo schneit es am Mittwoch?',
      a:'In München.',
      opts:['In München.','In Berlin.','In Köln.']
    },
    {
      file:'a1-l6-t1-hoeren-04.mp3',
      transcript:'Am Samstag ist der Himmel bewölkt. Die Temperaturen steigen am Mittag auf zehn Grad. Am Sonntag regnet es am Morgen. Am Abend sinken die Temperaturen auf vier Grad.',
      q:'Wann regnet es?',
      a:'Am Sonntagmorgen.',
      opts:['Am Samstagabend.','Am Sonntagmorgen.','Am Sonntagmittag.']
    },
    {
      file:'a1-l6-t1-hoeren-05.mp3',
      transcript:'Heute ist es kühler als gestern. Um sieben Uhr sind es nur sieben Grad. Der Wind kommt aus dem Norden. Am Mittag steigen die Temperaturen auf zehn Grad. Am Abend sinken sie wieder.',
      q:'Wie warm ist es um sieben Uhr?',
      a:'Sieben Grad.',
      opts:['Fünf Grad.','Sieben Grad.','Zehn Grad.']
    },
    {
      file:'a1-l6-t1-hoeren-06.mp3',
      transcript:'Am Freitag ist es am Morgen noch trocken. Gegen zehn Uhr beginnt es zu schneien. Die Straßen können glatt werden. Am Abend sinken die Temperaturen unter null Grad.',
      q:'Warum müssen Autofahrer vorsichtig sein?',
      a:'Die Straßen sind glatt.',
      opts:['Es ist sehr warm.','Die Straßen sind glatt.','Es regnet stark.']
    },
    {
      file:'a1-l6-t1-hoeren-07.mp3',
      transcript:'Am Donnerstag scheint am Morgen die Sonne. Bis zum Mittag steigen die Temperaturen auf siebzehn Grad. Gegen siebzehn Uhr kommt starker Wind aus dem Westen. Am Abend sinken die Temperaturen.',
      q:'Wann kommt starker Wind?',
      a:'Gegen siebzehn Uhr.',
      opts:['Am Morgen.','Gegen siebzehn Uhr.','In der Nacht.']
    },
    {
      file:'a1-l6-t1-hoeren-08.mp3',
      transcript:'Morgen kommen am frühen Morgen Wolken aus dem Westen. Ab neun Uhr regnet es. Die Temperaturen steigen nur auf elf Grad. Am Abend sinken sie auf acht Grad.',
      q:'Wie ist das Wetter morgen?',
      a:'Regnerisch und kühl.',
      opts:['Sonnig und warm.','Regnerisch und kühl.','Schneereich und sehr kalt.']
    },
    {
      file:'a1-l6-t1-hoeren-09.mp3',
      transcript:'Gegen elf Uhr kommen dunkle Wolken aus dem Westen. Jetzt hört man Tropfen am Fenster. Es regnet. Die Temperaturen sinken von vierzehn auf zwölf Grad.',
      q:'Was hört man?',
      a:'Regen.',
      opts:['Regen.','Schnee.','Donner.']
    },
    {
      file:'a1-l6-t1-hoeren-10.mp3',
      transcript:'Am Sonntag ist es am frühen Morgen noch bewölkt. Ab zehn Uhr scheint die Sonne. Der Wind kommt aus dem Süden. Am Nachmittag steigen die Temperaturen auf achtzehn Grad. Am Abend sinken sie wieder.',
      q:'Wie ist das Wetter am Sonntagnachmittag?',
      a:'Sonnig und warm.',
      opts:['Sonnig und warm.','Kalt und regnerisch.','Bewölkt und windig.']
    }
  ];
  window.listenItems=function(){
    return TASKS.map(x=>({
      audio:AUDIO+x.file,
      audioName:x.file,
      transcript:x.transcript,
      q:x.q,
      a:x.a,
      opts:x.opts
    }));
  };
})();