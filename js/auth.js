import {
  db, doc, getDoc, setDoc, updateDoc, serverTimestamp,
  collection, query, where, getDocs, limit
} from "./firebase.js";

export function $(id){return document.getElementById(id)}

export function safeText(s){
  return String(s||"")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

export function normText(s){return String(s||"").trim().toLowerCase()}

export function normId(s){
  return String(s||"")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-|-$/g,"");
}

export function makeStudentId(email,course){
  return normId(course)+"_"+normId(email);
}

export function languageCode(lang){
  const raw=String(lang||"").trim();
  const n=raw.toLowerCase();
  const map={
    "albanisch":"sq","amharisch":"am","arabisch":"ar","armenisch":"hy","aserbaidschanisch":"az",
    "bengalisch":"bn","bosnisch":"bs","bulgarisch":"bg","chinesisch":"zh","dari":"fa",
    "deutsch":"de","englisch":"en","farsi/persisch":"fa","persisch":"fa","französisch":"fr","franzoesisch":"fr",
    "georgisch":"ka","griechisch":"el","hindi":"hi","italienisch":"it","japanisch":"ja","kasachisch":"kk",
    "kroatisch":"hr","kurdisch":"ku","paschtu":"ps","polnisch":"pl","portugiesisch":"pt","rumänisch":"ro","rumaenisch":"ro",
    "russisch":"ru","serbisch":"sr","somali":"so","spanisch":"es","tamil":"ta","thai":"th","tigrinya":"ti",
    "tschechisch":"cs","türkisch":"tr","tuerkisch":"tr","ukrainisch":"uk","ungarisch":"hu","urdu":"ur","usbekisch":"uz","vietnamesisch":"vi"
  };
  if(map[n]) return map[n];
  if(/^[a-z]{2}$/.test(n)) return n;
  return raw || "en";
}

export function getActiveProfile(){
  try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}
  catch(e){return null}
}

export async function loadCourse(courseCode){
  const raw=String(courseCode||"").trim();
  const variants=[...new Set([raw,raw.toLowerCase(),raw.toUpperCase()].filter(Boolean))];

  for(const c of variants){
    const snap=await getDoc(doc(db,"courses",c));
    if(snap.exists()) return {id:c,data:snap.data()};
  }
  return null;
}

export function makeProfile(st,courseData,docId=null){
  return {
    userId:st.studentId || docId,
    studentId:st.studentId || docId,
    docId:docId || st.docId || st.studentId,
    vorname:st.vorname || "",
    nachname:st.nachname || "",
    email:st.email || "",
    kurs:st.kurs || st.kursnummer || "",
    kursnummer:st.kurs || st.kursnummer || "",
    muttersprache:st.muttersprache || "Englisch",
    motherLanguageCode:languageCode(st.muttersprache || "Englisch"),
    profilVollstaendig:st.profilVollstaendig || false,
    assignments:courseData || {},
    firebase:true,
    keepLoggedIn:true,
    fragenFortschritt:st.fragenFortschritt || 0,
    verbenFortschritt:st.verbenFortschritt || 0,
    wortschatzFortschritt:st.wortschatzFortschritt || 0,
    grammatikFortschritt:st.grammatikFortschritt || 0
  };
}

export function saveActiveProfile(st,courseData,docId=null){
  const p=makeProfile(st,courseData,docId);
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));
  localStorage.setItem("SP_KEEP_LOGGED_IN","1");
  localStorage.setItem("SP_STUDENT_ID",p.studentId || p.docId);
  // Wichtig für alle Wortschatz-Module:
  // motherLanguage ist der Sprachcode für tr.ar/tr.ru/tr.en usw.
  // muttersprache bleibt der sichtbare Name.
  localStorage.setItem("motherLanguage",p.motherLanguageCode);
  localStorage.setItem("muttersprache",p.muttersprache);
  localStorage.setItem("SP_MOTHER_LANGUAGE_CODE",p.motherLanguageCode);
  return p;
}

export function logout(){
  localStorage.removeItem("SP_USER_PROFILE");
  localStorage.removeItem("SP_KEEP_LOGGED_IN");
  localStorage.removeItem("SP_STUDENT_ID");
  localStorage.removeItem("motherLanguage");
  localStorage.removeItem("muttersprache");
  localStorage.removeItem("SP_MOTHER_LANGUAGE_CODE");
  location.href="/index.html";
}

