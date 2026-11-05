import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // AUTO-CREATE USER IF NOT FOUND
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "unassigned",
        createdAt: serverTimestamp()
      });

      alert("Your account has been created. Please ask an admin to assign your role.");
      return;
    }

    const userData = snap.data();

    if (userData.role === "teacher") {
      navigate("/teacher");
    } else if (userData.role === "admin") {
      navigate("/admin/supervisor");
    } else if (userData.role === "student") {
      navigate("/student");
    } else {
      alert("Your role is not assigned yet. Ask an admin to update it.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <button onClick={loginWithGoogle}>Sign in with Google</button>
    </div>
  );
}
