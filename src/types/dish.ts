export interface Dish {
    dishId: string;
    name: string;
    description: string;
    priceInCents: number;
    pictureUrl?: string;
    dishType: string;
    tags: string[];
    restaurantId: string;
    isPublished: boolean;
}

export interface DishFilters {
    dishType?: string;
    tags?: string[];
    searchTerm?: string;
}

export interface DishContextValue {
    // State
    dishes: Dish[];
    selectedRestaurantDishes: Dish[];
    filters: DishFilters;
    isLoading: boolean;
    error: string | null;

    // Actions
    setDishes: (dishes: Dish[]) => void;
    setFilters: (filters: DishFilters) => void;
    updateFilter: (key: keyof DishFilters, value: any) => void;
    clearFilters: () => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Computed
    filteredDishes: Dish[];
}
