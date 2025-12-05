import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader fullScreen />;
    }

    if (!user) {
        return <Navigate to={role === 'admin' ? '/admin/login' : '/student/login'} replace />;
    }

    // Check if user has role property, if not, redirect to login
    if (!user.role) {
        console.warn('User object missing role property:', user);
        return <Navigate to={role === 'admin' ? '/admin/login' : '/student/login'} replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
