const KEYCLOAK_URL = 'http://localhost:8180';
const REALM = 'kdg';
const CLIENT_ID = 'kdg-frontend';
const REDIRECT_URI = 'http://localhost:5173/auth/callback';

export const keycloakService = {
    /**
     * Redirect to Keycloak login page
     */
    login() {
        localStorage.removeItem('access_token');
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

    /**
     * Handle OAuth callback
     */
    async handleCallback(code: string) {
        const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

        console.log('🔄 Exchanging code for token...');

        try {
            const response = await fetch(tokenUrl, {
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
            console.log('Got token response:', data);

            const token = data.access_token;

            if (!token) {
                console.error('No access_token in response!');
                throw new Error('No access token in response');
            }

            console.log('Storing token in localStorage...');
            localStorage.setItem('access_token', token);

            const stored = localStorage.getItem('access_token');
            console.log('Token stored. Verify:', stored?.substring(0, 20) + '...');

            return token;
        } catch (err: any) {
            console.error('handleCallback error:', err);
            throw err;
        }
    },

    isAuthenticated() {
        return !!localStorage.getItem('access_token');
    },

    logout() {
        const logoutUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;
        localStorage.removeItem('access_token');
        window.location.href = `${logoutUrl}?redirect_uri=${window.location.origin}`;
    },
};
