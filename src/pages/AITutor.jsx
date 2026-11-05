// src/pages/AITutor.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AITutor({ id, studentId }) {
  const [settings, setSettings] = useState({
    tone: "friendly",
    strictness: "medium",
    teachingStyle: "step-by-step",
    simplicity: "middle-school",
    blockedTopics: [],
    customRules: []
  });
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const ref = doc(db, "classes", id);
        const snap = await getDoc(ref);

        if (snap.exists() && snap.data().settings) {
          const activeRules = snap.data().settings;
          setSettings({
            ...activeRules,
            blockedTopics: activeRules.blockedTopics || [],
            customRules: activeRules.customRules || []
          });
        }
      } catch (err) {
        console.error("Failed to read config:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadSettings();
  }, [id]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "student", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/student-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          studentId: studentId || "local-student",
          classId: id || "global-hub"
        })
      });

      const data = await res.json();

      const aiMsg = {
        role: "assistant",
        text:
          data.reply ||
          "I'm sorry, I couldn't process that response from the AI network model core. Please try typing your question again!"
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Tutor request failed:", err);
      const aiMsg = {
        role: "assistant",
        text:
          "The tutor connection had an issue. Try again in a moment."
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  if (loading) {
    return <div>Loading tutor settings...</div>;
  }

  return (
    <div className="ai-tutor-workspace">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "student" ? "msg-student" : "msg-assistant"}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask the tutor anything..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
