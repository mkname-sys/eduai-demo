// server/teacherEngine.js — CLASS-AWARE BEHAVIOR ENGINE
import OpenAI from "openai";
import admin from "firebase-admin";
import { logAIActivity } from "./logAIActivity.js";

const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "EDUAI Platform"
  }
});

const defaultSettings = {
  tone: "friendly",
  strictness: "medium",
  teachingStyle: "step-by-step",
  simplicity: "middle-school",
  blockedTopics: [],
  customRules: []
};

function validateSettings(updates = {}) {
  const valid = {};

  const toneMap = { friendly: "friendly", strict: "strict", neutral: "neutral" };
  const strictnessMap = { low: "low", medium: "medium", high: "high" };
  const simplicityMap = {
    "elementary": "elementary",
    "middle-school": "middle-school",
    "high-school": "high-school"
  };
  const styleMap = {
    "step-by-step": "step-by-step",
    "socratic": "socratic",
    "lecture": "lecture"
  };

  if (updates.tone && toneMap[updates.tone]) valid.tone = toneMap[updates.tone];
  if (updates.strictness && strictnessMap[updates.strictness]) valid.strictness = strictnessMap[updates.strictness];
  if (updates.simplicity && simplicityMap[updates.simplicity]) valid.simplicity = simplicityMap[updates.simplicity];
  if (updates.teachingStyle && styleMap[updates.teachingStyle]) valid.teachingStyle = styleMap[updates.teachingStyle];

  return valid;
}

function sanitizeList(list = []) {
  return [...new Set(
    list
      .map(t => t.toLowerCase().trim())
      .filter(t => t.length > 1)
  )];
}

function keywordInterpret(message = "", currentSettings = {}) {
  const lower = message.toLowerCase().trim();
  const updates = {};

  if (
    lower.includes("reset all") ||
    lower.includes("clear configurations") ||
    lower.includes("factory reset")
  ) {
    updates.__reset = true;
    return updates;
  }

  if (lower.includes("be friendly") || lower.includes("warm tone")) updates.tone = "friendly";
  if (
  lower.includes("be strict") ||
  lower.includes("more strict") ||
  lower.includes("challenge students") ||
  lower.includes("higher expectations")
) {
  updates.strictness = "high";
}
  if (lower.includes("be neutral") || lower.includes("unbiased tone")) updates.tone = "neutral";

  if (lower.includes("socratic method") || lower.includes("ask questions"))
    updates.teachingStyle = "socratic";
  if (lower.includes("step by step") || lower.includes("break it down"))
    updates.teachingStyle = "step-by-step";

  if (lower.includes("elementary level") || lower.includes("for kids"))
    updates.simplicity = "elementary";
  if (lower.includes("high school level") || lower.includes("more advanced"))
    updates.simplicity = "high-school";

  if (
    lower.includes("can't answer") ||
    lower.includes("cannot answer") ||
    lower.includes("don't answer")
  ) {
    const match = message.match(/(?:about|on)\s+([a-zA-Z0-9\s]+)(?:$|,|\.)/i);
    if (match && match[1]) {
      updates.blockedTopics = [
        ...(currentSettings.blockedTopics || []),
        match[1].trim()
      ];
    }
  }

  if (lower.includes("block ") || lower.includes("ban ")) {
    const match = message.match(/(?:block|ban)\s+([a-zA-Z0-9\s]+)(?:$|,|\.)/i);
    if (match && match[1]) {
      updates.blockedTopics = [
        ...(currentSettings.blockedTopics || []),
        match[1].trim()
      ];
    }
  }

  return updates;
}

async function aiInterpret(message = "") {
  const lower = message.toLowerCase().trim();
  if (lower.includes("reset all") || lower.includes("clear configurations")) {
    return { __reset: true };
  }

  try {
    const completion = await ai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: `
You are EDUAI's teacher instruction interpreter.

A teacher will describe how they want their classroom AI to behave.

Convert the request into ONE valid JSON object.

Output ONLY raw JSON.

Available keys:

{
  "tone": "friendly | neutral | strict",
  "strictness": "low | medium | high",
  "teachingStyle": "step-by-step | socratic | lecture",
  "simplicity": "elementary | middle-school | high-school",
  "blockedTopics": [],
  "customRules": []
}

Interpret meaning, not keywords.

Examples:

Teacher:
"Make the AI more challenging but keep it encouraging."

Output:
{
  "strictness": "high",
  "tone": "friendly"
}

Teacher:
"Don't discuss dating or relationships."

Output:
{
  "blockedTopics": ["dating", "relationships"]
}

Teacher:
"Ask students more questions before giving answers."

Output:
{
  "teachingStyle": "socratic"
}

Teacher:
"Explain things for younger students."

Output:
{
  "simplicity": "elementary"
}

Teacher:
"Be neutral and factual."

Output:
{
  "tone": "neutral"
}

Only include fields that should change.
`

        },
        { role: "user", content: `Instruction: "${message}"` }
      ]
    });

    let cleanJson = completion.choices[0].message.content.trim();

    if (cleanJson.startsWith("```json"))
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    if (cleanJson.startsWith("```"))
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();

    const firstBrace = cleanJson.indexOf("{");
    if (firstBrace > 0) cleanJson = cleanJson.slice(firstBrace);

    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("AI Instruction interpretation drop:", err);
    return {};
  }
}

