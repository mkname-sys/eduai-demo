import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function AddUserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");

  const createUser = async () => {
    if (!email) return alert("Email required.");

    await addDoc(collection(db, "pendingInvites"), {
      email,
      role
    });

    alert("Invite registered.");

    setEmail("");
    setRole("teacher");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Add New User</h3>

      <input
        type="email"
        placeholder="User email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="teacher">Teacher</option>
        <option value="student">Student</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={createUser}>
        Create Invite
      </button>
    </div>
  );
}
