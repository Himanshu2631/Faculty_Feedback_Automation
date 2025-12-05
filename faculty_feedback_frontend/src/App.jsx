import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ui/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';

// Student Pages
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import StudentSignup from "./pages/Signup";
import StudentDashboard from "./pages/student/StudentDashboard";
import Subjects from "./pages/student/Subjects";
import FeedbackCenter from "./pages/student/FeedbackCenter";
import Profile from "./pages/student/Profile";


// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageSubjects from './pages/admin/ManageSubjects';
import FeedbackSummary from './pages/admin/FeedbackSummary';
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>

      {/* Default → Role Selection */}
      <Route path="/" element={<RoleSelection />} />

      {/* ---------------- STUDENT ROUTES ---------------- */}
      <Route path="/student/login" element={<Login />} />
      <Route path="/student/signup" element={<StudentSignup />} />

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/subjects"
        element={
          <ProtectedRoute role="student">
            <Subjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/feedback"
        element={
          <ProtectedRoute role="student">
            <FeedbackCenter />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="student">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* ---------------- ADMIN ROUTES ---------------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute role="admin">
            <ManageFaculty />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/subjects"
        element={
          <ProtectedRoute role="admin">
            <ManageSubjects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/summary"
        element={
          <ProtectedRoute role="admin">
            <FeedbackSummary />
          </ProtectedRoute>
        }
      />

      {/* ---------------- 404 FALLBACK ---------------- */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
