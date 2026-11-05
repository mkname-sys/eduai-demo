import admin from "firebase-admin";

export async function getStudentMemory(studentId) {
  const snap = await admin
    .firestore()
    .collection("studentMemory")
    .doc(studentId)
    .get();

  return snap.exists ? snap.data() : { facts: [] };
}

export async function updateStudentMemory(studentId, memory) {
  await admin
    .firestore()
    .collection("studentMemory")
    .doc(studentId)
    .set(memory, { merge: true });
}
