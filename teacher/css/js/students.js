const Students = {
  async list(){
    if(!db) return [];
    const snap = await db.collection("students").get();
    return snap.docs.map(d => ({ id:d.id, ...d.data() }));
  },
  async progressList(){
    if(!db) return [];
    const snap = await db.collection("progress").get();
    return snap.docs.map(d => ({ id:d.id, ...d.data() }));
  },
  mergeStudentProgress(students, progressRows){
    const progressById = new Map(progressRows.map(p => [p.studentId || p.id, p]));
    return students.map(s => ({ ...s, progressDoc: progressById.get(s.studentId || s.id) || null }));
  },
  byCourse(students){
    const groups = {};
    for(const s of students){
      const k = s.kurs || s.kursnummer || "Ohne Kurs";
      groups[k] = groups[k] || [];
      groups[k].push(s);
    }
    return groups;
  }
};
