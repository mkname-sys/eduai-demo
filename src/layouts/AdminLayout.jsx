import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div
        style={{
          marginLeft: "240px",
          padding: "40px",
          width: "100%",
          minHeight: "100vh",
          background: "#0f172a",
          color: "#fff"
        }}
      >
        {/* ADMIN HEADER */}
        <AdminHeader title={title} subtitle={subtitle} />

        {/* PAGE CONTENT */}
        <div style={{ marginTop: "30px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
