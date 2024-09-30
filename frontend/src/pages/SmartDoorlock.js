import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import Header from '../components/LoginHeader';
import { useProduct } from '../ProductContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const accessoriesData = {
  "August Smart Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Schlage Encode": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Yale Assure Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "Level Lock": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ],
  "UltraloqU Bolt": [
    { id: '1', name: 'Level Connect', price: 60, image: '/images/doorlock/accessories/LevelConnect.jpg' },
    { id: '2', name: 'August Doorbell Camera', price: 150, image: '/images/doorlock/accessories/smart keypad.webp' },
    { id: '3', name: 'August Smart Lock Battery Pack', price: 40, image: '/images/doorlock/accessories/Yale module.webp' },
  ]
  // More doorlocks and accessories...
};

function SmartDoorlock() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedDoorlock, setSelectedDoorlock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  const doorlocks = products ? products.filter(product => product.category === 'Smart Doorlocks') : [];

  useEffect(() => {
    if (selectedDoorlock) {
      const accessoryData = accessoriesData[selectedDoorlock.name] || [];
      setAccessories(accessoryData);
      setReviews([]);
      setShowReviews(false);
    }
  }, [selectedDoorlock]);

  const handleImageClick = (doorlock) => {
    setSelectedDoorlock(doorlock);
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
    if (!selectedDoorlock) {
      console.log('No doorlock selected.');
      return;
    }

    try {
      const response = await axios.get(`/api/reviews?ProductModelName=${selectedDoorlock.name}`);
      
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
  if (selectedDoorlock) {
    navigate('/view-reviews', { state: { productModelName: selectedDoorlock.name } });
  } else {
    console.log('No doorlock selected.');
  }
};

  const handleWriteReview = () => {
    navigate('/write-review', { state: { doorlock: selectedDoorlock } });
  };

  return (
    <div className="smart-doorlock-page">
      <Header />
      <main className="main-content">
        <h2>Smart Doorlocks</h2>
        <div className="product-gallery">
          {doorlocks.length > 0 ? (
            doorlocks.map((doorlock) => (
              <div key={doorlock.id} className="product-item">
                <img
                  src={doorlock.image}
                  alt={doorlock.name}
                  onClick={() => handleImageClick(doorlock)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{doorlock.name}</h4>
                <p>Price: ${doorlock.price}</p>
                <div className="button-container">
                  {isInCart(doorlock) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, doorlock)}>-</button>
                      <input type="text" className="quantity" value={quantity} readOnly />
                      <button onClick={() => handleQuantityChange(1, doorlock)}>+</button>
                      <button onClick={() => handleRemoveFromCart(doorlock.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(doorlock)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart doorlocks available.</p>
          )}
        </div>

        {selectedDoorlock && (
          <div className="selected-doorlock">
            <h3>{selectedDoorlock.name}</h3>
            <img src={selectedDoorlock.image} alt={selectedDoorlock.name} className="selected-image" />
            <p>Price: ${selectedDoorlock.price}</p>
            <div className="button-container">
              {isInCart(selectedDoorlock) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedDoorlock)}>-</button>
                  <input type="text" className="quantity" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange(1, selectedDoorlock)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedDoorlock.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedDoorlock)}>Add to Cart</button>
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
                <p>No accessories available for this doorlock.</p>
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

export default SmartDoorlock;
