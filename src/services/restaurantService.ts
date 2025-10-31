import api from './api';
import type {Restaurant, RestaurantFilters} from '../types/restaurant';
import { mapBackendRestaurant, type BackendRestaurant } from './restaurantMapper';

export const restaurantService = {
    async getRestaurants(filters?: RestaurantFilters): Promise<Restaurant[]> {
        const params = new URLSearchParams();

        if (filters?.cuisineType) {
            params.append('cuisineType', filters.cuisineType);
        }
        if (filters?.searchTerm) {
            params.append('search', filters.searchTerm);
        }

        const response = await api.get('/restaurants', { params });

        // Extract array from wrapper
        const backendRestaurants: BackendRestaurant[] = response.data.restaurantSummaries || [];

        // Transform each restaurant to frontend format
        return backendRestaurants.map(mapBackendRestaurant);
    },

    async getRestaurantById(id: string): Promise<Restaurant> {
        const response = await api.get(`/restaurants/${id}`);

        // Backend might return single object directly or wrapped
        const data = response.data;

        return mapBackendRestaurant(data);
    },

    // ... rest of methods
};
