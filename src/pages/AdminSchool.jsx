import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminSchool() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "settings", "global"));
      if (snap.exists()) {
        setMaintenanceMode(snap.data().maintenanceMode || false);
      }
    }
    load();
  }, []);

  async function toggleMaintenance() {
    const newState = !maintenanceMode;
    setMaintenanceMode(newState);

    await updateDoc(doc(db, "settings", "global"), {
      maintenanceMode: newState
    });
  }

  return (
    <AdminLayout
      title="School Settings"
      subtitle="Manage global school configuration"
    >
      <div style={card}>
        <h3 style={cardTitle}>Maintenance Mode</h3>
        <p style={{ marginBottom: "10px" }}>
          When enabled, students and teachers cannot access EDUAI.
        </p>

        <button
          onClick={toggleMaintenance}
          style={{
            padding: "12px 20px",
            background: maintenanceMode ? "#dc2626" : "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          {maintenanceMode ? "Disable Maintenance Mode" : "Enable Maintenance Mode"}
        </button>
      </div>
    </AdminLayout>
  );
}

const card = {
  marginTop: "30px",
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
