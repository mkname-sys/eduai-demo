export default function Maintenance() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "#f1f5f9",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "40px", marginBottom: "20px" }}>🛑 EDUAI is Under Maintenance</h1>
      <p style={{ fontSize: "20px", maxWidth: "600px" }}>
        The system is temporarily unavailable while administrators perform updates.
        Please check back later.
      </p>
    </div>
  );
}
