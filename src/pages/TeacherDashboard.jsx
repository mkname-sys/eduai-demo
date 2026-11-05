import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

import { dashboardStyles as styles } from "../styles/teacherDashboardStyles";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "classes"),
          where("teacherId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const classList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClasses(classList);
      } catch (err) {
        console.error("TeacherDashboard class load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Teacher Dashboard</h1>
      <p style={styles.subtitle}>Select a class to open your AI teaching tools.</p>

      {classes.length === 0 && (
        <p style={{ opacity: 0.7 }}>You have no classes assigned yet.</p>
      )}

      <div style={styles.grid}>
        {classes.map(cls => (
          <Link
            key={cls.id}
            to={`/teacher/class/${cls.id}/content`}
            style={styles.card}
          >
            <h2 style={styles.className}>{cls.name}</h2>
            <p style={styles.classMeta}>Subject: {cls.subject}</p>
            <p style={styles.classMeta}>Grade: {cls.grade}</p>
            <p style={styles.classMeta}>Period: {cls.period}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