export async function findStudentByEmailAndCourse(email,courseInput){
  const emailNorm=normText(email);
  const courseRaw=String(courseInput||"").trim();
  const variants=[...new Set([courseRaw,courseRaw.toLowerCase(),courseRaw.toUpperCase()].filter(Boolean))];

  // 1) Neue Dokument-ID
  for(const course of variants){
    const id=makeStudentId(emailNorm,course);
    const direct=await getDoc(doc(db,"students",id));
    if(direct.exists()) return {id:direct.id,data:direct.data()};
  }

  // 2) Feldsuche email + kurs
  for(const course of variants){
    try{
      const q1=query(collection(db,"students"),where("email","==",emailNorm),where("kurs","==",course),limit(1));
      const snap=await getDocs(q1);
      if(!snap.empty){const d=snap.docs[0];return {id:d.id,data:d.data()};}
    }catch(e){
      console.warn("email+kurs query failed, trying fallback", e);
    }
  }

  // 3) Alte Dokumente/Fallback: kurs-Query + E-Mail normalisieren
  for(const course of variants){
    try{
      const q2=query(collection(db,"students"),where("kurs","==",course),limit(100));
      const snap=await getDocs(q2);
      const match=snap.docs.find(d=>normText(d.data().email)===emailNorm);
      if(match) return {id:match.id,data:match.data()};
    }catch(e){
      console.warn("kurs query failed", e);
    }
  }

  // 4) Letzter Fallback für alte Dokumente mit Kurs im Dokumentnamen: kleine Listen sind okay.
  try{
    const snap=await getDocs(query(collection(db,"students"),limit(300)));
    const match=snap.docs.find(d=>{
      const data=d.data();
      return normText(data.email)===emailNorm && variants.includes(String(data.kurs||data.kursnummer||"").trim());
    });
    if(match) return {id:match.id,data:match.data()};
  }catch(e){
    console.warn("full fallback failed", e);
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
  const st={
    studentId,
    userId:studentId,
    vorname:String(vorname||"").trim(),
    nachname:String(nachname||"").trim(),
    email:emailNorm,
    muttersprache,
    kurs:courseLoaded.id,
    profilVollstaendig:false,
    active:true,
    fragenFortschritt:0,
    verbenFortschritt:0,
    wortschatzFortschritt:0,
    createdAt:serverTimestamp(),
    lastLogin:serverTimestamp()
  };

  await setDoc(doc(db,"students",studentId),st);

  await setDoc(doc(db,"progress",studentId),{
    studentId,
    kurs:courseLoaded.id,
    fragen:{progress:0,state:{}},
    verben:{progress:0,stars:0,state:{}},
    wortschatz:{progress:0,state:{}},
    grammatik:{progress:0,state:{}},
    updatedAt:serverTimestamp()
  });

  return saveActiveProfile(st,courseLoaded.data,studentId);
}

export async function loginStudent(email,kurs){
  const emailNorm=normText(email);

  // Erst Schüler suchen. So funktioniert Login auch bei alten Kurs-Dokumenten,
  // wenn der Kurscode als Feld im Schülerprofil steht.
  const found=await findStudentByEmailAndCourse(emailNorm,kurs);
  if(!found) throw new Error("STUDENT_NOT_FOUND");

  const st=found.data;
  const courseLoaded=await loadCourse(st.kurs || kurs);

  await updateDoc(doc(db,"students",found.id),{lastLogin:serverTimestamp()});

  return saveActiveProfile(st,courseLoaded?.data || {},found.id);
}

export async function refreshActiveProfile(){
  const p=getActiveProfile();
  if(!p) return null;

  const docId=p.docId || p.studentId;
  if(!docId) return p;

  try{
    const snap=await getDoc(doc(db,"students",docId));
    if(!snap.exists()) return p;

    const st=snap.data();
    const courseLoaded=await loadCourse(st.kurs || p.kurs);
    return saveActiveProfile(st,courseLoaded?.data || p.assignments || {}, snap.id);
  }catch(e){
    console.warn("refreshActiveProfile failed", e);
    return p;
  }
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

  const fresh={...p,...updateData,email:emailNorm,motherLanguageCode:languageCode(updateData.muttersprache)};
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify(fresh));
  localStorage.setItem("motherLanguage",fresh.motherLanguageCode);
  localStorage.setItem("muttersprache",fresh.muttersprache);
  localStorage.setItem("SP_MOTHER_LANGUAGE_CODE",fresh.motherLanguageCode);

  return fresh;
}

export function requireLogin(){
  const p=getActiveProfile();
  if(!p){
    const target=location.pathname + location.search + location.hash;
    location.href="/login/?redirect="+encodeURIComponent(target);
    return null;
  }
  // Profil im Hintergrund aktualisieren, damit Änderungen aus Firebase (z.B. Arabisch) ankommen.
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

  el.innerHTML=`<span class="who">${safeText(p.vorname||"")} ${safeText(p.nachname||"")} · ${safeText(p.kurs||"")}</span><a href="/dashboard/">Dashboard</a><button onclick="logout()">Abmelden</button>`;
}
