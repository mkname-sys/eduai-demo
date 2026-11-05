import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ClassDetails() {
  const { id } = useParams(); // class ID from URL
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClass = async () => {
      try {
        const ref = doc(db, "classes", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setClassData({ id: snap.id, ...snap.data() });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading class:", err);
        setLoading(false);
      }
    };

    loadClass();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading class...</p>;
  }

  if (!classData) {
    return <p style={{ padding: 20 }}>Class not found.</p>;
  }

  const { name, subject, grade, period, settings } = classData;

  return (
    <div style={{ padding: 20 }}>
      <h1>{name}</h1>

      <p><strong>Subject:</strong> {subject}</p>
      <p><strong>Grade:</strong> {grade}</p>
      <p><strong>Period:</strong> {period}</p>

      <h2 style={{ marginTop: 30 }}>Settings</h2>
      <p><strong>Tone:</strong> {settings?.tone}</p>
      <p><strong>Difficulty:</strong> {settings?.difficulty}</p>
      <p><strong>Explanation Mode:</strong> {settings?.explanationMode}</p>
      <p><strong>Blocked Topics:</strong> {settings?.blockedTopics?.length || 0}</p>
      <p><strong>Restrictions:</strong> {settings?.restrictions?.length || 0}</p>

      <div style={{ marginTop: 30, display: "flex", gap: 15 }}>
        <button onClick={() => navigate(`/class/${id}/settings`)}>
  Edit Settings
</button>


        <button
          onClick={() => navigate(`/class/${id}/students`)}
          style={{ padding: "10px 20px" }}
        >
          View Students
        </button>

        <button
          onClick={() => navigate(`/class/${id}/tutor`)}
          style={{ padding: "10px 20px" }}
        >
          Open AI Tutor
        </button>
      </div>
    </div>
  );
}
