import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice'; // Templates
import MainLayout from './components/templates/MainLayout'; // Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/Dashboard'; import Loader from './components/atoms/Loader'; // Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => { const { isAuthenticated, user, loading } = useSelector((state) => state.auth); if (loading) return <Loader fullScreen />; if (!isAuthenticated) return <Navigate to="/login" replace />; if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />; return children;
}; function App() { const dispatch = useDispatch(); const { token } = useSelector((state) => state.auth); useEffect(() => { if (token) { dispatch(loadUser()); dispatch(fetchCart()); } }, [dispatch, token]); return ( <> <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#0a0a0a', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', }, success: { iconTheme: { primary: '#f59e0b', secondary: '#000' } }, error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }, }} /> <Routes> <Route element={<MainLayout />}> {/* Public Routes */} <Route path="/" element={<Home />} /> <Route path="/shop" element={<Shop />} /> <Route path="/product/:id" element={<ProductDetail />} /> <Route path="/cart" element={<Cart />} /> <Route path="/login" element={<Login />} /> <Route path="/register" element={<Register />} /> {/* Protected Routes */} <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} /> <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} /> <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> {/* Admin Routes */} <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} /> {/* 404 */} <Route path="*" element={<NotFound />} /> </Route> </Routes> </> );
} export default App;
