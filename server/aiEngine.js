// server/aiEngine.js — CORE STUDENT + TEACHER LLM ENGINE
import "dotenv/config";
import OpenAI from "openai";
import admin from "firebase-admin";
import { runSafetyChecks } from "../src/utils/safety/safetyChecks.js";
import { getGlobalMemory, updateGlobalMemory } from "./globalMemory.js";
import { logAIActivity } from "./logAIActivity.js";
import {
  getStudentMemory,
  updateStudentMemory
} from "./studentMemory.js";
const ai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3001",
    "X-Title": "EDUAI Platform"
  }
});

const studentMemory = {};

let ttcSettings = {
  tone: "friendly",
  blockedTopics: [],
  customRules: []
};

export function updateTTCSettings(newSettings) {
  ttcSettings = { ...ttcSettings, ...newSettings };
}

function detectTopic(message) {
  const lower = message.toLowerCase().trim();
  if (["hi", "hello", "hey", "yo"].includes(lower)) return "Greeting";
  if (lower.includes("photosynthesis") || lower.includes("plants")) return "photosynthesis";
  if (lower.includes("cell") || lower.includes("mitochondria") || lower.includes("organelle"))
    return "biology";
  if (lower.match(/\d+x\d+/) || lower.includes("multiply")) return "multiplication";
  if (lower.includes("equation") || lower.includes("solve")) return "algebra";
  return null;
}

function isContinuation(message, memory) {
  if (!memory || !memory.lastUserMessage) return false;
  const lower = message.toLowerCase();
  const sameTopicWords = ["it", "that", "this", "part", "so", "then", "next"];
  const refersToPrevious =
    sameTopicWords.some(w => lower.startsWith(w + " ")) ||
    lower.includes("explain that") ||
    lower.includes("again") ||
    lower.includes("what do i do next");

  if (refersToPrevious) return true;

  const newTopic = detectTopic(message);
  const oldTopic = detectTopic(memory.lastUserMessage);
  if (newTopic && oldTopic && newTopic === oldTopic) return true;

  return false;
}

function detectStudentState(message) {
  const lower = message.toLowerCase();
  if (
    lower.includes("idk") ||
    lower.includes("i don't know") ||
    lower.includes("you tell me") ||
    lower.includes("explain")
  )
    return "confused";
  if (
    lower.includes("bro") ||
    lower.includes("wtf") ||
    lower.includes("annoying") ||
    lower.includes("just tell me")
  )
    return "frustrated";
  if (lower.includes("i think") || lower.includes("maybe") || lower.includes("is it because"))
    return "confident";
  return "normal";
}

