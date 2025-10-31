import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Select,
    MenuItem,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

interface Order {
    id: string;
    customerName: string;
    totalPriceInCents: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
    createdAt: string;
    items: any[];
}

export function OwnerOrders() {
    const { user } = useAuth();
    const [orders] = useState<Order[]>([]);

    useEffect(() => {
        // TODO: Fetch orders from backend
        // GET /restaurants/{restaurantId}/orders
        console.log('Fetching orders for restaurant:', user?.restaurantId);
    }, [user?.restaurantId]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        // TODO: Update order status via API
        // PATCH /orders/{orderId}
        console.log('Updating order', orderId, 'to status:', newStatus);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                📋 Incoming Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell>Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                                    No orders yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id.slice(0, 8)}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell align="right">
                                        €{(order.totalPriceInCents / 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell>{order.items.length} items</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            size="small"
                                        >
                                            <MenuItem value="PENDING">🔴 Pending</MenuItem>
                                            <MenuItem value="PREPARING">🟡 Preparing</MenuItem>
                                            <MenuItem value="READY">🟢 Ready</MenuItem>
                                            <MenuItem value="DELIVERED">✅ Delivered</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button size="small" onClick={() => console.log('View order', order.id)}>
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default OwnerOrders;
