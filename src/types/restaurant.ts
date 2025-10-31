export interface Address {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
}

export interface Restaurant {
    id: string;
    name: string;
    address: Address;
    contactEmail: string;
    pictures: string[];
    cuisineType: string;
    defaultPrepTime: number;
    openingHours: OpeningHours;
    isOpen: boolean;
    avgMenuPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface OpeningHours {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
}

export interface TimeSlot {
    open: string;
    close: string
}



export interface RestaurantFilters {
    cuisineType?: string;
    priceRange?: PriceRangeCategory;
    maxDistance?: number; // in km
    maxDeliveryTime?: number; // in minutes
    searchTerm?: string;
}

export type PriceRangeCategory = 'CHEAP' | 'REGULAR' | 'EXPENSIVE' | 'PREMIUM';

export interface PriceRange {
    symbol: string;
    min: number;
    max: number;
}

export interface RestaurantContextValue {
    // State
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    filters: RestaurantFilters;
    isLoading: boolean;
    error: string | null;

    // Actions
    setRestaurants: (restaurants: Restaurant[]) => void;
    setSelectedRestaurant: (restaurant: Restaurant | null) => void;
    setFilters: (filters: RestaurantFilters) => void;
    updateFilter: (key: keyof RestaurantFilters, value: any) => void;
    clearFilters: () => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Computed
    filteredRestaurants: Restaurant[];
}
