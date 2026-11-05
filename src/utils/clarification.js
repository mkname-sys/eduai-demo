// src/utils/clarification.js

// Which subjects get clarification + what options they offer
const subjectClarificationOptions = {
  math: ["steps", "answer", "both"],
  ela: ["summary", "explanation", "writing help"],
  science: ["simple", "detailed"],
  history: ["summary", "timeline", "cause and effect"],
  language: ["definition", "translation", "example"]
};

// Very vague / multi-intent triggers
const vagueStarters = [
  "explain this",
  "help me with this",
  "what does this mean",
  "fix this",
  "rewrite this",
  "tell me about",
  "help me understand",
  "what is this"
];

export function shouldAskClarification(question, subject, qType) {
  const q = question.toLowerCase();

  // 1) Vague question
  if (vagueStarters.some(v => q.startsWith(v))) return true;

  // 2) Subject has multiple valid formats
  if (subjectClarificationOptions[subject]) {
    // If qType is missing or generic, ask
    if (!qType || qType === "explain" || qType === "write") return true;
  }

  return false;
}

// Personality-aware tone
function getTonePrefix(personality) {
  switch (personality) {
    case "professional":
      return "Please specify the format you prefer.";
    case "strict":
      return "Choose one of the following options.";
    case "kid":
    case "kidFriendly":
      return "How do you want me to help you with this?";
    case "simple":
      return "Pick what you want:";
    case "neutral":
      return "Select the response type you prefer.";
    case "friendly":
    default:
      return "Just to help you better — what kind of answer do you want?";
  }
}

export function buildClarificationMessage(subject, personality) {
  const options = subjectClarificationOptions[subject] || ["summary", "explanation"];
  const prefix = getTonePrefix(personality || "friendly");

  const bullets = options.map(o => `- ${o}`).join("\n");

  return `${prefix}\n\n${bullets}\n\nYou can just type one of these.`;
}

// Map student reply → internal qType
export function interpretClarificationReply(reply, subject) {
  const r = reply.toLowerCase();

  if (subject === "math") {
    if (r.includes("step")) return "steps";
    if (r.includes("both")) return "both";
    return "answer";
  }

  if (subject === "ela") {
    if (r.includes("summary")) return "summarize";
    if (r.includes("write")) return "writing";
    return "explain";
  }

  if (subject === "science") {
    if (r.includes("simple")) return "explain_simple";
    if (r.includes("detail")) return "explain_detailed";
    return "explain";
  }

  if (subject === "history") {
    if (r.includes("timeline")) return "timeline";
    if (r.includes("cause")) return "cause_effect";
    if (r.includes("summary")) return "summarize";
    return "explain";
  }

  if (subject === "language") {
    if (r.includes("definition")) return "define";
    if (r.includes("translation")) return "translate";
    if (r.includes("example")) return "example";
    return "explain";
  }

  // Default
  if (r.includes("summary")) return "summarize";
  if (r.includes("define")) return "define";
  return "explain";
}
