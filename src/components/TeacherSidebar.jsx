import { Link, useParams } from "react-router-dom";

export default function TeacherSidebar() {
  const { id } = useParams();

  return (
    <div style={{
      width: "160px",
      background: "#000000",      // ⭐ TRUE BLACK
      padding: "16px",
      color: "#ffffff",           // ⭐ PURE WHITE
      borderRight: "1px solid #1a1a1a",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      
      <h2 style={{
        color: "#a855f7",
        fontSize: "15px",
        fontWeight: "600",
        marginBottom: "8px"
      }}>
        EDUAI Teacher
      </h2>

      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px"
      }}>
        <Link to={`/teacher/class/${id}/content`} style={linkStyle}>
          Content Chat
        </Link>

        <Link to={`/teacher/class/${id}/control`} style={linkStyle}>
          Control Panel
        </Link>

        <Link to={`/teacher/class/${id}/data`} style={linkStyle}>
          Class Data
        </Link>
      </nav>
    </div>
  );
}

const linkStyle = {
  color: "#e5e5e5",               // ⭐ SOFT WHITE
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: "6px",
  fontSize: "14px",
  transition: "0.2s",
  background: "transparent"
};
