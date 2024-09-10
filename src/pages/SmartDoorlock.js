// src/pages/SmartDoorlockPage.js
import React from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component

function SmartDoorlock() {
  const { cart, addToCart, removeFromCart } = useCart(); // Get addToCart and removeFromCart from context
  const [doorlocks] = React.useState([
    { id: 1, name: "August Smart Lock", price: 149, image: '/images/doorlock/AugustSmartLock .jpg' },
    { id: 2, name: "Schlage Encode", price: 249, image: '/images/doorlock/SchlageEncode.jpg' },
    { id: 3, name: "Yale Assure Lock", price: 199, image: '/images/doorlock/YaleAssureLock.jpg' },
    { id: 4, name: "Ultraloq U-Bolt", price: 129, image: '/images/doorlock/UltraloqU-Bolt.jpg' },
    { id: 5, name: "Level Lock", price: 199, image: '/images/doorlock/LevelLock.jpg' }
  ]);

  return (
    <div className="smart-doorlock-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Doorlocks</h2>
        <div className="product-gallery">
          {doorlocks.map((doorlock) => (
            <div key={doorlock.id} className="product-item">
              <img src={doorlock.image} alt={doorlock.name} />
              <h4>{doorlock.name}</h4>
              <p>Price: ${doorlock.price}</p>
              <button onClick={() => addToCart(doorlock)}>Add to Cart</button>
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

export default SmartDoorlock;
