import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const isAuth = authService.isAuthenticated();

    if (!isAuth) {
        console.warn('Not authenticated, redirecting to login');
        // Clear any invalid tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        return <Navigate to="/owner/login" replace />;
    }

    return <>{children}</>;
}
