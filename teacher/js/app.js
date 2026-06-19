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
      await auth.signOut();
      location.href = "login.html";
      return;
    }

    const teacher = teacherDoc.data();

    if(
      teacher.role !== "teacher" ||
      teacher.active !== true ||
      !user.emailVerified
    ){

      await auth.signOut();

      alert(
        "Bitte bestätige zuerst deine E-Mail-Adresse."
      );

      location.href = "login.html";
      return;
    }

    TeacherApp.render();

  }catch(err){

    console.error(err);

    location.href = "login.html";

  }

});
