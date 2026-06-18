const Courses = {

  async list(){
    if(!db) return [];

    const snap = await db
      .collection("courses")
      .get();

    return snap.docs
      .map(d => ({
        id: d.id,
        ...d.data()
      }))
      .sort((a,b)=>
        String(a.id).localeCompare(String(b.id))
      );
  },

  async create(name){

    name = String(name || "").trim();

    if(!name){
      alert("Bitte Kursnamen eingeben.");
      return;
    }

    if(!db){
      alert("Firebase nicht verbunden.");
      return;
    }

    await db
      .collection("courses")
      .doc(name)
      .set({

        name,

        enabledModules:{
          "Verben A1": true
        },

        enabledLessons:{},

        enabledTasks:{},

        enabledWords:{},

        createdAt:
          firebase.firestore.FieldValue.serverTimestamp(),

        updatedAt:
          firebase.firestore.FieldValue.serverTimestamp()

      }, { merge:true });

    TeacherApp.render();
  },

  async remove(name){

    if(!db) return;

    if(
      !confirm(
        `Kurs ${name} wirklich löschen?`
      )
    ){
      return;
    }

    await db
      .collection("courses")
      .doc(name)
      .delete();

    TeacherApp.render();
  },

  async duplicate(oldName,newName){

    if(!db) return;

    const oldCourse =
      await db
        .collection("courses")
        .doc(oldName)
        .get();

    if(!oldCourse.exists){
      alert("Kurs nicht gefunden.");
      return;
    }

    await db
      .collection("courses")
      .doc(newName)
      .set({

        ...oldCourse.data(),

        name:newName,

        createdAt:
          firebase.firestore.FieldValue.serverTimestamp(),

        updatedAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });

    TeacherApp.render();
  },

  async rename(oldName,newName){

    if(!db) return;

    const oldCourse =
      await db
        .collection("courses")
        .doc(oldName)
        .get();

    if(!oldCourse.exists){
      return;
    }

    await db
      .collection("courses")
      .doc(newName)
      .set({

        ...oldCourse.data(),

        name:newName,

        updatedAt:
          firebase.firestore.FieldValue.serverTimestamp()

      });

    await db
      .collection("courses")
      .doc(oldName)
      .delete();

    TeacherApp.render();
  }

};
