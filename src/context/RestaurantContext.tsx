import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type {
    Restaurant,
    RestaurantContextValue,
    RestaurantFilters,
} from '../types/restaurant';

const RestaurantContext = createContext<RestaurantContextValue | undefined>(undefined);

const INITIAL_FILTERS: RestaurantFilters = {
    cuisineType: undefined,
    priceRange: undefined,
    maxDistance: undefined,
    maxDeliveryTime: undefined,
    searchTerm: undefined,
};

export function RestaurantProvider({ children }: { children: ReactNode }) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [filters, setFilters] = useState<RestaurantFilters>(INITIAL_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Update a specific filter
    const updateFilter = useCallback((key: keyof RestaurantFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    // Compute filtered restaurants based on current filters
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter((restaurant) => {
            // Filter by cuisine type
            if (filters.cuisineType && restaurant.cuisineType !== filters.cuisineType) {
                return false;
            }

            // Filter by search term (name)
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                if (!restaurant.name.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }

            // Filter by price range
            if (filters.priceRange) {
                const priceRange = getPriceRangeForCategory(filters.priceRange);
                if (
                    restaurant.avgMenuPrice < priceRange.min ||
                    restaurant.avgMenuPrice > priceRange.max
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [restaurants, filters]);

    const value: RestaurantContextValue = {
        restaurants,
        selectedRestaurant,
        filters,
        isLoading,
        error,
        setRestaurants,
        setSelectedRestaurant,
        setFilters,
        updateFilter,
        clearFilters,
        setIsLoading,
        setError,
        filteredRestaurants,
    };

    return (
        <RestaurantContext.Provider value={value}>
            {children}
        </RestaurantContext.Provider>
    );
}

// Custom hook to use the Restaurant context
export function useRestaurantContext() {
    const context = useContext(RestaurantContext);
    if (!context) {
        throw new Error('useRestaurantContext must be used within RestaurantProvider');
    }
    return context;
}

// Helper function to get price range
function getPriceRangeForCategory(category: string) {
    const ranges: Record<string, { min: number; max: number }> = {
        CHEAP: { min: 0, max: 10 },
        REGULAR: { min: 11, max: 30 },
        EXPENSIVE: { min: 31, max: 60 },
        PREMIUM: { min: 61, max: Infinity },
    };
    return ranges[category] || ranges.REGULAR;
}
