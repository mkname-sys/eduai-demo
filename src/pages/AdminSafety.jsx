import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminSafety() {
  const [blockedTopics, setBlockedTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const snap = await getDoc(
  doc(db, "system", "globalSettings")
);
      if (snap.exists()) {
        const data = snap.data();
        setBlockedTopics(data.blockedTopics || []);
        setLocked(data.lockedSettings || false);
      }
    }
    loadSettings();
  }, []);

  const addTopic = async () => {
    if (!newTopic.trim()) return;

    const updated = [...blockedTopics, newTopic.trim()];

    await updateDoc(
  doc(db, "system", "globalSettings"),
  {
      blockedTopics: updated
    });

    setBlockedTopics(updated);
    setNewTopic("");
  };

  const removeTopic = async (topic) => {
    const updated = blockedTopics.filter(t => t !== topic);

    await updateDoc(
  doc(db, "system", "globalSettings"),
  {
      blockedTopics: updated
    });

    setBlockedTopics(updated);
  };

  const toggleLock = async () => {
    const next = !locked;

    await updateDoc(doc(db, "system", "globalSettings"), {
      lockedSettings: next
    });

    setLocked(next);
  };

  return (
    <AdminLayout
      title="Safety Settings"
      subtitle="Manage global blocked topics and lock dangerous settings"
    >
      {/* BLOCKED TOPICS */}
      <div style={card}>
        <h3 style={cardTitle}>Global Blocked Topics</h3>

        <div style={listBox}>
          {blockedTopics.length === 0 ? (
            <p style={{ opacity: 0.7 }}>No blocked topics yet.</p>
          ) : (
            blockedTopics.map((topic) => (
              <div key={topic} style={listItem}>
                <span>{topic}</span>
                <button style={removeBtn} onClick={() => removeTopic(topic)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Add blocked topic"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            style={input}
          />
          <button style={addBtn} onClick={addTopic}>
            Add
          </button>
        </div>
      </div>

      {/* LOCK SETTINGS */}
      <div style={{ ...card, marginTop: "30px" }}>
        <h3 style={cardTitle}>Lock Dangerous Settings</h3>
        <p style={{ marginBottom: "10px" }}>
          Prevent teachers from modifying sensitive safety settings.
        </p>

        <button
          onClick={toggleLock}
          style={{
            padding: "12px 20px",
            background: locked ? "#dc2626" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {locked ? "Unlock Settings" : "Lock Settings"}
        </button>
      </div>
    </AdminLayout>
  );
}

const card = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #334155",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
};

const cardTitle = {
  marginBottom: "15px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#14b8a6"
};

const listBox = {
  background: "#334155",
  padding: "20px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#475569",
  padding: "12px 16px",
  borderRadius: "8px"
};

const removeBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const input = {
  flex: 1,
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#0f172a",
  color: "#fff"
};

const addBtn = {
  padding: "10px 16px",
  background: "#14b8a6",
  color: "#0f172a",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600"
};
