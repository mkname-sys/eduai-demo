import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminAnalytics() {
  const [teachers, setTeachers] = useState(0);
  const [students, setStudents] = useState(0);
  const [classes, setClasses] = useState(0);
  const [blockedTopics, setBlockedTopics] = useState(0);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [aiByClass, setAiByClass] = useState({});
  const [aiByTeacher, setAiByTeacher] = useState({});
  const [aiByStudent, setAiByStudent] = useState({});
  const [aiSubjects, setAiSubjects] = useState({});
  const [aiSafetyTriggers, setAiSafetyTriggers] = useState(0);

  useEffect(() => {
    async function loadAnalytics() {
      const userSnap = await getDocs(collection(db, "users"));
      const userList = userSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      setTeachers(userList.filter(u => u.role === "teacher").length);
      setStudents(userList.filter(u => u.role === "student").length);

      const classSnap = await getDocs(collection(db, "classes"));
      setClasses(classSnap.docs.length);

      const globalSnap = await getDoc(doc(db, "settings", "global"));
      if (globalSnap.exists()) {
        const data = globalSnap.data();
        setBlockedTopics(data.blockedTopics?.length || 0);
        setMaintenanceMode(data.maintenanceMode || false);
      }

      const aiSnap = await getDocs(collection(db, "ai_logs"));
      const aiLogs = aiSnap.docs.map(d => d.data());

      const classCounts = {};
      const teacherCounts = {};
      const studentCounts = {};
      const subjectCounts = {};
      let safetyCount = 0;

      aiLogs.forEach(log => {
        classCounts[log.classId] = (classCounts[log.classId] || 0) + 1;

        if (log.role === "teacher") {
          teacherCounts[log.userId] = (teacherCounts[log.userId] || 0) + 1;
        }

        if (log.role === "student") {
          studentCounts[log.userId] = (studentCounts[log.userId] || 0) + 1;
        }

        if (log.subject) {
          subjectCounts[log.subject] = (subjectCounts[log.subject] || 0) + 1;
        }

        if (log.safetyTriggered) {
          safetyCount++;
        }
      });

      setAiByClass(classCounts);
      setAiByTeacher(teacherCounts);
      setAiByStudent(studentCounts);
      setAiSubjects(subjectCounts);
      setAiSafetyTriggers(safetyCount);
    }

    loadAnalytics();
  }, []);

  return (
    <AdminLayout
      title="Analytics Dashboard"
      subtitle="System usage, AI activity, and safety metrics"
    >
      {/* BASIC STATS */}
      <div style={grid}>
        <StatCard title="Total Teachers" value={teachers} />
        <StatCard title="Total Students" value={students} />
        <StatCard title="Total Classes" value={classes} />
        <StatCard title="Blocked Topics" value={blockedTopics} />
        <StatCard
          title="Maintenance Mode"
          value={maintenanceMode ? "🛑 Enabled" : "🟢 Disabled"}
        />
      </div>

      {/* AI ANALYTICS */}
      <h2 style={sectionTitle}>AI Activity Analytics</h2>

      <AnalyticsSection title="AI Requests Per Class" data={aiByClass} />
      <AnalyticsSection title="AI Requests Per Teacher" data={aiByTeacher} />
      <AnalyticsSection title="AI Requests Per Student" data={aiByStudent} />
      <AnalyticsSection title="Most Asked Subjects" data={aiSubjects} />

      <div style={{ marginTop: "20px" }}>
        <h3 style={cardTitle}>Safety Filter Triggers</h3>
        <p style={{ fontSize: "28px", fontWeight: "700" }}>
          {aiSafetyTriggers}
        </p>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={{ fontSize: "28px", fontWeight: "700" }}>{value}</p>
    </div>
  );
}

function AnalyticsSection({ title, data }) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={cardTitle}>{title}</h3>
      <div style={{ marginTop: "10px" }}>
        {Object.keys(data).length === 0 ? (
          <p style={{ opacity: 0.7 }}>No data yet.</p>
        ) : (
          Object.entries(data).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {value}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "24px",
  marginTop: "30px"
};

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #334155",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
};

const cardTitle = {
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#14b8a6"
};

const sectionTitle = {
  marginTop: "40px",
  fontSize: "22px",
  fontWeight: "600",
  color: "#14b8a6"
};
