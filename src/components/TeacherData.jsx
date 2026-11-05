import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { dataStyles as styles } from "../styles/teacherDataStyles";

export default function TeacherData() {
  const { classId } = useParams();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    topQuestions: [],
    topTopics: [],
    struggleTopics: [],
    hintUsageStats: [],
    totalInteractions: 0,
    blockedAttemptsCount: 0
  });

  useEffect(() => {
    async function greetIfFirstTime() {
      if (!classId) return;

      const memRef = doc(db, "classes", classId);
      const memSnap = await getDoc(memRef);

      if (!memSnap.exists() || !memSnap.data().firstTimeTeacherDataPanel) {
        await setDoc(
          memRef,
          { firstTimeTeacherDataPanel: true },
          { merge: true }
        );

        alert(
          `Welcome to the EDUAI Data Panel for class "${classId}"!\n\nThis dashboard analyzes student activity logs and converts them into actionable insights for this specific class.`
        );
      }
    }

    greetIfFirstTime();
  }, [classId]);

  useEffect(() => {
  let interval;

  async function fetchAnalytics() {
    try {
      if (!classId) return;

      const response = await fetch(
        `http://localhost:3001/teacher/data?classId=${classId}`
      );

      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error("Telemetry Compilation Exception:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchAnalytics();

  interval = setInterval(fetchAnalytics, 15000);

  return () => clearInterval(interval);
}, [classId]);

  if (!classId) {
  return <div style={{ padding: 40, color: "#fff" }}>Invalid class route.</div>;
}

if (loading && metrics.totalInteractions === 0) {
  return (
    <div style={{ padding: 40, color: "#fff" }}>
      Backend offline — analytics cannot load.
    </div>
  );
}


  if (loading) {
    return (
      <div style={{ padding: 40, color: "#fff" }}>
        Compiling student diagnostic data arrays and computing focus metrics...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Class Data — {classId}</h1>
        <p style={styles.headerSubtitle}>
          Analytics for student interactions and AI usage.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Activity Cycles</div>
          <div style={styles.statValue}>{metrics.totalInteractions}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Safety Interventions</div>
          <div
            style={{
              ...styles.statValue,
              color:
                metrics.blockedAttemptsCount > 0
                  ? "#dc2626"
                  : "#16a34a"
            }}
          >
            {metrics.blockedAttemptsCount}
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Restricted Block Attempts</div>
          <div
            style={{
              ...styles.statValue,
              color:
                metrics.blockedAttemptsCount > 0 ? "#dc2626" : "#475569"
            }}
          >
            {metrics.blockedAttemptsCount} Caught
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequent Student Questions</h2>
        <div style={styles.listBox}>
          {metrics.topQuestions.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Insufficient message telemetry collected.
            </p>
          ) : (
            metrics.topQuestions.map((q, i) => (
              <div key={i} style={styles.listItem}>
                “{q}”
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>High-Comprehension Subject Hubs</h2>
        <div style={styles.listBox}>
          {metrics.topTopics.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Insufficient concept logs processed.
            </p>
          ) : (
            metrics.topTopics.map((t, i) => (
              <div key={i} style={styles.listItem}>
                📈 {t}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Identified Learning Gaps</h2>
        <div style={styles.listBox}>
          {metrics.struggleTopics.length === 0 ? (
            <p style={{ color: "#16a34a" }}>✓ No learning bottlenecks detected.</p>
          ) : (
            metrics.struggleTopics.map((s, i) => (
              <div key={i} style={{ ...styles.listItem, color: "#dc2626" }}>
                ⚠️ {s}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tutor Help Path Distributions</h2>
        <div style={styles.listBox}>
          {metrics.hintUsageStats.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>No scaffolding vectors logged.</p>
          ) : (
            metrics.hintUsageStats.map((h, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{h.element}</span>
                  <span>{h.count} requests</span>
                </div>

                <div
                  style={{
                    height: "8px",
                    background: "#334155",
                    marginTop: "4px",
                    borderRadius: "4px"
                  }}
                >
                  <div
                    style={{
                      height: "8px",
                      background: "#2563eb",
                      width: `${Math.min(h.count * 2, 100)}%`,
                      borderRadius: "4px"
                    }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
