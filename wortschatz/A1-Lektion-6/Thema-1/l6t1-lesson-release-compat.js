(function(){
  'use strict';

  const lessonPaths=[
    ['enabledLessons','A1-Lektion-6'],
    ['enabledLessons','wortschatz/A1-Lektion-6'],
    ['enabledLessons','Wortschatz/A1-Lektion-6'],
    ['releases','wortschatz','lessons','A1-Lektion-6','enabled'],
    ['releases','Wortschatz','lessons','A1-Lektion-6','enabled']
  ];
  const themePaths=[
    ['enabledThemes','A1-Lektion-6/Thema-1'],
    ['enabledThemes','wortschatz/A1-Lektion-6/Thema-1'],
    ['enabledThemes','Wortschatz/A1-Lektion-6/Thema-1'],
    ['releases','wortschatz','lessons','A1-Lektion-6','themes','Thema-1','enabled'],
    ['releases','Wortschatz','lessons','A1-Lektion-6','themes','Thema-1','enabled']
  ];

  function rawAny(paths){
    let data={};
    try{data=typeof window.l6ReleaseData==='function'?window.l6ReleaseData():{}}catch(e){}
    for(const path of paths){
      let cur=data,found=true;
      for(const part of path){
        if(!cur||typeof cur!=='object'||!(part in cur)){found=false;break}
        cur=cur[part];
      }
      if(found)return {found:true,value:cur===true};
    }
    return {found:false,value:false};
  }

  function install(){
    if(window.__SP_L6T1_LESSON_RELEASE_COMPAT__)return true;
    if(typeof window.bookOn!=='function')return false;
    const previousBookOn=window.bookOn;
    window.bookOn=function(){
      const theme=rawAny(themePaths);
      const lesson=rawAny(lessonPaths);
      // Ältere Freigaben speicherten beim Klick auf die Lektion zwar L6=true,
      // aber noch keine Themenwerte und setzten die Wortlisten gleichzeitig auf false.
      // In genau diesem Altdaten-Fall muss der Basiswortschatz trotzdem zur freigegebenen Lektion gehören.
      if(!theme.found&&lesson.found&&lesson.value===true)return true;
      return previousBookOn();
    };
    window.__SP_L6T1_LESSON_RELEASE_COMPAT__=true;
    return true;
  }

  install();
})();
