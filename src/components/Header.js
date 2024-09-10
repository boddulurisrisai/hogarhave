import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  return (
    <header>
      <div className="width">
        <NavLink to="/" className="logo">
          <h1>Smart Homes</h1>
        </NavLink>
      </div>
      <nav>
        <div className="width">
          <ul className="nav-menu">
            <li>
              <NavLink exact="true" to="/" activeClassName="selected">Home</NavLink>
            </li>
            <li>
              <NavLink to="/products/doorbells" activeClassName="selected">Smart Doorbell</NavLink>
            </li>
            <li>
              <NavLink to="/products/doorlocks" activeClassName="selected">Smart Doorlock</NavLink>
            </li>
            <li>
              <NavLink to="/products/lighting" activeClassName="selected">Smart Lighting</NavLink>
            </li>
            <li>
              <NavLink to="/products/speakers" activeClassName="selected">Smart Speakers</NavLink>
            </li>
            <li>
              <NavLink to="/products/thermostats" activeClassName="selected">Smart Thermostats</NavLink>
            </li>

            {/* Login Dropdown */}
            <li className="nav-item login-item" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
              <a href="#">Login</a>
              {showDropdown && (
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <NavLink to="/CustomerLogin">Customer</NavLink>
                  </li>
                  <li className="dropdown-item"><a href="#">Store Manager</a></li>
                  <li className="dropdown-item"><a href="#">Salesman</a></li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
