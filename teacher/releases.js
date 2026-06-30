const RELEASE_CATALOG = {
  modules:[
    {key:"Fragen A1",title:"Fragen A1"},
    {key:"Wortschatz",title:"Wortschatz"},
    {key:"Verben A1",title:"Verben A1"}
  ],
  lessons:[
    {
      key:"A1-Lektion-3",
      title:"A1 Lektion 3",
      themes:[
        {key:"Thema-1",title:"Thema 1 · Lebensmittel & Getränke",sets:[]},
        {key:"Thema-2",title:"Thema 2 · Mengen & Verpackungen",sets:[]},
        {key:"Thema-3",title:"Thema 3 · Einkaufen",sets:[]},
        {key:"Thema-4",title:"Thema 4 · Kochen",sets:[]}
      ]
    },
    {
      key:"A1-Lektion-4",
      title:"A1 Lektion 4",
      themes:[
        {key:"Thema-1",title:"Thema 1 · Räume",sets:[]},
        {key:"Thema-2",title:"Thema 2 · Zimmer & Möbel",sets:[
          {key:"book",aliases:["buch","basis","im-buch"],title:"Wortschatz aus dem Buch"},
          {key:"extra",aliases:["plus","nicht-aus-dem-buch"],title:"Wortschatz nicht aus dem Buch"}
        ]},
        {key:"Thema-3",title:"Thema 3 · Farben & Adjektive",sets:[]},
        {key:"Thema-4",title:"Thema 4 · Wohnungsanzeigen",sets:[]},
        {key:"Thema-5",title:"Thema 5 · Am Telefon",sets:[]}
      ]
    }
  ]
};

const ReleaseDraft = {
  courseName:null,
  courseCode:null,
  data:null,
  clone(x){return JSON.parse(JSON.stringify(x||{}))},
  open(course){
    this.courseName=Courses.docId ? Courses.docId(course) : (course.id||course.name);
    this.courseCode=Courses.code ? Courses.code(course) : (course.courseCode||course.id||course.name);
    this.data=this.clone({
      enabledModules:course.enabledModules||{},
      enabledLessons:course.enabledLessons||{},
      enabledThemes:course.enabledThemes||{},
      enabledTasks:course.enabledTasks||{},
      enabledWords:course.enabledWords||{},
      enabledSets:course.enabledSets||{},
      releases:course.releases||{}
    });
    this.ensureDefaults();
  },
  ensureDefaults(){
    if(!this.data) return;
    this.data.enabledModules=this.data.enabledModules||{};
    this.data.enabledLessons=this.data.enabledLessons||{};
    this.data.enabledThemes=this.data.enabledThemes||{};
    this.data.enabledSets=this.data.enabledSets||{};
    this.data.enabledTasks=this.data.enabledTasks||{};
    this.data.enabledWords=this.data.enabledWords||{};
    this.data.releases=this.data.releases||{};
  },
  set(path,value){
    this.ensureDefaults();
    let cur=this.data;
    for(let i=0;i<path.length-1;i++){cur[path[i]]=cur[path[i]]||{};cur=cur[path[i]]}
    cur[path[path.length-1]]=value;
  },
  setMany(paths,value){paths.forEach(p=>this.set(p,value));},
  get(path,fallback=false){
    let cur=this.data;
    for(const p of path){if(!cur||!(p in cur))return fallback;cur=cur[p]}
    return cur;
  },
  getAny(paths,fallback=false){
    for(const p of paths){
      const v=this.get(p,undefined);
      if(v!==undefined) return v;
    }
    return fallback;
  },
  checkbox(paths){return this.getAny(Array.isArray(paths[0])?paths:[paths],false)?"checked":""},
  setSet(lessonKey,themeKey,setKey,aliases,value){
    const keys=[setKey,...(aliases||[])];
    const paths=[];
    keys.forEach(k=>{
      paths.push(["enabledSets",`${lessonKey}/${themeKey}/${k}`]);
      paths.push(["enabledSets",`wortschatz/${lessonKey}/${themeKey}/${k}`]);
      paths.push(["enabledSets",`${themeKey}/${k}`]);
      paths.push(["enabledSets",k]);
    });
    this.setMany(paths,value);
    this.set(["releases","wortschatz","lessons",lessonKey,"themes",themeKey,"sets",setKey],value);
    this.set(["releases","Wortschatz","lessons",lessonKey,"themes",themeKey,"sets",setKey],value);
  },
  setVerb(verb,value){
    this.setMany(verbReleasePaths(verb),value);
  },
  normalizeBeforeSave(){
    for(const lesson of RELEASE_CATALOG.lessons){
      for(const theme of lesson.themes){
        if(theme.sets && theme.sets.length){
          for(const set of theme.sets){
            const value=this.getAny(setPaths(lesson.key,theme.key,set.key,set.aliases),false);
            this.setSet(lesson.key,theme.key,set.key,set.aliases,value);
          }
        }
      }
    }
    verbList().forEach(v=>{
      const value=this.getAny(verbReleasePaths(v),false);
      this.setVerb(v,value);
    });
    return this.data;
  },
  async save(){
    if(!this.courseName||!this.data)return alert("Keine Freigabe ausgewählt.");
    await Courses.update(this.courseName,this.normalizeBeforeSave());
    alert("Freigabe gespeichert.");
    TeacherApp.render();
  }
};

