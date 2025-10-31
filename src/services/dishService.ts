import api from './api';
import type {Dish} from '../types/dish';

export const dishService = {
    async getRestaurantDishes(restaurantId: string): Promise<Dish[]> {
        try {
            const response = await api.get(`/restaurants/${restaurantId}/menu`);

            const data = response.data;

            // Backend returns { dishes: [...] }
            const backendDishes = data.dishes || [];

            // Transform each dish
            return backendDishes.map((backendDish: any): Dish => ({
                dishId: backendDish.id,
                name: backendDish.name,
                description: backendDish.description || '',
                priceInCents: Math.round((backendDish.price || 0) * 100), // EUR 24.50 → 2450 cents
                pictureUrl: backendDish.pictureUrl,
                dishType: backendDish.type || 'MAIN',
                tags: backendDish.foodTags || [],
                restaurantId: data.restaurantID || restaurantId,
                isPublished: backendDish.availableForOrder ?? true,
            }));
        } catch (error) {
            console.error('Error fetching menu:', error);
            return [];
        }
    },
};