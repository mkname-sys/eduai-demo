// src/App.jsx — CLEAN, WORKING, COPILOT-STYLE ROUTER
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Teacher pages
import TeacherDashboard from "./pages/TeacherDashboard";
import ClassWorkspace from "./pages/ClassWorkspace";
import MyClasses from "./pages/MyClasses";
import StudentsPage from "./pages/StudentsPage";
import AITutor from "./pages/AITutor";

// Teacher tools (components, NOT pages)
import TeacherContentChat from "./components/TeacherContentChat";
import TeacherControlPanel from "./components/TeacherControlPanel";
import TeacherData from "./components/TeacherData";

// Student side
import StudentDashboard from "./pages/StudentDashboard";

// Authentication
import Login from "./pages/Login";

// Admin system
import AdminGate from "./components/AdminGate";
import AdminLayout from "./layouts/AdminLayout";

// Admin pages
import AdminUsers from "./pages/AdminUsers";
import AdminClasses from "./pages/AdminClasses";
import AdminSafety from "./pages/AdminSafety";
import AdminSchool from "./pages/AdminSchool";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔑 Public Authentication Entry */}
        <Route path="/login" element={<Login />} />

        {/* 👑 ADMIN ROUTES */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminClasses />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/safety"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminSafety />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/school"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminSchool />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminAnalytics />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/supervisor"
          element={
            <ProtectedRoute>
              <AdminGate>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminGate>
            </ProtectedRoute>
          }
        />

        {/* 🟩 TEACHER ROUTES */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* ⭐ THE FIX — COPILOT-STYLE WORKSPACE */}
        <Route
          path="/teacher/class/:classId"
          element={
            <ProtectedRoute>
              <ClassWorkspace />
            </ProtectedRoute>
          }
        >
          <Route path="content" element={<TeacherContentChat />} />
          <Route path="control" element={<TeacherControlPanel />} />
          <Route path="data" element={<TeacherData />} />
        </Route>

        <Route
          path="/teacher/classes"
          element={
            <ProtectedRoute>
              <MyClasses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/students"
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/tutor/:classId"
          element={
            <ProtectedRoute>
              <AITutor />
            </ProtectedRoute>
          }
        />

        {/* 🟦 STUDENT ROUTES */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🌐 Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}
