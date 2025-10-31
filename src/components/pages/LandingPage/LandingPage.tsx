import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
} from '@mui/material';
import { Restaurant as RestaurantIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import './LandingPage.scss';

export function LandingPage() {
    const navigate = useNavigate();

    const handleCustomerClick = () => {
        navigate('/restaurants');
    };

    const handleOwnerClick = () => {
        // Will implement owner authentication/dashboard later
        navigate('/owner/login');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        Keep Dishes Going
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            maxWidth: 600,
                            mx: 'auto',
                        }}
                    >
                        Fresh, fast, and reliable food ordering. Choose your role to get started.
                    </Typography>
                </Box>

                {/* Role Selection Cards */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                        },
                        gap: 3,
                        maxWidth: 900,
                        mx: 'auto',
                    }}
                >
                    {/* Customer Card */}
                    <Paper
                        elevation={8}
                        className="landing-card customer-card"
                        onClick={handleCustomerClick}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <ShoppingCartIcon
                            sx={{
                                fontSize: 64,
                                color: '#FF6B35',
                                mb: 2,
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            I'm a Customer
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 3 }}
                        >
                            Browse restaurants, discover great dishes, and place orders.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#FF6B35',
                                '&:hover': {
                                    backgroundColor: '#E55A2B',
                                },
                            }}
                        >
                            Order Now
                        </Button>
                    </Paper>

                    {/* Owner Card */}
                    <Paper
                        elevation={8}
                        className="landing-card owner-card"
                        onClick={handleOwnerClick}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-8px)',
                                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
                        <RestaurantIcon
                            sx={{
                                fontSize: 64,
                                color: '#004E89',
                                mb: 2,
                            }}
                        />
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                            I'm a Restaurant Owner
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 3 }}
                        >
                            Manage your menu, accept orders, and grow your business.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#004E89',
                                '&:hover': {
                                    backgroundColor: '#003366',
                                },
                            }}
                        >
                            Manage Restaurant
                        </Button>
                    </Paper>
                </Box>

                {/* Footer Info */}
                <Box
                    sx={{
                        mt: 8,
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}
                >
                    <Typography variant="body2">
                        Keep Dishes Going © 2025 • Fast. Clear. Reliable.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;
