import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminClasses() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    async function loadClasses() {
      const snap = await getDocs(collection(db, "classes"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setClasses(list);
    }

    loadClasses();
  }, []);

  const removeClass = async (id) => {
    await deleteDoc(doc(db, "classes", id));
    alert("Class removed.");
    window.location.reload();
  };

  return (
    <AdminLayout
      title="Class Management"
      subtitle="View and manage all classes"
    >
      <table style={table}>
        <thead>
          <tr>
            <th style={th}>Class ID</th>
            <th style={th}>Class Name</th>
            <th style={th}>Teacher Email</th>
            <th style={th}>Blocked Topics</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {classes.map(c => (
            <tr key={c.id} style={tr}>
              <td style={td}>{c.id}</td>
              <td style={td}>{c.name || "Untitled Class"}</td>
              <td style={td}>{c.teacherEmail || "Unknown"}</td>
              <td style={td}>{c.settings?.blockedTopics?.length || 0}</td>
              <td style={td}>
                <button style={removeBtn} onClick={() => removeClass(c.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
  background: "#1e293b",
  borderRadius: "10px",
  overflow: "hidden",
  border: "1px solid #334155"
};

const th = {
  padding: "14px",
  background: "#14b8a6",
  color: "#0f172a",
  fontWeight: "600",
  textAlign: "left"
};

const tr = {
  borderBottom: "1px solid #334155"
};

const td = {
  padding: "12px",
  color: "#fff"
};

const removeBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};