function setPaths(lessonKey,themeKey,setKey,aliases=[]){
  const keys=[setKey,...aliases];
  const paths=[];
  keys.forEach(k=>{
    paths.push(["enabledSets",`${lessonKey}/${themeKey}/${k}`]);
    paths.push(["enabledSets",`wortschatz/${lessonKey}/${themeKey}/${k}`]);
    paths.push(["enabledSets",`${themeKey}/${k}`]);
    paths.push(["enabledSets",k]);
    paths.push(["releases","wortschatz","lessons",lessonKey,"themes",themeKey,"sets",k]);
    paths.push(["releases","Wortschatz","lessons",lessonKey,"themes",themeKey,"sets",k]);
  });
  return paths;
}

function themeReleasePaths(lessonKey,themeKey){
  const paths=[
    ["enabledThemes",`${lessonKey}/${themeKey}`],
    ["enabledThemes",`wortschatz/${lessonKey}/${themeKey}`],
    ["releases","wortschatz","lessons",lessonKey,"themes",themeKey,"enabled"]
  ];
  if(lessonKey==="A1-Lektion-4") paths.push(["enabledThemes",themeKey]);
  return paths;
}

function themeSetCommand(lessonKey,themeKey){
  return `ReleaseDraft.setMany(${JSON.stringify(themeReleasePaths(lessonKey,themeKey))},this.checked)`;
}

function verbList(){return (typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).map(x=>x.v).filter(Boolean)}
function verbReleasePaths(verb){
  return [
    ["enabledWords",verb],
    ["enabledWords",`verben-A1/${verb}`],
    ["enabledWords",`Verben A1/${verb}`],
    ["releases","verben-A1","words",verb],
    ["releases","Verben A1","words",verb]
  ];
}
function verbSetCommand(verb){return `ReleaseDraft.setVerb(${JSON.stringify(verb)},this.checked)`}
function renderVerbReleaseSection(){
  const verbs=verbList();
  if(!verbs.length)return `<details class="release-section"><summary>Verben A1</summary><div class='empty'>Verbenliste konnte nicht geladen werden.</div></details>`;
  return `<details class="release-section" open><summary>Verben A1 · einzelne Verben freigeben</summary><div class="debug-box small">Häkchen = dieses Verb ist für TN freigeschaltet. Ohne Häkchen bleibt das Verb beim Einschätzen gesperrt.</div><div class="release-grid">${verbs.map(v=>releaseCheck(v,verbReleasePaths(v),verbSetCommand(v))).join("")}</div></details>`;
}

function releaseCheck(label,paths,onchange){
  const flat=(Array.isArray(paths[0])?paths:[paths]);
  const id="rel_"+flat[0].join("_").replace(/[^a-z0-9_]/gi,"_");
  const change=onchange || `ReleaseDraft.set(${JSON.stringify(flat[0])},this.checked)`;
  return `<label class="check-row"><input id="${id}" type="checkbox" ${ReleaseDraft.checkbox(flat)} onchange='${change}'><span>${label}</span></label>`;
}

function renderReleaseEditor(course){
  ReleaseDraft.open(course);
  const name=Courses.displayName ? Courses.displayName(course) : (course.id||course.name||"");
  let html=`<div class="release-toolbar sticky-release"><h3>Freigabe ${TeacherEnv.safe(name)}</h3><div><button onclick="TeacherApp.render()">Aktualisieren</button><button class="save-btn" onclick="ReleaseDraft.save()">Speichern</button></div></div>`;

  html+=`<div class="debug-box small">Du kannst mehrere Häkchen setzen. Es wird erst gespeichert, wenn du oben auf <b>Speichern</b> klickst.</div>`;

  html+=`<details class="release-section" open><summary>Module</summary>`;
  for(const m of RELEASE_CATALOG.modules){
    html+=releaseCheck(m.title,[["enabledModules",m.key],["releases",m.key,"enabled"]],`ReleaseDraft.setMany([["enabledModules","${m.key}"],["releases","${m.key}","enabled"]],this.checked)`);
  }
  html+=`</details>`;

  html+=`<details class="release-section" open><summary>Lektionen und Themen</summary>`;
  for(const lesson of RELEASE_CATALOG.lessons){
    html+=`<details class="release-sub" open><summary>${lesson.title}</summary>`;
    html+=releaseCheck(lesson.title,[["enabledLessons",lesson.key],["enabledLessons",`wortschatz/${lesson.key}`],["releases","wortschatz","lessons",lesson.key,"enabled"]],`ReleaseDraft.setMany([["enabledLessons","${lesson.key}"],["enabledLessons","wortschatz/${lesson.key}"],["releases","wortschatz","lessons","${lesson.key}","enabled"]],this.checked)`);

    for(const theme of lesson.themes){
      html+=`<details class="release-sub" open><summary>${theme.title}</summary>`;
      html+=releaseCheck(theme.title,themeReleasePaths(lesson.key,theme.key),themeSetCommand(lesson.key,theme.key));

      if(theme.sets && theme.sets.length){
        html+=`<div class="release-subtitle">Wortschatz-Sets</div>`;
        for(const set of theme.sets){
          html+=releaseCheck(set.title,setPaths(lesson.key,theme.key,set.key,set.aliases),`ReleaseDraft.setSet("${lesson.key}","${theme.key}","${set.key}",${JSON.stringify(set.aliases||[])},this.checked)`);
        }
      }
      html+=`</details>`;
    }
    html+=`</details>`;
  }
  html+=`</details>`;

  html+=renderVerbReleaseSection();
  html+=`<details class="release-section" open><summary>Aufgaben</summary>${(typeof DEFAULT_TASKS!=="undefined"?DEFAULT_TASKS:[]).map(t=>releaseCheck(t,["enabledTasks",t])).join("")||"<div class='empty'>Keine Aufgabenliste gefunden.</div>"}</details>`;
  return html;
}