function buildPrompt(message, topic, continuation, memory, runtimeSettings) {
  const studentState = detectStudentState(message);

  let style = `
You are EDUAI, an adaptive educational assistant.

IMPORTANT:
The classroom settings below are mandatory.
You must follow them even if they conflict with your default behavior.

Current Classroom Settings:

- Tone: ${runtimeSettings.tone}
- Strictness: ${runtimeSettings.strictness}
- Teaching Style: ${runtimeSettings.teachingStyle}
- Reading Level: ${runtimeSettings.simplicity}

`;

  // TONE

  if (runtimeSettings.tone === "friendly") {
    style += `
FRIENDLY MODE (MANDATORY):

- Be warm and encouraging.
- Be supportive.
- Make students feel comfortable asking questions.
`;
  }

  if (runtimeSettings.tone === "neutral") {
    style += `
NEUTRAL MODE (MANDATORY):

- Be objective.
- Be factual.
- Avoid excessive encouragement.
`;
  }

  if (runtimeSettings.tone === "strict") {
    style += `
STRICT TONE MODE (MANDATORY):

- Be academic and professional.
- Focus on learning outcomes.
- Avoid excessive praise.
`;
  }

  // STRICTNESS

  if (runtimeSettings.strictness === "high") {
    style += `
HIGH STRICTNESS MODE (MANDATORY):

- Challenge students to think.
- Encourage reasoning before answers.
- Ask students what they think when appropriate.
- Avoid immediately giving away solutions.
`;
  }

  if (runtimeSettings.strictness === "medium") {
    style += `
MEDIUM STRICTNESS MODE:

- Use a balanced teaching approach.
`;
  }

  if (runtimeSettings.strictness === "low") {
    style += `
LOW STRICTNESS MODE (MANDATORY):

- Give direct help.
- Offer hints freely.
- Focus on support rather than challenge.
`;
  }

  // TEACHING STYLE

  if (runtimeSettings.teachingStyle === "socratic") {
    style += `
SOCRATIC MODE (MANDATORY):

- Begin with a thoughtful question whenever possible.
- Guide students toward the answer.
- Encourage critical thinking.
- Ask before explaining.

DO NOT immediately give a full answer unless necessary.
`;
  }

  if (runtimeSettings.teachingStyle === "lecture") {
    style += `
LECTURE MODE (MANDATORY):

- Explain directly.
- Teach clearly.
- Deliver complete explanations.
- Minimize questioning.
`;
  }

  if (runtimeSettings.teachingStyle === "step-by-step") {
    style += `
STEP-BY-STEP MODE (MANDATORY):

- Break concepts into small steps.
- Explain ideas sequentially.
- Build understanding gradually.
`;
  }

  // READING LEVEL

  if (runtimeSettings.simplicity === "elementary") {
    style += `
ELEMENTARY LEVEL MODE (MANDATORY):

You MUST:
- Use simple vocabulary.
- Use everyday examples.
- Explain concepts for young learners.

You MUST NOT:
- Use advanced terminology unless explained.
- Assume prior academic knowledge.
`;
  }

  if (runtimeSettings.simplicity === "middle-school") {
    style += `
MIDDLE SCHOOL MODE:

- Use moderate educational language.
- Explain unfamiliar concepts.
- Balance simplicity with accuracy.
`;
  }

  if (runtimeSettings.simplicity === "high-school") {
    style += `
HIGH SCHOOL LEVEL MODE (MANDATORY):

You MUST:
- Use academic vocabulary.
- Use scientific terminology.
- Provide deeper explanations.
- Explain concepts at a secondary-school level.

You MUST NOT:
- Use childish language.
- Use phrases like "magic power".
- Use phrases like "superpower".
- Explain concepts as if teaching elementary students.

Failure to follow these requirements means the response is incorrect.
`;
  }

  // STUDENT STATE

  if (studentState === "confused") {
    style += `
The student is confused.

Provide extra clarity.
`;
  }

  if (studentState === "frustrated") {
    style += `
The student is frustrated.

Remain encouraging and patient.
`;
  }

  // TOPIC

  if (topic) {
    style += `
The student is asking about:

${topic}
`;
  }

  // CUSTOM RULES

  if (runtimeSettings.customRules.length > 0) {
    style += `
Strict Classroom Guidelines:
${runtimeSettings.customRules
  .map(rule => `- ${rule}`)
  .join("\n")}
`;
  }

  return `
${style}

Student Current Question:

"${message}"

The classroom settings above are mandatory.

Your response must match:
- the selected teaching style
- the selected strictness level
- the selected reading level
- the selected tone

Generate the response now.
`;
}

