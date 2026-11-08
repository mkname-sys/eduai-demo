import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { controlStyles as styles } from "../styles/teacherControlStyles";

export default function TeacherControlPanel() {
  const { classId } = useParams();

  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState("");
  const [showConfig, setShowConfig] = useState(false);

  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    async function loadSettings() {
     const res = await fetch(
  `https://eduai-api-iifp.onrender.com/teacher/settings?classId=${classId}`
);

      const data = await res.json();
      setSettings(data);
    }

    loadSettings();
  }, [classId]);

  async function sendMessage() {
    if (!message.trim()) return;

    const teacherMessage = message;

    setConversation((prev) => [
      ...prev,
      {
        role: "teacher",
        text: teacherMessage
      }
    ]);

    setMessage("");

    try {
      const res = await fetch(
  "https://eduai-api-iifp.onrender.com/teacher/command",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: teacherMessage,
            classId
          })
        }
      );

      const data = await res.json();

      if (data.settings) {
        setSettings(data.settings);
      }

      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            data.confirmation ||
            "The class AI has been updated."
        }
      ]);
    } catch (err) {
      console.error(err);

      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "I couldn't update the classroom configuration right now."
        }
      ]);
    }
  }

  if (!settings) {
    return (
      <div style={{ padding: 40, color: "#fff" }}>
        Loading Classroom Assistant...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          EDUAI Classroom Assistant
        </h1>

        {conversation.length === 0 && (
          <p style={styles.headerSubtitle}>
            How would you like your class AI to behave today?
          </p>
        )}
      </div>

      <div style={styles.chatArea}>
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "teacher"
                ? styles.teacherMessage
                : styles.assistantMessage
            }
          >
            <div style={styles.messageLabel}>
              {msg.role === "teacher"
                ? "Teacher"
                : "EDUAI"}
            </div>

            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputSection}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe how you'd like your class AI to behave..."
          style={styles.chatInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          style={styles.sendButton}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

      <div style={styles.statusPanel}>
        <button
          style={styles.configToggle}
          onClick={() => setShowConfig(!showConfig)}
        >
          {showConfig
            ? "▲ Current AI Configuration"
            : "▼ Current AI Configuration"}
        </button>

        {showConfig && (
          <>
            <div style={styles.statusGrid}>
              <div>
                <strong>Tone:</strong> {settings.tone}
              </div>

              <div>
                <strong>Strictness:</strong>{" "}
                {settings.strictness}
              </div>

              <div>
                <strong>Style:</strong>{" "}
                {settings.teachingStyle}
              </div>

              <div>
                <strong>Reading Level:</strong>{" "}
                {settings.simplicity}
              </div>
            </div>

            <div style={{ marginTop: "12px" }}>
              <strong>Blocked Topics:</strong>

              <div style={styles.topicRow}>
                {(settings.blockedTopics || []).length ===
                0 ? (
                  <span>No blocked topics</span>
                ) : (
                  settings.blockedTopics.map(
                    (topic, index) => (
                      <span
                        key={index}
                        style={styles.topicBadge}
                      >
                        {topic}
                      </span>
                    )
                  )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}