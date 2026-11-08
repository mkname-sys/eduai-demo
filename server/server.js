// server/server.js — MASTER DATA ROUTER HUB (PORT 3001 DEFAULT)
import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import { processTeacherCommand } from "./teacherEngine.js";
import { handleStudentMessage, generateTeacherDocument } from "./aiEngine.js";
import { runSafetyChecks } from "../src/utils/safety/safetyChecks.js";

const app = express();
app.use(cors());
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    })
  });
}
const db = admin.firestore();

// =============================================================
// 🟦 1. STUDENT DASHBOARD — MULTI-CHANNEL TUTOR ROUTE
// =============================================================
app.post("/student-ai", async (req, res) => {
  try {
    const { message, studentId, classId } = req.body;

    let classroomRules = {
      tone: "friendly",
      strictness: "medium",
      teachingStyle: "step-by-step",
      simplicity: "middle-school",
      blockedTopics: [],
      customRules: []
    };
    let lastContext = {};

    if (classId && classId !== "global-hub") {
      const classSnap = await db.collection("classes").doc(classId).get();
      if (classSnap.exists) {
        classroomRules = classSnap.data().settings || classroomRules;
      }
      
      const logsSnap = await db
        .collection("classes")
        .doc(classId)
        .collection("activityLogs")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (!logsSnap.empty) {
        const lastLog = logsSnap.docs[0].data();
        lastContext = {
          lastUserMessage: lastLog.message || lastLog.text || "",
          lastAiMessage: lastLog.replyContext || "",
          topic: lastLog.topic || "General Study Guidance"
        };
      }
    }

    const globalSettingsSnap = await db
  .collection("system")
  .doc("globalSettings")
  .get();

const globalSettings =
  globalSettingsSnap.exists
    ? globalSettingsSnap.data()
    : {};

const combinedBlockedTopics = [
  ...(globalSettings.blockedTopics || []),
  ...(classroomRules.blockedTopics || [])
];

const safetyStatus = runSafetyChecks(
  message,
  combinedBlockedTopics
);
    if (!safetyStatus.allowed) {

  if (classId && classId !== "global-hub") {
    await db
      .collection("classes")
      .doc(classId)
      .collection("activityLogs")
      .add({
        message,
        topic: "Blocked Topic",
        mode: "blocked",
        status: "blocked",
        timestamp: new Date().toISOString()
      });
  }

  return res.json({
    reply: safetyStatus.message,
    mode: "blocked"
  });
}

    const result = await handleStudentMessage(
      message,
      studentId || "session-id",
      classroomRules,
      classId || "global-hub",
      lastContext
    );

    if (classId && classId !== "global-hub" && result.mode !== "blocked") {
      const activeLogs = await db
        .collection("classes")
        .doc(classId)
        .collection("activityLogs")
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

      if (!activeLogs.empty) {
        await activeLogs.docs[0].ref.update({ replyContext: result.response });
      }
    }

    res.json({
      reply: result.response,
      mode: result.mode,
      topic: result.topic
    });
  } catch (err) {
    console.error("Student chat pipeline routing fault:", err);
    res.status(500).json({ reply: "Connection channel encountered a hiccup. Try again." });
  }
});

// =============================================================
// 🟩 2. TEACHER DASHBOARD — AI CONTENT CHAT ROUTE
// =============================================================
app.post("/ai", async (req, res) => {
  try {
    const { message, history = [], currentDocument = "" } = req.body;

    const result = await generateTeacherDocument({
      message,
      currentDocument,
      history
    });

    res.json({ reply: result.html, mode: result.mode || "document" });
  } catch (error) {
    console.error("Teacher content route error:", error);
    res.status(500).json({
      reply: "<p>Sorry, EDUAI content creation engine encountered an issue. Try again.</p>"
    });
  }
});

