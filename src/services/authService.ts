const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'kdg';
const CLIENT_ID = 'kdg-frontend';
const REDIRECT_URI = 'http://localhost:5173/auth/callback';
const TOKEN_ENDPOINT = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: 'OWNER' | 'CUSTOMER';
}

export interface AuthResponse {
    token: string;
    user?: User;
}

export const authService = {

    generatePKCE(): { verifier: string; challenge: string } {
        const verifier = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');


        return { verifier, challenge: verifier };
    },

    login() {
        console.log('🔐 Redirecting to Keycloak login...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');

        const authUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth`;
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: 'code',
            scope: 'openid profile email',
            prompt: 'login',
        });

        window.location.href = `${authUrl}?${params.toString()}`;
    },


    async handleCallback(code: string): Promise<AuthResponse> {
        console.log('Exchanging code for token...');

        try {
            const response = await fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: CLIENT_ID,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URI,
                }),
            });

            console.log('📡 Response status:', response.status);

            if (!response.ok) {
                const error = await response.json();
                console.error('Token exchange failed:', error);
                throw new Error(error.error_description || 'Token exchange failed');
            }

            const data = await response.json();
            console.log('Got token response:', {
                hasAccessToken: !!data.access_token,
                hasRefreshToken: !!data.refresh_token,
                tokenType: data.token_type,
                expiresIn: data.expires_in
            });

            const token = data.access_token;
            if (!token) {
                console.error('Response data:', data);
                throw new Error('No access token in response');
            }

            localStorage.setItem('auth_token', token);
            console.log('Token stored successfully');

            const user = this.decodeToken(token);
            localStorage.setItem('user_id', user.id);

            return { token, user };
        } catch (err: any) {
            console.error('handleCallback error:', err);
            throw err;
        }
    },


    isAuthenticated(): boolean {
        const token = localStorage.getItem('auth_token');
        return !!token;
    },


    getCurrentUser(): User | null {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;

        try {
            return this.decodeToken(token);
        } catch {
            return null;
        }
    },


    decodeToken(token: string): User {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            if (payload.exp && payload.exp * 1000 < Date.now()) {
                console.error('Token expired at:', new Date(payload.exp * 1000));
                // Clear expired token
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_id');
                throw new Error('Token expired');
            }

            const username = payload.preferred_username || payload.name || 'User';

            return {
                id: payload.sub,
                username: username,
                email: payload.email || '',
                name: payload.name || username,
                role: payload.realm_access?.roles?.includes('owner') ? 'OWNER' : 'CUSTOMER',
            };
        } catch (error) {
            console.error('Token decode failed:', error);
            throw error;
        }
    },


    logout() {
        console.log('Logging out...');
        const logoutUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        window.location.href = `${logoutUrl}?redirect_uri=${window.location.origin}`;
    },


    async register(email: string, password: string, name: string): Promise<User> {
        throw new Error('Registration is handled through Keycloak. Please use the login flow.');
    },
};