// 🟦 STUDENT CORE BRAIN PROCESS
export async function handleStudentMessage(
  message,
  studentId,
  classSettings = {},
  classId = "global-hub",
  lastContext = {}
) {
  const globalMemory = await getGlobalMemory();

const persistentMemory =
  await getStudentMemory(studentId);

  if (!globalMemory.firstTimeStudentGreeting) {
    await updateGlobalMemory({ firstTimeStudentGreeting: true });

    return {
      response: `
Hi there! I'm EDUAI, your personal learning assistant.

I help you understand topics, explain concepts, guide you step-by-step, and answer questions in a simple, friendly way.

Ask me anything — let's learn together!
      `,
      mode: "intro",
      topic: null
    };
  }

  const globalSettingsSnap = await admin
    .firestore()
    .collection("system")
    .doc("globalSettings")
    .get();

  const globalSettings = globalSettingsSnap.exists ? globalSettingsSnap.data() : {};

  const runtimeSettings = {
    tone: classSettings?.tone || globalSettings.tone || ttcSettings.tone,
    strictness: classSettings?.strictness || globalSettings.strictness || "medium",
    teachingStyle: classSettings?.teachingStyle || globalSettings.teachingStyle || "step-by-step",
    simplicity: classSettings?.simplicity || globalSettings.simplicity || "middle-school",
    blockedTopics: classSettings?.blockedTopics || globalSettings.blockedTopics || [],
    customRules: classSettings?.customRules || globalSettings.customRules || []
  };

  const memoryKey = `${studentId}_${classId}`;
  if (!studentMemory[memoryKey]) {
  studentMemory[memoryKey] = {
    topic: lastContext.topic || null,
    lastUserMessage: lastContext.lastUserMessage || null,
    lastAiMessage: lastContext.lastAiMessage || null,
    facts: {}
  };
}
  const memory = studentMemory[memoryKey];
  const favoritePlanetMatch =
  message.match(/my favorite planet is (.+)/i);

if (favoritePlanetMatch) {
  memory.facts.favoritePlanet =
    favoritePlanetMatch[1].trim();

  await updateStudentMemory(studentId, {
    facts: memory.facts,
    updatedAt: Date.now()
  });

  return {
    response:
      `Got it! I'll remember that your favorite planet is ${memory.facts.favoritePlanet}.`,
    mode: "memory",
    topic: null
  };
}

if (memory?.facts?.favoritePlanet) {
  await updateStudentMemory(studentId, {
    facts: memory.facts,
    updatedAt: Date.now()
  });
} 
const lower = message.toLowerCase();

if (
  lower.includes("what is my favorite planet") ||
  lower.includes("what's my favorite planet") ||
  lower.includes("do you know my favorite planet")
){
  return {
    response:
  persistentMemory?.facts?.favoritePlanet
    ? `Your favorite planet is ${persistentMemory.facts.favoritePlanet}.`
    : "I don't know your favorite planet yet.",
    mode: "memory",
    topic: null
  };
}

const favoriteColorMatch =
  message.match(/my favorite color is (.+)/i);

if (favoriteColorMatch) {
  memory.facts.favoriteColor =
    favoriteColorMatch[1].trim();

  await updateStudentMemory(studentId, {
    facts: memory.facts,
    updatedAt: Date.now()
  });

  return {
    response:
      `Got it! I'll remember that your favorite color is ${memory.facts.favoriteColor}.`,
    mode: "memory",
    topic: null
  };
}
if (
  lower.includes("what is my favorite color") ||
  lower.includes("what's my favorite color") ||
  lower.includes("do you know my favorite color")
) {
  return {
    response:
      persistentMemory?.facts?.favoriteColor
        ? `Your favorite color is ${persistentMemory.facts.favoriteColor}.`
        : "I don't know your favorite color yet.",
    mode: "memory",
    topic: null
  };
}
  const db = admin.firestore();

  const safetyStatus = runSafetyChecks(message, runtimeSettings.blockedTopics);
  if (!safetyStatus.allowed) {
    await logAIActivity({
      userId: studentId,
      classId,
      role: "student",
      subject: memory.topic || "unknown",
      safetyTriggered: true
    });
    if (classId !== "global-hub") {
  try {
    await db
      .collection("classes")
      .doc(classId)
      .collection("activityLogs")
      .add({
        message,
        topic: memory.topic || "Blocked Topic",
        mode: "blocked",
        status: "blocked",
        studentState: detectStudentState(message),
        timestamp: new Date().toISOString()
      });
  } catch (err) {
    console.error("Blocked log error:", err);
  }
}

    return {
      response:
        "I can’t explain that topic directly, but I can help with other science topics.",
      mode: "blocked",
      topic: memory.topic
    };
  }

  const topic = detectTopic(message) || memory.topic;
  const continuation = isContinuation(message, memory);
  const memoryFacts =
  persistentMemory?.facts
    ? `

Known Student Facts:
${Object.entries(persistentMemory.facts)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}
`
    : "";

const prompt = buildPrompt(
  `${memoryFacts}\n\n${message}`,
  topic,
  continuation,
  memory,
  runtimeSettings
);

  let aiResponse = "";

  try {
    const completion = await ai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message }
      ]
    });

    if (
      completion &&
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0].message &&
      completion.choices[0].message.content
    ) {
      aiResponse = completion.choices[0].message.content;
    }
  } catch (err) {
    console.error("AI completion error:", err);
    aiResponse = "";
  }

  if (!aiResponse) {
    aiResponse =
      "I couldn't reach the AI tutor properly just now. Try asking again in a moment.";
  }

  memory.topic = topic;
  memory.lastUserMessage = message;
  memory.lastAiMessage = aiResponse;

  if (classId !== "global-hub") {
    try {
      await db
        .collection("classes")
        .doc(classId)
        .collection("activityLogs")
        .add({
          message,
          topic: topic || "General Study Guidance",
          mode: continuation ? "continuation" : "tutor",
          studentState: detectStudentState(message),
          timestamp: new Date().toISOString()
        });
    } catch (err) {
      console.error("Firestore logging error:", err);
    }
  }

  await logAIActivity({
    userId: studentId,
    classId,
    role: "student",
    subject: topic || "unknown",
    safetyTriggered: false
  });

  return {
    response: aiResponse,
    mode: continuation ? "continuation" : "tutor",
    topic
  };
}

