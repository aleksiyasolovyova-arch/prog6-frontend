import { useNavigate } from 'react-router-dom';
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
    TextField,
} from '@mui/material';
import { useBasketContext } from '../../../context/BasketContext';

export function CartPage() {
    const navigate = useNavigate();
    const { basket, removeItem, updateQuantity } = useBasketContext();

    if (!basket || basket.items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Your Cart is Empty
                </Typography>
                <Button variant="contained" onClick={() => navigate('/restaurants')}>
                    Back to Restaurants
                </Button>
            </Container>
        );
    }

    const totalEuros = (basket.totalPriceInCents / 100).toFixed(2);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                {basket.restaurantName}
            </Typography>

            {/* Cart Items Table */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell>Dish</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((item) => {
                            const itemTotal = ((item.priceInCents * item.quantity) / 100).toFixed(2);
                            const itemPrice = (item.priceInCents / 100).toFixed(2);

                            return (
                                <TableRow key={item.dishId}>
                                    <TableCell>{item.dishName}</TableCell>
                                    <TableCell align="right">€{itemPrice}</TableCell>
                                    <TableCell align="center">
                                        <TextField
                                            type="number"
                                            inputProps={{ min: 1, max: 99 }}
                                            value={item.quantity}
                                            onChange={(e) =>
                                                updateQuantity(item.dishId, parseInt(e.target.value))
                                            }
                                            size="small"
                                            sx={{ width: 60 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">€{itemTotal}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => removeItem(item.dishId)}
                                        >
                                            Remove
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Total and Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                    Total: <strong>€{totalEuros}</strong>
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/restaurants')}>
                        Continue Shopping
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/checkout')}
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default CartPage;
