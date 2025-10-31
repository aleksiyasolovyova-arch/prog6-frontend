export interface User {
    id: string;
    email: string;
    name: string;
    role: 'CUSTOMER' | 'OWNER' | 'ADMIN';
    restaurantId?: string;
}

export interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
    isOwner: boolean;
    isAuthenticated: boolean;
}
