import { useState } from "react";

export default function ClassSettings() {
  const [className, setClassName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [restrictions, setRestrictions] = useState("");

  function saveSettings() {
    console.log("Saved settings:", {
      className,
      gradeLevel,
      subject,
      restrictions
    });
    alert("Class settings saved (local only for now).");
  }

  return (
    <div style={styles.container}>
      <h2>Class Settings</h2>
      <p style={{ opacity: 0.7 }}>Configure your class details and restrictions.</p>

      <div style={styles.field}>
        <label>Class Name</label>
        <input
          style={styles.input}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="e.g., 7th Grade Science"
        />
      </div>

      <div style={styles.field}>
        <label>Grade Level</label>
        <input
          style={styles.input}
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          placeholder="e.g., 7"
        />
      </div>

      <div style={styles.field}>
        <label>Subject</label>
        <input
          style={styles.input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Math, Science, ELA"
        />
      </div>

      <div style={styles.field}>
        <label>Restrictions</label>
        <textarea
          style={styles.textarea}
          value={restrictions}
          onChange={(e) => setRestrictions(e.target.value)}
          placeholder="e.g., No politics, no dating topics"
        />
      </div>

      <button style={styles.button} onClick={saveSettings}>
        Save Settings
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    background: "#f7f7f7",
    borderRadius: 10,
    maxWidth: 700
  },
  field: {
    marginBottom: 20,
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 15
  },
  textarea: {
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 15,
    height: 100
  },
  button: {
    padding: "12px 18px",
    borderRadius: 6,
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontSize: 15
  }
};
