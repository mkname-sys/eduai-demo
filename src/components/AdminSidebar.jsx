import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1e293b",
        color: "#fff",
        padding: "24px",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        borderRight: "1px solid #334155"
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          color: "#14b8a6",
          marginBottom: "10px"
        }}
      >
        EDUAI Admin
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <Link
          to="/admin/users"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Users
        </Link>

        <Link
          to="/admin/classes"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Classes
        </Link>

        <Link
          to="/admin/safety"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Safety
        </Link>

        <Link
          to="/admin/school"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          School Settings
        </Link>

        <Link
          to="/admin/analytics"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Analytics
        </Link>

        <Link
          to="/admin/supervisor"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Dashboard
        </Link>
      </nav>
    </div>
  );
}