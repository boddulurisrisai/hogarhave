import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext'; // Import useCart hook
import Header from '../components/LoginHeader'; // Import Header component
import { useProduct } from '../ProductContext'; // Import ProductContext
import axios from 'axios'; // For making API requests

const accessoriesData = {
  // You can add your hardcoded accessories data here
};

function SmartDoorbell() {
  const { products } = useProduct();
  const { cart, addToCart, removeFromCart, updateItemQuantity } = useCart();
  const [selectedDoorbell, setSelectedDoorbell] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [accessories, setAccessories] = useState([]);
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [newReview, setNewReview] = useState(''); // State for new review input

  const doorbells = products ? products.filter(product => product.category === 'Smart Doorbells') : [];

  useEffect(() => {
    if (selectedDoorbell) {
      const accessoryData = accessoriesData[selectedDoorbell.name] || [];
      setAccessories(accessoryData);
      fetchReviews(selectedDoorbell.id); // Fetch reviews for selected doorbell
    }
  }, [selectedDoorbell]);

  const fetchReviews = async (doorbellId) => {
    try {
      const response = await axios.get(`/api/reviews/${doorbellId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleImageClick = (doorbell) => {
    setSelectedDoorbell(doorbell);
    setQuantity(1); // Reset quantity
  };

  const handleQuantityChange = (amount, item) => {
    if (item) {
      const newQuantity = Math.max(1, quantity + amount);
      setQuantity(newQuantity);
      updateItemQuantity(item.id, newQuantity);
    }
  };

  const isInCart = (item) => cart ? cart.some(cartItem => cartItem.id === item.id) : false;

  const handleAddToCart = (item) => {
    if (item) {
      addToCart(item);
    }
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleReviewSubmit = async () => {
    try {
      if (!newReview.trim()) return;
      const reviewData = { doorbellId: selectedDoorbell.id, review: newReview };
      await axios.post('/api/reviews', reviewData);
      setNewReview('');
      fetchReviews(selectedDoorbell.id);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Example using Fetch API
const submitReview = async (productId, productName, customerId, rating, reviewText) => {
  const reviewData = {
    productId,
    productName,
    customerId,
    rating,
    reviewText
  };

  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Review submitted:', data);
      // Optionally show a success message to the user
    } else {
      console.error('Failed to submit review:', data.error);
    }
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};


  return (
    <div className="smart-doorbell-page">
      <Header />
      <main className="main-content">
        <h2>Smart Doorbells</h2>
        <div className="product-gallery">
          {doorbells.length > 0 ? (
            doorbells.map((doorbell) => (
              <div key={doorbell.id} className="product-item">
                <img
                  src={doorbell.image}
                  alt={doorbell.name}
                  onClick={() => handleImageClick(doorbell)}
                  style={{ cursor: 'pointer' }}
                />
                <h4>{doorbell.name}</h4>
                <p>Price: ${doorbell.price}</p>
                <div className="button-container">
                  {isInCart(doorbell) ? (
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(-1, doorbell)}>-</button>
                      <input
                        type="text"
                        className="quantity"
                        value={quantity}
                        readOnly
                      />
                      <button onClick={() => handleQuantityChange(1, doorbell)}>+</button>
                      <button onClick={() => handleRemoveFromCart(doorbell.id)}>Remove from Cart</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(doorbell)}>Add to Cart</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No smart doorbells available.</p>
          )}
        </div>

        {selectedDoorbell && (
          <div className="selected-doorbell">
            <h3>{selectedDoorbell.name}</h3>
            <img src={selectedDoorbell.image} alt={selectedDoorbell.name} className="selected-image" />
            <p>{selectedDoorbell.description}</p>
            <p>Price: ${selectedDoorbell.price}</p>
            <div className="button-container">
              {isInCart(selectedDoorbell) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1, selectedDoorbell)}>-</button>
                  <input
                    type="text"
                    className="quantity"
                    value={quantity}
                    readOnly
                  />
                  <button onClick={() => handleQuantityChange(1, selectedDoorbell)}>+</button>
                  <button onClick={() => handleRemoveFromCart(selectedDoorbell.id)}>Remove from Cart</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(selectedDoorbell)}>Add to Cart</button>
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
                            <input
                              type="text"
                              className="quantity"
                              value={quantity}
                              readOnly
                            />
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
                <p>No accessories available for this doorbell.</p>
              )}
            </div>

            <div className="reviews-section">
              <h4>Customer Reviews</h4>
              {reviews.length > 0 ? (
                <ul>
                  {reviews.map((review, index) => (
                    <li key={index}>
                      <p>{review}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}

              <div className="review-form">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Write your review..."
                ></textarea>
                <button onClick={handleReviewSubmit}>Submit Review</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartDoorbell;
