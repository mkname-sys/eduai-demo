import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "../firebase";
import AdminLayout from "../layouts/AdminLayout";
import AddUserForm from "../components/AddUserForm";

export default function AdminUsers() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const snap = await getDocs(collection(db, "users"));

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data()
    }));

    setTeachers(
      list.filter((u) => u.role === "teacher")
    );

    setStudents(
      list.filter((u) => u.role === "student")
    );

    setAdmins(
      list.filter((u) => u.role === "admin")
    );

    setPendingUsers(
      list.filter(
        (u) =>
          !u.role ||
          u.role === "unassigned"
      )
    );
  }

  const assignRole = async (id, role) => {
    try {
      await updateDoc(doc(db, "users", id), {
        role
      });

      alert(`User assigned as ${role}`);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to assign role.");
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));

      alert("User removed.");

      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to remove user.");
    }
  };

  return (
    <AdminLayout
      title="User Management"
      subtitle="Manage teachers, students, admins, and pending users"
    >
      {/* TEMPORARY USER CREATION TOOL */}
      <div style={card}>
        <h3 style={cardTitle}>Add New User (Testing Only)</h3>
        <AddUserForm />
      </div>

      {/* PENDING USERS */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={sectionTitle}>Pending Users</h2>

        <div style={listBox}>
          {pendingUsers.length === 0 ? (
            <p>No pending users.</p>
          ) : (
            pendingUsers.map((user) => (
              <div key={user.id} style={listItem}>
                <span>{user.email}</span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    style={assignBtn}
                    onClick={() =>
                      assignRole(user.id, "teacher")
                    }
                  >
                    Teacher
                  </button>

                  <button
                    style={assignBtn}
                    onClick={() =>
                      assignRole(user.id, "student")
                    }
                  >
                    Student
                  </button>

                  <button
                    style={adminBtn}
                    onClick={() =>
                      assignRole(user.id, "admin")
                    }
                  >
                    Admin
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADMINS */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={sectionTitle}>Admins</h2>

        <div style={listBox}>
          {admins.length === 0 ? (
            <p>No admins found.</p>
          ) : (
            admins.map((admin) => (
              <div key={admin.id} style={listItem}>
                <span>{admin.email}</span>

                <button
                  style={removeBtn}
                  onClick={() => removeUser(admin.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TEACHERS */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={sectionTitle}>Teachers</h2>

        <div style={listBox}>
          {teachers.length === 0 ? (
            <p>No teachers found.</p>
          ) : (
            teachers.map((teacher) => (
              <div key={teacher.id} style={listItem}>
                <span>{teacher.email}</span>

                <button
                  style={removeBtn}
                  onClick={() => removeUser(teacher.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* STUDENTS */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={sectionTitle}>Students</h2>

        <div style={listBox}>
          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            students.map((student) => (
              <div key={student.id} style={listItem}>
                <span>{student.email}</span>

                <button
                  style={removeBtn}
                  onClick={() => removeUser(student.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const card = {
  background: "#1e293b",
  padding: "25px",
  borderRadius: "10px",
  border: "1px solid #334155",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,.2)"
};

const cardTitle = {
  marginBottom: "15px",
  fontSize: "18px",
  fontWeight: "600",
  color: "#14b8a6"
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#14b8a6",
  marginBottom: "10px"
};

const listBox = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #334155",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const listItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#334155",
  padding: "12px 16px",
  borderRadius: "8px"
};

const assignBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const adminBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const removeBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};