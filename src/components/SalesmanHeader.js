import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';
import { useCart } from '../CartContext'; // Assuming useCart hook is used for cart management
import '../pages/SalesmanLoginPage'; // Ensure correct import path
import '../pages/SalesmanOrdersPage'; // Ensure correct import path
import '../pages/SalesmanDashboard';
function SalesmanHeader() {
  const { cart } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const cartItemCount = cart.length;

  // Toggle dropdown on click
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Hide dropdown when navigating to orders
  const handleNavigateToOrders = () => {
    setShowDropdown(false);
    navigate('/salesman/orders'); // Navigate to the SalesManager Orders page
  };

  // Handle logout and redirect to login page
  const handleLogout = () => {
    // Implement logout logic here (e.g., clear authentication tokens, etc.)
    // For example, if using local storage for tokens:
    localStorage.removeItem('authToken'); // Adjust this based on your auth mechanism

    // Redirect to SalesManager login page
    navigate('/salesman/login');
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
            <Link to="/salesman/dashboard">Home</Link>
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
                <button onClick={handleNavigateToOrders}>Orders</button>
                <button onClick={handleLogout}>Logout</button> {/* Added Logout button */}
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default SalesmanHeader;
