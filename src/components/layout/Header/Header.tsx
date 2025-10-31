import { AppBar, Toolbar, Button, Badge, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useBasketContext } from '../../../context/BasketContext';

export function Header() {
    const navigate = useNavigate();
    const { basket } = useBasketContext();

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" onClick={() => navigate('/')}>
                        🍽️ KDG Food Ordering
                    </Button>
                </Box>
                <Button color="inherit" onClick={() => navigate('/restaurants')}>
                    Restaurants
                </Button>
                <Button color="inherit" onClick={() => navigate('/cart')}>
                    <Badge badgeContent={basket?.totalItems || 0} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </Button>
            </Toolbar>
        </AppBar>
    );
}
