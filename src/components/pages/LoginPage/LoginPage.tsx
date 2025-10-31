// src/pages/LoginPage.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

export default function LoginPage() {
    const navigate = useNavigate();

    // If already authenticated, redirect to dashboard
    useEffect(() => {
        const checkAuth = () => {
            if (authService.isAuthenticated()) {
                console.log('✅ Already authenticated, redirecting...');
                // Use replace to prevent back button issues
                navigate('/owner/create-restaurant', { replace: true });
            }
        };

        checkAuth();
    }, []);

    const handleLogin = () => {
        console.log('🔐 Initiating Keycloak login...');
        authService.login();
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                py: 4
            }}>
                <Paper elevation={3} sx={{ p: 6, textAlign: 'center', width: '100%' }}>
                    <RestaurantIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />

                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        KDG Food Ordering
                    </Typography>

                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Restaurant Owner Portal
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleLogin}
                        fullWidth
                        sx={{
                            py: 1.5,
                            fontSize: '1.1rem',
                            textTransform: 'none'
                        }}
                    >
                        Sign in with Keycloak
                    </Button>

                    <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                        Secure authentication powered by Keycloak
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
