import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Box,
} from '@mui/material';
import type {Restaurant} from '../../../../types/restaurant';
import './RestaurantCard.scss';

export interface RestaurantCardProps {
    restaurant: Restaurant;
    onSelect: () => void;
}

export function RestaurantCard({
                                   restaurant,
                                   onSelect,
                               }: RestaurantCardProps) {
    const primaryImage = restaurant.pictures?.[0] || 'https://via.placeholder.com/300';

    const getPriceSymbol = (price: number): string => {
        if (price < 10) return '€';
        if (price < 31) return '€€';
        if (price < 61) return '€€€';
        return '€€€€';
    };

    return (
        <Card className="restaurant-card" onClick={onSelect || (() => {})}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="200"
                    image={primaryImage}
                    alt={restaurant.name}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        {restaurant.name}
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                            {restaurant.cuisineType}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {getPriceSymbol(restaurant.avgMenuPrice)} •{' '}
                            {restaurant.defaultPrepTime} min prep
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                            {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            {restaurant.address.city}, {restaurant.address.country}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
