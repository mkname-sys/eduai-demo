import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../firebase";

export default function StudentsPage() {
  const { id } = useParams(); // class ID
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  useEffect(() => {
    const ref = collection(db, "classes", id, "students");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(list);
    });

    return unsubscribe;
  }, [id]);

  const addStudent = async () => {
    if (!newStudent.trim()) return;

    await addDoc(collection(db, "classes", id, "students"), {
      name: newStudent.trim(),
    });

    setNewStudent("");
  };

  const removeStudent = async (studentId) => {
    await deleteDoc(doc(db, "classes", id, "students", studentId));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Students</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Student name"
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
          style={{ padding: 10, marginRight: 10 }}
        />
        <button onClick={addStudent} style={{ padding: "10px 20px" }}>
          Add Student
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {students.map((s) => (
          <div
            key={s.id}
            style={{
              background: "#f4f4f4",
              padding: 15,
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{s.name}</span>
            <button
              onClick={() => removeStudent(s.id)}
              style={{ padding: "6px 12px", background: "red", color: "white" }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
