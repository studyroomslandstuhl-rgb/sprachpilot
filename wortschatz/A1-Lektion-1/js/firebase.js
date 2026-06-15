const firebaseConfig = {
  apiKey: "AIzaSyDbl0m8JIEu7BuoLwXrdxRL4wMJAVJS468",
  authDomain: "sprachpilot-12c68.firebaseapp.com",
  projectId: "sprachpilot-12c68",
  storageBucket: "sprachpilot-12c68.firebasestorage.app",
  messagingSenderId: "454992284519",
  appId: "1:454992284519:web:c7a87558cf59e0c0fc7dc2",
  measurementId: "G-2XXR3FSY89"
};

export function initFirebase(){
  if(!window.firebase) return null;
  if(!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  return firebase.firestore();
}

export function studentId(profile){
  return profile?.studentId || profile?.userId || null;
}

export async function loadTeacherAssignment(profile){
  const db = initFirebase();
  const courseId = profile?.kurs || profile?.kursnummer || "";
  if(!db || !courseId) return null;

  try{
    const snap = await db.collection("verbAssignments").doc(courseId).get();
    if(snap.exists) return snap.data();
  }catch(e){
    console.warn("Lehrer-Konfiguration konnte nicht geladen werden:", e);
  }
  return null;
}

export async function saveProgress(profile, progress){
  const db = initFirebase();
  const sid = studentId(profile);
  if(!db || !sid) return;

  await db.collection("progress").doc(sid).set({
    studentId:sid,
    kurs:profile.kurs || profile.kursnummer || "",
    verbA1:progress,
    updatedAt:firebase.firestore.FieldValue.serverTimestamp()
  }, {merge:true});

  await db.collection("students").doc(sid).set({
    studentId:sid,
    vorname:profile.vorname || "",
    nachname:profile.nachname || "",
    kurs:profile.kurs || profile.kursnummer || "",
    muttersprache:profile.muttersprache || "",
    verbenFortschritt:progress.overallPercent || 0,
    lastActivity:firebase.firestore.FieldValue.serverTimestamp()
  }, {merge:true});
}

export async function loadProgress(profile){
  const db = initFirebase();
  const sid = studentId(profile);
  if(!db || !sid) return null;
  try{
    const snap = await db.collection("progress").doc(sid).get();
    if(snap.exists) return snap.data()?.verbA1 || null;
  }catch(e){
    console.warn("Fortschritt konnte nicht geladen werden:", e);
  }
  return null;
}
