import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../services/authService';

export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: () => void;
    logout: () => void;
    isOwner: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from token on mount
    useEffect(() => {
        const loadUser = () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const currentUser = authService.getCurrentUser();
                    setUser(currentUser);
                    console.log('User loaded from token:', currentUser);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    localStorage.removeItem('auth_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = useCallback(() => {
        // Just redirect to Keycloak - no email/password needed
        setError(null);
        authService.login();
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        authService.logout();
    }, []);

    const value: AuthContextValue = {
        user,
        isLoading,
        error,
        login,
        logout,
        isOwner: user?.role === 'OWNER',
        isAuthenticated: !!user,
        setUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
