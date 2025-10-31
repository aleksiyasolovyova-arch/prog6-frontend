import { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { useBasketContext } from '../../../../context/BasketContext';
import type {Dish} from '../../../../types/dish';

export interface DishCardProps {
    dish: Dish;
}

export function DishCard({ dish }: DishCardProps) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useBasketContext();

    const priceInEuros = (dish.priceInCents / 100).toFixed(2);
    const imageUrl = dish.pictureUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(dish.name)}&size=300&background=random`;

    const handleAddToCart = () => {
        addItem({
            dishId: dish.dishId,
            dishName: dish.name,
            price: dish.priceInCents / 100,
            priceInCents: dish.priceInCents,
            quantity,
            restaurantId: dish.restaurantId,
        });
        setQuantity(1);
        alert(`${dish.name} added to cart!`); // Replace with toast later
    };

    return (
        <Card>
            <CardMedia
                component="img"
                height="200"
                image={imageUrl}
                alt={dish.name}
            />

            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {dish.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {dish.description}
                </Typography>

                {dish.tags && dish.tags.length > 0 && (
                    <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {dish.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        €{priceInEuros}
                    </Typography>
                </Box>

                {/* Quantity selector */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                    <Button
                        size="small"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        −
                    </Button>
                    <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                        {quantity}
                    </Typography>
                    <Button
                        size="small"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        +
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddToCart}
                        sx={{ ml: 1 }}
                    >
                        Add
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
