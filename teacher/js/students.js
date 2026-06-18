const Students = {

  async list(){
    if(!db) return [];

    const snap = await db
      .collection("students")
      .get();

    return snap.docs.map(d => ({
      id:d.id,
      ...d.data()
    }));
  },

  async progressList(){
    if(!db) return [];

    const snap = await db
      .collection("progress")
      .get();

    return snap.docs.map(d => ({
      id:d.id,
      ...d.data()
    }));
  },

  mergeStudentProgress(
    students,
    progressRows
  ){

    const progressById =
      new Map(
        progressRows.map(p => [
          p.studentId || p.id,
          p
        ])
      );

    return students.map(s => ({
      ...s,
      progressDoc:
        progressById.get(
          s.studentId || s.id
        ) || null
    }));
  },

  byCourse(students){

    const groups = {};

    for(const s of students){

      const course =
        s.kurs ||
        s.kursnummer ||
        "Ohne Kurs";

      if(!groups[course]){
        groups[course] = [];
      }

      groups[course].push(s);
    }

    return groups;
  },

  getCourseStudents(
    students,
    courseName
  ){

    return students.filter(s =>

      (s.kurs === courseName) ||

      (s.kursnummer === courseName)

    );
  },

  studentName(s){

    return (
      `${s.vorname || ""} ${s.nachname || ""}`
    ).trim()
    ||
    s.id
    ||
    "Unbekannt";
  },

  getVerbStats(student){

    const verben =
      student.progressDoc?.verben
      || {};

    return {

      progress:
        verben.progress || 0,

      stars:
        verben.stars || 0,

      active:
        (verben.activeVerbs || []).length,

      known:
        (verben.known || []).length,

      unsure:
        (verben.unsure || []).length,

      unknown:
        (verben.unknown || []).length

    };
  }

};
