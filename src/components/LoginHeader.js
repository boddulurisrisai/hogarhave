import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext'; // Correct import
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Using react-icons for cart and account icons

function LoginHeader() {
  const { cart, orders, cancelOrder } = useCart(); // Correctly use useCart
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation(); // Get the current location

  const cartItemCount = cart.length; // Number of items in the cart

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Handle dropdown selection for past orders
  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setShowDropdown(false);
  };

  // Determine if the current path matches the link
  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">
          <h1>Smart Homes</h1>
        </Link>
      </div>
      <div className="header-content">
        <nav>
          <ul>
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
          </ul>
        </nav>
        <div className="header-icons">
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
          <div className="account-menu">
            <span onClick={toggleDropdown} className="account-icon">
              <FaUserCircle />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/account">Account Information</Link>
                <h3>Past Orders</h3>
                <ul>
                  {orders.map(order => (
                    <li key={order.id}>
                      <button onClick={() => handleOrderSelect(order)}>
                        Order #{order.confirmationNumber}
                      </button>
                    </li>
                  ))}
                </ul>
                {selectedOrder && (
                  <div className="order-details">
                    <h4>Order Details</h4>
                    <p>Confirmation Number: {selectedOrder.confirmationNumber}</p>
                    <p>Delivery Date: {new Date(selectedOrder.deliveryDate).toDateString()}</p>
                    <button onClick={() => cancelOrder(selectedOrder.id)}>Cancel Order</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default LoginHeader;
