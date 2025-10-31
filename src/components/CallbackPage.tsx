// src/pages/CallbackPage.tsx
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';

export default function CallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useAuth();

    const hasProcessed = useRef(false);

    useEffect(() => {
        if (hasProcessed.current) {
            console.log('Already processed, skipping...');
            return;
        }

        const handleAuth = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const errorDescription = searchParams.get('error_description');

            if (error) {
                console.error('Keycloak error:', error, errorDescription);
                setError(errorDescription || error);
                setTimeout(() => navigate('/owner/login'), 3000);
                return;
            }

            if (!code) {
                console.error('No authorization code received');
                setError('No authorization code received');
                setTimeout(() => navigate('/owner/login'), 3000);
                return;
            }

            hasProcessed.current = true;

            try {
                console.log('Processing callback with code...');
                const { user } = await authService.handleCallback(code);
                console.log('Authentication successful!', user);

                if (user) {
                    setUser(user);
                }

                navigate('/owner/create-restaurant', { replace: true });
            } catch (err: any) {
                console.error('Authentication failed:', err);
                setError(err.message || 'Authentication failed');
                // Reset the flag on error so user can retry
                hasProcessed.current = false;
                setTimeout(() => navigate('/owner/login'), 3000);
            }
        };

        handleAuth();
    }, [searchParams, navigate, setUser]); // Include all dependencies

    if (error) {
        return (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2,
                p: 3
            }}>
                <Alert severity="error" sx={{ maxWidth: 500 }}>
                    <Typography variant="h6" gutterBottom>
                        Authentication Error
                    </Typography>
                    <Typography variant="body2">
                        {error}
                    </Typography>
                </Alert>
                <Typography variant="body2" color="text.secondary">
                    Redirecting to login page...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2
        }}>
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Completing authentication...
            </Typography>
        </Box>
    );
}
