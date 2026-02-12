import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AttendanceSheet from './pages/teacher/AttendanceSheet';
import AttendanceHistory from './pages/teacher/AttendanceHistory';

/**
 * ProtectedRoute Component
 * Checks if the user is logged in and has the correct role.
 * Shows a loading state to prevent the "white screen" while checking localStorage.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  // 1. Prevent rendering anything if the Auth state is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold uppercase tracking-widest text-xs">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // 2. If no user is found in Context or LocalStorage, send to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If a specific role is required (admin/teacher) and doesn't match
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Teacher Routes */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes (Placeholder for now) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <div className="p-10 text-center font-bold">Admin Dashboard Coming Soon</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/attendance/:roomId"
            element={
              <ProtectedRoute allowedRole="teacher">
                <AttendanceSheet />
              </ProtectedRoute>
            }
          />

          <Route path="/teacher/history" element={<AttendanceHistory />} />

          {/* Default Redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch-all for 404s */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;