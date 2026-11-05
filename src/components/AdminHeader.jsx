export default function AdminHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "600",
          margin: 0,
          color: "#14b8a6"
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            marginTop: "6px",
            fontSize: "16px",
            opacity: 0.8
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
