// src/pages/CreateRestaurantForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import api from '../../../services/api';
import { authService } from '../../../services/authService';

export default function CreateRestaurantForm() {
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        postalCode: '',
        email: '',
        cuisineType: 'ITALIAN',
        preparationTimeMinutes: '30',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthAndLoadUser = () => {
            if (!authService.isAuthenticated()) {
                console.error('Not authenticated or token expired, redirecting to login');
                // Clear everything and redirect
                localStorage.clear();
                navigate('/owner/login', { replace: true });
                return;
            }

            const user = authService.getCurrentUser();

            console.log('🔍 Debug Info:');
            console.log('  - Is authenticated:', authService.isAuthenticated());
            console.log('  - Current user:', user);

            if (!user) {
                console.error('Could not load user, redirecting to login');
                localStorage.clear();
                navigate('/owner/login', { replace: true });
                return;
            }

            // Pre-fill email if available
            if (user.email) {
                setFormData(prev => ({ ...prev, email: user.email }));
            }
        };

        checkAuthAndLoadUser();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate required fields
        if (!formData.name.trim()) {
            setError('Restaurant name is required');
            setLoading(false);
            return;
        }
        if (!formData.street.trim()) {
            setError('Street address is required');
            setLoading(false);
            return;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            setLoading(false);
            return;
        }
        if (!formData.postalCode.trim()) {
            setError('Postal code is required');
            setLoading(false);
            return;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            setLoading(false);
            return;
        }

        try {
            console.log('📤 Creating restaurant with data:', formData);

            // ownerId is NOT included - backend extracts it from JWT token via OwnerContext
            const requestBody = {
                name: formData.name,
                address: {
                    street: formData.street,
                    city: formData.city,
                    postalCode: formData.postalCode
                },
                email: formData.email,
                pictureUrls: [], // Empty for now
                cuisineType: formData.cuisineType,
                defaultPreparationTime: {
                    minutes: parseInt(formData.preparationTimeMinutes) || 30,
                },
                openingHours: {
                    // Default opening hours - you can make this configurable later
                    monday: { openTime: '09:00', closeTime: '22:00', closed: false },
                    tuesday: { openTime: '09:00', closeTime: '22:00', closed: false },
                    wednesday: { openTime: '09:00', closeTime: '22:00', closed: false },
                    thursday: { openTime: '09:00', closeTime: '22:00', closed: false },
                    friday: { openTime: '09:00', closeTime: '23:00', closed: false },
                    saturday: { openTime: '09:00', closeTime: '23:00', closed: false },
                    sunday: { openTime: '10:00', closeTime: '21:00', closed: false },
                },
            };

            console.log('📦 Request payload:', JSON.stringify(requestBody, null, 2));

            const response = await api.post('/restaurants', requestBody);

            console.log('✅ Restaurant created:', response.data);

            alert('Restaurant created successfully!');
            navigate('/owner/dashboard');
        } catch (err: any) {
            console.error('Error creating restaurant:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);

            if (err.response?.status === 401) {
                setError('Authentication failed. Please log in again.');
                setTimeout(() => navigate('/owner/login'), 2000);
            } else if (err.response?.status === 400) {
                setError(
                    err.response?.data?.message ||
                    'Invalid data. Please check all fields.'
                );
            } else {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to create restaurant'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                        Create Your Restaurant
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Restaurant Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., Le Gourmet"
                            disabled={loading}
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            label="Email *"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., contact@restaurant.com"
                            disabled={loading}
                        />

                        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                            Address
                        </Typography>

                        <TextField
                            fullWidth
                            label="Street Address *"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            margin="normal"
                            placeholder="e.g., 123 Main Street"
                            disabled={loading}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                fullWidth
                                label="City *"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="e.g., Brussels"
                                disabled={loading}
                            />

                            <TextField
                                fullWidth
                                label="Postal Code *"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                margin="normal"
                                placeholder="e.g., 1000"
                                disabled={loading}
                            />
                        </Box>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Cuisine Type *</InputLabel>
                            <Select
                                name="cuisineType"
                                value={formData.cuisineType}
                                onChange={handleChange}
                                label="Cuisine Type *"
                                disabled={loading}
                            >
                                <MenuItem value="ITALIAN">Italian</MenuItem>
                                <MenuItem value="CHINESE">Chinese</MenuItem>
                                <MenuItem value="JAPANESE">Japanese</MenuItem>
                                <MenuItem value="FRENCH">French</MenuItem>
                                <MenuItem value="INDIAN">Indian</MenuItem>
                                <MenuItem value="MEXICAN">Mexican</MenuItem>
                                <MenuItem value="THAI">Thai</MenuItem>
                                <MenuItem value="GREEK">Greek</MenuItem>
                                <MenuItem value="AMERICAN">American</MenuItem>
                                <MenuItem value="BELGIAN">Belgian</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Default Preparation Time (minutes)"
                            name="preparationTimeMinutes"
                            type="number"
                            value={formData.preparationTimeMinutes}
                            onChange={handleChange}
                            margin="normal"
                            disabled={loading}
                            helperText="Average time to prepare orders"
                            inputProps={{ min: 10, max: 120 }}
                        />

                        <Alert severity="info" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                Default opening hours will be set to 9 AM - 10 PM (weekdays) and 10 AM - 9 PM (Sunday).
                                You can customize these later from your dashboard.
                            </Typography>
                        </Alert>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <CircularProgress size={20} sx={{ mr: 1 }} />
                                    Creating...
                                </>
                            ) : (
                                'Create Restaurant'
                            )}
                        </Button>
                    </form>

                    <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 2 }}>
                        You can edit these details later from your dashboard.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
