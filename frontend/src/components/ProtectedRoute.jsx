import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute({ children }) {
    const { user, token } = useAuth();
    
    // Check if token exists in localStorage as a fallback 
    // in case state hasn't hydrated but user is logged in
    const hasToken = localStorage.getItem('token');

    if (!user && !hasToken) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}