// 🟩 TEACHER CONTENT ENGINE (AI Content Chat)
export async function generateTeacherDocument({
  message,
  currentDocument = "",
  history = []
}) {
  const globalMemory = await getGlobalMemory();

  if (!globalMemory.firstTimeTeacherContentChat) {
    await updateGlobalMemory({ firstTimeTeacherContentChat: true });

    return {
      html: `
<h2>Welcome to the EDUAI Content Chat!</h2>
<p>This tool helps you generate lessons, worksheets, quizzes, study guides, and full curriculum materials.</p>
<p>Describe any topic, lesson plan, or assignment, and I'll create clean, structured HTML you can export as a PDF.</p>
<p>Type your first request to begin building content.</p>
      `.trim(),
      mode: "document"
    };
  }

  const systemPrompt = `You are an EDUAI curriculum assistant.
ALWAYS output clean HTML only.
Use <h2>, <h3>, <p>, <ul>, <li>, <strong>.
Do NOT use markdown code fences.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map(m => ({
      role: m.role === "teacher" ? "user" : "assistant",
      content: m.text
    }))
  ];

  if (currentDocument) {
    messages.push({
      role: "system",
      content: `[CURRENT DOCUMENT]:\n${currentDocument}\n\nAppend or modify based on teacher request.`
    });
  }

  messages.push({ role: "user", content: message });

  let htmlReply = "";

  try {
    const completion = await ai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages,
      temperature: 0.4
    });

    if (
      completion &&
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0].message &&
      completion.choices[0].message.content
    ) {
      htmlReply = completion.choices[0].message.content.trim();
    }
  } catch (err) {
    console.error("Teacher document AI error:", err);
    htmlReply = "<p>Sorry, the document engine encountered an issue.</p>";
  }

  if (htmlReply.startsWith("```html"))
    htmlReply = htmlReply.replace(/^```html/, "").replace(/```$/, "").trim();
  if (htmlReply.startsWith("```"))
    htmlReply = htmlReply.replace(/^```/, "").replace(/```$/, "").trim();

  return { html: htmlReply, mode: "document" };
}
