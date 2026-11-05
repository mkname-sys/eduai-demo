// src/utils/safety/safetyChecks.js

const cheatingPatterns = [
  /\bgive\s+me\s+(the\s+)?(answer|soln|resp)/i,
  /\b(test|exam|quiz|homework|assessment)\s+(answer|key|solution|cheat)/i,
  /\bdo\s+my\s+(test|exam|quiz|homework|classwork)/i,
  /\bcheat\s+for\s+me\s*/i,
  /\bsolve\s+this\s+(test|exam|quiz)/i
];

export function runSafetyChecks(question, teacherBlockedTopics = []) {
  if (!question || typeof question !== "string") {
    return { allowed: false, message: "Invalid message frame configuration." };
  }

  const q = question.trim().toLowerCase();

  // 1. Silent Check: Dynamic teacher-blocked topics from Firestore
  if (Array.isArray(teacherBlockedTopics)) {
    for (const topic of teacherBlockedTopics) {
      if (topic && q.includes(topic.toLowerCase().trim())) {
        return {
          allowed: false,
          message: "I am unable to assist with that specific topic under current classroom settings. Let's try focusing on a different concept!"
        };
      }
    }
  }

  // 2. Silent Check: Core academic cheating protections
  const triggersCheating = cheatingPatterns.some(pattern => pattern.test(q));
  if (triggersCheating) {
    return {
      allowed: false,
      message: "I can absolutely help you understand how this concept works step-by-step, but I cannot provide direct exam keys or test answers. Let's practice solving a similar example together!"
    };
  }

  return { allowed: true, message: null };
}

export default { runSafetyChecks };