// =============================================================
// 🟪 3. TEACHER DASHBOARD — CONTROL PANEL RULE OVERRIDES ROUTE
// =============================================================
app.post("/teacher/command", async (req, res) => {
  try {
    const { message, command, currentSettings, classId } = req.body;

    const teacherMessage = message || command || "";   // ⭐ SAFE

let effectiveSettings = {};

if (classId) {
  const classSnap = await db
    .collection("classes")
    .doc(classId)
    .get();

  if (classSnap.exists) {
    effectiveSettings =
      classSnap.data().settings || {};
  }
}

const result = await processTeacherCommand(
  teacherMessage,
  effectiveSettings,
  classId
);

    if (classId) {
      await db.collection("classes").doc(classId).update({ settings: result.settings });
    }

    res.json({ settings: result.settings, confirmation: result.confirmation });
  } catch (err) {
    console.error("Teacher control panel route error:", err);
    res.status(500).json({ confirmation: "System failed to alter environment variables." });
  }
});

// =============================================================
// 🟧 4. TEACHER DATA PANEL — ANALYTICS ROUTE
// =============================================================
app.get("/teacher/data", async (req, res) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.json({ error: "Missing classId" });
    }

    const logsSnap = await db
      .collection("classes")
      .doc(classId)
      .collection("activityLogs")
      .get();

    const rawLogs = logsSnap.docs.map(doc => doc.data());

    const questionCounter = {};
    const topicCounter = {};
    const struggleCounter = {};
    const hintCounter = {};

    let totalInteractions = rawLogs.length;
    let blockedAttemptsCount = rawLogs.filter(
      log => log.mode === "blocked" || log.status === "blocked"
    ).length;

    rawLogs.forEach(log => {
      const text = log.message || log.text || "";
      const topic = log.topic || "General Study Guidance";

      if (text.length > 10) {
        questionCounter[text] = (questionCounter[text] || 0) + 1;
      }

      if (
        log.mode === "continuation" ||
        log.studentState === "confused" ||
        log.studentState === "frustrated"
      ) {
        struggleCounter[topic] = (struggleCounter[topic] || 0) + 1;
      } else {
        topicCounter[topic] = (topicCounter[topic] || 0) + 1;
      }

      if (log.hintType) {
        hintCounter[log.hintType] = (hintCounter[log.hintType] || 0) + 1;
      }
    });

    const sortMap = obj =>
      Object.entries(obj)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    res.json({
      topQuestions: sortMap(questionCounter).slice(0, 3),
      topTopics: sortMap(topicCounter).slice(0, 3),
      struggleTopics: sortMap(struggleCounter).slice(0, 2),
      hintUsageStats: Object.entries(hintCounter).map(([element, count]) => ({
        element,
        count
      })),
      totalInteractions,
      blockedAttemptsCount
    });
  } catch (err) {
    console.error("Data panel error:", err);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});

// =============================================================
// 🔍 5. LIGHTWEIGHT CONFIGURATION RETRIEVAL GATEWAY
// =============================================================
app.get("/teacher/settings", async (req, res) => {
  try {
    const { classId } = req.query;
    if (classId) {
      const snap = await db.collection("classes").doc(classId).get();
      if (snap.exists) return res.json(snap.data().settings || {});
    }
    res.json({
      tone: "friendly",
      strictness: "medium",
      teachingStyle: "step-by-step",
      simplicity: "middle-school",
      blockedTopics: [],
      customRules: []
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to read configuration mapping states." });
  }
});
 // =============================================================
// 🟨 6. CLASS INFORMATION ROUTE
// =============================================================
app.get("/class/info", async (req, res) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({
        error: "Missing classId"
      });
    }

    const snap = await db
      .collection("classes")
      .doc(classId)
      .get();

    if (!snap.exists) {
      return res.json({
        name: classId
      });
    }

    const data = snap.data();

    res.json({
      name: data.name || classId,
      subject: data.subject || "",
      period: data.period || ""
    });
  } catch (err) {
    console.error("Class info route error:", err);

    res.status(500).json({
      error: "Failed to retrieve class information"
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(`🚀 EDUAI Core District Server operating on port ${PORT}`)
);
