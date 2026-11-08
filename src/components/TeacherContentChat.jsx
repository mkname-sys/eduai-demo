import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { contentStyles as styles } from "../styles/teacherContentStyles";

export default function TeacherContentChat() {
  const { classId } = useParams();
  const [className, setClassName] = useState("");
  const [settings, setSettings] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [documentHtml, setDocumentHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const documentBoxRef = useRef(null);

useEffect(() => {
  async function loadClassData() {
    const res = await fetch(
      `https://eduai-api-iifp.onrender.com/class/info?classId=${classId}`
    );

    const data = await res.json();
    setClassName(data.name || classId);

    const settingsRes = await fetch(
      `https://eduai-api-iifp.onrender.com/teacher/settings?classId=${classId}`
    );

    const settingsData = await settingsRes.json();
    setSettings(settingsData);
  }

  loadClassData();
}, [classId]);
  useEffect(() => {
    if (documentBoxRef.current) {
      documentBoxRef.current.scrollTop = documentBoxRef.current.scrollHeight;
    }
  }, [documentHtml]);

  async function sendMessage(extraInstruction = null) {
    if (loading) return;
    if (!input.trim() && !extraInstruction) return;

    const userText = extraInstruction || input.trim();
    const teacherMsg = { role: "teacher", text: userText };
    const newHistory = [...messages, teacherMsg];

    setMessages(newHistory);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("https://eduai-api-iifp.onrender.com/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: newHistory,
          currentDocument: documentHtml,
          classId,
          behaviorSettings: settings
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: "Document updated." }]);
      setDocumentHtml(data.reply || "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>AI Content Chat — {className}</h1>
        <p style={styles.headerSubtitle}>Generate lessons, worksheets, quizzes, diagrams, and more.</p>
      </div>

      <div style={styles.documentBox} ref={documentBoxRef}>
        {documentHtml ? (
          <div
            style={styles.documentContent}
            dangerouslySetInnerHTML={{ __html: documentHtml }}
          />
        ) : (
          <div style={styles.emptyContainer}>
            <span style={styles.emptyIcon}>📝</span>
            <h4 style={styles.emptyTitle}>AI Content Generation Terminal</h4>
            <p style={styles.emptySubtitle}>
              Request full lessons, study guides, worksheets, quizzes, or inline vector graphics.
            </p>
          </div>
        )}
      </div>

      <div style={styles.actionsRow}>
        <button style={styles.macroBtn} onClick={() => sendMessage("Improve the document.")}>✨ Improve</button>
        <button style={styles.macroBtn} onClick={() => sendMessage("Simplify the document.")}>📝 Simplify</button>
        <button style={styles.macroBtn} onClick={() => sendMessage("Add worksheet.")}>📋 Worksheet</button>
        <button style={styles.macroBtn} onClick={() => sendMessage("Add quiz.")}>🧠 Quiz</button>
        <button style={styles.macroBtn} onClick={() => sendMessage("Add diagram.")}>🎨 Diagram</button>
        <button style={styles.exportBtn}>🖨️ Export PDF</button>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe the lesson or worksheet you want to draft..."
        />
        <button
          style={styles.sendButton}
          onClick={() => sendMessage()}
        >
          {loading ? "Drafting..." : "Compile"}
        </button>
      </div>
    </div>
  );
}
