import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import api from '../../../services/api';
import { authService } from '../../../services/authService'

interface OwnerData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface RestaurantData {
    name: string;
    address: string;
    phone: string;
    cuisineType: string;
}

const steps = ['Owner Account', 'Restaurant Info'];

export default function OwnerRegistrationPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [ownerData, setOwnerData] = useState<OwnerData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [restaurantData, setRestaurantData] = useState<RestaurantData>({
        name: '',
        address: '',
        phone: '',
        cuisineType: '',
    });

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOwnerData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRestaurantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRestaurantData((prev) => ({ ...prev, [name]: value }));
    };

    const validateOwnerStep = (): boolean => {
        if (!ownerData.username || !ownerData.email || !ownerData.password) {
            setError('All fields are required');
            return false;
        }
        if (ownerData.password !== ownerData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (ownerData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const validateRestaurantStep = (): boolean => {
        if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
            setError('All fields are required');
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        setError('');

        if (activeStep === 0) {
            if (validateOwnerStep()) {
                setActiveStep(1);
            }
        } else if (activeStep === 1) {
            if (validateRestaurantStep()) {
                await handleSubmit();
            }
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const authResponse = await authService.register(
                ownerData.username,
                ownerData.password
            );

            // ✅ Step 2: Create restaurant (sends JWT automatically via api interceptor)
            await api.post('/api/restaurants', {
                name: restaurantData.name,
                address: restaurantData.address,
                phone: restaurantData.phone,
                cuisineType: restaurantData.cuisineType
            });

            navigate('/owner/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                    Owner Registration
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Step 1: Owner Account */}
                {activeStep === 0 && (
                    <Box>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={ownerData.username}
                            onChange={handleOwnerChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={ownerData.email}
                            onChange={handleOwnerChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={ownerData.password}
                            onChange={handleOwnerChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={ownerData.confirmPassword}
                            onChange={handleOwnerChange}
                            margin="normal"
                        />
                    </Box>
                )}

                {/* Step 2: Restaurant Info */}
                {activeStep === 1 && (
                    <Box>
                        <TextField
                            fullWidth
                            label="Restaurant Name"
                            name="name"
                            value={restaurantData.name}
                            onChange={handleRestaurantChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={restaurantData.address}
                            onChange={handleRestaurantChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={restaurantData.phone}
                            onChange={handleRestaurantChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Cuisine Type (e.g., Italian, Thai)"
                            name="cuisineType"
                            value={restaurantData.cuisineType}
                            onChange={handleRestaurantChange}
                            margin="normal"
                        />
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={loading}
                    >
                        {activeStep === steps.length - 1 ? 'Register' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