export async function processTeacherCommand(
  message = "",
  activeSettings = {},
  classId = null
)

{
  let currentSettings = {
    tone: activeSettings.tone || defaultSettings.tone,
    strictness: activeSettings.strictness || defaultSettings.strictness,
    teachingStyle: activeSettings.teachingStyle || defaultSettings.teachingStyle,
    simplicity: activeSettings.simplicity || defaultSettings.simplicity,
    blockedTopics: activeSettings.blockedTopics || [],
    customRules: activeSettings.customRules || []
  };

  const keywordUpdates = keywordInterpret(message, currentSettings);
  const aiUpdatesRaw = await aiInterpret(message);
  const aiUpdates = validateSettings(aiUpdatesRaw);

  if (keywordUpdates.__reset || aiUpdatesRaw.__reset) {
    const resetSettings = { ...defaultSettings, blockedTopics: [], customRules: [] };

    if (classId) {
      await admin.firestore().collection("classes").doc(classId).update({ settings: resetSettings });
    } else {
      await admin.firestore().collection("system").doc("globalSettings").set(resetSettings);
    }

    await logAIActivity({
      userId: "teacher",
      classId: classId || "global-hub",
      role: "teacher",
      subject: "behavior-control",
      safetyTriggered: false
    });

    return {
      settings: resetSettings,
      confirmation: "All behavioral settings reset to default."
    };
  }

  const finalTone =
    aiUpdates.tone ?? keywordUpdates.tone ?? currentSettings.tone;

  const finalStrictness =
    aiUpdates.strictness ?? keywordUpdates.strictness ?? currentSettings.strictness;

  const finalStyle =
    aiUpdates.teachingStyle ?? keywordUpdates.teachingStyle ?? currentSettings.teachingStyle;

  const finalSimplicity =
    aiUpdates.simplicity ?? keywordUpdates.simplicity ?? currentSettings.simplicity;

  const combinedTopics = [
    ...(currentSettings.blockedTopics || []),
    ...(keywordUpdates.blockedTopics || []),
    ...(aiUpdatesRaw.blockedTopics || [])
  ];

  const uniqueBlockedTopics = sanitizeList(combinedTopics);

  const combinedRules = [
    ...(currentSettings.customRules || []),
    ...(keywordUpdates.customRules || []),
    ...(aiUpdatesRaw.customRules || [])
  ];

  const uniqueCustomRules = sanitizeList(combinedRules);

  const compiledSettings = {
    tone: finalTone,
    strictness: finalStrictness,
    teachingStyle: finalStyle,
    simplicity: finalSimplicity,
    blockedTopics: uniqueBlockedTopics,
    customRules: uniqueCustomRules
  };

  if (classId) {
    await admin.firestore().collection("classes").doc(classId).update({ settings: compiledSettings });
  } else {
    await admin.firestore().collection("system").doc("globalSettings").set(compiledSettings);
  }

let confirmation = "Got it.\n\n";

if (
  finalStrictness !== currentSettings.strictness &&
  finalTone === currentSettings.tone
) {
  confirmation +=
    finalStrictness === "high"
      ? "I'll challenge students more and encourage deeper thinking."
      : "I'll provide more support and guidance for students.";
}

else if (
  finalTone !== currentSettings.tone &&
  finalStrictness === currentSettings.strictness
) {
  confirmation +=
    finalTone === "friendly"
      ? "I'll keep interactions warm, supportive, and approachable."
      : "I'll adjust the classroom tone accordingly.";
}

else {
  confirmation +=
    "I've updated the class AI behavior and teaching approach.";
}

if (uniqueBlockedTopics.length > currentSettings.blockedTopics.length) {
  const newTopics = uniqueBlockedTopics.slice(
    currentSettings.blockedTopics.length
  );

  confirmation += `

Topics now restricted:
${newTopics.join(", ")}.`;
}

confirmation += "\n\nThe class AI has been updated.";
  await logAIActivity({
    userId: "teacher",
    classId: classId || "global-hub",
    role: "teacher",
    subject: "behavior-control",
    safetyTriggered: false
  });

  return {
    settings: compiledSettings,
    confirmation
  };
}

export default {
  processTeacherCommand
};
