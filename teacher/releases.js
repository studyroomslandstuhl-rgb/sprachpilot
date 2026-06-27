const RELEASE_CATALOG = {
  modules:["Fragen A1","Wortschatz","Verben A1"],
  lessons:["A1-Lektion-4"],
  themes:{
    "A1-Lektion-4":{
      "Thema-1":{title:"Thema 1 · Räume",sets:{}},
      "Thema-2":{title:"Thema 2 · Zimmer & Möbel",sets:{"buch":"Wortschatz aus dem Buch","extra":"Wortschatz nicht aus dem Buch"}},
      "Thema-3":{title:"Thema 3 · Farben & Adjektive",sets:{}},
      "Thema-4":{title:"Thema 4 · Wohnungsanzeigen",sets:{}}
    }
  }
};

const ReleaseDraft = {
  courseName:null,
  data:null,
  clone(x){return JSON.parse(JSON.stringify(x||{}))},
  open(course){
    this.courseName=course.id||course.name;
    this.data=this.clone({
      enabledModules:course.enabledModules||{},
      enabledLessons:course.enabledLessons||{},
      enabledTasks:course.enabledTasks||{},
      enabledWords:course.enabledWords||{},
      enabledSets:course.enabledSets||{},
      releases:course.releases||{}
    });
  },
  set(path,value){
    let cur=this.data;
    for(let i=0;i<path.length-1;i++){cur[path[i]]=cur[path[i]]||{};cur=cur[path[i]]}
    cur[path[path.length-1]]=value;
  },
  get(path,fallback=false){
    let cur=this.data;
    for(const p of path){if(!cur||!(p in cur))return fallback;cur=cur[p]}
    return cur;
  },
  checkbox(path){return this.get(path,false)?"checked":""},
  async save(){
    if(!this.courseName||!this.data)return alert("Keine Freigabe ausgewählt.");
    await Courses.update(this.courseName,this.data);
    alert("Freigabe gespeichert.");
    TeacherApp.render();
  }
};

function releaseCheck(label,path){
  const id="rel_"+path.join("_").replace(/[^a-z0-9_]/gi,"_");
  return `<label class="check-row"><input id="${id}" type="checkbox" ${ReleaseDraft.checkbox(path)} onchange='ReleaseDraft.set(${JSON.stringify(path)},this.checked)'><span>${label}</span></label>`;
}

function renderReleaseEditor(course){
  ReleaseDraft.open(course);
  const name=course.id||course.name;
  let html=`<div class="release-toolbar"><h3>Freigabe ${name}</h3><div><button onclick="TeacherApp.render()">Aktualisieren</button><button class="save-btn" onclick="ReleaseDraft.save()">Speichern</button></div></div>`;
  html+=`<details class="release-section" open><summary>Module</summary>${RELEASE_CATALOG.modules.map(m=>releaseCheck(m,["enabledModules",m])).join("")}</details>`;
  html+=`<details class="release-section" open><summary>Lektionen und Themen</summary>`;
  for(const lesson of RELEASE_CATALOG.lessons){
    html+=`<details class="release-sub" open><summary>${lesson}</summary>${releaseCheck(lesson,["enabledLessons",lesson])}`;
    const themes=RELEASE_CATALOG.themes[lesson]||{};
    for(const [themeKey,theme] of Object.entries(themes)){
      html+=`<details class="release-sub" open><summary>${theme.title}</summary>${releaseCheck(theme.title,["enabledThemes",`${lesson}/${themeKey}`])}`;
      const sets=theme.sets||{};
      if(Object.keys(sets).length){
        html+=`<div class="small">Wortschatz-Sets</div>`;
        for(const [setKey,setTitle] of Object.entries(sets)){
          html+=releaseCheck(setTitle,["enabledSets",`${lesson}/${themeKey}/${setKey}`]);
        }
      }
      html+=`</details>`;
    }
    html+=`</details>`;
  }
  html+=`</details>`;
  html+=`<details class="release-section" open><summary>Aufgaben</summary>${(typeof DEFAULT_TASKS!=="undefined"?DEFAULT_TASKS:[]).map(t=>releaseCheck(t,["enabledTasks",t])).join("")||"<div class='empty'>Keine Aufgabenliste gefunden.</div>"}</details>`;
  html+=`<details class="release-section" open><summary>Wörter / Verben</summary>${(typeof VERB_WORDS!=="undefined"?VERB_WORDS:[]).map(w=>releaseCheck(w,["enabledWords",w])).join("")||"<div class='empty'>Keine VERB_WORDS gefunden.</div>"}</details>`;
  return html;
}
