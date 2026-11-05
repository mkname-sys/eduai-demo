// server/logAIActivity.js — BACKEND-SAFE AI LOGGER
import admin from "firebase-admin";

// Ensure Firebase Admin is initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert("./serviceAccount.json")
  });
}

const db = admin.firestore();

/**
 * Logs AI activity for analytics (backend version).
 */
export async function logAIActivity({
  userId,
  classId,
  role,
  subject,
  safetyTriggered
}) {
  try {
    await db.collection("ai_logs").add({
      userId,
      classId,
      role,
      subject: subject || "unknown",
      timestamp: Date.now(),
      safetyTriggered: safetyTriggered || false
    });
  } catch (err) {
    console.error("AI logging failed:", err);
  }
}
