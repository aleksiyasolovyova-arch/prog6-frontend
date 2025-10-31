import { useParams, useNavigate } from 'react-router-dom';
import { useRestaurantContext } from '../../../context';
import { useDishContext } from '../../../context';
import { useRestaurantMenu } from '../../../hooks/useDishes';
import { useRestaurantDetail } from '../../../hooks/useRestaurant'; // NEW
import {
    Box,
    CircularProgress,
    Typography,
    Container,
    Button,
    Paper,
    Alert,
} from '@mui/material';
import { DishCard } from '../../features/Dish/DishCard';

export function RestaurantDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Restaurant state
    const { selectedRestaurant } = useRestaurantContext();
    const {
        isLoading: restaurantLoading,
        error: restaurantError,
    } = useRestaurantDetail(id!);

    // Menu state
    const {
        filteredDishes,
        isLoading: menuLoading,
        error: menuError,
    } = useDishContext();

    useRestaurantMenu(id);

    const restaurant = selectedRestaurant;
    const isLoading = restaurantLoading || menuLoading;

    if (isLoading && !restaurant) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (restaurantError || !restaurant) {
        return (
            <Box sx={{ textAlign: 'center', p: 3, color: 'error.main' }}>
                <Typography>Error loading restaurant</Typography>
                <Button onClick={() => navigate('/restaurants')} sx={{ mt: 2 }}>
                    Back to Restaurants
                </Button>
            </Box>
        );
    }

    const placeholderUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&size=400&background=random`;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Button onClick={() => navigate('/restaurants')} sx={{ mb: 2 }}>
                ← Back to Restaurants
            </Button>

            <Paper sx={{ p: 3, mb: 4 }}>

                <img src={restaurant.pictures?.[0] ?? placeholderUrl} alt={restaurant.name} />

                <Typography variant="h4" gutterBottom>
                    {restaurant.name}
                </Typography>
                {/* ... rest unchanged ... */}
            </Paper>

            {/* Menu section */}
            <Box>
                <Typography variant="h5" gutterBottom>
                    Menu ({filteredDishes.length} items)
                </Typography>

                {menuError && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Couldn’t load the menu right now. Please try again later.
                    </Alert>
                )}

                {/* Filters ... */}

                {/* Dishes grid */}
                {filteredDishes.length > 0 ? (
                    <Box /* grid props */>
                        {filteredDishes.map((dish) => (
                            <DishCard
                                key={dish.dishId}
                                dish={dish}
                            />
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                        <Typography>No dishes available. Try adjusting your filters.</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}