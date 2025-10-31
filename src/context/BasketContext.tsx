import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type {Basket, CartItem, BasketContextValue} from '../types/basket';

const BasketContext = createContext<BasketContextValue | undefined>(undefined);
const STORAGE_KEY = 'kdg_basket';

export function BasketProvider({ children }: { children: ReactNode }) {
    const [basket, setBasket] = useState<Basket | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setBasket(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to load basket:', error);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever basket changes
    useEffect(() => {
        if (isLoaded) {
            if (basket) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [basket, isLoaded]);

    const addItem = useCallback((item: CartItem) => {
        console.log('Adding item to cart:', item);

        setBasket((prev) => {
            if (!prev || prev.restaurantId !== item.restaurantId) {
                // New basket or different restaurant
                const newBasket = {
                    restaurantId: item.restaurantId,
                    restaurantName: item.dishName,
                    items: [item],
                    totalItems: item.quantity,
                    totalPriceInCents: item.priceInCents * item.quantity,
                };
                console.log('Created new basket:', newBasket);
                return newBasket;
            }

            // Check if item already in basket
            const existingItem = prev.items.find((i) => i.dishId === item.dishId);

            if (existingItem) {
                // Increase quantity
                const updatedItems = prev.items.map((i) =>
                    i.dishId === item.dishId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );

                const updated = {
                    ...prev,
                    items: updatedItems,
                    totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                    totalPriceInCents: updatedItems.reduce(
                        (sum, i) => sum + i.priceInCents * i.quantity,
                        0
                    ),
                };
                console.log('Updated existing item:', updated);
                return updated;
            }

            // Add new item
            const updatedItems = [...prev.items, item];
            const updated = {
                ...prev,
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                totalPriceInCents: updatedItems.reduce(
                    (sum, i) => sum + i.priceInCents * i.quantity,
                    0
                ),
            };
            console.log('Added new item:', updated);
            return updated;
        });
    }, []);

    const removeItem = useCallback((dishId: string) => {
        setBasket((prev) => {
            if (!prev) return null;

            const updatedItems = prev.items.filter((i) => i.dishId !== dishId);

            if (updatedItems.length === 0) {
                console.log('Cart is now empty');
                return null;
            }

            const updated = {
                ...prev,
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                totalPriceInCents: updatedItems.reduce(
                    (sum, i) => sum + i.priceInCents * i.quantity,
                    0
                ),
            };
            console.log('Removed item:', updated);
            return updated;
        });
    }, []);

    const updateQuantity = useCallback((dishId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(dishId);
            return;
        }

        setBasket((prev) => {
            if (!prev) return null;

            const updatedItems = prev.items.map((i) =>
                i.dishId === dishId ? { ...i, quantity } : i
            );

            const updated = {
                ...prev,
                items: updatedItems,
                totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
                totalPriceInCents: updatedItems.reduce(
                    (sum, i) => sum + i.priceInCents * i.quantity,
                    0
                ),
            };
            console.log('Updated quantity:', updated);
            return updated;
        });
    }, [removeItem]);

    const clearBasket = useCallback(() => {
        console.log('Clearing basket');
        setBasket(null);
    }, []);

    const getTotalPrice = useCallback(() => {
        return basket?.totalPriceInCents ?? 0;
    }, [basket]);

    const value: BasketContextValue = {
        basket,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        getTotalPrice,
    };

    return (
        <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
    );
}

export function useBasketContext() {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasketContext must be used within BasketProvider');
    }
    return context;
}
