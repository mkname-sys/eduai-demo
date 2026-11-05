export const dashboardStyles = {
  page: {
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff"
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#a855f7",
    marginBottom: "10px"
  },

  subtitle: {
    opacity: 0.7,
    marginBottom: "30px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #334155",
    textDecoration: "none",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "0.2s"
  },

  cardHover: {
    transform: "scale(1.02)"
  },

  className: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#a855f7",
    marginBottom: "6px"
  },

  classMeta: {
    opacity: 0.8,
    marginBottom: "4px"
  }
};
