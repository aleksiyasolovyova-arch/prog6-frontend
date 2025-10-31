import { useNavigate } from 'react-router-dom';
import { CircularProgress, Box, TextField, MenuItem, Button } from '@mui/material';
import { useRestaurantContext } from '../../../context';
import { useRestaurants } from '../../../hooks/useRestaurant';
import { RestaurantCard } from '../../features/Restaurant/RestaurantCard';
import type {RestaurantFilters} from '../../../types/restaurant';

export function CustomerRestaurantListPage() {
    const navigate = useNavigate();
    const {
        filteredRestaurants,
        filters,
        updateFilter,
        clearFilters,
        isLoading,
        error,
    } = useRestaurantContext();

    // Call hook to trigger data fetching
    useRestaurants(filters);

    const handleFilterChange = (
        key: keyof RestaurantFilters,
        value: string | undefined
    ) => {
        updateFilter(key, value);
    };

    const handleRestaurantClick = (restaurantId: string) => {
        navigate(`/api/restaurants/${restaurantId}`);
    };

    if (error) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
                Error loading restaurants: {error}
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <h1>Restaurants</h1>

            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                    label="Search"
                    placeholder="Restaurant name"
                    value={filters.searchTerm || ''}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    size="small"
                    sx={{ minWidth: 200 }}
                />

                <TextField
                    select
                    label="Cuisine Type"
                    value={filters.cuisineType || ''}
                    onChange={(e) =>
                        handleFilterChange('cuisineType', e.target.value || undefined)
                    }
                    size="small"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                    <MenuItem value="Japanese">Japanese</MenuItem>
                    <MenuItem value="Indian">Indian</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Price Range"
                    value={filters.priceRange || ''}
                    onChange={(e) =>
                        handleFilterChange(
                            'priceRange',
                            e.target.value || undefined
                        )
                    }
                    size="small"
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="CHEAP">€ (Cheap)</MenuItem>
                    <MenuItem value="REGULAR">€€ (Regular)</MenuItem>
                    <MenuItem value="EXPENSIVE">€€€ (Expensive)</MenuItem>
                    <MenuItem value="PREMIUM">€€€€ (Premium)</MenuItem>
                </TextField>

                <Button variant="outlined" onClick={clearFilters}>
                    Clear Filters
                </Button>
            </Box>

            {/* Loading State */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',           // 1 column on mobile
                            sm: 'repeat(2, 1fr)', // 2 columns on tablet
                            md: 'repeat(3, 1fr)', // 3 columns on desktop
                            lg: 'repeat(4, 1fr)', // 4 columns on large screens
                        },
                        gap: 2,
                    }}
                >
                    {filteredRestaurants.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onSelect={() => handleRestaurantClick(restaurant.id)}
                        />
                    ))}
                </Box>
            )}

            {filteredRestaurants.length === 0 && !isLoading && (
                <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                    No restaurants found. Try adjusting your filters.
                </Box>
            )}
        </Box>
    );
}

export default CustomerRestaurantListPage;
