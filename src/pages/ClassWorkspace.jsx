import { Outlet, useParams, Link } from "react-router-dom";

export default function ClassWorkspace() {
  const { classId } = useParams();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0f172a",
        color: "#fff",
        overflow: "hidden"
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#020617",
          padding: "20px",
          borderRight: "1px solid #1e293b",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          flexShrink: 0
        }}
      >
        <h2
          style={{
            color: "#a855f7",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "8px"
          }}
        >
          EDUAI Teacher
        </h2>

        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginBottom: "16px"
          }}
        >
          {classId}
        </p>

        <Link
          to={`/teacher/class/${classId}/content`}
          style={linkStyle}
        >
          📄 Content Studio
        </Link>

        <Link
          to={`/teacher/class/${classId}/control`}
          style={linkStyle}
        >
          🤖 Classroom Assistant
        </Link>

        <Link
          to={`/teacher/class/${classId}/data`}
          style={linkStyle}
        >
          📊 Class Insights
        </Link>
      </div>

      {/* Workspace */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

const linkStyle = {
  color: "#e5e7eb",
  textDecoration: "none",
  padding: "12px 14px",
  borderRadius: "10px",
  background: "#111827",
  fontSize: "14px"
};
