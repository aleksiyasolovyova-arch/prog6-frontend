import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useBasketContext } from '../../../context/BasketContext';
import { orderService } from '../../../services/orderService';
import type {Order} from '../../../types/order';

export function CheckoutPage() {
    const navigate = useNavigate();
    const { basket, clearBasket } = useBasketContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryCity: '',
        deliveryPostalCode: '',
        notes: '',
    });

    if (!basket || basket.items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="warning">
                    No items in cart. Redirecting to restaurants...
                </Alert>
            </Container>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate form
            if (
                !formData.customerName ||
                !formData.customerEmail ||
                !formData.customerPhone ||
                !formData.deliveryAddress ||
                !formData.deliveryCity ||
                !formData.deliveryPostalCode
            ) {
                throw new Error('Please fill in all required fields');
            }

            // Create order object
            const order: Order = {
                restaurantId: basket.restaurantId,
                restaurantName: basket.restaurantName,
                items: basket.items.map((item) => ({
                    dishId: item.dishId,
                    name: item.dishName,
                    quantity: item.quantity,
                    priceInCents: item.priceInCents,
                })),
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                deliveryAddress: formData.deliveryAddress,
                deliveryCity: formData.deliveryCity,
                deliveryPostalCode: formData.deliveryPostalCode,
                notes: formData.notes,
                totalAmount: basket.totalPriceInCents,
            };

            // Submit order
            const createdOrder = await orderService.createOrder(order);

            // Clear cart and navigate to confirmation
            clearBasket();
            navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder } });
        } catch (err) {
            setError((err as Error).message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const totalEuros = (basket.totalPriceInCents / 100).toFixed(2);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Checkout
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Delivery Information
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                        <TextField
                            label="Full Name"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            name="customerEmail"
                            value={formData.customerEmail}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                        <TextField
                            label="Phone"
                            name="customerPhone"
                            value={formData.customerPhone}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Postal Code"
                            name="deliveryPostalCode"
                            value={formData.deliveryPostalCode}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                        <TextField
                            label="Street Address"
                            name="deliveryAddress"
                            value={formData.deliveryAddress}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="City"
                            name="deliveryCity"
                            value={formData.deliveryCity}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                    </Box>

                    <TextField
                        label="Special Instructions (optional)"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        multiline
                        rows={3}
                        fullWidth
                    />
                </Paper>

                {/* Order Summary */}
                <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" gutterBottom>
                        Order Summary
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Items: {basket.totalItems}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Subtotal: €{totalEuros}
                    </Typography>
                    <Typography variant="h6">
                        Total: €{totalEuros}
                    </Typography>
                </Paper>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/cart')}
                        disabled={loading}
                    >
                        Back to Cart
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? <CircularProgress size={24} /> : 'Place Order'}
                    </Button>
                </Box>
            </form>
        </Container>
    );
}

export default CheckoutPage;
