import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

// Hardcoded accessories data for smart speakers
const accessoriesData = {
  "Amazon Echo Dot (4th Gen)": [
    { id: '1', name: 'Charging Cable', price: 130, image: '/images/speaker/accessories/ChargingCable.webp' },
    { id: '2', name: 'Mount', price: 30, image: '/images/speaker/accessories/Wall Mounted.webp' },
    { id: '3', name: 'Wall Mount', price: 20, image: '/images/speaker/accessories/WallMount.webp' },
  ],
  "Google Nest Audio": [
    { id: '1', name: 'Charging Cable', price: 130, image: '/images/speaker/accessories/ChargingCable.webp' },
    { id: '2', name: 'Mount', price: 30, image: '/images/speaker/accessories/Wall Mounted.webp' },
    { id: '3', name: 'Wall Mount', price: 20, image: '/images/speaker/accessories/WallMount.webp' },
  ],
  "Apple HomePod Mini": [
    { id: '1', name: 'Charging Cable', price: 130, image: '/images/speaker/accessories/ChargingCable.webp' },
    { id: '2', name: 'Mount', price: 30, image: '/images/speaker/accessories/Wall Mounted.webp' },
    { id: '3', name: 'Wall Mount', price: 20, image: '/images/speaker/accessories/WallMount.webp' },
  ],
  "Sonos One": [
    { id: '1', name: 'Charging Cable', price: 130, image: '/images/speaker/accessories/ChargingCable.webp' },
    { id: '2', name: 'Mount', price: 30, image: '/images/speaker/accessories/Wall Mounted.webp' },
    { id: '3', name: 'Wall Mount', price: 20, image: '/images/speaker/accessories/WallMount.webp' },
  ],
  "Bose Home Speaker 500": [
    { id: '1', name: 'Charging Cable', price: 130, image: '/images/speaker/accessories/ChargingCable.webp' },
    { id: '2', name: 'Mount', price: 30, image: '/images/speaker/accessories/Wall Mounted.webp' },
    { id: '3', name: 'Wall Mount', price: 20, image: '/images/speaker/accessories/WallMount.webp' },
  ],
};

function SmartSpeakers() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  const speakers = products ? products.filter(product => product.category === 'Smart Speakers') : [];

  useEffect(() => {
    if (selectedSpeaker) {
      const accessoryData = accessoriesData[selectedSpeaker.name] || [];
      setAccessories(accessoryData);
      setReviews([]);
      setShowReviews(false);
    }
  }, [selectedSpeaker]);

  const handleImageClick = (speaker) => {
    setSelectedSpeaker(speaker);
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

  const handleViewReviews = () => {
    if (selectedSpeaker) {
      navigate('/view-reviews', { state: { productModelName: selectedSpeaker.name } });
    } else {
      console.log('No speaker selected.');
    }
  };

  const handleWriteReview = () => {
    navigate('/write-review', { state: { speaker: selectedSpeaker } });
  };

  return (
    <div className="smart-speakers-page">
      <Header />
      <main className="main-content">
        <h2>Smart Speakers</h2>
        <div className="product-gallery">
          {speakers.length > 0 ? (
            speakers.map((speaker) => (
              <div key={speaker.id} className="product-item">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  onClick={() => handleImageClick(speaker)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{speaker.name}</h4>
                <p>Price: ${speaker.price}</p>
                <div className="button-container">
                  {isInCart(speaker) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, speaker)}>-</button>
                      <input type="text" className="quantity" value={quantity} readOnly />
                      <button onClick={() => handleQuantityChange(1, speaker)}>+</button>
                      <button onClick={() => handleRemoveFromCart(speaker.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(speaker)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart speakers available.</p>
          )}
        </div>

        {selectedSpeaker && (
          <div className="selected-speaker">
            <h3>{selectedSpeaker.name}</h3>
            <img src={selectedSpeaker.image} alt={selectedSpeaker.name} className="selected-image" />
            <p>Price: ${selectedSpeaker.price}</p>
            <div className="button-container">
              {isInCart(selectedSpeaker) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedSpeaker)}>-</button>
                  <input type="text" className="quantity" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange(1, selectedSpeaker)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedSpeaker.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedSpeaker)}>Add to Cart</button>
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
                <p>No accessories available for this speaker.</p>
              )}
            </div>

            <div className="reviews-section">
              <h4>Customer Reviews</h4>
              <button onClick={handleViewReviews}>View Reviews</button>

              {showReviews && (
                <div className="reviews-box">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="review-item">
                        <p>{review.review}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
              <button onClick={handleWriteReview}>Write a Review</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartSpeakers;
