firebase.auth().onAuthStateChanged(async user => {

  if(!user){
    location.href = "login.html";
    return;
  }

  try{

    const teacherDoc = await db
      .collection("teachers")
      .doc(user.uid)
      .get();

    if(!teacherDoc.exists){
      await db.collection("teachers").doc(user.uid).set({
        email:user.email || "",
        role:"teacher",
        active:true,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
    }

    const freshDoc = await db.collection("teachers").doc(user.uid).get();
    const teacher = freshDoc.data();

    if(teacher.role !== "teacher" || teacher.active === false){
      await auth.signOut();
      alert("Lehrerzugang ist nicht aktiv.");
      location.href = "login.html";
      return;
    }

    TeacherApp.render();

  }catch(err){

    console.error(err);
    document.getElementById("app").innerHTML =
      "<div class='card no'>Dashboard konnte nicht geladen werden: "+err.message+"</div>";

  }

});
