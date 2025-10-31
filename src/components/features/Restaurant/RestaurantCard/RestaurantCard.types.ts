export interface RestaurantCardProps {
    id: string;
    name: string;
    image: string;
    cuisineType: string;
    rating: number;
    onSelect: (id: string) => void;
}