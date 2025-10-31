import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { DishProvider } from './context';
import { RestaurantProvider } from './context';
import { BasketProvider } from './context/BasketContext';
import CartPage from './components/pages/CartPage/CartPage';
import CheckoutPage from './components/pages/CheckoutPage/CheckoutPage';
import OrderConfirmationPage from './components/pages/OrderConfirmPage/OrderConfirmPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import OwnerDashboard from './components/pages/OwnerDashboardPage/OwnerDashboard';
import OwnerOrders from './components/pages/OwnerOrders/OwnerOrders';
import OwnerMenu from './components/pages/OwnerMenu/OwnerMenu';
import LandingPage from './components/pages/LandingPage/LandingPage';
import CustomerRestaurantListPage from './components/pages/CustomerRestaurantListPage/CustomerRestaurantListPage';
import { RestaurantDetailPage } from './components/pages/RestaurantDetailPage/RestaurantDetailPage';
import OwnerRegistrationPage from './components/pages/OwnerRegistration/OwnerRegistrationPage'
import { AuthProvider } from './context/AuthContext';
import CreateRestaurantForm from './components/pages/CreateRestaurantForm/CreateRestaurantForm';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/authService';
import CallbackPage from './components/CallbackPage';

const queryClient = new QueryClient();

const theme = createTheme({
    palette: {
        primary: { main: '#FF6B35' },
        secondary: { main: '#004E89' },
        background: { default: '#f5f5f5' },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function AppContent({ authenticated}: any) {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/restaurants" element={<CustomerRestaurantListPage />} />
            <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

            <Route path="/auth/callback" element={<CallbackPage />} />
            <Route path="/owner/login" element={<LoginPage />} />
            <Route path="/owner/create-restaurant" element={
                <ProtectedRoute>
                    <CreateRestaurantForm />
                </ProtectedRoute>
            } />
            <Route
                path="/owner/dashboard"
                element={authenticated ? <OwnerDashboard onLogout={function(): void {
                    throw new Error("Function not implemented.");
                } } /> : <Navigate to="/owner/login" />}
            />
            <Route
                path="/owner/orders"
                element={authenticated ? <OwnerOrders /> : <Navigate to="/owner/login" />}
            />
            <Route
                path="/owner/menu"
                element={authenticated ? <OwnerMenu /> : <Navigate to="/owner/login" />}
            />
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route
                path="/owner/register"
                element={<OwnerRegistrationPage />}
            />

        </Routes>
    );
}

function App() {
    const [authenticated, setAuthenticated] = useState(authService.isAuthenticated());

    return (
        <Router>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <RestaurantProvider>
                            <DishProvider>
                                <BasketProvider>
                                    <AppContent authenticated={authenticated} setAuthenticated={setAuthenticated} />
                                </BasketProvider>
                            </DishProvider>
                        </RestaurantProvider>
                    </ThemeProvider>
                </QueryClientProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;