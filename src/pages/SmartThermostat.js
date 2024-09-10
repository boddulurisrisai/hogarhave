// src/pages/SmartThermostatPage.js
import React from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component

function SmartThermostat() {
  const { cart, addToCart, removeFromCart } = useCart(); // Get addToCart and removeFromCart from context
  const [thermostats] = React.useState([
    { id: 1, name: "Nest Learning Thermostat", price: 249, image: '/images/thermostat/Nest Learning Thermostat.jpg' },
    { id: 2, name: "ecobee SmartThermostat", price: 229, image: '/images/thermostat/Ecobee SmartThermostat.jpg' },
    { id: 3, name: "Honeywell Home T9", price: 199, image: '/images/thermostat/Honeywell Lyric T5.jpg' },
    { id: 4, name: "Emerson Sensi Touch", price: 169, image: '/images/thermostat/Emerson Sensi.jpg' },
    { id: 5, name: "Lux Kono Smart Thermostat", price: 149, image: '/images/thermostat/Lux Kono.jpg' }
  ]);

  return (
    <div className="smart-thermostat-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Thermostats</h2>
        <div className="product-gallery">
          {thermostats.map((thermostat) => (
            <div key={thermostat.id} className="product-item">
              <img src={thermostat.image} alt={thermostat.name} />
              <h4>{thermostat.name}</h4>
              <p>Price: ${thermostat.price}</p>
              <button onClick={() => addToCart(thermostat)}>Add to Cart</button>
            </div>
          ))}
        </div>
        <div className="cart">
          <h3>Shopping Cart</h3>
          {cart.length > 0 ? (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.name} - ${item.price}
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default SmartThermostat;
