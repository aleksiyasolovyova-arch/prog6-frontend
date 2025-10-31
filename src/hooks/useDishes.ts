import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDishContext } from '../context/DishContext';
import { dishService } from '../services/dishService';
import type {DishFilters} from '../types/dish';

export function useRestaurantMenu(restaurantId: string | undefined, filters?: DishFilters) {
    const { setDishes, setIsLoading, setError } = useDishContext();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['dishes', restaurantId, filters],
        queryFn: () => dishService.getRestaurantDishes(restaurantId || ''),
        enabled: !!restaurantId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });

    // Update context when data changes
    useEffect(() => {
        if (data) {
            setDishes(data);
        }
    }, [data, setDishes]);

    // Update loading state
    useEffect(() => {
        setIsLoading(isLoading);
    }, [isLoading, setIsLoading]);

    // Update error state
    useEffect(() => {
        setError(error?.message || null);
    }, [error, setError]);

    return {
        dishes: data || [],
        isLoading,
        error: error?.message || null,
        refetch,
    };
}
