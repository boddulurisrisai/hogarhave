// src/pages/SmartSpeakerPage.js
import React from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component

function SmartSpeaker() {
  const { cart, addToCart, removeFromCart } = useCart(); // Get addToCart and removeFromCart from context
  const [speakers] = React.useState([
    { id: 1, name: "Amazon Echo", price: 99, image: '/images/speaker/Amazon Echo.jpg' },
    { id: 2, name: "Google Nest Audio", price: 89, image: '/images/speaker/Google Nest Audio.jpg' },
    { id: 3, name: "Apple HomePod Mini", price: 99, image: '/images/speaker/AppleHomePodMini.jpeg' },
    { id: 4, name: "Sonos One", price: 199, image: '/images/speaker/SonosOne.jpeg' },
    { id: 5, name: "Bose Home Speaker 500", price: 299, image: '/images/speaker/BoseSmartSpeaker.jpg' }
  ]);

  return (
    <div className="smart-speaker-page">
      <Header /> {/* Include Header component */}
      <main className="main-content">
        <h2>Smart Speakers</h2>
        <div className="product-gallery">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="product-item">
              <img src={speaker.image} alt={speaker.name} />
              <h4>{speaker.name}</h4>
              <p>Price: ${speaker.price}</p>
              <button onClick={() => addToCart(speaker)}>Add to Cart</button>
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

export default SmartSpeaker;
