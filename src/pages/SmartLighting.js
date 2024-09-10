// src/pages/SmartLightingPage.js
import React from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component

function SmartLighting() {
  const { cart, addToCart, removeFromCart } = useCart(); // Get addToCart and removeFromCart from context
  const [lightings] = React.useState([
    { id: 1, name: "Philips Hue Bulb", price: 49, image: '/images/lighting/Philips Hue Bulb.jpg' },
    { id: 2, name: "LIFX Smart Bulb", price: 59, image: '/images/lighting/LIFX Smart Bulb.jpeg' },
    { id: 3, name: "Wyze Bulb", price: 29, image: '/images/lighting/Wyze Bulb.webp' },
    { id: 4, name: "Nanoleaf Shapes", price: 199, image: '/images/lighting/TP-Link Kasa.jpeg' },
    { id: 5, name: "Sengled Smart Light", price: 39, image: '/images/lighting/Sengled Smart Bulb.jpg' }
  ]);

  return (
    <div className="smart-lighting-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Lightings</h2>
        <div className="product-gallery">
          {lightings.map((lighting) => (
            <div key={lighting.id} className="product-item">
              <img src={lighting.image} alt={lighting.name} />
              <h4>{lighting.name}</h4>
              <p>Price: ${lighting.price}</p>
              <button onClick={() => addToCart(lighting)}>Add to Cart</button>
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

export default SmartLighting;
