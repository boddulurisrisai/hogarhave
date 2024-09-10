// src/pages/SmartDoorbellPage.js
import React from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component

function SmartDoorbell() {
  const { cart, addToCart, removeFromCart } = useCart(); // Get addToCart and removeFromCart from context
  const [doorbells] = React.useState([
    { id: 1, name: "Ring Video Doorbell", price: 99, image: '/images/doorbell/RingVideoDoorbell.jpg' },
    { id: 2, name: "Nest Hello", price: 229, image: '/images/doorbell/NestHello.jpeg' },
    { id: 3, name: "Arlo Video Doorbell", price: 179, image: '/images/doorbell/ArloVideoDoorbell.jpg' },
    { id: 4, name: "Eufy Security Video Doorbell", price: 129, image: '/images/doorbell/EufySecurityDoorbell.jpg' },
    { id: 5, name: "Remo+ RemoBell S", price: 99, image: '/images/doorbell/RemoBell S.jpg' }
  ]);

  return (
    <div className="smart-doorbell-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Doorbells</h2>
        <div className="product-gallery">
          {doorbells.map((doorbell) => (
            <div key={doorbell.id} className="product-item">
              <img src={doorbell.image} alt={doorbell.name} />
              <h4>{doorbell.name}</h4>
              <p>Price: ${doorbell.price}</p>
              <button onClick={() => addToCart(doorbell)}>Add to Cart</button>
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

export default SmartDoorbell;
