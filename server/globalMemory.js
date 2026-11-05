// server/globalMemory.js — GLOBAL MEMORY CONTROLLER
import admin from "firebase-admin";

export async function getGlobalMemory() {
  const doc = await admin.firestore().collection("system").doc("globalMemory").get();
  return doc.exists ? doc.data() : {};
}

export async function updateGlobalMemory(updates) {
  await admin.firestore().collection("system").doc("globalMemory").set(updates, { merge: true });
}
