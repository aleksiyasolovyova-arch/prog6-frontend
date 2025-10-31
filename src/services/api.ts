import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const publicPaths = ['/restaurants'];

    if (publicPaths.some(path => config.url?.startsWith(path))) {
        return config;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_id');
                window.location.href = '/owner/login';
                return Promise.reject(new Error('Token expired'));
            }
            config.headers.Authorization = `Bearer ${token}`;
        } catch {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');
            window.location.href = '/owner/login';
            return Promise.reject(new Error('Invalid token'));
        }
    }
    return config;
});


api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - redirecting to login');

            // Clear invalid token
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_id');

            // Redirect to login page
            window.location.href = '/owner/login';
        }

        return Promise.reject(error);
    }
);

export default api;
