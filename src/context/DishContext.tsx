import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type {Dish, DishFilters, DishContextValue} from '../types/dish';

const DishContext = createContext<DishContextValue | undefined>(undefined);

const INITIAL_FILTERS: DishFilters = {
    dishType: undefined,
    tags: [],
    searchTerm: undefined,
};

export function DishProvider({ children }: { children: ReactNode }) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [filters, setFilters] = useState<DishFilters>(INITIAL_FILTERS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateFilter = useCallback((key: keyof DishFilters, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
    }, []);

    // Compute filtered dishes based on current filters
    const filteredDishes = useMemo(() => {
        return dishes.filter((dish) => {
            // Filter by type
            if (filters.dishType && dish.dishType !== filters.dishType) {
                return false;
            }

            // Filter by tags
            if (filters.tags && filters.tags.length > 0) {
                const hasAllTags = filters.tags.every((tag) =>
                    dish.tags.includes(tag)
                );
                if (!hasAllTags) return false;
            }

            // Filter by search term
            if (filters.searchTerm) {
                const searchLower = filters.searchTerm.toLowerCase();
                if (
                    !dish.name.toLowerCase().includes(searchLower) &&
                    !dish.description.toLowerCase().includes(searchLower)
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [dishes, filters]);

    const value: DishContextValue = {
        dishes,
        selectedRestaurantDishes: dishes,
        filters,
        isLoading,
        error,
        setDishes,
        setFilters,
        updateFilter,
        clearFilters,
        setIsLoading,
        setError,
        filteredDishes,
    };

    return <DishContext.Provider value={value}>{children}</DishContext.Provider>;
}

export function useDishContext() {
    const context = useContext(DishContext);
    if (!context) {
        throw new Error('useDishContext must be used within DishProvider');
    }
    return context;
}
