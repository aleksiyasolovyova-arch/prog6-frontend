import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
} from '@mui/material';
import type {Order} from '../../../types/order';

export function OrderConfirmationPage() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order as Order | undefined;

    if (!order) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Alert severity="error">Order not found</Alert>
            </Container>
        );
    }

    const totalEuros = (order.totalAmount / 100).toFixed(2);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Alert severity="success" sx={{ mb: 3 }}>Order placed successfully!
            </Alert>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Order Confirmation
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Order ID: {orderId}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {order.restaurantName}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Delivery to: {order.deliveryAddress}, {order.deliveryPostalCode} {order.deliveryCity}
                    </Typography>
                    <Typography variant="body2">
                        Contact: {order.customerEmail} | {order.customerPhone}
                    </Typography>
                </Box>

                {/* Order Items */}
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="center">Qty</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.items.map((item) => {
                                const itemTotal = ((item.priceInCents * item.quantity) / 100).toFixed(2);
                                const itemPrice = (item.priceInCents / 100).toFixed(2);
                                return (
                                    <TableRow key={item.dishId}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">€{itemPrice}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="right">€{itemTotal}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Typography variant="h6">
                        Total: <strong>€{totalEuros}</strong>
                    </Typography>
                </Box>

                {order.notes && (
                    <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">
                            Notes: {order.notes}
                        </Typography>
                    </Box>
                )}
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" fullWidth onClick={() => navigate('/restaurants')}>
                    Back to Restaurants
                </Button>
                <Button variant="outlined" fullWidth onClick={() => window.print()}>
                    Print Receipt
                </Button>
            </Box>
        </Container>
    );
}

export default OrderConfirmationPage;
