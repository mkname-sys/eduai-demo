import { Navigate } from "react-router-dom";

export default function AdminGate({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
