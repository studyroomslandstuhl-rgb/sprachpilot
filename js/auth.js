import { db, doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs, limit } from "./firebase.js";
export function $(id){return document.getElementById(id)}
export function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
export function normText(s){return String(s||"").trim().toLowerCase()}
export function normId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
export function makeStudentId(email,course){return normId(course)+"_"+normId(email)}
export function getActiveProfile(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){return null}}
export async function loadCourse(courseCode){
 const raw=String(courseCode||"").trim();
 for(const c of [...new Set([raw,raw.toLowerCase(),raw.toUpperCase()].filter(Boolean))]){
   const snap=await getDoc(doc(db,"courses",c));
   if(snap.exists()) return {id:c,data:snap.data()};
 }
 return null;
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
export function logout(){localStorage.removeItem("SP_USER_PROFILE");localStorage.removeItem("SP_KEEP_LOGGED_IN");localStorage.removeItem("SP_STUDENT_ID");location.href="/index.html"}

export async function findStudentByEmailAndCourse(email,courseInput){
  const emailNorm=normText(email);
  const courseRaw=String(courseInput||"").trim();
  const courseNorm=courseRaw.toLowerCase();

  // 1) Direkte Dokument-ID-Varianten prüfen
  const possibleIds=[
    makeStudentId(emailNorm,courseRaw),
    makeStudentId(emailNorm,courseNorm),
    makeStudentId(emailNorm,courseRaw.toUpperCase())
  ];

  for(const id of [...new Set(possibleIds)]){
    try{
      const direct=await getDoc(doc(db,"students",id));
      if(direct.exists()) return {id:direct.id,data:direct.data()};
    }catch(e){
      console.warn("direct student lookup failed", e);
    }
  }

  // 2) Robuste Feldsuche mit mehreren Kurs-Feldnamen
  const courseVariants=[...new Set([
    courseRaw,
    courseNorm,
    courseRaw.toUpperCase()
  ].filter(Boolean))];

  const courseFields=["kurs","courseCode","kursnummer"];

  for(const field of courseFields){
    for(const course of courseVariants){
      try{
        const q1=query(
          collection(db,"students"),
          where("email","==",emailNorm),
          where(field,"==",course),
          limit(5)
        );
        const snap=await getDocs(q1);
        if(!snap.empty){
          const d=snap.docs[0];
          return {id:d.id,data:d.data()};
        }
      }catch(e){
        console.warn("student field query failed", field, e);
      }
    }
  }

  // 3) Fallback: E-Mail suchen und Kurs lokal vergleichen
  try{
    const q2=query(collection(db,"students"),where("email","==",emailNorm),limit(50));
    const snap=await getDocs(q2);
    const match=snap.docs.find(d=>{
      const data=d.data();
      const k=String(data.kurs||data.courseCode||data.kursnummer||"").trim().toLowerCase();
      return k===courseNorm;
    });
    if(match) return {id:match.id,data:match.data()};
  }catch(e){
    console.warn("student email fallback failed", e);
  }

  // 4) Letzter Fallback für alte Daten: kleine Liste lesen und normalisiert vergleichen
  try{
    const snap=await getDocs(query(collection(db,"students"),limit(500)));
    const match=snap.docs.find(d=>{
      const data=d.data();
      const e=normText(data.email);
      const k=String(data.kurs||data.courseCode||data.kursnummer||"").trim().toLowerCase();
      return e===emailNorm && k===courseNorm;
    });
    if(match) return {id:match.id,data:match.data()};
  }catch(e){
    console.warn("student full fallback failed", e);
  }

  return null;
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
  const courseRaw=String(kurs||"").trim();

  const found=await findStudentByEmailAndCourse(emailNorm,courseRaw);
  if(!found) throw new Error("STUDENT_NOT_FOUND");

  const st=found.data;
  const realCourse=st.kurs || st.courseCode || st.kursnummer || courseRaw;

  let courseData={};
  try{
    const courseLoaded=await loadCourse(realCourse);
    courseData=courseLoaded?.data || {};
  }catch(e){
    console.warn("course load skipped", e);
  }

  try{
    await updateDoc(doc(db,"students",found.id),{
      lastLogin:serverTimestamp()
    });
  }catch(e){
    console.warn("lastLogin update failed", e);
  }

  const normalizedStudent={
    ...st,
    studentId:st.studentId || found.id,
    userId:st.userId || st.studentId || found.id,
    email:emailNorm,
    kurs:realCourse
  };

  return saveActiveProfile(normalizedStudent,courseData,found.id);
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
    el.innerHTML=`
      <div class="who">
        Nicht eingeloggt
      </div>

      <div class="account-links">
        <a href="${loginUrlForCurrent()}">🔑 Login</a>
        <a href="/register/?redirect=${encodeURIComponent(location.pathname+location.search+location.hash)}">📝 Registrieren</a>
      </div>
    `;
    return;
  }

  el.innerHTML=`
    <div class="who">
      ${safeText(p.vorname||"")} ${safeText(p.nachname||"")} · ${safeText(p.kurs||"")}
    </div>

    <div class="account-links">
      <a href="/dashboard/">📊 Dashboard</a>
      <a href="/profile/">👤 Profil</a>
      <button onclick="logout()">Abmelden</button>
    </div>
  `;
}  const el=document.getElementById(rootId);
  if(!el) return;
  const p=getActiveProfile();
  if(!p){
    el.innerHTML=`<span class="who">Nicht eingeloggt</span><a href="${loginUrlForCurrent()}">Login</a><a href="/register/?redirect=${encodeURIComponent(location.pathname+location.search+location.hash)}">Registrieren</a>`;
    return;
  }
  el.innerHTML=`<span class="who">${safeText(p.vorname||"")} ${safeText(p.nachname||"")} · ${safeText(p.kurs||"")}</span><a href="/dashboard/">Dashboard</a><a href="/profile/">Profil</a><button onclick="logout()">Abmelden</button>`;
}
