// App.js
import './App.css';
import './index.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Import the LoginPage
import Header from './components/Header'; // Import the new Header component

function App() {
  // List of Smart Home products
  const products = [
    {
      id: 1,
      name: 'Smart Doorbell',
      description: 'Monitor and interact with your visitors remotely with HD video and two-way communication.',
      price: 99.99,
      image: './images/doorbell/smart-doorbell.jpg',
    },
    {
      id: 2,
      name: 'Smart Doorlock',
      description: 'Secure your home with advanced keyless entry, including remote locking and unlocking.',
      price: 149.99,
      image: './images/doorlock/smart-doorlock.jpg',
    },
    {
      id: 3,
      name: 'Smart Speaker',
      description: 'Control your home with voice commands, listen to music, and connect with other devices.',
      price: 89.99,
      image: './images/speaker/smart-speaker.jpg',
    },
    {
      id: 4,
      name: 'Smart Lighting',
      description: 'Automate your home lighting with remote controls and custom schedules.',
      price: 49.99,
      image: './images/lighting/smart-lighting.jpg',
    },
    {
      id: 5,
      name: 'Smart Thermostat',
      description: 'Manage your home’s temperature efficiently to save on energy costs.',
      price: 199.99,
      image: './images/thermostat/smart-thermostat.jpg',
    },
  ];

  return (
    <div id="container">
      {/* Include Header */}
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/CustomerLogin" element={<LoginPage />} />
      </Routes>

      {/* Main Body Content */}
      <div id="body" className="width">
        <section id="content">
          <article>
            <h2>Welcome to SmartHomes</h2>
            <p>
              At SmartHomes, we provide cutting-edge smart home solutions that make everyday living easier and more secure.
              Explore our range of products, from smart doorbells to thermostats, all designed to seamlessly integrate into
              your home and provide remote control, automation, and convenience.
            </p>
            <p>
              Whether you're looking to monitor your home while away, automate your lighting, or reduce energy costs,
              SmartHomes has the perfect solution for you.
            </p>
            <a href="#" className="button">Learn More</a>
          </article>

          {/* Displaying Product Highlights */}
          <article className="product-highlights">
            <h2>Our Products</h2>
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-item">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>${product.price.toFixed(2)}</strong></p>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* Sidebar */}
        <aside className="sidebar">
          <ul>
            <li>
              <h4>About SmartHomes</h4>
              <ul>
                <li className="text">
                  <p>
                    SmartHomes is dedicated to creating a seamless smart home experience. Our products are
                    designed with user convenience and safety in mind. Whether you're at home or away,
                    control your home from anywhere with ease.
                  </p>
                  <a href="#" className="readmore">Read More &raquo;</a>
                </li>
              </ul>
            </li>
            <li>
              <h4>Search</h4>
              <ul>
                <li className="text">
                  <form method="get" className="searchform" action="#">
                    <input type="text" size="31" name="s" className="s" placeholder="Search products..." />
                  </form>
                </li>
              </ul>
            </li>
          </ul>
        </aside>

        <div className="clear"></div>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-content width">
          <ul>
            <li><h4>SmartHomes</h4></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
          <div className="clear"></div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 SmartHomes. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
