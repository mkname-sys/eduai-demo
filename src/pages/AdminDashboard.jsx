import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [analyticsPreview, setAnalyticsPreview] = useState(null);

  useEffect(() => {
    loadMaintenance();
    loadAnalyticsPreview();
  }, []);

  async function loadMaintenance() {
    const snap = await getDoc(doc(db, "settings", "global"));
    if (snap.exists()) {
      setMaintenanceMode(snap.data().maintenanceMode || false);
    }
  }

  async function loadAnalyticsPreview() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/teacher/data?classId=global-hub`
      );
      const data = await res.json();
      setAnalyticsPreview(data);
    } catch (err) {
      console.error("Analytics preview error:", err);
    }
  }

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Overview of your school system"
    >
      {/* STATUS CARDS */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >
        {/* Maintenance Status */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Maintenance Mode</h3>
          <p>
            Status:{" "}
            <strong
              style={{
                color: maintenanceMode ? "#dc2626" : "#16a34a"
              }}
            >
              {maintenanceMode ? "Enabled" : "Disabled"}
            </strong>
          </p>
          <Link to="/admin/school" style={buttonStyle}>
            Manage Maintenance
          </Link>
        </div>

        {/* Analytics Preview */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Analytics Overview</h3>
          {analyticsPreview ? (
            <>
              <p>
                Total Interactions:{" "}
                <strong>{analyticsPreview.totalInteractions}</strong>
              </p>
              <p>
                Blocked Attempts:{" "}
                <strong>{analyticsPreview.blockedAttemptsCount}</strong>
              </p>
              <Link to="/admin/analytics" style={buttonStyle}>
                View Full Analytics
              </Link>
            </>
          ) : (
            <p>Loading analytics...</p>
          )}
        </div>

        {/* Classes */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>Class Management</h3>
          <p>View and manage all classes.</p>
          <Link to="/admin/classes" style={buttonStyle}>
            Manage Classes
          </Link>
        </div>

        {/* Users */}
        <div style={cardStyle}>
          <h3 style={cardTitle}>User Management</h3>
          <p>View teachers and students.</p>
          <Link to="/admin/users" style={buttonStyle}>
            Manage Users
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #334155",
  width: "300px",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
};

const cardTitle = {
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#14b8a6"
};

const buttonStyle = {
  marginTop: "10px",
  display: "inline-block",
  padding: "10px 16px",
  background: "#14b8a6",
  color: "#0f172a",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600"
};
