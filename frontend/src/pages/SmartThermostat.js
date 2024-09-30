import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext
import axios from 'axios'; // Import axios for API requests
import { useNavigate } from 'react-router-dom'; // Import navigation hook

const accessoriesData = {
  "Nest Learning Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Ecobee SmartThermostat with Voice Control": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Honeywell Home T9 Smart Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Lux Kono": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ],
  "Emerson Sensi Touch Wi-Fi Thermostat": [
    { id: '1', name: 'Decorative Wall Plate', price: 19.99, image: '/images/thermostat/accessories/Decorative Wall  Plate.webp' },
    { id: '2', name: 'Wall Plate', price: 29.99, image: '/images/thermostat/accessories/wallPlate.webp' },
    { id: '3', name: 'Wire Adapter', price: 24.99, image: '/images/thermostat/accessories/WireAdapter.webp' },
  ]
};

function SmartThermostat() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedThermostat, setSelectedThermostat] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  const thermostats = products ? products.filter(product => product.category === 'Smart Thermostats') : [];

  useEffect(() => {
    if (selectedThermostat) {
      const accessoryData = accessoriesData[selectedThermostat.name] || [];
      setAccessories(accessoryData);
      setReviews([]);
      setShowReviews(false);
    }
  }, [selectedThermostat]);

  const handleImageClick = (thermostat) => {
    setSelectedThermostat(thermostat);
    setQuantity(1);
  };

  const handleQuantityChange = (amount, item) => {
    const newQuantity = Math.max(1, quantity + amount);
    setQuantity(newQuantity);
    if (item) updateItemQuantity(item.id, newQuantity);
  };

  const isInCart = (item) => cart ? cart.some(cartItem => cartItem.id === item.id) : false;

  const handleAddToCart = (item) => {
    try {
      addToCart(item);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    try {
      removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };
/*
  const handleViewReviews = async () => {
    if (!selectedThermostat) {
      console.log('No thermostat selected.');
      return;
    }

    try {
      const response = await axios.get(`/api/reviews?ProductModelName=${selectedThermostat.name}`);
      
      if (response.data && response.data.reviews) {
        setReviews(response.data.reviews);
      } else {
        setReviews([]);
      }

      setShowReviews(true); // Show the reviews section
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
*/

const handleViewReviews = () => {
  if (selectedThermostat) {
    navigate('/view-reviews', { state: { productModelName: selectedThermostat.name } });
  } else {
    console.log('No thermostat selected.');
  }
};

  const handleWriteReview = () => {
    navigate('/write-review', { state: { thermostat: selectedThermostat } });
  };

  return (
    <div className="smart-thermostat-page">
      <Header />
      <main className="main-content">
        <h2>Smart Thermostats</h2>
        <div className="product-gallery">
          {thermostats.length > 0 ? (
            thermostats.map((thermostat) => (
              <div key={thermostat.id} className="product-item">
                <img
                  src={thermostat.image}
                  alt={thermostat.name}
                  onClick={() => handleImageClick(thermostat)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{thermostat.name}</h4>
                <p>Price: ${thermostat.price}</p>
                <div className="button-container">
                  {isInCart(thermostat) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, thermostat)}>-</button>
                      <input type="text" className="quantity" value={quantity} readOnly />
                      <button onClick={() => handleQuantityChange(1, thermostat)}>+</button>
                      <button onClick={() => handleRemoveFromCart(thermostat.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(thermostat)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart thermostats available.</p>
          )}
        </div>

        {selectedThermostat && (
          <div className="selected-thermostat">
            <h3>{selectedThermostat.name}</h3>
            <img src={selectedThermostat.image} alt={selectedThermostat.name} className="selected-image" />
            <p>Price: ${selectedThermostat.price}</p>
            <div className="button-container">
              {isInCart(selectedThermostat) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedThermostat)}>-</button>
                  <input type="text" className="quantity" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange(1, selectedThermostat)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedThermostat.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedThermostat)}>Add to Cart</button>
              )}
            </div>

            <div className="accessories">
              <h4>Accessories</h4>
              {accessories.length > 0 ? (
                <div className="accessories-gallery">
                  {accessories.map((accessory) => (
                    <div key={accessory.id} className="accessories-item">
                      <img src={accessory.image} alt={accessory.name} className="accessories-image" />
                      <h4>{accessory.name}</h4>
                      <p>Price: ${accessory.price}</p>
                      <div className="button-container">
                        {isInCart(accessory) ? (
                          <div className="quantity-controls">
                            <button onClick={() => handleQuantityChange(-1, accessory)}>-</button>
                            <input type="text" className="quantity" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange(1, accessory)}>+</button>
                            <button onClick={() => handleRemoveFromCart(accessory.id)}>Remove from Cart</button>
                          </div>
                        ) : (
                          <button onClick={() => handleAddToCart(accessory)}>Add to Cart</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No accessories available for this thermostat.</p>
              )}
            </div>

            <div className="reviews-section">
              <h4>Customer Reviews</h4>
              <button onClick={handleViewReviews}>View Reviews</button>
              <button onClick={handleWriteReview}>Write a Review</button>

              {showReviews && (
                <div className="reviews-list">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <h5>{review.title}</h5>
                        <p>{review.content}</p>
                        <p>Rating: {review.rating}/5</p>
                        <p>By: {review.author}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartThermostat;
