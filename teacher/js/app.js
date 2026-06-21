firebase.auth().onAuthStateChanged(async user => {
  if(!user){
    location.href = "login.html";
    return;
  }

  try{
    const ref=db.collection("teachers").doc(user.uid);
    let teacherDoc=await ref.get();

    if(!teacherDoc.exists){
      await ref.set({
        email:user.email || "",
        role:"teacher",
        active:true,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
      teacherDoc=await ref.get();
    }

    const teacher=teacherDoc.data();

    if(teacher.role !== "teacher" || teacher.active === false){
      await auth.signOut();
      alert("Lehrerzugang ist nicht aktiv.");
      location.href = "login.html";
      return;
    }

    if(window.TeacherApp && TeacherApp.render){
      TeacherApp.render();
    }else{
      document.getElementById("app").innerHTML="<div class='card no'>TeacherApp konnte nicht geladen werden.</div>";
    }

  }catch(err){
    console.error(err);
    document.getElementById("app").innerHTML =
      "<div class='card no'>Dashboard konnte nicht geladen werden: "+err.message+"</div>";
  }
});
