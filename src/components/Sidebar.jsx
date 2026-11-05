import { Link } from "react-router-dom";

export default function Sidebar({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar only for teacher pages */}
      <div style={{
        width: 240,
        borderRight: "1px solid #e2e8f0",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
        <h3>Teacher Menu</h3>

        <Link to="/teacher">Dashboard</Link>
        <Link to="/teacher/content">AI Content Chat</Link>
        <Link to="/teacher/control">AI Behavior Control</Link>
        <Link to="/teacher/data">AI Data Panel</Link>

        <h4 style={{ marginTop: 20 }}>Classes</h4>
        <Link to="/teacher/classes">My Classes</Link>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}
