export interface OrderItem {
    dishId: string;
    name: string;
    quantity: number;
    priceInCents: number;
}

export interface Order {
    id?: string;
    restaurantId: string;
    restaurantName: string;
    items: OrderItem[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryPostalCode: string;
    notes?: string;
    totalAmount: number;
    status?: string; // "PENDING", "CONFIRMED", "PREPARING", etc.
    createdAt?: string;
}
