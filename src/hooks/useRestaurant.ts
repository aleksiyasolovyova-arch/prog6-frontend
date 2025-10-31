import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRestaurantContext } from '../context/RestaurantContext';
import { restaurantService } from '../services/restaurantService';
import type {RestaurantFilters} from '../types/restaurant';

export function useRestaurants(filters?: RestaurantFilters) {
    const { setRestaurants, setIsLoading, setError } = useRestaurantContext();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['restaurants', filters],
        queryFn: () => restaurantService.getRestaurants(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    });

    // Update context when data changes
    useEffect(() => {
        if (data) {
            setRestaurants(data);
        }
    }, [data, setRestaurants]);

    // Update loading state
    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    // Update error state
    useEffect(() => {
        setError(error?.message || null);
    }, [error, setError]);

    return {
        restaurants: data || [],
        isLoading,
        error: error?.message || null,
        refetch,
    };
}

export function useRestaurantDetail(id: string) {
    const { setSelectedRestaurant } = useRestaurantContext();

    const { data, isLoading, error } = useQuery({
        queryKey: ['restaurants', id],
        queryFn: () => restaurantService.getRestaurantById(id),
        enabled: !!id,
    });

    // Update context when data changes
    useEffect(() => {
        if (data) {
            setSelectedRestaurant(data);
        }
    }, [data, setSelectedRestaurant]);

    return {
        restaurant: data || null,
        isLoading,
        error: error?.message || null,
    };
}
