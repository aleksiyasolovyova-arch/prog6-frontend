import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Typography,
    Dialog,
    TextField,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    MenuItem
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

interface Dish {
    id: string;
    name: string;
    description: string;
    price: number;
    type: string;
    isPublished: boolean;
}

export function OwnerMenu() {
    const { user } = useAuth();
    const [dishes] = useState<Dish[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        type: 'MAIN',
    });

    useEffect(() => {
        // TODO: Fetch menu from backend
        console.log('Fetching menu for restaurant:', user?.restaurantId);
    }, [user?.restaurantId]);

    const handleOpenDialog = (dish?: Dish) => {
        if (dish) {
            setEditingDish(dish);
            setFormData({
                name: dish.name,
                description: dish.description,
                price: dish.price.toString(),
                type: dish.type,
            });
        } else {
            setEditingDish(null);
            setFormData({ name: '', description: '', price: '', type: 'MAIN' });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (editingDish) {
            // TODO: PUT /dishes/{dishId}
            console.log('Updating dish:', editingDish.id);
        } else {
            // TODO: POST /restaurants/{restaurantId}/dishes
            console.log('Creating new dish');
        }
        setOpenDialog(false);
    };

    const handleDelete = async (dishId: string) => {
        // TODO: DELETE /dishes/{dishId}
        console.log('Deleting dish:', dishId);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">🍽️ Menu Management</Typography>
                <Button variant="contained" onClick={() => handleOpenDialog()}>
                    ➕ Add Dish
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dishes.map((dish) => (
                            <TableRow key={dish.id}>
                                <TableCell>{dish.name}</TableCell>
                                <TableCell>{dish.description.slice(0, 30)}...</TableCell>
                                <TableCell>{dish.type}</TableCell>
                                <TableCell align="right">€{dish.price}</TableCell>
                                <TableCell align="center">
                                    {dish.isPublished ? '✅ Published' : '⏸️ Draft'}
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        size="small"
                                        onClick={() => handleOpenDialog(dish)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(dish.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingDish ? 'Edit Dish' : 'Add New Dish'}
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        label="Dish Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        margin="normal"
                    />
                    <TextField
                        label="Price (€)"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Type"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="APPETIZER">Appetizer</MenuItem>
                        <MenuItem value="MAIN">Main</MenuItem>
                        <MenuItem value="DESSERT">Dessert</MenuItem>
                        <MenuItem value="BEVERAGE">Beverage</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default OwnerMenu;
