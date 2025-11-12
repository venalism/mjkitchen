import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenuPage from './pages/admin/AdminMenuPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import { useAuthStore } from './store/authStore';

const PrivateRoute = ({ children }) => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<PrivateRoute><OrderTrackingPage /></PrivateRoute>} />
        </Route>

        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenuPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;