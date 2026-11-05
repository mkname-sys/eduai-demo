// src/styles/discordStyles.js — DISCORD-STYLE STUDENT UI THEME
const styles = {
  discordWrapper: {
    display: "flex",
    width: "100%",
    height: "100vh",
    background: "#000000",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
    overflow: "hidden",
    boxSizing: "border-box"
  },

  serverSidebar: {
    width: "72px",
    background: "#0d0d0d",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "12px",
    gap: "8px"
  },

  eduaiLogo: {
    fontSize: "20px",
    cursor: "pointer",
    background: "#1a1a1a",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease"
  },

  divider: {
    width: "32px",
    borderBottom: "2px solid #36393f",
    margin: "4px 0"
  },

  serverIcon: {
    width: "48px",
    height: "48px",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "#1a1a1a",
    color: "#ffffff"
  },

  channelSidebar: {
    width: "240px",
    background: "#0d0d0d",
    display: "flex",
    flexDirection: "column",
    padding: "14px 10px",
    position: "relative"
  },

  serverTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#fff"
  },

  serverSubtitle: {
    margin: "2px 0 10px 0",
    fontSize: "12px",
    color: "#b9bbbe"
  },

  channelGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "10px"
  },

  channelItem: {
    padding: "8px 10px",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#8e9297",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s ease"
  },

  userFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    background: "#1a1a1a",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxSizing: "border-box"
  },

  avatar: {
    width: "32px",
    height: "32px",
    background: "#ffffff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    color: "#000000"
  },

  chatViewport: {
  flex: 1,
  background: "#000000",
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  position: "relative"
},

  topAppBar: {
    height: "48px",
    borderBottom: "1px solid #202225",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    color: "#fff"
  },

  messageBox: {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  padding: "20px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "20px"
},

  sectionDivider: {
    textAlign: "center",
    color: "#9e9e9e",
    fontSize: "12px",
    margin: "10px 0",
    opacity: 0.7
  },

  discordMessageRow: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    animation: "fadeIn 0.3s ease"
  },

  msgAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    color: "#fff"
  },

  msgMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },

  msgAuthor: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px"
  },

  msgTime: {
    color: "#9e9e9e",
    fontSize: "12px"
  },

  msgBubble: {
    background: "#1a1a1a",
    padding: "10px 14px",
    borderRadius: "8px",
    marginTop: "4px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#ffffff",
    maxWidth: "75%",
    animation: "slideUp 0.25s ease"
  },

  msgBubbleAI: {
    background: "#0d0d0d",
    padding: "10px 14px",
    borderRadius: "8px",
    marginTop: "4px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#ffffff",
    maxWidth: "75%",
    animation: "slideUp 0.25s ease"
  },

  typingDots: {
    display: "flex",
    gap: "4px",
    marginTop: "6px"
  },

  typingDot: {
    width: "6px",
    height: "6px",
    background: "#ffffff",
    borderRadius: "50%",
    animation: "typingBlink 1.4s infinite ease-in-out"
  },

  inputContainer: {
  padding: "16px 20px",
  borderTop: "1px solid #202225",
  background: "#000000",
  flexShrink: 0
},

discordInput: {
  width: "100%",
  minHeight: "56px",
  background: "#1a1a1a",
  border: "1px solid #2f3136",
  borderRadius: "16px",
  padding: "16px 20px",
  color: "#ffffff",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box"
},

  scrollButton: {
    position: "absolute",
    bottom: "90px",
    right: "30px",
    background: "#ffffff",
    color: "#000000",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0px 0px 10px rgba(255,255,255,0.3)",
    transition: "transform 0.2s ease",
    zIndex: 10
  },

}
export default styles;
