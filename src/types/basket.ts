export interface CartItem {
    dishId: string;
    dishName: string;
    price: number;
    priceInCents: number;
    quantity: number;
    restaurantId: string;
}

export interface Basket {
    restaurantId: string;
    restaurantName: string;
    items: CartItem[];
    totalItems: number;
    totalPriceInCents: number;
}

export interface BasketContextValue {
    basket: Basket | null;
    addItem: (item: CartItem) => void;
    removeItem: (dishId: string) => void;
    updateQuantity: (dishId: string, quantity: number) => void;
    clearBasket: () => void;
    getTotalPrice: () => number;
}
