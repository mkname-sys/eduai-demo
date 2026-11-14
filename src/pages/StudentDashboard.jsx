// src/pages/StudentDashboard.jsx — DISCORD-STYLE STUDENT HUB (UPGRADED)
import { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styles from "../styles/discordStyles.js";

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate() {
  const now = new Date();
  return now.toDateString();
}

export default function StudentDashboard() {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatRef = useRef(null);

  const [studentId] = useState(() => {
    let id = localStorage.getItem("studentId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("studentId", id);
    }
    return id;
  });

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeClass, isTyping]);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      const mockClasses = [
  {
    id: "period1_science",
    name: "Science — Period 1",
    subject: "Science",
    shortName: "S"
  },
  {
    id: "period2_math",
    name: "Math — Period 2",
    subject: "Math",
    shortName: "M"
  }
];
      setClasses(mockClasses);
      setActiveClass(mockClasses[0]);
      setLoading(false);
    }, 1000);

    const unsubscribe = onAuthStateChanged(auth, async () => {
      try {
        const classRef = collection(db, "classes");
        const snap = await getDocs(classRef);
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (list.length > 0) {
          clearTimeout(fallbackTimer);
          const formattedList = list.map(c => ({
            ...c,
            shortName: c.name ? c.name.charAt(0).toUpperCase() : "C"
          }));
          setClasses(formattedList);
          setActiveClass(formattedList[0]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Firebase read blocked or empty:", err);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(fallbackTimer);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || isTyping || !activeClass) return;

    const userText = input.trim();
    const currentClassId = activeClass.id;
    const currentChatHistory = messages[currentClassId] || [];
    const timestamp = formatTime();
    const date = formatDate();

    const updatedHistory = [
      ...currentChatHistory,
      { sender: "user", text: userText, time: timestamp, date }
    ];

    setMessages(prev => ({ ...prev, [currentClassId]: updatedHistory }));
    setInput("");
    setIsTyping(true);
console.log("STUDENT REQUEST:", {
  message: input,
  studentId: studentId || "local-student",
  classId: id || "global-hub"
});
    try {
      const response = await fetch(
  "https://eduai-api-iifp.onrender.com/student-ai",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          studentId: studentId,
          classId: currentClassId
        })
      });

      if (!response.ok) throw new Error("Server engine drop");
      const data = await response.json();

      const aiTimestamp = formatTime();
      const aiDate = formatDate();

      setMessages(prev => ({
        ...prev,
        [currentClassId]: [
          ...updatedHistory,
          { sender: "ai", text: data.reply, time: aiTimestamp, date: aiDate }
        ]
      }));
    } catch (err) {
      console.error("Tutor communication drop:", err);
      const aiTimestamp = formatTime();
      const aiDate = formatDate();
      setMessages(prev => ({
        ...prev,
        [currentClassId]: [
          ...updatedHistory,
          {
            sender: "ai",
            text: "Error: Could not reach tutor rules channel.",
            time: aiTimestamp,
            date: aiDate
          }
        ]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleScroll = () => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollButton(scrollTop + clientHeight < scrollHeight - 50);
  };

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.addEventListener("scroll", handleScroll);
    return () => chatRef.current.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: "#202225",
          color: "#ffffff",
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        Syncing course channels and connecting database servers...
      </div>
    );
  }

  const activeChatMessages = messages[activeClass?.id] || [];

  return (
    <div style={styles.discordWrapper}>
      {/* SIDEBAR */}
      <div style={styles.serverSidebar}>
        <div style={styles.eduaiLogo}>⭐</div>
        <div style={styles.divider}></div>

        {classes.map((cls) => {
          const isSelected = activeClass?.id === cls.id;
          return (
            <div
              key={cls.id}
              onClick={() => setActiveClass(cls)}
              style={{
                ...styles.serverIcon,
                borderRadius: isSelected ? "16px" : "50%",
                background: isSelected ? "#ffffff" : "#1a1a1a",
                color: isSelected ? "#000000" : "#ffffff"
              }}
              title={cls.name}
            >
              {cls.shortName}
            </div>
          );
        })}
      </div>

      {/* CHANNEL SIDEBAR */}
      <div style={styles.channelSidebar}>
        <h3 style={styles.serverTitle}>{activeClass?.name || "Select Course"}</h3>
        <p style={styles.serverSubtitle}>{activeClass?.subject || "Ecosystem Hub"}</p>
        <div style={{ ...styles.divider, borderColor: "#2e303a", width: "100%" }}></div>

        <div
           style={{ ...styles.channelItem, background: "#1a1a1a", color: "#ffffff" }}
        >
           🤖 EDUAI Tutor
        </div>
          <div style={styles.channelItem}># 📢 class-announcements</div>
          <div style={styles.channelItem}># 📚 study-materials</div>

        <div style={styles.userFooter}>
          <div style={styles.avatar}>S</div>
          <div style={{ fontSize: "13px", fontWeight: "600", color: "#ffffff" }}>
            Student Account
          </div>
        </div>
      </div>

      {/* MAIN CHAT */}
      <div style={styles.chatViewport}>
        <div style={styles.topAppBar}>
          <span style={{ fontWeight: "700", fontSize: "16px", color: "#ffffff" }}>
            🤖 EDUAI Tutor
          </span>
        </div>

        <div ref={chatRef} style={styles.messageBox}>
          {/* SECTION DIVIDER */}
          {activeChatMessages.length > 0 && (
            <div style={styles.sectionDivider}>
              {activeChatMessages[0].date}
            </div>
          )}

          {/* MESSAGES */}
          {activeChatMessages.map((msg, i) => {
            const isUser = msg.sender === "user";
            const prevMsg = activeChatMessages[i - 1];
            const showDivider = prevMsg && prevMsg.date !== msg.date;

            return (
              <>
                {showDivider && (
                  <div style={styles.sectionDivider}>{msg.date}</div>
                )}

                <div key={i} style={styles.discordMessageRow}>
                  <div
                    style={{
                      ...styles.msgAvatar,
                      background: isUser ? "#ffffff" : "#0d0d0d",
                      color: isUser ? "#000000" : "#ffffff"
                    }}
                  >
                    {isUser ? "S" : "AI"}
                  </div>
                  <div>
                    <div style={styles.msgMetaRow}>
                      <span style={styles.msgAuthor}>
                        {isUser ? "Student" : "EDUAI Assistant"}
                      </span>
                      <span style={styles.msgTime}>{msg.time || "Now"}</span>
                    </div>
                    <div style={isUser ? styles.msgBubble : styles.msgBubbleAI}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              </>
            );
          })}

          {/* TYPING */}
          {isTyping && (
            <div style={{ ...styles.discordMessageRow, opacity: 0.7 }}>
              <div style={{ ...styles.msgAvatar, background: "#0d0d0d" }}>AI</div>
              <div>
                <div style={styles.msgMetaRow}>
                  <span style={styles.msgAuthor}>EDUAI Assistant</span>
                </div>
                <div style={styles.typingDots}>
                  <div style={{ ...styles.typingDot, animationDelay: "0s" }}></div>
                  <div style={{ ...styles.typingDot, animationDelay: "0.2s" }}></div>
                  <div style={{ ...styles.typingDot, animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SCROLL BUTTON */}
        {showScrollButton && (
          <button style={styles.scrollButton} onClick={scrollToBottom}>
            ↓
          </button>
        )}

        {/* INPUT */}
        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask EDUAI anything..."
            style={styles.discordInput}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
}
