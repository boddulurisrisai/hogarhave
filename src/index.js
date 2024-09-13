import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import LoginPage from './pages/LoginPage'; // Import the LoginPage
import CustomerLandingPage from './pages/CustomerLandingPage';
import SmartDoorlock from './pages/SmartDoorlock';
import SmartDoorbell from './pages/SmartDoorbell';
import SmartLighting from './pages/SmartLighting';
import SmartSpeaker from './pages/SmartSpeaker';
import SmartThermostat from './pages/SmartThermostat';
import CartPage from './pages/CartPage';
import { CartProvider } from './CartContext'; // Import CartProvider
import { ProductProvider } from './ProductContext'; // Import ProductProvider
import reportWebVitals from './reportWebVitals';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import CustomerSignupPage from './pages/CustomerSignupPage';
import StoreManagerLoginPage from './pages/StoreManagerLoginPage';
import StoreManagerDashboard from './pages/StoreManagerDashboard';
import SalesmanLoginPage from './pages/SalesmanLoginPage';
import SalesmanDashboard from './pages/SalesmanDashboard';
import SalesmanOrdersPage from './pages/SalesmanOrdersPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Wrap the application with ProductProvider and CartProvider */}
      <ProductProvider> 
        <CartProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/CustomerLogin" element={<LoginPage />} />
            <Route path="/Cart" element={<CartPage />} />
            <Route path="/CustomerLandingPage" element={<CustomerLandingPage />} />
            <Route path="/products/doorlocks" element={<SmartDoorlock />} />
            <Route path="/products/doorbells" element={<SmartDoorbell />} />
            <Route path="/products/lighting" element={<SmartLighting />} />
            <Route path="/products/speakers" element={<SmartSpeaker />} />
            <Route path="/products/thermostats" element={<SmartThermostat />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/customer/signup" element={<CustomerSignupPage />} />
            <Route path="/storemanager/login" element={<StoreManagerLoginPage />} />
            <Route path="/store-manager/dashboard" element={<StoreManagerDashboard />} />
            <Route path="/salesman/login" element={<SalesmanLoginPage />} />
            <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
            <Route path="/salesman/orders" element={<SalesmanOrdersPage />} />

          </Routes>
        </CartProvider>
      </ProductProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
