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
export function makeProfile(st,courseData){return {userId:st.studentId,studentId:st.studentId,vorname:st.vorname,nachname:st.nachname,email:st.email,kurs:st.kurs,kursnummer:st.kurs,muttersprache:st.muttersprache||"Englisch",profilVollstaendig:st.profilVollstaendig||false,assignments:courseData||{},firebase:true,keepLoggedIn:true}}
export function saveActiveProfile(st,courseData){const p=makeProfile(st,courseData);localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));localStorage.setItem("SP_KEEP_LOGGED_IN","1");localStorage.setItem("SP_STUDENT_ID",p.studentId);return p}
export function logout(){localStorage.removeItem("SP_USER_PROFILE");localStorage.removeItem("SP_KEEP_LOGGED_IN");localStorage.removeItem("SP_STUDENT_ID");location.href="/index.html"}

export async function findStudentByEmailAndCourse(email,courseInput){
 const emailNorm=normText(email);
 const variants=[...new Set([String(courseInput||"").trim(),String(courseInput||"").trim().toLowerCase(),String(courseInput||"").trim().toUpperCase()].filter(Boolean))];
 for(const course of variants){
   const q1=query(collection(db,"students"),where("email","==",emailNorm),where("kurs","==",course),limit(1));
   const snap=await getDocs(q1);
   if(!snap.empty){const d=snap.docs[0];return {id:d.id,data:d.data()};}
 }
 for(const course of variants){
   const q2=query(collection(db,"students"),where("kurs","==",course),limit(80));
   const snap=await getDocs(q2);
   const match=snap.docs.find(d=>normText(d.data().email)===emailNorm);
   if(match) return {id:match.id,data:match.data()};
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
 return saveActiveProfile(st,courseLoaded.data);
}

export async function loginStudent(email,kurs){
 const emailNorm=normText(email);
 const courseLoaded=await loadCourse(kurs);
 if(!courseLoaded) throw new Error("COURSE_NOT_FOUND");
 const found=await findStudentByEmailAndCourse(emailNorm,courseLoaded.id);
 if(!found) throw new Error("STUDENT_NOT_FOUND");
 await updateDoc(doc(db,"students",found.id),{lastLogin:serverTimestamp()});
 return saveActiveProfile(found.data,courseLoaded.data);
}
