import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

function LoginHeader() {
  const { cart, orders, cancelOrder } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const location = useLocation();

  const cartItemCount = cart.length;

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setShowDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      {/* Centered Smart Homes heading */}
      <div className="logo-container">
        <h1 className="logo">Smart Homes</h1>
      </div>
      
      {/* Navigation and Icons */}
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

          {/* Cart Icon */}
          <li className="cart-icon">
            <Link to="/cart">
              <FaShoppingCart />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>
          </li>

          {/* Account Dropdown */}
          <li className="account-menu">
            <span onClick={toggleDropdown} className="account-icon">
              <FaUserCircle />
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/account">Account Information</Link>
                <h3>Past Orders</h3>
                <ul>
                  {orders.map((order) => (
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
                    <p>
                      Delivery Date: {new Date(selectedOrder.deliveryDate).toDateString()}
                    </p>
                    <button onClick={() => cancelOrder(selectedOrder.id)}>
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default LoginHeader;
