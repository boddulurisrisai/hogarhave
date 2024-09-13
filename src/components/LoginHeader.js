import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import '../pages/OrdersPage';

function LoginHeader() {
  const { cart, orders } = useCart(); // Make sure `orders` is available from context
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cart.length;

  // Toggle dropdown on click
  const toggleDropdown = () => {
    console.log("Toggling dropdown:", !showDropdown);
    setShowDropdown((prev) => !prev);
  };

  // Handle navigation to OrdersPage
  const handleNavigateToOrders = () => {
    setShowDropdown(false);
    navigate('/orders', { state: { orderDetails: orders[0] } }); // Pass the first order details
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user session or authentication token here if needed
    // For example, remove user data from localStorage or context
    // localStorage.removeItem('userToken');

    // Redirect to login page
    navigate('/CustomerLogin');
  };

  // Check if the current path matches the given path
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="logo-container">
        <h1 className="logo">Smart Homes</h1>
      </div>

      <nav className="header-content">
        <ul className="nav-menu">
          <li className={isActive('/') ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={isActive('/products/doorbells') ? 'active' : ''}>
            <Link to="/products/doorbells">Smart Doorbell</Link>
          </li>
          <li className={isActive('/products/doorlocks') ? 'active' : ''}>
            <Link to="/products/doorlocks">Smart Doorlock</Link>
          </li>
          <li className={isActive('/products/lighting') ? 'active' : ''}>
            <Link to="/products/lighting">Smart Lighting</Link>
          </li>
          <li className={isActive('/products/speakers') ? 'active' : ''}>
            <Link to="/products/speakers">Smart Speaker</Link>
          </li>
          <li className={isActive('/products/thermostats') ? 'active' : ''}>
            <Link to="/products/thermostats">Smart Thermostat</Link>
          </li>

          <li className="cart-icon">
            <Link to="/cart">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </li>

          {/* Account Dropdown */}
          <li
            className="account-menu"
            onClick={toggleDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <span className="account-icon">
              <FaUserCircle />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/account">Account Information</Link>
                <button onClick={handleNavigateToOrders}>Past Orders</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default LoginHeader;
