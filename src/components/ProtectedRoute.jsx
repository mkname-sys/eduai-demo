import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Maintenance from "../pages/Maintenance";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserData(null);
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setUserData({ uid: user.uid, ...snap.data() });
      } else {
        setUserData(null);
      }

      const globalSnap = await getDoc(doc(db, "settings", "global"));
      if (globalSnap.exists()) {
        setMaintenanceMode(globalSnap.data().maintenanceMode || false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (maintenanceMode && userData?.role !== "admin") {
    return <Maintenance />;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  // Inject user into AdminGate
  return children && typeof children === "object"
    ? { ...children, props: { ...children.props, user: userData } }
    : children;
}
