// src/styles/teacherContentStyles.js
export const contentStyles = {
  page: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    padding: "32px",
    color: "#fff",
    overflow: "hidden"
  },

  header: {
    marginBottom: "20px"
  },

  headerTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#a855f7"
  },

  headerSubtitle: {
    opacity: 0.7,
    marginTop: "4px"
  },

  documentBox: {
    flex: 1,
    overflowY: "auto",
    background: "#1e293b",
    borderRadius: "12px",
    padding: "32px",
    border: "1px solid #334155"
  },

  documentContent: {
    color: "#e2e8f0",
    lineHeight: "1.7",
    fontSize: "15px"
  },

  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#94a3b8",
    textAlign: "center"
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px"
  },

  emptyTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#cbd5e1"
  },

  emptySubtitle: {
    margin: 0,
    fontSize: "14px",
    maxWidth: "400px"
  },

  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    padding: "16px 0",
    marginTop: "20px"
  },

  macroBtn: {
    background: "#334155",
    color: "#fff",
    border: "1px solid #475569",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.15s"
  },

  exportBtn: {
    background: "#a855f7",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    marginLeft: "auto"
  },

  inputRow: {
    display: "flex",
    gap: "12px",
    marginTop: "20px"
  },

  input: {
    flex: 1,
    border: "1px solid #475569",
    borderRadius: "8px",
    padding: "14px 16px",
    fontSize: "14px",
    background: "#1e293b",
    color: "#fff",
    outline: "none"
  },

  sendButton: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "0 24px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer"
  }
};
