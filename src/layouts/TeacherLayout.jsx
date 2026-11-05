export default function TeacherLayout({ children }) {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100vw",
      background: "#111111",      // ⭐ CHARCOAL BLACK
      overflow: "hidden"
    }}>
      <TeacherSidebar />

      <div style={{
        flex: 1,
        overflow: "auto",
        padding: "32px",
        color: "#ffffff"          // ⭐ WHITE TEXT
      }}>
        {children}
      </div>
    </div>
  );
}
