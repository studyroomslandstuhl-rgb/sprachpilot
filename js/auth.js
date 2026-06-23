import { db, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, limit } from "./firebase.js";
export function $(id){return document.getElementById(id)}
export function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
export function normText(s){return String(s||"").trim().toLowerCase()}
export function normId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
export function makeStudentId(email,course){return normId(course)+"_"+normId(email)}
export function getActiveProfile(){
  if(localStorage.getItem("SP_TEACHER_MODE")==="1"){
    return {
      role:"teacher",
      teacherMode:true,
      vorname:"Lehrer",
      nachname:"",
      email:localStorage.getItem("SP_TEACHER_EMAIL")||"",
      kurs:"Lehrer-Modus",
      muttersprache:"Deutsch",
      motherLanguageCode:"de",
      assignments:{teacherMode:true}
    };
  }
  try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}
  catch(e){return null}
}
export function makeProfile(st,courseData,docId=null){
  return {
    userId:st.studentId,
    studentId:st.studentId,
    docId:docId || st.docId || st.studentId,
    vorname:st.vorname,
    nachname:st.nachname,
    email:st.email,
    kurs:st.kurs,
    kursnummer:st.kurs,
    muttersprache:st.muttersprache||"Englisch",
    profilVollstaendig:st.profilVollstaendig||false,
    assignments:courseData||{},
    firebase:true,
    keepLoggedIn:true
  }
}
export function saveActiveProfile(st,courseData,docId=null){
  const p=makeProfile(st,courseData,docId);
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));
  localStorage.setItem("SP_KEEP_LOGGED_IN","1");
  localStorage.setItem("SP_STUDENT_ID",p.studentId);
  localStorage.setItem("motherLanguage",p.muttersprache);
  localStorage.setItem("muttersprache",p.muttersprache);
  return p
}
export function logout(){
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  localStorage.removeItem("SP_STUDENT_ID");
  localStorage.removeItem("motherLanguage");
  localStorage.removeItem("muttersprache");
  localStorage.removeItem("SP_MOTHER_LANGUAGE_CODE");
  localStorage.removeItem("SP_TEACHER_MODE");
  localStorage.removeItem("SP_USER_ROLE");
  localStorage.removeItem("SP_TEACHER_EMAIL");
  localStorage.removeItem("SP_TEACHER_ID");
  location.href="/index.html";
}

export async function registerStudent({vorname,nachname,email,muttersprache,kurs}){
 const emailNorm=normText(email);
 const courseLoaded=await loadCourse(kurs);
 if(!courseLoaded) throw new Error("COURSE_NOT_FOUND");
 const existing=await findStudentByEmailAndCourse(emailNorm,courseLoaded.id);
 if(existing) throw new Error("STUDENT_EXISTS");
 const studentId=makeStudentId(emailNorm,courseLoaded.id);
 const st={studentId,userId:studentId,vorname,nachname,email:emailNorm,muttersprache,kurs:courseLoaded.id,profilVollstaendig:false,active:true,fragenFortschritt:0,verbenFortschritt:0,wortschatzFortschritt:0,createdAt:serverTimestamp(),lastLogin:serverTimestamp()};
 await setDoc(doc(db,"students",studentId),st);
 await setDoc(doc(db,"progress",studentId),{studentId,kurs:courseLoaded.id,fragen:{progress:0,state:{}},verben:{progress:0,stars:0,state:{}},wortschatz:{progress:0,state:{}},grammatik:{progress:0,state:{}},updatedAt:serverTimestamp()});
 return saveActiveProfile(st,courseLoaded.data,studentId);
}

export async function loginStudent(email,kurs){
 const emailNorm=normText(email);
 const courseLoaded=await loadCourse(kurs);
 if(!courseLoaded) throw new Error("COURSE_NOT_FOUND");
 const found=await findStudentByEmailAndCourse(emailNorm,courseLoaded.id);
 if(!found) throw new Error("STUDENT_NOT_FOUND");
 await updateDoc(doc(db,"students",found.id),{lastLogin:serverTimestamp()});
 return saveActiveProfile(found.data,courseLoaded.data,found.id);
}


export async function updateStudentProfile({vorname,nachname,email,muttersprache}){
  const p=getActiveProfile();
  if(!p) throw new Error("NOT_LOGGED_IN");

  const docId=p.docId || p.studentId;
  const emailNorm=normText(email);

  const updateData={
    vorname:String(vorname||"").trim(),
    nachname:String(nachname||"").trim(),
    email:emailNorm,
    muttersprache:String(muttersprache||"").trim(),
    updatedAt:serverTimestamp()
  };

  if(!updateData.vorname || !updateData.nachname || !updateData.email || !updateData.muttersprache){
    throw new Error("MISSING_FIELDS");
  }

  await updateDoc(doc(db,"students",docId),updateData);

  const newProfile={...p,...updateData,email:emailNorm};
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify(newProfile));
  localStorage.setItem("motherLanguage",updateData.muttersprache);
  localStorage.setItem("muttersprache",updateData.muttersprache);

  return newProfile;
}


export function requireLogin(){
  const p=getActiveProfile();
  if(!p){
    const target=location.pathname + location.search + location.hash;
    location.href="/login/?redirect="+encodeURIComponent(target);
    return null;
  }
  if(p.teacherMode){
    renderAccountStrip();
    return p;
  }
  refreshActiveProfile().then(()=>renderAccountStrip()).catch(()=>{});
  return p;
}

export function loginUrlForCurrent(){
  const target=location.pathname + location.search + location.hash;
  return "/login/?redirect="+encodeURIComponent(target);
}

export function getRedirectTarget(defaultTarget="/index.html"){
  const params=new URLSearchParams(location.search);
  return params.get("redirect") || sessionStorage.getItem("SP_AFTER_LOGIN") || defaultTarget;
}

export function renderAccountStrip(rootId="accountStrip"){
  const el=document.getElementById(rootId);
  if(!el) return;

  const p=getActiveProfile();
  if(!p){
    el.innerHTML=`<span class="who">Nicht eingeloggt</span><a href="${loginUrlForCurrent()}">Anmelden</a>`;
    return;
  }

  if(p.teacherMode){
    el.innerHTML=`<span class="who">Lehrer-Modus · ${safeText(p.email||"")}</span><a href="/teacher/index.html">Teacher Dashboard</a><button onclick="logout()">Abmelden</button>`;
    return;
  }

  el.innerHTML=`<span class="who">${safeText(p.vorname||"")} ${safeText(p.nachname||"")} · ${safeText(p.kurs||"")}</span><a href="/dashboard/">Dashboard</a><button onclick="logout()">Abmelden</button>`;
}
