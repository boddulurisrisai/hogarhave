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
import reportWebVitals from './reportWebVitals';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* Wrap the application with CartProvider */}
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


        </Routes>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
