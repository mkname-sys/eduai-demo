import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function MyClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, "classes"),
          where("teacherId", "==", user.uid)
        );

        const snapshot = await getDocs(q);
        const classList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setClasses(classList);
        setLoading(false);
      } catch (error) {
        console.error("Error loading classes:", error);
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return <p style={{ padding: 20 }}>Loading your classes...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Classes</h1>

      {classes.length === 0 && <p>You have no classes yet.</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        {classes.map((cls) => (
          <div
            key={cls.id}
           onClick={() => navigate(`/teacher/class/${cls.id}`)}
            style={{
              background: "#f4f4f4",
              padding: 20,
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            <h2>{cls.name}</h2>
            <p>Subject: {cls.subject}</p>
            <p>Grade: {cls.grade}</p>
            <p>Period: {cls.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
