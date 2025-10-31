import { useEffect, useState } from 'react';
import { authService } from '../../../services/authService';
import api from '../../../services/api';

interface Restaurant {
    id: string;
    name: string;
    address: string;
    cuisineType: string;
}

export default function DashboardPage({ onLogout }: { onLogout: () => void }) {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const response = await api.get('/api/restaurants/me');
            setRestaurant(response.data);
        } catch (error) {
            console.error('Failed to fetch restaurant:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        onLogout();
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                    Logout
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {restaurant && (
                <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                    <h2>{restaurant.name}</h2>
                    <p><strong>Address:</strong> {restaurant.address}</p>
                    <p><strong>Cuisine:</strong> {restaurant.cuisineType}</p>
                </div>
            )}
            {!restaurant && !loading && <p>No restaurant found. Create one!</p>}
        </div>
    );
}
