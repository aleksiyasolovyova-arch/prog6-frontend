import api from './api';
import type {Order} from '../types/order';

export const orderService = {
    async createOrder(order: Order): Promise<Order> {
        try {
            const response = await api.post('/orders', {
                restaurantId: order.restaurantId,
                restaurantName: order.restaurantName,
                items: order.items.map((item) => ({
                    dishId: item.dishId,
                    name: item.name,
                    quantity: item.quantity,
                    priceInCents: item.priceInCents,
                })),
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                customerPhone: order.customerPhone,
                deliveryAddress: order.deliveryAddress,
                deliveryCity: order.deliveryCity,
                deliveryPostalCode: order.deliveryPostalCode,
                notes: order.notes || '',
                totalAmount: order.totalAmount,
            });

            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    async getOrder(orderId: string): Promise<Order> {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },

    async getUserOrders(): Promise<Order[]> {
        const response = await api.get('/orders');
        return response.data;
    },
};
