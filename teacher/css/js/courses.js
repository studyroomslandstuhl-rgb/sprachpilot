const Courses = {
  async list(){
    if(!db) return [];
    const snap = await db.collection("courses").get();
    return snap.docs.map(d => ({ id:d.id, ...d.data() })).sort((a,b)=>String(a.id).localeCompare(String(b.id)));
  },
  async create(name){
    name = String(name||"").trim();
    if(!name) return alert("Bitte Kursnamen eingeben, z. B. GLK-68.");
    if(!db) return alert("Firebase ist nicht verbunden.");
    await db.collection("courses").doc(name).set({
      name,
      enabledModules:{ "Verben A1": true },
      enabledLessons:{},
      enabledTasks:{},
      enabledWords:{},
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge:true });
    TeacherApp.render();
  },
  async remove(name){
    if(!db) return;
    if(confirm(`Kurs ${name} wirklich löschen? Schüler-Fortschritte bleiben erhalten.`)){
      await db.collection("courses").doc(name).delete();
      TeacherApp.render();
    }
  }
};
