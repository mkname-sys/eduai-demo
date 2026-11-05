// src/styles/teacherControlStyles.js

export const controlStyles = {
  page: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "#fff",
    padding: "24px"
  },

  header: {
    marginBottom: "20px"
  },

  headerTitle: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#a855f7",
    marginBottom: "6px"
  },

  headerSubtitle: {
    fontSize: "15px",
    color: "#94a3b8"
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingRight: "8px",
    marginBottom: "20px"
  },

  teacherMessage: {
    alignSelf: "flex-end",
    maxWidth: "75%",
    background: "#7c3aed",
    color: "#fff",
    padding: "14px 16px",
    borderRadius: "16px 16px 4px 16px"
  },

  assistantMessage: {
    alignSelf: "flex-start",
    maxWidth: "75%",
    background: "#1e293b",
    color: "#e2e8f0",
    padding: "14px 16px",
    borderRadius: "16px 16px 16px 4px",
    border: "1px solid #334155"
  },

  messageLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#cbd5e1",
    marginBottom: "6px"
  },

  inputSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px"
  },

  chatInput: {
    flex: 1,
    background: "#1e293b",
    color: "#fff",
    border: "1px solid #334155",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none"
  },

  sendButton: {
    background: "#a855f7",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "0 22px",
    fontWeight: "600",
    cursor: "pointer"
  },

  statusPanel: {
    background: "#111827",
    border: "1px solid #334155",
    borderRadius: "14px",
    padding: "16px"
  },

  statusTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#a855f7",
    marginBottom: "12px"
  },

  statusGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
    color: "#cbd5e1",
    fontSize: "14px"
  },

  topicRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px"
  },

  topicBadge: {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600"
  }
};